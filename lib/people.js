import sqlite3 from "sqlite3";
const db = new sqlite3.Database("people.db");

// Initialize database
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, name TEXT, email TEXT, notes TEXT)");
});

async function get(parsedurl) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM people", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function add(parsedurl, method, person) {
  if (person.id) {
    // Update existing person
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE people SET name = ?, email = ?, notes = ? WHERE id = ?",
        [person.name, person.email, person.notes, person.id],
        (err) => (err ? reject(err) : resolve())
      );
    });
    return person;
  } else {
    // Add new person
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO people (name, email, notes) VALUES (?, ?, ?)",
        [person.name, person.email, person.notes],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name: person.name, email: person.email, notes: person.notes });
        }
      );
    });
  }
}

export { get, add };