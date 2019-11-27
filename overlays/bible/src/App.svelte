<script>
  import { onMount, onDestroy } from "svelte";
  import { doConnect, doDisconnect, sendCommand } from "./websocket-client.js";
  import Keypad from "./Keypad.svelte";
  import seb from "./seb.json";

  let shown = false;
  let line1 = '';
  let line2 = '';
  let lastAddresses = [
    {book: "gn", chapter: 1, verse: 1},
    {book: "z", chapter: 150, verse: 1},
    {book: "jn", chapter: 3, verse: 16},
  ];

  let books = seb.books.filter(book => book.category != 'deut');
  let booksByAbbr = new Map();
  books.forEach(book => {booksByAbbr[book.abbreviation] = book});

  let bookFilter = "";
  let aBook;

  let selected = {
    book: "gn",
    chapter: 1,
    verse: 1,
  }

  $: filteredBooks = bookFilter
    ? books.filter(matchesBook)
    : books;
  $: filteredLastAddresses = bookFilter
    ? lastAddresses.filter(h => matchesBook(booksByAbbr[h.book]))
    : lastAddresses;

  const matchesBook = (book) => {
    const prefix = bookFilter.toLowerCase();
    const bookLower = book.name.toLowerCase();
    return (
      bookLower.startsWith(prefix) ||
      book.abbreviation.startsWith(prefix) ||
      (book.aliases && book.aliases.some(a => a.toLowerCase().startsWith(prefix))) ||
      (prefix.length >= 2 && bookLower.includes(' '+prefix))
    );
  }

  $: aBook = booksByAbbr[selected.book];
  $: line1 = addressAsString(selected);
  $: line2 = aBook.chapters[selected.chapter] ? aBook.chapters[selected.chapter][selected.verse] || '' : '';

  onMount(async () => {
    doConnect(onMessage);
  });

  onDestroy(async () => {
    doDisconnect();
  });

  function addToLastAddresses(address) {
    console.log('before', lastAddresses)
    lastAddresses.unshift({
      book: address.book,
      chapter: address.chapter,
      verse: address.verse,
    })
    console.log('between', lastAddresses)
    lastAddresses = lastAddresses.filter((h,i) =>
      i === 0 ||
      h.book != address.book ||
      h.chapter != address.chapter ||
      h.verse != address.verse
    )
    console.log('after', lastAddresses)
  }
  const addressAsString = (address) => (booksByAbbr[address.book].name + ' ' + address.chapter + (address.verse ? ','+address.verse : ''));
  const equalAddresses = (a1, a2) => (
      a1.book == a2.book &&
      a1.chapter == a2.chapter &&
      a1.verse == a2.verse
  );
  function selectAddress(address) {
    return () => {
      selected.book = address.book;
      selected.chapter = address.chapter || '';
      selected.verse = address.verse || '';
    }
  }

  function toggleLine() {
    shown = !shown;
    sendCommand({
      show: shown,
      line1: line1,
      line2: line2,
      address: selected,
    });
    addToLastAddresses(selected)
  }

  function onMessage(data) {
    console.log(data);
    if (data.hasOwnProperty("shown")) {
      shown = data.shown;
    }
    if (data.hasOwnProperty("address")) {
      selected = data.address;
    }
  }

</script>

<style>
  .control-button {
    width: 6rem;
    float: right;
  }
  .books-filter {
    display: block;
    width: 49%;
    margin: 0 1% 0 0;
    padding: 0;
    height: 10rem;
    overflow: scroll;
    float: left;
  }
  .books-filter button {
    width: 100%;
    margin: 0 0 .25rem 0;
    padding: .25rem .5rem;
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
  <button class="btn btn-primary" class:btn-success={book.abbreviation==selected.book} on:click={selectAddress({book: book.abbreviation})}>{book.name}</button>
  {/each}
</div>
<div class="books-filter">
  {#each filteredLastAddresses as address}
  <button class="btn btn-primary" class:btn-success={equalAddresses(address, selected)} on:click={selectAddress(address)}>{addressAsString(address)}</button>
  {/each}
</div>

Kapitola: {selected.chapter}
<Keypad bind:value={selected.chapter} />
Verš: {selected.verse}
<Keypad bind:value={selected.verse} />

<button class="control-button btn" on:click={toggleLine} class:btn-danger={shown} class:btn-primary={!shown}>
  {#if shown}Skryť{:else}Zobraziť{/if}
</button>
<div class="address">{line1}</div>
<span class="vers">{@html line2}</span>

