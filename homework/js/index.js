const API_URL = 'https://jsonplaceholder.typicode.com/users';

const userListEl = document.getElementById('userList');
const spinner = document.querySelector('.spinner');

function showSpinner() {
  spinner.style.display = 'block';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.classList.add('fade-in');
  card.dataset.id = user.id;

  const nameInput = document.createElement('input');
  nameInput.value = user.name;
  nameInput.disabled = true;

  const emailInput = document.createElement('input');
  emailInput.value = user.email;
  emailInput.disabled = true;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  editBtn.onclick = () => {
    nameInput.disabled = false;
    emailInput.disabled = false;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  };

  saveBtn.onclick = async () => {
    const updatedUser = {
      ...user,
      name: nameInput.value,
      email: emailInput.value,
    };

    showSpinner();
    try {
      await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      nameInput.disabled = true;
      emailInput.disabled = true;
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    hideSpinner();
  };

  deleteBtn.onclick = async () => {
    showSpinner();
    try {
      await fetch(`${API_URL}/${user.id}`, { method: 'DELETE' });
      card.remove();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
    hideSpinner();
  };

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  buttonGroup.append(editBtn, saveBtn, deleteBtn);

  card.append(nameInput, emailInput, buttonGroup);
  return card;
}

async function fetchUsers() {
  showSpinner();
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    users.forEach((user) => {
      const userCard = createUserCard(user);
      userListEl.appendChild(userCard);
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
  hideSpinner();
}

fetchUsers();
