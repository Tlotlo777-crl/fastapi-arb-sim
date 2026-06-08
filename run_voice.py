"""Entry point for the live voice answer assistant.

Run:  python run_voice.py     (listens on http://0.0.0.0:8000)
Env:
  ANTHROPIC_API_KEY  enable Claude answers (without it you still get
                     retrieved document snippets)
  VOICE_MODEL        Claude model id (default: claude-opus-4-8)
  VOICE_DATA_DIR     where uploaded docs are persisted (default: voice_data)
  PORT               port to bind (default: 8000)
"""

import os

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("voice_assistant.server:app", host="0.0.0.0", port=port)
