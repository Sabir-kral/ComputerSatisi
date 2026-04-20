const API_BASE = 'http://localhost:8080/api';

function checkAuth() {
    const authSection = document.getElementById('auth-section');
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');

    if (token && email) {
        authSection.innerHTML = `
            <div class="user-nav" onclick="location.href='profile.html'">
                <span>${email.split('@')[0]}</span>
                <div class="user-icon">${email[0].toUpperCase()}</div>
            </div>
        `;
    } else {
        authSection.innerHTML = `<a href="login.html" class="btn-login">Giriş</a>`;
    }
}

async function getComputers() {
    try {
        const response = await fetch(`${API_BASE}/customers/v2`);
        const data = await response.json();
        const container = document.getElementById('pc-grid');
        container.innerHTML = '';

        data.forEach(pc => {
            container.innerHTML += `
                <div class="card" onclick="goToDetail(${pc.id})">
                    <h3>${pc.name}</h3>
                    <p>${pc.description || 'Yüksək performanslı kompüter'}</p>
                    <div class="price" style="color:var(--success)">${pc.price} AZN</div>
                </div>
            `;
        });
    } catch (e) { console.error("Yüklənmə xətası", e); }
}

function goToDetail(id) {
    if(!localStorage.getItem('accessToken')) {
        alert("Detallara baxmaq üçün giriş edin!");
        location.href = 'login.html';
    } else {
        // Detal funksiyası bura yazıla bilər
    }
}
function handleSearch() {
    const id = document.getElementById('search-id').value;
    if (id) {
        // findComputerById funksiyasını çağırırıq (bayaq yazdığımız)
        findComputerById(id);
    } else {
        // Əgər boşdursa hamısını gətir
        getComputers();
    }
}
checkAuth();
getComputers();

async function findComputerById(id) {
    console.log("Axtarış başladı, ID:", id); // Yoxlama üçün
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("Zəhmət olmasa əvvəlcə giriş edin!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/computers/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            throw new Error("Giriş qadağandır (403). Tokeninizin vaxtı bitmiş ola bilər.");
        }

        if (!response.ok) {
            throw new Error("Kompüter tapılmadı (404).");
        }

        const pc = await response.json();
        renderDetailView(pc); // Detalları göstərən köməkçi funksiya

    } catch (err) {
        console.error("Axtarış xətası:", err.message);
        alert(err.message);
    }
}

// Detal görünüşü üçün köməkçi funksiya
function renderDetailView(pc) {
    const container = document.getElementById('pc-grid');
    container.innerHTML = `
        <div class="card detail-view" style="grid-column: 1/-1; border: 2px solid var(--primary-blue);">
            <button class="btn-blue" onclick="getComputers()">← Geri qayıt</button>
            <div style="margin-top: 20px;">
                <h2>${pc.name}</h2>
                <p>${pc.description || 'Məlumat yoxdur'}</p>
                <div class="price" style="font-size: 1.5rem; color: var(--success);">${pc.price} AZN</div>
                <br>
                <button class="btn-blue" style="background:#49fb35">İndi Al</button>
            </div>
        </div>
    `;
}