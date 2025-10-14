import db from './db.js';

/**
 * Get all rooms
 * @returns { Promise<Array<object>> }
 */
async function get() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM rooms', (err, rows) => {
      if (err) {
        console.error('DB GET error (rooms):', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Add or update a room
 * @param { object } room
 * @returns { Promise<object> }
 */
async function add(room) {
  return new Promise((resolve, reject) => {
    if (room.id) {
      db.run(
        'UPDATE rooms SET name = ?, buildingId = ?, capacity = ? WHERE id = ?',
        [room.name, room.buildingId, room.capacity, room.id],
        function (err) {
          if (err) {
            console.error('DB UPDATE error (rooms):', err.message);
            reject(err);
          } else {
            resolve(room);
          }
        }
      );
    } else {
      db.run(
        'INSERT INTO rooms (name, buildingId, capacity) VALUES (?, ?, ?)',
        [room.name, room.buildingId, room.capacity],
        function (err) {
          if (err) {
            console.error('DB INSERT error (rooms):', err.message);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...room });
          }
        }
      );
    }
  });
}

export { get, add };