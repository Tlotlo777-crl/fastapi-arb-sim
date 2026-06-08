"""Lightweight retrieval over uploaded documents.

Pure-Python TF-IDF + cosine similarity so the assistant can "learn" any
document (Bible, CV, proposal, ...) without heavy ML dependencies. Good
enough to surface the right passage for a spoken question in milliseconds.
"""

from __future__ import annotations

import math
import re
import threading
from collections import Counter
from dataclasses import dataclass, field

_WORD = re.compile(r"[a-z0-9']+")


def tokenize(text: str) -> list[str]:
    return _WORD.findall(text.lower())


def chunk_text(text: str, target_words: int = 160, overlap: int = 30) -> list[str]:
    """Split text into overlapping word windows for retrieval."""
    words = text.split()
    if not words:
        return []
    chunks: list[str] = []
    step = max(1, target_words - overlap)
    i = 0
    while i < len(words):
        chunks.append(" ".join(words[i : i + target_words]))
        if i + target_words >= len(words):
            break
        i += step
    return chunks


@dataclass
class Chunk:
    doc_id: str
    doc_name: str
    index: int
    text: str
    counts: Counter = field(default_factory=Counter)
    norm: float = 0.0


@dataclass
class Hit:
    score: float
    chunk: Chunk


class DocumentStore:
    """In-memory TF-IDF index over all uploaded documents."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.docs: dict[str, dict] = {}  # doc_id -> metadata
        self.chunks: list[Chunk] = []
        self.idf: dict[str, float] = {}

    # ---- mutation -------------------------------------------------------
    def add_document(self, doc_id: str, name: str, text: str) -> dict:
        pieces = chunk_text(text)
        with self._lock:
            for i, piece in enumerate(pieces):
                self.chunks.append(
                    Chunk(doc_id, name, i, piece, Counter(tokenize(piece)))
                )
            meta = {
                "id": doc_id,
                "name": name,
                "chunks": len(pieces),
                "chars": len(text),
            }
            self.docs[doc_id] = meta
            self._reindex()
        return meta

    def remove_document(self, doc_id: str) -> bool:
        with self._lock:
            if doc_id not in self.docs:
                return False
            self.chunks = [c for c in self.chunks if c.doc_id != doc_id]
            self.docs.pop(doc_id, None)
            self._reindex()
        return True

    def list_documents(self) -> list[dict]:
        with self._lock:
            return list(self.docs.values())

    # ---- indexing -------------------------------------------------------
    def _reindex(self) -> None:
        df: Counter = Counter()
        for c in self.chunks:
            df.update(c.counts.keys())
        n = max(1, len(self.chunks))
        self.idf = {t: math.log((n + 1) / (v + 1)) + 1.0 for t, v in df.items()}
        for c in self.chunks:
            c.norm = self._vec_norm(c.counts)

    def _vec_norm(self, counts: Counter) -> float:
        total = 0.0
        for term, freq in counts.items():
            w = (1.0 + math.log(freq)) * self.idf.get(term, 0.0)
            total += w * w
        return math.sqrt(total) or 1.0

    # ---- query ----------------------------------------------------------
    def search(self, query: str, k: int = 4) -> list[Hit]:
        q_counts = Counter(tokenize(query))
        with self._lock:
            if not q_counts or not self.chunks:
                return []
            q_weights = {
                t: (1.0 + math.log(f)) * self.idf.get(t, 0.0)
                for t, f in q_counts.items()
            }
            q_norm = math.sqrt(sum(w * w for w in q_weights.values())) or 1.0

            hits: list[Hit] = []
            for chunk in self.chunks:
                dot = 0.0
                for term, qw in q_weights.items():
                    cf = chunk.counts.get(term)
                    if cf:
                        dot += qw * (1.0 + math.log(cf)) * self.idf.get(term, 0.0)
                if dot <= 0:
                    continue
                hits.append(Hit(dot / (q_norm * chunk.norm), chunk))

        hits.sort(key=lambda h: h.score, reverse=True)
        return hits[:k]
