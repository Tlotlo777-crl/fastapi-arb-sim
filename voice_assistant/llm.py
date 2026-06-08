"""Claude-powered answer generation, streamed for instant display.

Two modes:
  - "agent"  Super Agent on Claude Opus 4.8  — deepest, most capable answers.
  - "fast"   Ultra-fast on Claude Haiku 4.5  — lowest latency.

Two styles:
  - "answer"  directly answer the question that was asked.
  - "coach"   suggest how to better ASK or ANSWER in the live conversation.

Falls back to returning the top retrieved passage when no ANTHROPIC_API_KEY
is configured, so the app is still demoable without a key.
"""

from __future__ import annotations

import os
from collections.abc import AsyncIterator

from .rag import Hit

# Model per mode (override via env if desired).
AGENT_MODEL = os.environ.get("VOICE_AGENT_MODEL", "claude-opus-4-8")
FAST_MODEL = os.environ.get("VOICE_FAST_MODEL", "claude-haiku-4-5")

MODELS = {"agent": AGENT_MODEL, "fast": FAST_MODEL}
MAX_TOKENS = {"agent": 450, "fast": 260}

ANSWER_SYSTEM = """You are a real-time answer assistant for a live call \
(like a discreet teleprompter). Someone is speaking; you instantly surface the \
best answer to whatever they just said.

Rules:
- Output ONLY the answer. No preamble, no "Here is", no meta-commentary, no \
restating the question.
- Be concise and direct: 1-4 short sentences, or a tight bullet list.
- If document context is provided and relevant, ground your answer in it and \
cite the source name in [brackets].
- If it is a factual question (e.g. "what is science"), answer it immediately.
- If the utterance is a statement rather than a question, give the single most \
useful relevant fact or talking point in response.
- Never invent document content. If the context does not cover it, answer from \
general knowledge and say so briefly."""

COACH_SYSTEM = """You are a live conversation coach on a call or meeting \
(Google Meet, Zoom). You hear what people say and help the user navigate the \
conversation in real time — learning how to better ASK and ANSWER.

Rules:
- Output ONLY the line(s) the user could say next — natural, confident, ready \
to speak aloud. No preamble or meta-commentary.
- If the other person asked something, give the user a sharp, persuasive way to \
answer it.
- If the user just finished a point or it's their turn, suggest the single best \
question to ask to move the conversation forward.
- Ground suggestions in the user's uploaded documents when relevant and cite \
the source in [brackets].
- Keep it short: one strong line, or two at most. Optionally add a 4-6 word \
"why" hint in parentheses."""


_client = None
_client_ready = False


def _get_client():
    global _client, _client_ready
    if _client_ready:
        return _client
    _client_ready = True
    if not os.environ.get("ANTHROPIC_API_KEY"):
        _client = None
        return None
    from anthropic import AsyncAnthropic

    _client = AsyncAnthropic()
    return _client


def available() -> bool:
    return _get_client() is not None


def _format_contexts(hits: list[Hit]) -> str:
    return "\n\n---\n\n".join(f"[{h.chunk.doc_name}]\n{h.chunk.text}" for h in hits)


def _resolve_model(mode: str) -> str:
    return MODELS.get(mode, AGENT_MODEL)


def _build_request(mode: str, style: str, system: str, user: str) -> dict:
    model = _resolve_model(mode)
    kwargs = {
        "model": model,
        "max_tokens": MAX_TOKENS.get(mode, 400),
        "system": system,
        "thinking": {"type": "disabled"},  # off = lowest latency
        "messages": [{"role": "user", "content": user}],
    }
    # `effort` is supported on Opus (4.5+) but errors on Haiku 4.5.
    if model.startswith("claude-opus"):
        kwargs["output_config"] = {"effort": "low" if style == "answer" else "medium"}
    return kwargs


async def stream_answer(
    question: str,
    hits: list[Hit],
    mode: str = "agent",
    style: str = "answer",
    speaker: str | None = None,
) -> AsyncIterator[str]:
    """Yield answer/suggestion text deltas for the given spoken utterance."""
    client = _get_client()

    if client is None:
        if hits:
            yield hits[0].chunk.text[:500]
        else:
            yield (
                "AI answers are disabled — set ANTHROPIC_API_KEY to enable them. "
                "Upload documents to get grounded snippets without a key."
            )
        return

    system = COACH_SYSTEM if style == "coach" else ANSWER_SYSTEM
    context = _format_contexts(hits)
    who = f"{speaker}: " if speaker else ""

    parts = []
    if context:
        parts.append(f"Document context from the user's uploaded files:\n\n{context}\n")
        parts.append("---\n")
    parts.append(f'In the conversation, this was just said — {who}"{question}"\n')
    parts.append(
        "Give the instant suggestion now." if style == "coach"
        else "Give the instant answer now."
    )
    user = "\n".join(parts)

    async with client.messages.stream(**_build_request(mode, style, system, user)) as stream:
        async for text in stream.text_stream:
            yield text
