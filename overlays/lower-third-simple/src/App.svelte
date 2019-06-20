<style>
.control-button {
	max-width: 6rem;
}
</style>
<script>
let lines = [1,2,3,4];
let shown = -1;

function showLine(i) {
	if (shown === i) {
		shown = -1;
	} else {
		shown = i;
	}
}
function cleanLines() {
	// remove empty lines except last
	lines = [...lines.filter(l=>l), ''];
}
function onMessage(data) {
	console.log(data);
    if (data.hasOwnProperty('lines')) {
        lines = data.lines;
    }
    if (data.hasOwnProperty('shown')) {
        shown = data.shown;
    }
}

function updateLine(i) {
	var line = document.getElementById("line1").value;
	if (history.indexOf(line) < 0) {
		history.push(line);
	}
	sendCommand({
		"line1": line,
	})
}
function show() {
	sendCommand({
		"line1": document.getElementById("line1").value,
		"show": true,
	})
}
function hide() {
	sendCommand({"show": false})
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
						<input class="form-control" type="text" placeholder="Text" id="line1" bind:value="{line}" on:change={cleanLines}>
						<button class="form-control btn {shown === i?'btn-danger':'btn-primary'} control-button" on:click={e=>showLine(i)}>{#if shown === i}Hide{:else}Show{/if}</button>
					</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
