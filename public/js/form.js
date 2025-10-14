export function showform(formid, submitCallback) {
  const formcontainer = document.getElementById(formid);
  if (!formcontainer) {
    console.error(`Form container with ID ${formid} not found`);
    return;
  }
  formcontainer.style.display = 'flex';

  const form = formcontainer.querySelector('form');
  if (!form) {
    console.error(`Form element not found in ${formid}`);
    return;
  }

  const newForm = form.cloneNode(true);
  // @ts-ignore
  form.parentNode.replaceChild(newForm, form);

  // @ts-ignore
  const closeButton = newForm.querySelector('.close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      formcontainer.style.display = 'none';
    });
  } else {
    console.error('Close button not found in form');
  }

  // @ts-ignore
  newForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    try {
      await submitCallback();
      formcontainer.style.display = 'none';
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error saving data: ' + error.message);
    }
  });
}

export function getformfieldvalue(fieldid) {
  const field = document.getElementById(fieldid);
  if (!field) {
    console.error(`Field with ID ${fieldid} not found`);
    return '';
  }
  // @ts-ignore
  return field.value || '';
}

export function setformfieldvalue(fieldid, value) {
  const field = document.getElementById(fieldid);
  if (field) {
    // @ts-ignore
    field.value = value || '';
  } else {
    console.error(`Field with ID ${fieldid} not found`);
  }
}

export function clearform(formid) {
  const formcontainer = document.getElementById(formid);
  if (!formcontainer) {
    console.error(`Form container with ID ${formid} not found`);
    return;
  }
  const inputs = formcontainer.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // @ts-ignore
    if (input.type !== 'submit' && input.type !== 'button') {
      // @ts-ignore
      input.value = '';
    }
  });
}

export function gettablebody(tableid) {
  const table = document.getElementById(tableid);
  if (!table) {
    console.error(`Table with ID ${tableid} not found`);
    return null;
  }
  return table.querySelector('tbody');
}

export function cleartablerows(tableid) {
  const tbody = gettablebody(tableid);
  if (tbody) {
    tbody.innerHTML = '';
  } else {
    console.error(`Table body for ${tableid} not found`);
  }
}