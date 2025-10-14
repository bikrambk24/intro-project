import db from './db.js';

/**
 * Get all buildings
 * @returns { Promise<Array<object>> }
 */
async function get() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM buildings', (err, rows) => {
      if (err) {
        console.error('DB GET error (buildings):', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Add or update a building
 * @param { object } building
 * @returns { Promise<object> }
 */
async function add(building) {
  return new Promise((resolve, reject) => {
    if (building.id) {
      db.run(
        'UPDATE buildings SET name = ?, landlordId = ?, address = ? WHERE id = ?',
        [building.name, building.landlordId, building.address, building.id],
        function (err) {
          if (err) {
            console.error('DB UPDATE error (buildings):', err.message);
            reject(err);
          } else {
            resolve(building);
          }
        }
      );
    } else {
      db.run(
        'INSERT INTO buildings (name, landlordId, address) VALUES (?, ?, ?)',
        [building.name, building.landlordId, building.address],
        function (err) {
          if (err) {
            console.error('DB INSERT error (buildings):', err.message);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...building });
          }
        }
      );
    }
  });
}

export { get, add };