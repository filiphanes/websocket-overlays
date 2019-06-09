#!/usr/bin/env python3

"Websocket server that synchronizes state across clients"

import asyncio
import json
import sys
import websockets
from collections import defaultdict

CLIENTS = defaultdict(set)
STATE = defaultdict(dict)

async def distributor(websocket, path):
    CLIENTS[path].add(websocket)
    await websocket.send(json.dumps(STATE[path]))
    print('%s:%s connected' % websocket.remote_address)
    try:
        async for message in websocket:
            try:
                STATE[path].update(json.loads(message))
            except Exception:
                print('Message is not valid JSON', message)
            if len(CLIENTS) > 1:       # asyncio.wait doesn't accept an empty list
                await asyncio.wait([client.send(message) for client in CLIENTS if client != websocket])
            print('%s:%s' % websocket.remote_address, message)
    finally:
        CLIENTS[path].remove(websocket)
        if not CLIENTS[path]:
            del CLIENTS[path]
        print('%s:%s disconnected' % websocket.remote_address)

def help():
        print('''Websocket sync server
Relays each message to all clients.
Usage:', sys.argv[0], '[host [port]]''')

if __name__ == '__main__':
    if '-h' in sys.argv or '--help' in sys.argv:
        help()
    else:
        host = 'localhost'
        port = 8000

        try:
            host = sys.argv[1]
            port = int(sys.argv[2])
        except (IndexError, ValueError):
            pass

        try:
            asyncio.get_event_loop().run_until_complete(
                websockets.serve(distributor, host, port))
            asyncio.get_event_loop().run_forever()
        except Exception:
            help()
            raise
