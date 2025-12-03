import asyncio
import websockets
import json
from colorama import Fore, Style
from utils import current_time_ns, TradeLogger
from executor import TradeExecutor

class ArbitrageEngine:
    def __init__(self, config):
        self.exchanges = {
            "A": {"uri": "ws://localhost:9001", "bid": 0, "ask": 0},
            "B": {"uri": "ws://localhost:9002", "bid": 0, "ask": 0}
        }
        self.min_profit = config.min_profit
        self.max_trades = config.max_trades_per_day
        self.daily_trades = 0
        self.running = False
        
        # Initialize Executor
        self.trade_logger = TradeLogger()
        self.executor = TradeExecutor(config.mode, self.trade_logger)

    async def connect_to_exchange(self, name, uri):
        """Connects and listens to the websocket feed."""
        while self.running:
            try:
                # Changed from "localhost" to "127.0.0.1" to ensure connection within the same machine
                async with websockets.connect(uri.replace("localhost", "127.0.0.1")) as websocket:
                    print(f"{Fore.GREEN}Connected to Exchange {name}{Style.RESET_ALL}")
                    while self.running:
                        msg = await websocket.recv()
                        data = json.loads(msg)
                        if data['type'] == 'book_update':
                            self.exchanges[name]['bid'] = data['bid']
                            self.exchanges[name]['ask'] = data['ask']
                            await self.check_arbitrage()
            except Exception as e:
                # print(f"Connection error on {name}: {e}. Retrying...")
                await asyncio.sleep(1)

    async def check_arbitrage(self):
        if self.daily_trades >= self.max_trades:
            return

        bid_a = self.exchanges['A']['bid']
        ask_a = self.exchanges['A']['ask']
        bid_b = self.exchanges['B']['bid']
        ask_b = self.exchanges['B']['ask']

        if bid_a == 0 or bid_b == 0: return

        # Strategy: Buy Low, Sell High
        if bid_a > (ask_b + self.min_profit):
            await self.trigger_trade("B", ask_b, "A", bid_a)
        elif bid_b > (ask_a + self.min_profit):
            await self.trigger_trade("A", ask_a, "B", bid_b)

    async def trigger_trade(self, buy_ex, buy_price, sell_ex, sell_price):
        # Double check limit before execution
        if self.daily_trades >= self.max_trades: return
        
        self.daily_trades += 1
        await self.executor.execute_order(buy_ex, buy_price, sell_ex, sell_price)

    async def start(self):
        self.running = True
        print("Engine Started.")
        await asyncio.gather(
            self.connect_to_exchange("A", self.exchanges["A"]["uri"]),
            self.connect_to_exchange("B", self.exchanges["B"]["uri"])
        )
    
    def stop(self):
        self.running = False
