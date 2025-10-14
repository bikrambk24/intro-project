import { getdata, putdata } from './api.js';
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from './form.js';
import { findancestorbytype } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  const addButton = document.getElementById('addroom');
  if (!addButton) {
    console.error('Add Room button not found');
    return;
  }
  addButton.addEventListener('click', addRoomInput);
  await goRooms();
});

async function fetchRooms() {
  try {
    const [rooms, buildings] = await Promise.all([getdata('rooms'), getdata('buildings')]);
    return { rooms, buildings };
  } catch (error) {
    console.error('Error fetching rooms/buildings:', error);
    return { rooms: [], buildings: [] };
  }
}

async function addRoom(name, buildingId, capacity) {
  await putdata('rooms', { name, buildingId: Number(buildingId), capacity: Number(capacity) });
}

async function updateRoom(id, name, buildingId, capacity) {
  await putdata('rooms', { id, name, buildingId: Number(buildingId), capacity: Number(capacity) });
}

async function goRooms() {
  try {
    const { rooms, buildings } = await fetchRooms();
    cleartablerows('roomtable');

    for (const room of rooms) {
      const building = buildings.find(b => b.id === room.buildingId);
      addRoomDom(room, building ? building.name : 'Unknown');
    }

    const buildingSelect = document.getElementById('roomform-buildingId');
    buildingSelect.innerHTML = '<option value="">Select Building</option>';
    if (buildings.length === 0) {
      buildingSelect.innerHTML = '<option value="">No Buildings Available</option>';
    } else {
      buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.id;
        option.textContent = building.name;
        buildingSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error populating rooms:', error);
  }
}

function addRoomInput() {
  clearform('roomform');
  showform('roomform', async () => {
    const name = getformfieldvalue('roomform-name');
    const buildingId = getformfieldvalue('roomform-buildingId');
    const capacity = getformfieldvalue('roomform-capacity');
    if (!name || !buildingId || !capacity) {
      alert('Name, Building, and Capacity are required');
      return;
    }
    try {
      await addRoom(name, buildingId, capacity);
      await goRooms();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room: ' + error.message);
    }
  });
}

function editRoom(ev) {
  clearform('roomform');
  const roomRow = findancestorbytype(ev.target, 'tr');
  // @ts-ignore
  setformfieldvalue('roomform-name', roomRow.room.name);
  // @ts-ignore
  setformfieldvalue('roomform-buildingId', roomRow.room.buildingId);
  // @ts-ignore
  setformfieldvalue('roomform-capacity', roomRow.room.capacity || '');

  showform('roomform', async () => {
    const name = getformfieldvalue('roomform-name');
    const buildingId = getformfieldvalue('roomform-buildingId');
    const capacity = getformfieldvalue('roomform-capacity');
    if (!name || !buildingId || !capacity) {
      alert('Name, Building, and Capacity are required');
      return;
    }
    try {
      // @ts-ignore
      await updateRoom(roomRow.room.id, name, buildingId, capacity);
      await goRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room: ' + error.message);
    }
  });
}

export function addRoomDom(room, buildingName) {
  const table = gettablebody('roomtable');
  const newRow = table.insertRow();
  const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2), newRow.insertCell(3)];
  // @ts-ignore
  newRow.room = room;
  cells[0].innerText = room.name;
  cells[1].innerText = buildingName;
  cells[2].innerText = room.capacity || '';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn-secondary');
  editButton.addEventListener('click', editRoom);
  cells[3].appendChild(editButton);
}