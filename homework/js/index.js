// js/index.js
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('user-list');
const spinner = document.getElementById('spinner');

function showSpinner() {
  spinner.style.display = 'block';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function createUserElement(user) {
  const container = document.createElement('div');
  container.className = 'user';

  const nameInput = document.createElement('input');
  nameInput.value = user.name;

  const emailInput = document.createElement('input');
  emailInput.value = user.email;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.onclick = async () => {
    showSpinner();
    await fetch(`${API_URL}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, name: nameInput.value, email: emailInput.value })
    });
    hideSpinner();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = async () => {
    showSpinner();
    await fetch(`${API_URL}/${user.id}`, { method: 'DELETE' });
    container.remove();
    hideSpinner();
  };

  container.append(nameInput, emailInput, saveBtn, deleteBtn);
  return container;
}

async function loadUsers() {
  showSpinner();
  const res = await fetch(API_URL);
  const users = await res.json();
  users.forEach(user => userList.appendChild(createUserElement(user)));
  hideSpinner();
}

loadUsers();

function showSpinner() {
  spinner.style.display = 'block';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

async function loadUsers() {
  showSpinner();
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    users.forEach(user => {
      const userElement = createUserElement(user);
      userList.appendChild(userElement);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    hideSpinner();
  }
}

function createUserElement(user) {
  const container = document.createElement('div');
  container.className = 'user';

  const nameInput = document.createElement('input');
  nameInput.value = user.name;

  const emailInput = document.createElement('input');
  emailInput.value = user.email;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.onclick = async () => {
    showSpinner();
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          name: nameInput.value,
          email: emailInput.value
        })
      });
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      hideSpinner();
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = async () => {
    showSpinner();
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
        method: 'DELETE'
      });
      container.remove();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      hideSpinner();
    }
  };

  container.appendChild(nameInput);
  container.appendChild(emailInput);
  container.appendChild(saveBtn);
  container.appendChild(deleteBtn);

  return container;
}

document.addEventListener('DOMContentLoaded', loadUsers);
