# EchoMind — Live Voice → Instant Answers

A real-time "voice to word, voice to answer" assistant in the style of
Cluely / pewbeam / lockedinai. When someone speaks (e.g. on a Zoom/Meet call),
it transcribes them live and **instantly pops out an answer** — grounded in the
documents you upload (a Bible, your CV, a proposal, study notes, anything).

It runs as a single web app, so the **same URL works on your PC and your phone**.

---

## How it works

```
 🎙  You/the speaker          🖥  Browser (PC or phone)             ☁  FastAPI backend
 ───────────────────         ────────────────────────────         ─────────────────────────
   speech ─────────────────▶  Web Speech API (live STT)
                              finalized text ──── WebSocket ─────▶  retrieve doc passages (TF-IDF)
                                                                     │
                              answer streams back  ◀── WebSocket ──  Claude (claude-opus-4-8)
   answer appears instantly ◀─ rendered live
```

- **Speech recognition happens in the browser** (Web Speech API). It's free,
  real-time, and supported by Chrome/Edge on desktop and Android. **No audio
  leaves your device — only the recognized text is sent** to the backend.
- **Documents are "learned"** by extracting their text, splitting it into
  passages, and indexing them. For each spoken question, the most relevant
  passages are retrieved and given to Claude so answers are grounded in *your*
  content (and cite the source name).
- **Answers stream token-by-token** over a WebSocket so they appear as they're
  generated.

---

## Quick start

```bash
pip install -r requirements.txt

export ANTHROPIC_API_KEY=sk-ant-...     # enables Claude answers
python run_voice.py                     # serves http://localhost:8000
```

Open **http://localhost:8000** in Chrome, click **Start listening**, allow the
microphone, and speak. Try: *"What is science?"* — the answer pops out.

Upload a document (e.g. a CV) in the **Knowledge** panel, then ask
*"What experience do I have with Python?"* — the answer is grounded in the CV
and shows the source.

> Without `ANTHROPIC_API_KEY` the app still runs: instead of AI answers it
> returns the most relevant passage from your uploaded documents.

### Configuration

| Env var             | Default            | Purpose                                   |
| ------------------- | ------------------ | ----------------------------------------- |
| `ANTHROPIC_API_KEY` | —                  | Enables Claude answers                     |
| `VOICE_MODEL`       | `claude-opus-4-8`  | Claude model id (e.g. `claude-haiku-4-5` for lower latency) |
| `VOICE_DATA_DIR`    | `voice_data`       | Where uploaded documents persist           |
| `PORT`              | `8000`             | Port to bind                               |

---

## Connecting your PC *and* your phone

The app is just a web page, so any device that can reach the server can use it.
The Web Speech API requires a **secure context** — `http://localhost` counts,
but other devices need **HTTPS**. Two easy options:

### Option A — same Wi-Fi (LAN)
1. Find your PC's LAN IP (e.g. `192.168.1.20`).
2. On the phone, open `http://192.168.1.20:8000`.
3. This works for the UI, but phone Chrome needs HTTPS to use the mic — so for
   listening *on the phone*, use Option B.

### Option B — public HTTPS tunnel (recommended for phone mic)
Use a tunnel so both devices get an `https://…` URL with a valid certificate:

```bash
# pick one
cloudflared tunnel --url http://localhost:8000
# or
ngrok http 8000
```

Open the printed `https://…` URL on **both** your PC and your phone. The mic
works on each device, and answers appear on whichever device is listening.

> Typical setup: keep the **phone** near the speaker as the "ear" (listening),
> and watch the **answers on your PC**. Open the same tunnel URL on both. Each
> device with "Start listening" on contributes transcripts; answers stream to
> every connected screen.

---

## Files

```
voice_assistant/
  server.py        FastAPI: REST + WebSocket, doc persistence
  rag.py           TF-IDF document index + retrieval
  documents.py     PDF / DOCX / TXT text extraction
  llm.py           Claude streaming answers (+ no-key fallback)
  static/          The web app (index.html, app.js, styles.css)
run_voice.py       Entry point
```

---

## Notes & limits
- Best in **Chrome or Edge** (desktop or Android). iOS Safari's speech support
  is limited; use Chrome where possible.
- Browser STT quality depends on mic and accent; pick the right language in the
  dropdown.
- This is a focused MVP: retrieval is keyword/TF-IDF based (fast, no GPU). For
  larger corpora you could swap in embeddings later behind the same
  `DocumentStore.search()` interface.
