#!/usr/bin/env python3

"Websocket server that synchronizes state across clients"

import asyncio
import json
import sys
import websockets

STATE = {}

CLIENTS = set()

def state_event():
    return json.dumps(STATE)

async def counter(websocket, path):
    CLIENTS.add(websocket)
    print('%s:%s connected' % websocket.remote_address)
    try:
        await websocket.send(state_event())
        async for message in websocket:
            STATE.update(json.loads(message))
            print(message)
            if CLIENTS:       # asyncio.wait doesn't accept an empty list
                await asyncio.wait([client.send(message) for client in CLIENTS if client != websocket])
    finally:
        CLIENTS.remove(websocket)

def help():
        print('''Websocket sync server
Relays each message to all clients.
Updates state on client connect.
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
                websockets.serve(counter, host, port))
            asyncio.get_event_loop().run_forever()
        except Exception:
            help()
            raise
