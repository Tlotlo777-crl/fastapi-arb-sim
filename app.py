from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
import asyncio
from simulator import ExchangeSimulator
from arb_engine import ArbitrageEngine
from config import SystemConfig
import pandas as pd
import os

# Global State
state = {
    "sim_a": None,
    "sim_b": None,
    "engine": None,
    "tasks": []
}

app = FastAPI(title="Latency Arb Bot API")

@app.post("/start")
async def start_system(config: SystemConfig, background_tasks: BackgroundTasks):
    """
    Starts the Simulators and the Arbitrage Engine.
    """
    if state["engine"] and state["engine"].running:
        return {"message": "System is already running."}

    # Clear old log file if it exists
    if os.path.exists("trade_log.csv"):
        os.remove("trade_log.csv")

    # 1. Init Simulators
    state["sim_a"] = ExchangeSimulator("Ex_A", 9001, base_price=1000, latency_ms=5)
    state["sim_b"] = ExchangeSimulator("Ex_B", 9002, base_price=1000, latency_ms=50, jitter_ms=20)
    
    # 2. Init Engine
    state["engine"] = ArbitrageEngine(config)

    # 3. Run them as Async Tasks (non-blocking)
    loop = asyncio.get_event_loop()
    state["tasks"].append(loop.create_task(state["sim_a"].start()))
    state["tasks"].append(loop.create_task(state["sim_b"].start()))
    
    # Give simulators a moment to boot
    await asyncio.sleep(1)
    state["tasks"].append(loop.create_task(state["engine"].start()))

    return {
        "status": "started", 
        "mode": config.mode, 
        "max_trades": config.max_trades_per_day
    }

@app.post("/stop")
async def stop_system():
    """Stops all running tasks."""
    if state["engine"]: state["engine"].stop()
    if state["sim_a"]: state["sim_a"].running = False
    if state["sim_b"]: state["sim_b"].running = False
    
    # Cancel asyncio tasks
    for task in state["tasks"]:
        task.cancel()
    state["tasks"] = []
    
    return {"status": "stopped"}

@app.get("/status")
def get_status():
    """Returns current P&L and trade counts."""
    if not state["engine"]:
        return {"status": "offline"}
    
    return {
        "status": "running" if state["engine"].running else "stopped",
        "daily_trades": state["engine"].daily_trades,
        "max_trades": state["engine"].max_trades,
        "prices": {
            "Ex_A": state["engine"].exchanges["A"],
            "Ex_B": state["engine"].exchanges["B"]
        }
    }

@app.get("/logs")
def get_logs():
    """Reads the CSV and returns recent trades."""
    try:
        # Added 'os.path.join' for robustness, though not strictly necessary here
        df = pd.read_csv("trade_log.csv")
        # Convert timestamp column to string for JSON serialization
        df['timestamp'] = df['timestamp'].astype(str)
        return df.tail(10).to_dict(orient="records")
    except Exception as e:
        return {"error": f"No logs found or error reading file: {e}"}

# For Render/Deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
