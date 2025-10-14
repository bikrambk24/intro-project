import { getdata, putdata } from './api.js';
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from './form.js';
import { findancestorbytype } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  const addButton = document.getElementById('addbuilding');
  if (!addButton) {
    console.error('Add Building button not found');
    return;
  }
  addButton.addEventListener('click', addBuildingInput);
  await goBuildings();
});

async function fetchBuildings() {
  try {
    const [buildings, landlords] = await Promise.all([getdata('buildings'), getdata('landlords')]);
    return { buildings, landlords };
  } catch (error) {
    console.error('Error fetching buildings/landlords:', error);
    return { buildings: [], landlords: [] };
  }
}

async function addBuilding(name, landlordId, address) {
  await putdata('buildings', { name, landlordId: Number(landlordId), address });
}

async function updateBuilding(id, name, landlordId, address) {
  await putdata('buildings', { id, name, landlordId: Number(landlordId), address });
}

async function goBuildings() {
  try {
    const { buildings, landlords } = await fetchBuildings();
    cleartablerows('buildingtable');

    for (const building of buildings) {
      const landlord = landlords.find(l => l.id === building.landlordId);
      addBuildingDom(building, landlord ? landlord.name : 'Unknown');
    }

    const landlordSelect = document.getElementById('buildingform-landlordId');
    landlordSelect.innerHTML = '<option value="">Select Landlord</option>';
    if (landlords.length === 0) {
      landlordSelect.innerHTML = '<option value="">No Landlords Available</option>';
    } else {
      landlords.forEach(landlord => {
        const option = document.createElement('option');
        option.value = landlord.id;
        option.textContent = landlord.name;
        landlordSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error populating buildings:', error);
  }
}

function addBuildingInput() {
  clearform('buildingform');
  showform('buildingform', async () => {
    const name = getformfieldvalue('buildingform-name');
    const landlordId = getformfieldvalue('buildingform-landlordId');
    if (!name || !landlordId) {
      alert('Name and Landlord are required');
      return;
    }
    try {
      await addBuilding(name, landlordId, getformfieldvalue('buildingform-address'));
      await goBuildings();
    } catch (error) {
      console.error('Error adding building:', error);
      alert('Failed to add building: ' + error.message);
    }
  });
}

function editBuilding(ev) {
  clearform('buildingform');
  const buildingRow = findancestorbytype(ev.target, 'tr');
  // @ts-ignore
  setformfieldvalue('buildingform-name', buildingRow.building.name);
  // @ts-ignore
  setformfieldvalue('buildingform-landlordId', buildingRow.building.landlordId);
  // @ts-ignore
  setformfieldvalue('buildingform-address', buildingRow.building.address || '');

  showform('buildingform', async () => {
    const name = getformfieldvalue('buildingform-name');
    const landlordId = getformfieldvalue('buildingform-landlordId');
    if (!name || !landlordId) {
      alert('Name and Landlord are required');
      return;
    }
    try {
      // @ts-ignore
      await updateBuilding(buildingRow.building.id, name, landlordId, getformfieldvalue('buildingform-address'));
      await goBuildings();
    } catch (error) {
      console.error('Error updating building:', error);
      alert('Failed to update building: ' + error.message);
    }
  });
}

export function addBuildingDom(building, landlordName) {
  const table = gettablebody('buildingtable');
  const newRow = table.insertRow();
  const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2), newRow.insertCell(3)];
  // @ts-ignore
  newRow.building = building;
  cells[0].innerText = building.name;
  cells[1].innerText = landlordName;
  cells[2].innerText = building.address || '';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn-secondary');
  editButton.addEventListener('click', editBuilding);
  cells[3].appendChild(editButton);
}