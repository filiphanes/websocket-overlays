<style>
.control-button {
	max-width: 6rem;
}
</style>
<script>
import { onMount, onDestroy } from 'svelte';
import { doConnect, doDisconnect, sendCommand } from './websocket-client.js';

let lines = [1,2,3,4];
let shown = -1;

onMount(async () => {
	doConnect(onMessage);
})

onDestroy(async () => {
	doDisconnect();
})

function toggleLine(i) {
	if (shown === i) {
		shown = -1;
	} else {
		shown = i;
	}
	sendCommand({
		"shown": shown,
		"line1": lines[i],
		"show": shown >= 0,
	})
}
function cleanLines() {
	// remove empty lines except last
	lines = [...lines.filter(l=>l), ''];

}
function onMessage(data) {
	console.log(data);
    if (data.hasOwnProperty('lines')) {
		lines = data.lines;
		cleanLines();
    }
    if (data.hasOwnProperty('shown')) {
        shown = data.shown;
    }
}

function updateLines() {
	sendCommand({
		"lines": lines,
	})
}

function changeLine(i) {
	let command = {
		"lines": lines,
	};
	if (shown === i) {
		command["line1"] = lines[i];
	}
	sendCommand(command);
	cleanLines();
}

cleanLines();
</script>

<div class="container-fluid">
	<div class="row">
		<div class="col-md">
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">Lower Third control</h5>
					{#each lines as line, i}
					<div class="input-group">
						<input class="form-control" type="text" placeholder="Text"
								bind:value="{line}"
								on:change={e=>changeLine(i)}>
						<button class="form-control btn {shown === i?'btn-danger':'btn-primary'} control-button"
								on:click={e=>toggleLine(i)}>
							{#if shown === i}Hide{:else}Show{/if}
						</button>
					</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
