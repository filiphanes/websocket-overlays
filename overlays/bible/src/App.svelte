<script>
  import { onMount, onDestroy } from "svelte";
  import { doConnect, doDisconnect, sendCommand } from "./websocket-client.js";
  import Keypad from "./Keypad.svelte";
  import seb from "./seb.json";

  let shown = false;
  let line1 = '';
  let line2 = '';

  let books = seb.books.filter(book => book.category != 'deut');
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
  $: line2 = book.chapters[selectedChapter] ? book.chapters[selectedChapter][selectedVerse] || '' : '';

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
      line2: line2,
      book: selectedBook,
      chapter: selectedChapter,
      verse: selectedVerse,
      show: shown
    });
  }

  function onMessage(data) {
    console.log(data);
    if (data.hasOwnProperty("shown")) {
      shown = data.shown;
    }
    if (data.hasOwnProperty("book")) {
      selectBook = data.book;
    }
    if (data.hasOwnProperty("chapter")) {
      selectedChapter = data.chapter;
    }
    if (data.hasOwnProperty("verse")) {
      selectedVerse = data.vers;
    }
  }

  function selectBook(book) {
    selectedBook = book.abbreviation;
    selectedChapter = '';
    selectedVerse = '';
  }
</script>

<style>
  .control-button {
    width: 6rem;
    float: right;
  }
  .books-filter {
    display: block;
    width: 50%;
    padding: 0;
    height: 10rem;
    overflow: scroll;
  }
  .books-filter button {
    width: 100%;
    margin: 0;
    padding: 0.5rem;
    text-align: left;
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
<div class="books-filter">
  {#each filteredBooks as book}
  <button class="btn btn-primary" class:btn-success={book.abbreviation==selectedBook} on:click={selectBook(book)}>{book.name}</button>
  {/each}
</div>

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

