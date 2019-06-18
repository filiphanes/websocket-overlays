# Python Websocket Overlay
Simple and powerfull remote controlled html pages useful for overlays in OBS Studio, Casper CD, XSplit and others.

## Features
- server holds overlay state, not only relay commands
- on refresh or reconnect, state is updated from server for overlay and controller so you don't loose texts etc.
- multiple overlay-controller groups on 1 server instance (via different websocket paths)
- automatic reconnection every 5s

# Install & Run
Python 3.6+ is needed. You can download it from https://www.python.org/downloads/

    pip3 install websockets
    python3 server.py 127.0.0.1 8089

NodeJS is needed. You can download it from https://nodejs.org/en/

    npm install ws
    node server.js 127.0.0.1 8089

# Setup in playout software
Setting you might need to change is websocket URI in `overlay.html` and `controller.html` in `overlays/your-overlay/` directory.
Set it to the same IP address and port as your server is running on.

    WEBSOCKET_URI = "ws://127.0.0.1:8089/"

## OBS Studio
1. Click the plus button under Sources
2. Select BrowserSource
3. Name the source and click "OK"
4. Check the "Local file" box
5. Click the "Browse" button on the right and select the client.html you want to use
6. Set the Resolution to 1920x1080 (Width: 1920; Height: 1080) or the overlay resolution
7. Set FPS to you stream FPS (examples: 25, 30, 50, 60)

## Caspar CG
https://github.com/CasparCG/help/wiki/Media:-HTML-Templates

## XSplit
https://www.xsplit.com/broadcaster/manual/sources/webpage

# Thanks
This project was inspired by
- https://github.com/lebaston100/htmlOverlayFramework
- https://github.com/hberntsen/websocket-png-overlayer
- https://github.com/Scrxtchy/ts3-overlay-ws
- https://github.com/slugalisk/win-loss-overlay

# TODO
- more overlays
- remember controller config in browser session storage
- public websocket server with public overlays
