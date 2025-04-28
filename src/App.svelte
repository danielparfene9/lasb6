<script>
  import { wins } from './lib/stores/wins.js';
  import { theme } from './lib/stores/theme.js';
  let newTitle = '';
  let newTag = 'general';
  let filterTag = 'all';

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
</script>

<main>
  <h1>Daily Wins Tracker</h1>

  <select bind:value={filterTag}>
    <option value="all">All</option>
    <option value="today">Today's Wins</option>
    <option value="general">General</option>
    <option value="health">Health</option>
    <option value="study">Study</option>
    <option value="social">Social</option>
  </select>

  <input bind:value={newTitle} placeholder="What are your plans?" />
  <select bind:value={newTag}>
    <option value="general">General</option>
    <option value="health">Health</option>
    <option value="study">Study</option>
    <option value="social">Social</option>
  </select>

  <button on:click={addWin}>Add Win</button>

  <hr />

  {#each filteredWins as win}
    <div class="win-card">
      <strong>{win.title}</strong> ({win.tag})
      <button on:click={() => toggleLike(win.id)}>
        {win.completed ? '💖' : '🤍'}
      </button>
      <button on:click={() => removeWin(win.id)}>🗑</button>
    </div>
  {/each}


  <button on:click={toggleTheme}>
    Switch to {$theme === 'light' ? 'Dark' : 'Light'} Mode
  </button>

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
