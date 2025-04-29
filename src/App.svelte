<script>
  import { wins } from './lib/stores/wins.js';
  import { theme } from './lib/stores/theme.js';
  import { onMount, tick } from 'svelte';
  let newTitle = '';
  let newTag = 'general';
  let filterTag = 'all';
  let editingInput = null;

  onMount(() => {
    wins.update(list => list.map(w => ({ ...w, editing: false })));
  });
  
  const quotes = [
    "Small steps every day lead to big results!",
    "Celebrate your wins, no matter how small!",
    "Progress, not perfection.",
    "Believe you can and you're halfway there.",
    "One day or day one. You decide."
  ];

  let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  function addWin() {
    if (!newTitle.trim()) return;
    wins.update((list) => [
      ...list,
      {
        id: Date.now(),
        title: newTitle,
        tag: newTag,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    newTitle = '';
  }

  function removeWin(id) {
    wins.update((list) => list.filter((w) => w.id !== id));
  }

  function toggleLike(id) {
    wins.update((list) =>
      list.map((w) => w.id === id ? { ...w, completed: !w.completed } : w)
    );
  }

  function toggleTheme() {
    theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  $: filteredWins = $wins.filter(win => {
    if (filterTag === 'all') return true;
    if (filterTag === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return win.date === today;
    }
    return win.tag === filterTag;
  });

  function startEdit(id) {
    wins.update(list => list.map(w => w.id === id ? { ...w, editing: true } : w));
    
    tick().then(() => {
      if (editingInput) {
        editingInput.focus();
        editingInput.select();
      }
    });
  }

  function saveEdit(id) {
    wins.update(list => list.map(w => w.id === id ? { ...w, editing: false } : w));
  }

</script>

<main id="app">
  <div class="tracker-card">
    <div class="top-bar">
      <button on:click={toggleTheme}>
        Switch to {$theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>

    <h1>Daily Wins Tracker</h1>
    {#if filteredWins.length > 0}
      <p><em>{randomQuote}</em></p>
    {/if}

    <div class="controls">
      <div class="filter-buttons">
        {#each ['all', 'today', 'general', 'health', 'study', 'social'] as tag}
          <button
            on:click={() => filterTag = tag}
            class:active={filterTag === tag}
          >
            {tag === 'all' ? 'All' : tag === 'today' ? "Today's Wins" : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        {/each}
      </div>

      <input bind:value={newTitle} placeholder="What are your plans?" />
      <select bind:value={newTag}>
        <option value="general">General</option>
        <option value="health">Health</option>
        <option value="study">Study</option>
        <option value="social">Social</option>
      </select>

      <button on:click={addWin}>Add Win</button>
    </div>

    <hr />

    <div class="wins-list">
      {#each filteredWins as win}
        <div class="win-card">

          {#if win.editing}
            <input
              bind:this={editingInput}
              bind:value={win.title}
              on:blur={(e) => saveEdit(win.id)}
              on:keydown={(e) => e.key === 'Enter' && saveEdit(win.id)}/>
          {:else}
            <strong on:dblclick={() => startEdit(win.id)}>{win.title}</strong>
          {/if}
        
          <!-- <strong>{win.title}</strong> ({win.tag}) -->
          <div class="buttons">
            <button on:click={() => startEdit(win.id)}>✏️</button>
            <button on:click={() => toggleLike(win.id)}>
              {win.completed ? '💖' : '🤍'}
            </button>
            <button on:click={() => removeWin(win.id)}>🗑</button>
          </div>
        </div>
      {/each}
      {#if filteredWins.length === 0}
        <div class="empty-placeholder">
          <em>{randomQuote}</em>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    background-color: white;
    color: black;
    transition: all 0.3s ease;
  }

  :global(body.dark) {
    background-color: #111;
    color: white;
  }

  .win-card {
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #aaa;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.05);
  }

  :global(body.dark) .win-card {
    border-color: #555;
    background-color: rgba(255, 255, 255, 0.1);
  }

  input, select {
    padding: 5px;
    margin-right: 5px;
  }
</style>
