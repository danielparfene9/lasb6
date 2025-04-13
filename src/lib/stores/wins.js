import { writable } from 'svelte/store';

const stored = localStorage.getItem('wins');
const initialWins = stored ? JSON.parse(stored) : [];

export const wins = writable(initialWins);

wins.subscribe((value) => {
  localStorage.setItem('wins', JSON.stringify(value));
});