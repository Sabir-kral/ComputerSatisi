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

const PC_CONTAINER = document.getElementById('pc-grid');

// 1. Kartları ekrana çıxaran funksiya
async function getComputers() {
    try {
        const response = await fetch(`${API_BASE}/customers/v2`);
        if (!response.ok) throw new Error("Məlumat gəlmədi");
        
        const data = await response.json();
        const container = document.getElementById('pc-grid');
        container.innerHTML = ''; 

        data.forEach(pc => {
            // Əgər pc obyekti gəlirsə amma içində xəta varsa belə, kartı yaratmağa çalış
            try {
                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = () => findComputerById(pc.id);
                
                card.innerHTML = `
                    <div class="card-badge">ID: ${pc.id}</div>
                    <h3>${pc.name || 'Adsız Kompüter'}</h3>
                    <p>${pc.description || 'Təsvir yoxdur'}</p>
                    <div class="price">${pc.price} AZN</div>
                    <small style="color:var(--text-dim)">Satıcı: ${pc.user ? pc.user.name : 'Sistem'}</small>
                `;
                container.appendChild(card);
            } catch (innerErr) {
                console.error("Tək bir kart yaradılarkən xəta:", innerErr);
            }
        });
    } catch (err) {
        console.error("Ümumi yükləmə xətası:", err);
    }
}

// 2. ID ilə axtarış funksiyası
async function findComputerById(id) {
    console.log("Klikləndi! Axtarılan ID:", id); // Bunu görməlisən!
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("Bu kompüterin detallarına baxmaq üçün əvvəlcə giriş edin!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/computers/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Kompüter tapılmadı və ya icazə yoxdur.');

        const pc = await response.json();
        
        // Detallı görünüşü göstər
        PC_CONTAINER.innerHTML = `
            <div class="card detail-view" style="grid-column: 1/-1;">
                <button class="btn-blue" onclick="getComputers()">← Geri qayıt</button>
                <div style="margin-top:20px">
                    <h2>${pc.name}</h2>
                    <p>${pc.description}</p>
                    <div class="price">${pc.price} AZN</div>
                    <button class="btn-blue" style="margin-top:15px; background:var(--success)">İndi Al</button>
                </div>
            </div>
        `;
    } catch (err) {
        alert(err.message);
    }
}

// 3. Axtarış düyməsi üçün funksiya
function handleSearch() {
    const idValue = document.getElementById('search-id').value;
    if (idValue) {
        findComputerById(idValue);
    } else {
        getComputers();
    }
}

// Səhifə açılanda işlət
getComputers();
checkAuth(); // Navbar yoxlanışı


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