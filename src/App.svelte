<script>
  import { wins } from './lib/stores/wins.js';
  let newTitle = '';
  let newTag = 'general';

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
</script>

<main>
  <h1>Daily Wins Tracker</h1>

  <input bind:value={newTitle} placeholder="What are your plans?" />
  <select bind:value={newTag}>
    <option value="general">General</option>
    <option value="health">Health</option>
    <option value="study">Study</option>
    <option value="social">Social</option>
  </select>

  <button on:click={addWin}>Add Win</button>

  <hr />

  {#each $wins as win}
    <div class="win-card">
      <strong>{win.title}</strong> ({win.tag})
      <button on:click={() => toggleLike(win.id)}>
        {win.completed ? '💖' : '🤍'}
      </button>
      <button on:click={() => removeWin(win.id)}>🗑</button>
    </div>
  {/each}

</main>

<style>
</style>
