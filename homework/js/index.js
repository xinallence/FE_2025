document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('userList');
    const pageSpinner = document.getElementById('pageSpinner');
    let users = [];
    
    // Показываем спиннер при загрузке страницы
    showSpinner();
    
    // Загружаем пользователей
    fetchUsers();
    
    function showSpinner() {
        pageSpinner.style.display = 'flex';
    }
    
    function hideSpinner() {
        pageSpinner.style.display = 'none';
    }
    
    function fetchUsers() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                users = data;
                renderUserList();
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            })
            .finally(() => {
                hideSpinner();
            });
    }
    
    function renderUserList() {
        userList.innerHTML = '';
        
        if (users.length === 0) {
            checkForEasterEgg();
            return;
        }
        
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item';
            li.innerHTML = `
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.phone}</p>
                </div>
                <div class="user-actions">
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </div>
            `;
            userList.appendChild(li);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    function handleEdit(e) {
        const userId = parseInt(e.target.dataset.id);
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const userItem = e.target.closest('.user-item');
        userItem.innerHTML = `
            <div class="edit-form">
                <input type="text" id="edit-name-${user.id}" value="${user.name}" placeholder="Name">
                <input type="email" id="edit-email-${user.id}" value="${user.email}" placeholder="Email">
                <input type="tel" id="edit-phone-${user.id}" value="${user.phone}" placeholder="Phone">
                <div class="form-actions">
                    <button class="save-btn" data-id="${user.id}">Save</button>
                    <button class="cancel-btn" data-id="${user.id}">Cancel</button>
                </div>
            </div>
        `;
        
        userItem.querySelector('.save-btn').addEventListener('click', handleSave);
        userItem.querySelector('.cancel-btn').addEventListener('click', () => {
            renderUserList();
        });
    }
    
    function handleSave(e) {
        const userId = parseInt(e.target.dataset.id);
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const updatedUser = {
            ...user,
            name: document.getElementById(`edit-name-${userId}`).value,
            email: document.getElementById(`edit-email-${userId}`).value,
            phone: document.getElementById(`edit-phone-${userId}`).value
        };
        
        showSpinner();
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(data => {
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index] = data;
            }
            renderUserList();
        })
        .catch(error => {
            console.error('Error updating user:', error);
        })
        .finally(() => {
            hideSpinner();
        });
    }
    
    function handleDelete(e) {
        const userId = parseInt(e.target.dataset.id);
        
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
        
        showSpinner();
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE'
        })
        .then(() => {
            users = users.filter(user => user.id !== userId);
            renderUserList();
            checkForEasterEgg();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        })
        .finally(() => {
            hideSpinner();
        });
    }
    
    function checkForEasterEgg() {
    const easterEgg = document.getElementById('easterEgg');
    if (users.length === 0) {
        easterEgg.removeAttribute('hidden');
    } else {
        easterEgg.setAttribute('hidden', 'true');
    }
}
    
    window.resetUsers = function() {
    showSpinner();
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            renderUserList();
            document.getElementById('easterEgg').setAttribute('hidden', 'true');
        })
        .catch(error => {
            console.error('Error resetting users:', error);
        })
        .finally(() => {
            hideSpinner();
        });
};
});