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

  // Filter out deuteronomy books
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
  $: line2 = aBook.chapters[selected.chapter] ? aBook.chapters[selected.chapter][selected.verse-1] || '' : '';

  onMount(async () => {
    doConnect(onMessage);
  });

  onDestroy(async () => {
    doDisconnect();
  });

  function addToLastAddresses(address) {
    lastAddresses.unshift({
      book: address.book,
      chapter: address.chapter,
      verse: address.verse,
    })
    lastAddresses = lastAddresses.filter((h,i) =>
      i === 0 ||
      h.book != address.book ||
      h.chapter != address.chapter ||
      h.verse != address.verse
    )
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
  function removeLastAddress(j) {
    return () => {
    lastAddresses = lastAddresses.filter((h, i) => (i !== j));
    }
  }

  function updateLine() {
    sendCommand({
      line1: line1,
      line2: line2,
      address: selected,
    });
  }
  function toggleLine() {
    shown = !shown;
    const data = {
      show: shown
    };
    if (shown) {
      addToLastAddresses(selected);
      data.line1 = line1;
      data.line2 = line2;
      data.history = lastAddresses;
    }
    sendCommand(data);
  }

  function onMessage(data) {
    console.log('Recieved websocket message', data);
    if (data.hasOwnProperty("show")) {
      shown = data.show;
    }
    if (data.hasOwnProperty("address")) {
      selected = data.address;
    }
    if (data.hasOwnProperty("history")) {
      lastAddresses = data.history;
    }
  }

</script>

<style>
  .control-button {
    width: 6rem;
    /* float: right; */
  }
  .books-filter,
  .address-filter {
    display: block;
    width: 49%;
    margin: 0 1% 0 0;
    padding: 0;
    height: 10rem;
    overflow: scroll;
    float: left;
  }
  .book-item {
    width: 100%;
    margin: 0 0 .25rem 0;
    padding: .25rem .5rem;
    text-align: left;
  }
  .address-item {
    width: 100%;
    margin: 0 0 .25rem 0;
  }
  .address-set {
    width: auto;
    padding: .25rem .5rem;
    margin: 0;
    text-align: left;
  }
  .address-remove {
    margin: 0;
    max-width: 2rem;
    padding: .25rem .5rem;
  }
  .vers,
  .address {
    color: white;
  }
  :global(body) {
    color: white;
  }
</style>

<div class="input-group" style="width: 100%; display: flex;">
  <input class="form-control" type="text" placeholder="filter" bind:value={bookFilter} />
  <button type="button" class="form-control btn btn-secondary" on:click={()=>{bookFilter=''}} style="max-width: 2rem;">×</button>
</div>
<div class="books-filter">
  {#each filteredBooks as book}
  <button class="book-item btn" class:btn-primary={book.abbreviation==selected.book} on:click={selectAddress({book: book.abbreviation})}>{book.name}</button>
  {/each}
</div>
<div class="address-filter">
  {#each filteredLastAddresses as address, i}
  <div class="address-item btn-group">
    <button class="address-set btn" class:btn-primary={equalAddresses(address, selected)} on:click={selectAddress(address)}>{addressAsString(address)}</button>
    <button class="btn address-remove" on:click={removeLastAddress(i)}>×</button>
  </div>
  {/each}
</div>

<div style="display: inline-block; margin: 0 .5rem 0 0;">
  Kapitola: {selected.chapter}
  <Keypad bind:value={selected.chapter} max={Object.keys(aBook.chapters).length} />
</div>
<div style="display: inline-block;">
  Verš: {selected.verse}
  <Keypad bind:value={selected.verse} max={(aBook.chapters[selected.chapter]||[]).length} />
</div>

<button class="control-button btn" on:click={toggleLine} class:btn-danger={shown} class:btn-success={!shown}>
  {#if shown}Skryť{:else}Zobraziť{/if}
</button>
<button class="control-button btn btn-primary" on:click={updateLine}>Zmeniť</button>
<div class="address">{line1}</div>
<span class="vers">{@html line2}</span>

