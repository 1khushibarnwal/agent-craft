// Simple in-memory conversation history, keyed by userId.
// NOTE: this resets on every server restart and grows unbounded —
// fine for a demo, but swap for a real DB (or at least an LRU/TTL
// cache) before this goes anywhere near production.
const memory = {};

export function getHistory(userId) {
  if (!memory[userId]) memory[userId] = [];
  return memory[userId];
}

export function addMessage(userId, role, content) {
  getHistory(userId).push({ role, content });
}
