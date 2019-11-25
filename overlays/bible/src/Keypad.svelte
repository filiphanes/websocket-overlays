<script>
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher();

	const select = num => () => value = +value*10 + num;
	const decrement = num => () => value = Math.max(1, +value-1);
	const increment = num => () => value = +value + 1;
	const clear  = () => value = '';
	const backspace  = () => value = Math.floor(+value/10);
	const submit = () => dispatch('submit');
</script>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(7, 3rem);
		grid-template-rows: repeat(2, 3rem);
		grid-gap: 0;
        margin: 0 0 0.5rem 0;
	}

	button {
		margin: 0;
        line-height: 2rem;
        width: 3rem;
	}
</style>

<div class="keypad">
	<button disabled={!value} on:click={backspace}>←</button>
	<button on:click={increment()}>+</button>
	<button on:click={select(1)}>1</button>
	<button on:click={select(2)}>2</button>
	<button on:click={select(3)}>3</button>
	<button on:click={select(4)}>4</button>
	<button on:click={select(5)}>5</button>

	<button disabled={!value} on:click={clear}>C</button>
	<button disabled={value <= 1} on:click={decrement()}>-</button>
	<button on:click={select(6)}>6</button>
	<button on:click={select(7)}>7</button>
	<button on:click={select(8)}>8</button>
	<button on:click={select(9)}>9</button>
	<button on:click={select(0)}>0</button>
</div>