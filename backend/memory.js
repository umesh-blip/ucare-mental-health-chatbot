const fs = require('fs');
const path = require('path');

const MEMORY_FILE = path.join(__dirname, 'conversation_memory.json');
const MAX_ITEMS = 10; // keep last 10 exchanges

function readMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function writeMemory(items) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(items.slice(-MAX_ITEMS), null, 2));
  } catch (e) {
    // ignore
  }
}

function addExchange(userText, botText) {
  const items = readMemory();
  items.push({ user: userText, bot: botText, ts: Date.now() });
  writeMemory(items);
}

function getImportantContext() {
  const items = readMemory();
  // lightweight heuristic: last 3 turns
  return items.slice(-3).map((it) => `User: ${it.user}\nBot: ${it.bot}`).join('\n');
}

module.exports = { addExchange, getImportantContext };


