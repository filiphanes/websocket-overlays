<script>
let WEBSOCKET_URI = WEBSOCKET_URI || "ws://127.0.0.1:8089/"
</script>
<div class="card">
    <div class="card-body">
        <h5 class="card-title">Connection settings</h5>
        <div class="form-row">
            <div class="form-group col">
                <label for="WEBSOCKET_URI">Websocket URI:</label>
                <div class="input-group">
                    <input id="WEBSOCKET_URI" class="form-control" bind:value={WEBSOCKET_URI} placeholder="ws://host:ip/">
                    <button class="form-control btn btn-success control-button" onclick='doConnect();' id="btt_connect">Connect</button>
                    <button class="form-control btn btn-danger control-button" onclick='doDisconnect();' id="btt_disconnect">Disconnect</button>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col">
                <label for="inputtext">Custom command:</label>
                <div class="input-group">
                    <input id="inputtext" class="form-control" type="text" placeholder="Command">
                    <div class="input-group-append">
                        <button class="form-control btn btn-primary" onclick='sendCommand(JSON.parse(document.getElementById("inputtext").value));'>Send command</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col">
                <label for="outputtext">Console:</label>
                <textarea id="outputtext" class="form-control" style="height: 10rem; font-size: 80%; font-family: monospace;" readonly></textarea>
            </div>
        </div>
    </div>
</div>