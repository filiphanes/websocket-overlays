//Modify this to point to the ip address where your server is running on
WEBSOCKET_URI = WEBSOCKET_URI || "ws://127.0.0.1:8089/";

let websocket;
let socketIsOpen = false;
let intervalID = 0;
let closedByUser = false;

export function sendCommand(obj) {
    console.log(JSON.stringify(obj));
	if (socketIsOpen) {
		websocket.send(JSON.stringify(obj));
	} else {
		console.err('Not connected\n');
	}
}


export function doConnect(onMessage) {
	websocket = new WebSocket(WEBSOCKET_URI);
	websocket.onopen = function(evt) {
		socketIsOpen = true;
		console.info("Connection opened");
		clearInterval(intervalID);
		intervalID = 0;
	};
	websocket.onclose = function(evt) {
		socketIsOpen = true;
		if (!intervalID && !closedByUser) {
			intervalID = setInterval(doConnect, 5000);
		} else if (closedByUser) {
			closedByUser = false;
		}
		console.info("Connection closed");
	};
	websocket.onmessage = function(evt) {
		var jsonOBJ = JSON.parse(evt.data);
		console.log(evt.data);
		onMessage(jsonOBJ);
	};
	websocket.onerror = function(evt) {
		console.error('Connection failed, is the Server running?');
		socketIsOpen = false;
		if (!intervalID) {
			intervalID = setInterval(doConnect, 5000);
		}
	};
}

export function doDisconnect() {
	socketIsOpen = false;
	closedByUser = true;
	websocket.close();
}