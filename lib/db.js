import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');

  // People table
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      notes TEXT
    )
  `);

  // Landlords table
  db.run(`
    CREATE TABLE IF NOT EXISTS landlords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      notes TEXT
    )
  `);

  // Buildings table
  db.run(`
    CREATE TABLE IF NOT EXISTS buildings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      landlordId INTEGER NOT NULL,
      address TEXT,
      FOREIGN KEY (landlordId) REFERENCES landlords (id) ON DELETE CASCADE
    )
  `);

  // Rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      buildingId INTEGER NOT NULL,
      capacity INTEGER,
      FOREIGN KEY (buildingId) REFERENCES buildings (id) ON DELETE CASCADE
    )
  `);

  // Temporarily disable FK for safe seeding
  db.run('PRAGMA foreign_keys = OFF;');

  // Seed landlords (no dependencies)
  db.run('INSERT OR IGNORE INTO landlords (id, name, email, notes) VALUES (1, "John Doe", "john@example.com", "Owns multiple properties")');
  db.run('INSERT OR IGNORE INTO landlords (id, name, email, notes) VALUES (2, "Jane Smith", "jane@example.com", "")');

  // Seed buildings (depends on landlords)
  db.run('INSERT OR IGNORE INTO buildings (id, name, landlordId, address) VALUES (1, "Sunset Towers", 1, "123 Main St")');
  db.run('INSERT OR IGNORE INTO buildings (id, name, landlordId, address) VALUES (2, "River Apartments", 2, "456 River Rd")');

  // Seed rooms (depends on buildings)
  db.run('INSERT OR IGNORE INTO rooms (id, name, buildingId, capacity) VALUES (1, "Room 101", 1, 4)');
  db.run('INSERT OR IGNORE INTO rooms (id, name, buildingId, capacity) VALUES (2, "Apartment 3B", 2, 2)');

  // Seed people (for consistency)
  db.run('INSERT OR IGNORE INTO people (id, name, email, notes) VALUES (1, "Kermit Frog", "", "")');
  db.run('INSERT OR IGNORE INTO people (id, name, email, notes) VALUES (2, "Miss Piggy", "", "")');

  // Re-enable FK
  db.run('PRAGMA foreign_keys = ON;');
});

export default db;