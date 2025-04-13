import { writable } from 'svelte/store';

const stored = localStorage.getItem('theme') || 'light';

export const theme = writable(stored);

theme.subscribe((value) => {
  localStorage.setItem('theme', value);
  document.body.classList.toggle('dark', value === 'dark');
});
