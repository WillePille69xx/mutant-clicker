import Database from "better-sqlite3"

const db = new Database("database.db")

db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dna INTEGER DEFAULT 0,
    money_per_click INTEGER DEFAULT 1,
    money_per_second INTEGER DEFAULT 0,
    upgrades INTEGER DEFAULT 0,
    upgrades_data TEXT DEFAULT "",
    clicks INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`)

console.log("Connected to SQLite")
export default db