import db from './db.js';

/**
 * Get all landlords
 * @returns { Promise<Array<object>> }
 */
async function get() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM landlords', (err, rows) => {
      if (err) {
        console.error('DB GET error (landlords):', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Add or update a landlord
 * @param { object } landlord
 * @returns { Promise<object> }
 */
async function add(landlord) {
  return new Promise((resolve, reject) => {
    if (landlord.id) {
      db.run(
        'UPDATE landlords SET name = ?, email = ?, notes = ? WHERE id = ?',
        [landlord.name, landlord.email, landlord.notes, landlord.id],
        function (err) {
          if (err) {
            console.error('DB UPDATE error (landlords):', err.message);
            reject(err);
          } else {
            resolve(landlord);
          }
        }
      );
    } else {
      db.run(
        'INSERT INTO landlords (name, email, notes) VALUES (?, ?, ?)',
        [landlord.name, landlord.email, landlord.notes],
        function (err) {
          if (err) {
            console.error('DB INSERT error (landlords):', err.message);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...landlord });
          }
        }
      );
    }
  });
}

export { get, add };