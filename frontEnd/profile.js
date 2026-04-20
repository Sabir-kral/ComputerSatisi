const token = localStorage.getItem('accessToken');
if(!token) location.href = 'login.html';

async function loadProfile() {
    const response = await fetch('http://localhost:8080/api/customers/profile', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const user = await response.json();
    document.getElementById('view-name').innerText = user.name;
    document.getElementById('view-surname').innerText = user.surname;
    document.getElementById('view-email').innerText = user.email;
}

function showUpdate() {
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('update-form').style.display = 'block';
}

async function processUpdate() {
    const token = localStorage.getItem('accessToken');
    const data = {
        name: document.getElementById('up-name').value,
        surname: document.getElementById('up-surname').value,
        password: document.getElementById('up-pass').value // Əgər backend parol tələb edirsə
    };

    try {
        const response = await fetch('http://localhost:8080/api/customers/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Məlumatlar uğurla yeniləndi!");
            location.reload();
        } else if (response.status === 403) {
            alert("Yeniləmə uğursuz oldu: Giriş icazəniz yoxdur (403).");
        } else {
            alert("Xəta baş verdi.");
        }
    } catch (err) {
        console.error("Update xətası:", err);
    }
}
async function deleteAccount() {
    if(confirm("Hesabınız həmişəlik silinsin?")) {
        await fetch('http://localhost:8080/api/customers/delete', {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        });
        logout();
    }
}

function logout() {
    localStorage.clear();
    location.href = 'index.html';
}

loadProfile();