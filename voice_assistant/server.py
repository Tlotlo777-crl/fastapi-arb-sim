"""FastAPI app: document management, manual ask, and the live WebSocket.

The browser handles speech recognition (Web Speech API) and streams finalized
utterances here over the WebSocket; this server retrieves relevant document
passages and streams an AI answer back token-by-token.
"""

from __future__ import annotations

import asyncio
import json
import os
import re
import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from . import llm
from .documents import extract_text
from .rag import DocumentStore

DATA_DIR = Path(os.environ.get("VOICE_DATA_DIR", "voice_data"))
DOCS_DIR = DATA_DIR / "docs"
STATIC_DIR = Path(__file__).parent / "static"

store = DocumentStore()

app = FastAPI(title="Live Voice Answer Assistant")

_QUESTION_WORDS = {
    "what", "who", "when", "where", "why", "how", "which", "whose", "whom",
    "is", "are", "can", "could", "should", "would", "do", "does", "did",
    "explain", "define", "tell", "describe", "give", "list", "name",
}


def _looks_answerable(text: str) -> bool:
    """Heuristic: decide whether a finalized utterance deserves an answer."""
    t = text.strip()
    if not t:
        return False
    if "?" in t:
        return True
    words = re.findall(r"[a-z']+", t.lower())
    if not words:
        return False
    if words[0] in _QUESTION_WORDS:
        return True
    return len(words) >= 4


# ---- persistence --------------------------------------------------------
def _load_persisted() -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    for path in sorted(DOCS_DIR.glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            store.add_document(payload["id"], payload["name"], payload["text"])
        except Exception:
            continue


def _persist(doc_id: str, name: str, text: str) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    (DOCS_DIR / f"{doc_id}.json").write_text(
        json.dumps({"id": doc_id, "name": name, "text": text}),
        encoding="utf-8",
    )


def _delete_persisted(doc_id: str) -> None:
    target = DOCS_DIR / f"{doc_id}.json"
    if target.exists():
        target.unlink()


@app.on_event("startup")
def _startup() -> None:
    _load_persisted()


# ---- REST API -----------------------------------------------------------
@app.get("/api/status")
def status() -> dict:
    return {
        "ai_enabled": llm.available(),
        "model": llm.MODEL if llm.available() else None,
        "documents": store.list_documents(),
    }


@app.get("/api/documents")
def list_documents() -> dict:
    return {"documents": store.list_documents()}


@app.post("/api/documents")
async def upload_document(file: UploadFile = File(...)) -> JSONResponse:
    data = await file.read()
    try:
        text = extract_text(file.filename or "upload.txt", data)
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=400)
    if not text.strip():
        return JSONResponse(
            {"error": "No readable text found in that file."}, status_code=400
        )
    doc_id = uuid.uuid4().hex[:12]
    name = file.filename or f"document-{doc_id}"
    meta = store.add_document(doc_id, name, text)
    _persist(doc_id, name, text)
    return JSONResponse({"document": meta})


@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str) -> dict:
    removed = store.remove_document(doc_id)
    if removed:
        _delete_persisted(doc_id)
    return {"removed": removed}


@app.post("/api/ask")
async def ask(payload: dict) -> JSONResponse:
    question = (payload or {}).get("question", "").strip()
    if not question:
        return JSONResponse({"error": "Missing 'question'."}, status_code=400)
    hits = store.search(question, k=4)
    parts: list[str] = []
    async for delta in llm.stream_answer(question, hits):
        parts.append(delta)
    return JSONResponse(
        {
            "answer": "".join(parts),
            "sources": [
                {"name": h.chunk.doc_name, "score": round(h.score, 3)} for h in hits
            ],
        }
    )


# ---- WebSocket (live transcript -> streamed answer) ---------------------
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    current: asyncio.Task | None = None

    async def answer(question: str, force: bool) -> None:
        if not force and not _looks_answerable(question):
            return
        answer_id = uuid.uuid4().hex[:8]
        hits = store.search(question, k=4)
        try:
            await ws.send_json(
                {
                    "type": "answer_start",
                    "id": answer_id,
                    "question": question,
                    "sources": [
                        {"name": h.chunk.doc_name, "score": round(h.score, 3)}
                        for h in hits
                    ],
                }
            )
            async for delta in llm.stream_answer(question, hits):
                await ws.send_json(
                    {"type": "answer_delta", "id": answer_id, "text": delta}
                )
            await ws.send_json({"type": "answer_done", "id": answer_id})
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            try:
                await ws.send_json(
                    {"type": "error", "id": answer_id, "message": str(exc)}
                )
            except Exception:
                pass

    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue

            if msg.get("type") in ("transcript", "ask"):
                text = (msg.get("text") or "").strip()
                if not text:
                    continue
                force = msg.get("type") == "ask"
                # A new utterance supersedes the previous in-flight answer.
                if current and not current.done():
                    current.cancel()
                current = asyncio.create_task(answer(text, force))
    except WebSocketDisconnect:
        if current and not current.done():
            current.cancel()


# ---- static frontend ----------------------------------------------------
@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
