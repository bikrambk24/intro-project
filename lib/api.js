import { get as getPeople, add as addPeople } from './people.js';
import { get as getLandlords, add as addLandlords } from './landlords.js';
import { get as getBuildings, add as addBuildings } from './buildings.js';
import { get as getRooms, add as addRooms } from './rooms.js';

/**
 * @param { URL } parsedurl 
 * @param { object } res
 * @param { object } req
 * @param { object } receivedobj
 */
async function handleapi(parsedurl, res, req, receivedobj) {
  const pathname = parsedurl.pathname;

  const calls = {
    '/api/people': { 'GET': getPeople, 'PUT': () => addPeople(receivedobj) },
    '/api/landlords': { 'GET': getLandlords, 'PUT': () => addLandlords(receivedobj) },
    '/api/buildings': { 'GET': getBuildings, 'PUT': () => addBuildings(receivedobj) },
    '/api/rooms': { 'GET': getRooms, 'PUT': () => addRooms(receivedobj) }
  };

  if (!(pathname in calls) || !(req.method in calls[pathname])) {
    console.error('404 file not found: ', pathname);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not found');
    return;
  }

  try {
    let data;
    if (req.method === 'GET') {
      data = await calls[pathname][req.method]();
    } else {
      data = await calls[pathname][req.method]();
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error('API handler error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error: ' + err.message);
  }
}

export { handleapi };