# Python Websocket Overlay
Simple and powerfull remote controlled html pages useful for overlays in OBS Studio, Casper CD, XSplit and others.

# Install & Run
Python 3.6+ is needed. You can download it from https://www.python.org/downloads/

    pip3 install websockets
    python3 server.py localhost 8000

# Setup in playout software
## OBS Studio
1. Click the plus button under Sources
2. Select BrowserSource
3. Name the source and click "OK"
4. Check the "Local file" box
5. Click the "Browse" button on the right and select the client.html you want to use
6. Set the Resolution to 1920x1080 (Width: 1920; Height: 1080) or the overlay resolution
7. Set FPS to you stream FPS

# Thanks
This project was inspired by https://github.com/lebaston100/htmlOverlayFramework
But I have made:
 - standard python naming (not CamelCase)
 - without CDN library which requires internet connection
 - better websockets library from pypi (not from github)
 - simpler directory structure
 - one javascript include for html overlay and controller
