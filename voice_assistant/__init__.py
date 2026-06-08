"""Live voice-to-answer assistant.

Listens to speech (via the browser's Web Speech API), retrieves relevant
passages from uploaded documents, and streams instant AI answers back.
"""

__all__ = ["server", "rag", "documents", "llm"]
