"""Claude-powered answer generation, streamed for instant display.

Falls back to returning the top retrieved passage when no ANTHROPIC_API_KEY
is configured, so the app is still demoable without a key.
"""

from __future__ import annotations

import os
from collections.abc import AsyncIterator

from .rag import Hit

MODEL = os.environ.get("VOICE_MODEL", "claude-opus-4-8")

SYSTEM_PROMPT = """You are a real-time answer assistant for a live call \
(like a discreet teleprompter). Someone is speaking; you instantly surface \
the best answer to whatever they just said.

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


def _format_contexts(hits: list[Hit]) -> str:
    if not hits:
        return ""
    blocks = []
    for h in hits:
        blocks.append(f"[{h.chunk.doc_name}]\n{h.chunk.text}")
    return "\n\n---\n\n".join(blocks)


def available() -> bool:
    return _get_client() is not None


async def stream_answer(question: str, hits: list[Hit]) -> AsyncIterator[str]:
    """Yield answer text deltas for the given spoken utterance."""
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

    context = _format_contexts(hits)
    if context:
        user = (
            f"Document context from the user's uploaded files:\n\n{context}\n\n"
            f"---\n\nThe person just said: \"{question}\"\n\n"
            "Give the instant answer now."
        )
    else:
        user = (
            f'The person just said: "{question}"\n\nGive the instant answer now.'
        )

    async with client.messages.stream(
        model=MODEL,
        max_tokens=400,
        system=SYSTEM_PROMPT,
        thinking={"type": "disabled"},
        output_config={"effort": "low"},
        messages=[{"role": "user", "content": user}],
    ) as stream:
        async for text in stream.text_stream:
            yield text
