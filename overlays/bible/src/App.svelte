<script>
  import { onMount, onDestroy } from "svelte";
  import { doConnect, doDisconnect, sendCommand } from "./websocket-client.js";
  import Keypad from "./Keypad.svelte";
  import seb from "./seb.json";

  let shown = false;
  let line1 = '';
  let line2 = '';

  let books = seb.books;
  let booksByAbbr = new Map();
  books.forEach(book => {booksByAbbr[book.abbreviation] = book});

  let bookFilter = "";
  let selectedBook = "gn";
  let book;

  let selectedChapter = 1;
  let selectedVerse = 1;

  $: filteredBooks = bookFilter
    ? books.filter(book => {
        const prefix = bookFilter.toLowerCase();
        const bookLower = book.name.toLowerCase();
        return (
          bookLower.startsWith(prefix) ||
          book.abbreviation.startsWith(prefix) ||
          (book.aliases && book.aliases.some(a => a.toLowerCase().startsWith(prefix))) ||
          (prefix.length >= 2 && bookLower.includes(' '+prefix))
        );
      })
    : books;

  $: book = booksByAbbr[selectedBook];
  $: line1 = book.name + ' ' + selectedChapter + (selectedVerse ? ','+selectedVerse : '');
  $: line2 = book.chapters[selectedChapter] ? book.chapters[selectedChapter][selectedVerse] : '';

  onMount(async () => {
    doConnect(onMessage);
  });

  onDestroy(async () => {
    doDisconnect();
  });

  function toggleLine() {
    shown = !shown;
    sendCommand({
      line1: line1,
      show: shown
    });
  }

  function onMessage(data) {
    console.log(data);
    if (data.hasOwnProperty("shown")) {
      shown = data.shown;
    }
  }
</script>

<style>
  .control-button {
    width: 6rem;
    float: right;
  }
  .books-filter {
    width: 100%;
    padding: 0;
  }
  .books-filter option {
    width: 100%;
    padding: 0.5rem;
  }
  .vers,
  .address {
    color: white;
  }
  :global(body) {
    color: white;
  }
</style>

<input
  class="form-control"
  type="text"
  placeholder="filter"
  bind:value={bookFilter} />
<select class="books-filter" bind:value={selectedBook} size={8}>
  {#each filteredBooks as book}
    <option value={book.abbreviation}>{book.name}</option>
  {/each}
</select>

Kapitola: {selectedChapter}
<Keypad bind:value={selectedChapter} />
Verš: {selectedVerse}
<Keypad bind:value={selectedVerse} />

<button class="control-button btn" on:click={toggleLine} class:btn-danger={shown} class:btn-primary={!shown}>
  {#if shown}Skryť{:else}Zobraziť{/if}
</button>
<div class="address">{line1}</div>
<span class="vers">
  {@html line2}
</span>

