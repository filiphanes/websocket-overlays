# Websocket Overlay
Simple and powerfull remote controlled html pages useful for overlays in OBS Studio, Casper CD, XSplit or simply fullscreen browser.

Check out overlays project using [gundb](https://gun.eco/): https://github.com/filiphanes/gun-overlays

## Features
- server holds overlay state, not only relay commands
- on refresh or reconnect, state is updated from server for overlay and controller so you don't loose texts etc.
- multiple overlay-controller groups on 1 server instance (via different websocket paths)
- automatic reconnection every 5s

# Install
You can run server with Python or Nodejs.

Python 3.6+ is needed. You can download it from https://www.python.org/downloads/

    pip3 install websockets

NodeJS is needed. You can download it from https://nodejs.org/en/

    npm install ws

# Run
## 1. Run websocket server
Python server:

    python3 server.py 127.0.0.1 8089

Node server:

    node server.js 127.0.0.1 8089

## 2. Open controller
Open in browser `lower-third-simple/controller.html`.

## 3. Open overlay
Open in browser `lower-third-simple/overlay.html`

# Setup in playout software
Setting you might need to change is websocket URI in `overlay.html` and `controller.html` in directory `your-overlay/`.
FSet it to the same IP address and port as your server is running on.

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

## ProPresenter
https://learn.renewedvision.com/propresenter6/the-features-of-propresenter/web-view

## XSplit
https://www.xsplit.com/broadcaster/manual/sources/webpage


# New overlays
You can create your own overlay and associated controller without implementing server.

## Server API
Server API is made simple and universal. Server only keeps state of overlay and broadcasts state updates from controller to all connected clients.

- Controller and overlay connects to the same websocket `ws://host:port/path`. Path can be any string you choose.
- Server keeps 1 state object for each path, so you can have multiple overlays with different state on one server with different path. State object is not persisted between server restarts. State is kept only in memory.
- Each websocket message is json. Server keeps state of overlay in js object (dict in python).
- When server recieves json it updates all key/value pairs, but not removes existing.
- When new client (overlay or controller) connects to websocket, servers sends him full state in json message.
- Controller is meant to send state updates (websocket messages) to server which are broadcasted to all connected overlays and controllers (you can control multiple opened overlays with multiple opened controllers).
- When controller recieves message he updates his internal state.
- Overlay usually only recieves updates from server, but in some situation may want to send updates from overlay (i.e. set value state after finishing animation).

Usually you want to send commands to overlay like show or hide something. With state updating aproach you don't send `{"command":"show-counter"}` and `{"command":"hide-counter"}`, but rather `{"show-counter":true}` and `{"show-counter":false}`.

This approach is more robust against errors on network. Controller and overlay can connect and disconnect any time and he recieves full state and don't need to replay commands from history.

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
