const API_URL = 'https://jsonplaceholder.typicode.com/users';

const userListEl = document.getElementById('userList');
const spinner = document.querySelector('.spinner-wrapper');

function showSpinner() {
  spinner.style.display = 'block';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.dataset.id = user.id;

  const nameInput = document.createElement('input');
  nameInput.value = user.name;
  nameInput.disabled = true;
  nameInput.type = 'text';
  nameInput.setAttribute('aria-label', 'Ім\'я користувача');

  const emailInput = document.createElement('input');
  emailInput.value = user.email;
  emailInput.disabled = true;
  emailInput.type = 'email';
  emailInput.setAttribute('aria-label', 'Email користувача');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.type = 'button';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none';
  saveBtn.type = 'button';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.type = 'button';

  editBtn.addEventListener('click', () => {
    nameInput.disabled = false;
    emailInput.disabled = false;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  });

  saveBtn.addEventListener('click', async () => {
    const updatedUser = {
      ...user,
      name: nameInput.value,
      email: emailInput.value,
    };

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      nameInput.disabled = true;
      emailInput.disabled = true;
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
    } catch (error) {
      alert('Помилка оновлення користувача');
    } finally {
      hideSpinner();
    }
  });

  deleteBtn.addEventListener('click', async () => {
    const confirmDelete = confirm('Ви впевнені, що хочете видалити користувача?');
    if (!confirmDelete) return;

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      card.remove();
    } catch (error) {
      alert('Помилка видалення користувача');
    } finally {
      hideSpinner();
    }
  });

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  buttonGroup.append(editBtn, saveBtn, deleteBtn);

  card.append(nameInput, emailInput, buttonGroup);

  return card;
}

async function fetchUsers() {
  showSpinner();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const users = await response.json();
    users.forEach((user) => {
      const userCard = createUserCard(user);
      userListEl.appendChild(userCard);
    });
  } catch (error) {
    alert('Помилка завантаження користувачів');
  } finally {
    hideSpinner();
  }
}

fetchUsers();
