<script>
  import { wins } from './lib/stores/wins.js';
  let newTitle = '';
  let newTag = 'general';
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

  <button>Add Win</button>
</main>

<style>
</style>
