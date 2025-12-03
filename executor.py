import asyncio
from datetime import datetime
import uuid
from colorama import Fore, Style
from utils import TradeLogger

class TradeExecutor:
    def __init__(self, mode: str, logger: TradeLogger):
        self.mode = mode
        self.logger = logger

    async def execute_order(self, buy_ex, buy_price, sell_ex, sell_price):
        """
        Routes the order based on the selected mode.
        """
        spread = sell_price - buy_price

        if self.mode == "LIVE":
            return await self._execute_live(buy_ex, buy_price, sell_ex, sell_price)
        else:
            return await self._execute_sim(buy_ex, buy_price, sell_ex, sell_price, spread)

    async def _execute_sim(self, buy_ex, buy_price, sell_ex, sell_price, spread):
        """Existing logic: Log to CSV, print to console."""
        print(f"{Fore.CYAN}[SIMULATED TRADE] Buy {buy_ex} @ {buy_price} | Sell {sell_ex} @ {sell_price} | Spread: {spread:.2f}{Style.RESET_ALL}")
        
        # Log to CSV
        trade_record = [
            datetime.now(), str(uuid.uuid4())[:8], 
            buy_ex, sell_ex, buy_price, sell_price, 
            spread, spread - 0.05, 0
        ]
        self.logger.log_trade(trade_record)
        return {"status": "filled", "mode": "simulation", "profit": spread}

    async def _execute_live(self, buy_ex, buy_price, sell_ex, sell_price):
        """
        FUTURE TODO: Implement CCXT or Exchange API calls here.
        """
        print(f"{Fore.RED}[REAL TRADE TRIGGERED] - Functionality not enabled yet.{Style.RESET_ALL}")
        # Simulate a network delay for real execution
        await asyncio.sleep(0.2) 
        return {"status": "failed", "reason": "Live trading not implemented"}
