import db from './db.js';

/**
 * Get all people
 * @returns { Promise<Array<object>> }
 */
async function get() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM people', (err, rows) => {
      if (err) {
        console.error('DB GET error (people):', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Add or update a person
 * @param { object } person
 * @returns { Promise<object> }
 */
async function add(person) {
  return new Promise((resolve, reject) => {
    if (person.id) {
      db.run(
        'UPDATE people SET name = ?, email = ?, notes = ? WHERE id = ?',
        [person.name, person.email, person.notes, person.id],
        function (err) {
          if (err) {
            console.error('DB UPDATE error (people):', err.message);
            reject(err);
          } else {
            resolve(person);
          }
        }
      );
    } else {
      db.run(
        'INSERT INTO people (name, email, notes) VALUES (?, ?, ?)',
        [person.name, person.email, person.notes],
        function (err) {
          if (err) {
            console.error('DB INSERT error (people):', err.message);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...person });
          }
        }
      );
    }
  });
}

export { get, add };