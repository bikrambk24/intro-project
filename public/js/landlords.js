import { getdata, putdata } from './api.js';
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from './form.js';
import { findancestorbytype } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('addlandlord').addEventListener('click', addLandlordInput);
  await goLandlords();
});

async function fetchLandlords() {
  return await getdata('landlords');
}

async function addLandlord(name, email, notes) {
  await putdata('landlords', { name, email, notes });
}

async function updateLandlord(id, name, email, notes) {
  await putdata('landlords', { id, name, email, notes });
}

async function goLandlords() {
  const landlords = await fetchLandlords();
  cleartablerows('landlordtable');
  for (const landlord of landlords) {
    addLandlordDom(landlord);
  }
}

function addLandlordInput() {
  clearform('landlordform');
  showform('landlordform', async () => {
    const name = getformfieldvalue('landlordform-name');
    if (!name) {
      alert('Name is required');
      return;
    }
    await addLandlord(name, getformfieldvalue('landlordform-email'), getformfieldvalue('landlordform-notes'));
    await goLandlords();
  });
}

function editLandlord(ev) {
  clearform('landlordform');
  const landlordRow = findancestorbytype(ev.target, 'tr');
  // @ts-ignore - Custom property for data attachment
  setformfieldvalue('landlordform-name', landlordRow.landlord.name);
  // @ts-ignore
  setformfieldvalue('landlordform-email', landlordRow.landlord.email || '');
  // @ts-ignore
  setformfieldvalue('landlordform-notes', landlordRow.landlord.notes || '');

  showform('landlordform', async () => {
    const name = getformfieldvalue('landlordform-name');
    if (!name) {
      alert('Name is required');
      return;
    }
    // @ts-ignore
    await updateLandlord(landlordRow.landlord.id, name, getformfieldvalue('landlordform-email'), getformfieldvalue('landlordform-notes'));
    await goLandlords();
  });
}

export function addLandlordDom(landlord) {
  const table = gettablebody('landlordtable');
  const newRow = table.insertRow();
  const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2), newRow.insertCell(3)];
  // @ts-ignore
  newRow.landlord = landlord;
  cells[0].innerText = landlord.name;
  cells[1].innerText = landlord.email;
  cells[2].innerText = landlord.notes;

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn-secondary');
  editButton.addEventListener('click', editLandlord);
  cells[3].appendChild(editButton);
}