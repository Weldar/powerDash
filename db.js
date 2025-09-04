import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Helper that opens the DB and returns a promise‑based interface
export async function getDb() {
  const db = new sqlite3.Database('./power.db');

  // Promisify methods used
  const run   = promisify(db.run.bind(db));
  const all   = promisify(db.all.bind(db));
  const get   = promisify(db.get.bind(db));

  // Initialise tables (run returns a promise now)
  await run(`
    CREATE TABLE IF NOT EXISTS overall_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      total_watts REAL NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS device_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      watts REAL NOT NULL
    );
  `);

  // Return promises that mimics the API used on frontend
  return {
    run,
    all,
    get,
    close: () => new Promise(resolve => db.close(resolve))
  };
}
