var ip = "127.0.0.1"; //Modify this to point to the ip address where your server is running on
var port = "8000";

///////////////////////////////////////////////////////////////////////////


window.addEventListener("load", init, false);
var socketIsOpen = 0;
var intervalID = 0;
var closedByUser = 0;

function getInput(id) {
	return document.getElementById(id).value;
}

function sendCommand(obj) {
	if (socketIsOpen) {
		websocket.send(JSON.stringify(obj));
	} else {
		console.log('Fail: Not connected\n');
	}
}


function init() {
	document.getElementById("ip").value = ip;
	document.getElementById("port").value = port;
	document.getElementById("inputtext").value = '{"ping":"test"}'
	document.getElementById("btt_disconnect").disabled = true;
	doConnect();
}

function doConnect() {
	websocket = new WebSocket("ws://" + ip + ":" + port + "/");
	websocket.onopen = function(evt) {
		socketIsOpen = 1;
		writeToScreen("\nInfo: Connection opened");
		document.getElementById("btt_connect").disabled = true;
		document.getElementById("btt_disconnect").disabled = false;
		clearInterval(intervalID);
		intervalID = 0;
	};
	websocket.onclose = function(evt) {
		socketIsOpen = 0;
		if (!intervalID && !closedByUser) {
			intervalID = setInterval(doConnect, 5000);
		} else if (closedByUser) {
			closedByUser = 0;
		}
		writeToScreen("\nInfo: Connection closed");
		document.getElementById("btt_connect").disabled = false;
		document.getElementById("btt_disconnect").disabled = true;
	};
	websocket.onmessage = function(evt) {
		var jsonOBJ = JSON.parse(evt.data);
		writeToScreen('\n' + evt.data);
	};
	websocket.onerror = function(evt) {
		writeToScreen('\nConnection failed, is the Server running?');
		socketIsOpen = 0;
		document.getElementById("btt_connect").disabled = false;
		document.getElementById("btt_disconnect").disabled = true;
		if (!intervalID) {
			intervalID = setInterval(doConnect, 5000);
		}
	};
}

function writeToScreen(message) {
	document.getElementById("outputtext").value += message;
	document.getElementById("outputtext").scrollTop = document.getElementById("outputtext").scrollHeight;
}

function doDisconnect() {
	socketIsOpen = 0;
	closedByUser = 1;
	websocket.close();
}