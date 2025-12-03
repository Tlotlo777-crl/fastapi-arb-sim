from pydantic import BaseModel

class SystemConfig(BaseModel):
    min_profit: float = 0.10
    max_trades_per_day: int = 3  # Your specific rule
    mode: str = "SIMULATION"     # Options: "SIMULATION", "LIVE"
    
    # Future Real Exchange Configs
    binance_api_key: str = ""
    binance_secret: str = ""
