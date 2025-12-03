import time
import logging
import csv
from datetime import datetime

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("ArbLogger")

def current_time_ns():
    """Returns current time in nanoseconds for high-precision latency checks."""
    return time.perf_counter_ns()

class TradeLogger:
    def __init__(self, filename="trade_log.csv"):
        self.filename = filename
        # Initialize CSV with headers
        with open(self.filename, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                "timestamp", "trade_id", "exchange_buy", "exchange_sell",
                "buy_price", "sell_price", "gross_profit",
                "net_profit", "latency_ns"
            ])

    def log_trade(self, trade_data):
        with open(self.filename, mode='a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(trade_data)
