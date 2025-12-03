import asyncio
import websockets
import json
import random
import time
from utils import current_time_ns

class ExchangeSimulator:
    def __init__(self, name, port, base_price=100.0, latency_ms=0, jitter_ms=0):
        self.name = name
        self.port = port
        self.price = base_price
        self.latency_ms = latency_ms
        self.jitter_ms = jitter_ms
        self.clients = set()
        self.running = True

    async def generate_market_data(self):
        """Simulates a random walk price and broadcasts it."""
        while self.running:
            # Random Walk: Price moves slightly up or down
            movement = random.gauss(0, 0.05) 
            self.price += movement
            
            # Create Order Book (Spread usually ~0.02 - 0.05)
            spread = 0.05
            best_bid = round(self.price - (spread / 2), 2)
            best_ask = round(self.price + (spread / 2), 2)

            msg = {
                "type": "book_update",
                "exchange": self.name,
                "bid": best_bid,
                "ask": best_ask,
                "timestamp_ns": current_time_ns()
            }
            
            # Broadcast to all connected clients
            if self.clients:
                # Added a try-except to handle potential connection errors during broadcast
                try:
                    await asyncio.gather(*[client.send(json.dumps(msg)) for client in self.clients])
                except Exception:
                    pass # Silently ignore broadcast errors
            
            # Emit updates every 50ms (Simulate 20 ticks/sec)
            await asyncio.sleep(0.05)

    async def handle_orders(self, websocket):
        """Listens for orders, simulates network lag, and sends fills."""
        async for message in websocket:
            data = json.loads(message)
            if data['type'] == 'order':
                # Simulate Latency (Network delay + Processing time)
                delay = self.latency_ms + random.uniform(0, self.jitter_ms)
                await asyncio.sleep(delay / 1000)

                # Send Fill Confirmation
                fill_msg = {
                    "type": "fill",
                    "order_id": data['order_id'],
                    "exchange": self.name,
                    "price": data['price'],
                    "side": data['side'],
                    "filled_at": current_time_ns()
                }
                await websocket.send(json.dumps(fill_msg))

    async def handler(self, websocket):
        """Main WebSocket handler."""
        self.clients.add(websocket)
        try:
            await self.handle_orders(websocket)
        finally:
            self.clients.remove(websocket)

    async def start(self):
        print(f"[{self.name}] server started on port {self.port} (Latency: {self.latency_ms}ms)")
        # Note: Changed "localhost" to "0.0.0.0" to ensure it binds correctly in the sandbox environment
        server = await websockets.serve(self.handler, "0.0.0.0", self.port)
        await asyncio.gather(server.wait_closed(), self.generate_market_data())
