import { getdata, putdata } from './api.js';
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from './form.js';
import { findancestorbytype } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('addperson').addEventListener('click', addPersonInput);
  await goPeople();
});

async function fetchPeople() {
  return await getdata('people');
}

async function addPerson(name, email, notes) {
  await putdata('people', { name, email, notes });
}

async function updatePerson(id, name, email, notes) {
  await putdata('people', { id, name, email, notes });
}

async function goPeople() {
  try {
    const people = await fetchPeople();
    cleartablerows('peopletable');

    for (const person of people) {
      addPersonDom(person);
    }
  } catch (error) {
    console.error('Error fetching people:', error);
  }
}

function addPersonInput() {
  clearform('personform');
  showform('personform', async () => {
    const name = getformfieldvalue('personform-name');
    if (!name) {
      alert('Name is required');
      return;
    }
    await addPerson(name, getformfieldvalue('personform-email'), getformfieldvalue('personform-notes'));
    await goPeople();
  });
}

function editPerson(ev) {
  clearform('personform');
  const personRow = findancestorbytype(ev.target, 'tr');
  // @ts-ignore
  setformfieldvalue('personform-name', personRow.person.name);
  // @ts-ignore
  setformfieldvalue('personform-email', personRow.person.email || '');
  // @ts-ignore
  setformfieldvalue('personform-notes', personRow.person.notes || '');

  showform('personform', async () => {
    const name = getformfieldvalue('personform-name');
    if (!name) {
      alert('Name is required');
      return;
    }
    // @ts-ignore
    await updatePerson(personRow.person.id, name, getformfieldvalue('personform-email'), getformfieldvalue('personform-notes'));
    await goPeople();
  });
}

export function addPersonDom(person) {
  const table = gettablebody('peopletable');
  const newRow = table.insertRow();
  const cells = [
    newRow.insertCell(0), // Name
    newRow.insertCell(1), // Schedule Day 1
    newRow.insertCell(2), // Day 2
    newRow.insertCell(3), // Day 3
    newRow.insertCell(4), // Day 4
    newRow.insertCell(5), // Day 5
    newRow.insertCell(6), // Day 6
    newRow.insertCell(7), // Day 7
    newRow.insertCell(8)  // Action
  ];
  // @ts-ignore
  newRow.person = person;
  cells[0].innerText = person.name;
  // Placeholder
  for (let i = 1; i <= 7; i++) {
    cells[i].innerText = 'N/A';
  }

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn-secondary');
  editButton.addEventListener('click', editPerson);
  cells[8].appendChild(editButton);
}