var ip = "127.0.0.1"; //Modify this to point to the ip address where your server is running on
var port = "8000";

///////////////////////////////////////////////////////////////////////////

window.addEventListener("load", init, false);
var socketIsOpen = false;
var intervalID = 0;

function init() {
	doConnect();
}

function sendCommand(obj) {
	if (socketIsOpen) {
		websocket.send(JSON.stringify(obj));
	} else {
		console.log('Fail: Not connected\n');
	}
}

function setMediaVolume(id, volume) {
	document.getElementById(id).volume = volume/100;
}

function changeElement(id, newContent) {
	document.getElementById(id).innerHTML = newContent
}

function playMedia(id) {
	document.getElementById(id).play();
}

function pauseMedia(id) {
	document.getElementById(id).pause();
}

function showContent(id) {
	document.getElementById(id).style.visibility = "visible";
}

function hideContent(id) {
	document.getElementById(id).style.visibility = "hidden";
}

function changeElementContent(id, newContent) {
	document.getElementById(id).innerHTML = newContent
}

function doConnect() {
	websocket = new WebSocket("ws://" + ip + ":" + port + "/");
	websocket.onopen = function(event) {
        socketIsOpen = true;
        clearInterval(intervalID);
        intervalID = 0;
    };
	websocket.onclose = function(event) {
        socketIsOpen = false;
        if (!intervalID) {
            intervalID = setInterval(doConnect, 5000);
        }
    };
	websocket.onmessage = function(event) {
        console.log(event.data);
        var messageObject = JSON.parse(event.data);
        window.commandRecieved(messageObject);
    };
	websocket.onerror = function(event) {
        socketIsOpen = false;
        if (!intervalID) {
            intervalID = setInterval(doConnect, 5000);
        }
    };
}


function doDisconnect() {
	socketIsOpen = false;
	websocket.close();
}