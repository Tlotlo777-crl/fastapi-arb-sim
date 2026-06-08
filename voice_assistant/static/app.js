/* EchoMind — live voice → instant answers.
 * Speech recognition runs in the browser (Web Speech API) so it works on both
 * desktop and phone Chrome with no audio leaving the device — only text is sent.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {
    wsDot: $("wsDot"), aiBadge: $("aiBadge"),
    micBtn: $("micBtn"), micLabel: $("micLabel"), lang: $("lang"),
    autoAnswer: $("autoAnswer"),
    transcript: $("transcript"), interim: $("interim"),
    answers: $("answers"),
    askForm: $("askForm"), askInput: $("askInput"),
    drop: $("drop"), fileInput: $("fileInput"), docList: $("docList"),
    modeSeg: $("modeSeg"), styleSeg: $("styleSeg"),
    speakers: $("speakers"), addSpeaker: $("addSpeaker"),
  };

  let ws = null;
  let recognition = null;
  let listening = false;
  let manualStop = false;
  const cards = new Map(); // answer id -> { aEl }

  // copilot state
  const state = { mode: "agent", style: "answer", speaker: "Me" };

  // ---- toast -------------------------------------------------------------
  let toastTimer = null;
  function toast(msg, isErr) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); document.body.appendChild(t); }
    t.className = "toast" + (isErr ? " err" : "");
    t.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 3200);
  }

  // ---- WebSocket ---------------------------------------------------------
  function connect() {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${location.host}/ws`);
    ws.onopen = () => els.wsDot.classList.add("on");
    ws.onclose = () => {
      els.wsDot.classList.remove("on");
      setTimeout(connect, 1500); // auto-reconnect
    };
    ws.onerror = () => els.wsDot.classList.remove("on");
    ws.onmessage = (ev) => handleServer(JSON.parse(ev.data));
  }

  function send(obj) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
  }

  function handleServer(msg) {
    if (msg.type === "answer_start") startCard(msg);
    else if (msg.type === "answer_delta") appendCard(msg.id, msg.text);
    else if (msg.type === "answer_done") finishCard(msg.id);
    else if (msg.type === "error") {
      finishCard(msg.id);
      toast(msg.message || "Answer failed", true);
    }
  }

  // ---- answer cards ------------------------------------------------------
  function clearHint(container) {
    const h = container.querySelector(".hint");
    if (h) h.remove();
  }

  function startCard(msg) {
    clearHint(els.answers);
    const isCoach = msg.style === "coach";
    const card = document.createElement("div");
    card.className = "answer-card" + (isCoach ? " coach" : "");
    const q = document.createElement("div");
    q.className = "q";
    const label = isCoach ? "Suggest" : "Q";
    const who = msg.speaker ? msg.speaker + ": " : "";
    q.innerHTML = `<span class="label">${label}</span>${who ? escapeHtml(who) : ""}“${escapeHtml(msg.question)}”`;
    const a = document.createElement("div");
    a.className = "a";
    a.innerHTML = '<span class="cursor">▍</span>';
    card.appendChild(q);
    card.appendChild(a);
    if (msg.sources && msg.sources.length) {
      const src = document.createElement("div");
      src.className = "src";
      msg.sources.forEach((s) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = s.name;
        src.appendChild(chip);
      });
      card.appendChild(src);
    }
    els.answers.prepend(card);
    cards.set(msg.id, { aEl: a, text: "" });
  }

  function appendCard(id, text) {
    const c = cards.get(id);
    if (!c) return;
    c.text += text;
    c.aEl.innerHTML = escapeHtml(c.text) + '<span class="cursor">▍</span>';
  }

  function finishCard(id) {
    const c = cards.get(id);
    if (!c) return;
    c.aEl.innerHTML = escapeHtml(c.text);
    cards.delete(id);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  }

  // ---- transcript --------------------------------------------------------
  function addHeard(text, speaker) {
    clearHint(els.transcript);
    const line = document.createElement("div");
    line.className = "line";
    const who = speaker ? `<span class="who">${escapeHtml(speaker)}</span>` : "";
    line.innerHTML = who + escapeHtml(text);
    els.transcript.appendChild(line);
    els.transcript.scrollTop = els.transcript.scrollHeight;
  }

  function payloadBase(extra) {
    return Object.assign(
      { mode: state.mode, style: state.style, speaker: state.speaker },
      extra
    );
  }

  // ---- speech recognition ------------------------------------------------
  function makeRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = els.lang.value;

    r.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript.trim();
        if (res.isFinal) {
          if (text) {
            addHeard(text, state.speaker);
            // Only ask the server for an answer when auto-answer is on.
            if (els.autoAnswer.checked)
              send(payloadBase({ type: "transcript", text }));
          }
        } else {
          interim += text + " ";
        }
      }
      els.interim.textContent = interim;
    };

    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        toast("Microphone permission denied.", true);
        stopListening();
      } else if (e.error === "no-speech") {
        // ignore; will restart via onend
      }
    };

    r.onend = () => {
      els.interim.textContent = "";
      if (listening && !manualStop) {
        try { r.start(); } catch (_) { /* already started */ }
      }
    };
    return r;
  }

  function startListening() {
    if (!recognition) recognition = makeRecognition();
    if (!recognition) {
      toast("Speech recognition needs Chrome/Edge (desktop or Android).", true);
      return;
    }
    recognition.lang = els.lang.value;
    manualStop = false;
    listening = true;
    try { recognition.start(); } catch (_) {}
    els.micBtn.classList.add("live");
    els.micLabel.textContent = "Stop listening";
  }

  function stopListening() {
    manualStop = true;
    listening = false;
    if (recognition) try { recognition.stop(); } catch (_) {}
    els.micBtn.classList.remove("live");
    els.micLabel.textContent = "Start listening";
    els.interim.textContent = "";
  }

  els.micBtn.addEventListener("click", () => (listening ? stopListening() : startListening()));
  els.lang.addEventListener("change", () => {
    if (recognition) recognition.lang = els.lang.value;
    if (listening) { stopListening(); setTimeout(startListening, 200); }
  });

  // ---- manual ask --------------------------------------------------------
  els.askForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = els.askInput.value.trim();
    if (!q) return;
    addHeard(q, state.speaker);
    send(payloadBase({ type: "ask", text: q }));
    els.askInput.value = "";
  });

  // ---- documents ---------------------------------------------------------
  async function refreshDocs() {
    try {
      const r = await fetch("/api/documents");
      const data = await r.json();
      renderDocs(data.documents || []);
    } catch (_) {}
  }

  function renderDocs(docs) {
    els.docList.innerHTML = "";
    if (!docs.length) {
      const li = document.createElement("li");
      li.className = "hint";
      li.style.padding = "4px";
      li.textContent = "No documents yet. Upload one to ground answers.";
      els.docList.appendChild(li);
      return;
    }
    docs.forEach((d) => {
      const li = document.createElement("li");
      li.className = "doc-item";
      const left = document.createElement("div");
      left.innerHTML = `<div class="name">${escapeHtml(d.name)}</div>` +
        `<div class="meta">${d.chunks} passages · ${(d.chars / 1000).toFixed(1)}k chars</div>`;
      const del = document.createElement("button");
      del.title = "Remove";
      del.textContent = "✕";
      del.onclick = () => removeDoc(d.id);
      li.appendChild(left);
      li.appendChild(del);
      els.docList.appendChild(li);
    });
  }

  async function uploadFiles(files) {
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const r = await fetch("/api/documents", { method: "POST", body: fd });
        const data = await r.json();
        if (!r.ok) { toast(data.error || "Upload failed", true); continue; }
        toast(`Learned “${data.document.name}”`);
      } catch (_) {
        toast("Upload failed", true);
      }
    }
    refreshDocs();
  }

  async function removeDoc(id) {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    refreshDocs();
  }

  els.fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) uploadFiles(e.target.files);
    e.target.value = "";
  });
  ["dragover", "dragenter"].forEach((evt) =>
    els.drop.addEventListener(evt, (e) => { e.preventDefault(); els.drop.classList.add("over"); })
  );
  ["dragleave", "drop"].forEach((evt) =>
    els.drop.addEventListener(evt, (e) => { e.preventDefault(); els.drop.classList.remove("over"); })
  );
  els.drop.addEventListener("drop", (e) => {
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  });

  // ---- segmented controls & speakers ------------------------------------
  function wireSeg(seg, key) {
    seg.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      state[key] = btn.dataset[key];
      [...seg.children].forEach((b) => b.classList.toggle("active", b === btn));
    });
  }
  wireSeg(els.modeSeg, "mode");
  wireSeg(els.styleSeg, "style");

  els.speakers.addEventListener("click", (e) => {
    const btn = e.target.closest(".spk");
    if (!btn || btn.id === "addSpeaker") return;
    state.speaker = btn.dataset.spk;
    els.speakers.querySelectorAll(".spk").forEach((b) =>
      b.classList.toggle("active", b === btn)
    );
  });
  els.addSpeaker.addEventListener("click", () => {
    const name = (prompt("Speaker name (e.g. Sarah, Client)") || "").trim();
    if (!name) return;
    const btn = document.createElement("button");
    btn.className = "spk";
    btn.dataset.spk = name;
    btn.textContent = name;
    els.speakers.insertBefore(btn, els.addSpeaker);
    btn.click();
  });

  // ---- status ------------------------------------------------------------
  async function loadStatus() {
    try {
      const r = await fetch("/api/status");
      const s = await r.json();
      if (s.ai_enabled) {
        const m = s.models || {};
        els.aiBadge.textContent = `⚡ ${m.agent || "Opus"} · 🚀 ${m.fast || "Haiku"}`;
        els.aiBadge.className = "badge ok";
      } else {
        els.aiBadge.textContent = "AI: set ANTHROPIC_API_KEY";
        els.aiBadge.className = "badge off";
      }
      renderDocs(s.documents || []);
    } catch (_) {
      els.aiBadge.textContent = "AI: offline";
      els.aiBadge.className = "badge off";
    }
  }

  // ---- boot --------------------------------------------------------------
  connect();
  loadStatus();
})();
