<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";

  const dispatch = createEventDispatcher();

  const select = num => () => (value = +value * 10 + num);
  const decrement = () => (value = Math.max(1, +value - 1));
  const increment = () => (value = +value + 1);
  const clear = () => (value = "");
  const deleteLast = () => (value = Math.floor(+value / 10));
</script>

<style>
  .keypad {
    display: grid;
    grid-template-columns: repeat(7, 3rem);
    grid-template-rows: repeat(2, 3rem);
    grid-gap: 0.2rem;
    margin: 0 0 0.5rem 0;
  }

  button {
    margin: 0;
    line-height: 2rem;
    width: 3rem;
  }
</style>

<div class="keypad">
  <button class="btn btn-primary" on:click={deleteLast} disabled={!value}>←</button>
  <button class="btn btn-primary" on:click={increment}>↑</button>
  <button class="btn btn-primary" on:click={select(1)}>1</button>
  <button class="btn btn-primary" on:click={select(2)}>2</button>
  <button class="btn btn-primary" on:click={select(3)}>3</button>
  <button class="btn btn-primary" on:click={select(4)}>4</button>
  <button class="btn btn-primary" on:click={select(5)}>5</button>

  <button class="btn btn-primary" on:click={clear} disabled={!value} >C</button>
  <button class="btn btn-primary" on:click={decrement} disabled={value <= 1}>↓</button>
  <button class="btn btn-primary" on:click={select(6)}>6</button>
  <button class="btn btn-primary" on:click={select(7)}>7</button>
  <button class="btn btn-primary" on:click={select(8)}>8</button>
  <button class="btn btn-primary" on:click={select(9)}>9</button>
  <button class="btn btn-primary" on:click={select(0)}>0</button>
</div>
