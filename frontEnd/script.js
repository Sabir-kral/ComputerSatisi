const PC_CONTAINER = document.getElementById('pc-grid');
const API_BASE = 'http://localhost:8080/api'; // Əgər işləməsə buranı Server IP-si ilə dəyiş

async function getComputers() {
    try {
        const response = await fetch(`${API_BASE}/customers/v2`);

        if (!response.ok) throw new Error('Məlumatları gətirmək mümkün olmadı');

        const data = await response.json();
        PC_CONTAINER.innerHTML = '';

        data.forEach(pc => {
            // Hər karta onclick="findComputerById(${pc.id})" əlavə edirik
            PC_CONTAINER.innerHTML += `
                <div class="card" onclick="findComputerById(${pc.id})">
                    <div class="card-badge">ID: ${pc.id}</div>
                    <h3>${pc.name}</h3>
                    <p>${pc.description || 'Texniki göstəricilər üçün klikləyin'}</p>
                    <div class="price">${pc.price} AZN</div>
                </div>
            `;
        });
    } catch (err) {
        console.error(err);
        PC_CONTAINER.innerHTML = `<p style="color:red; text-align:center;">Xəta: ${err.message}</p>`;
    }
}

async function findComputerById(id) {
    console.log("Axtarılan ID:", id); // Console-da yoxlamaq üçün
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("Bu kompüterin detallarına baxmaq üçün əvvəlcə login olmalısınız!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/computers/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403 || response.status === 401) {
            throw new Error('Sizin bu məlumata giriş icazəniz yoxdur (403 Forbidden)');
        }

        if (!response.ok) throw new Error('Kompüter tapılmadı!');

        const pc = await response.json();
        
        // Detallı görünüş
        PC_CONTAINER.innerHTML = `
            <div class="card detail-view" style="grid-column: 1/-1;">
                <button class="btn-back" onclick="getComputers()">← Geri qayıt</button>
                <div class="detail-content">
                    <h2>${pc.name}</h2>
                    <hr>
                    <p><strong>Təsvir:</strong> ${pc.description}</p>
                    <div class="price">Qiymət: ${pc.price} AZN</div>
                    <button class="btn-buy" onclick="buyPC(${pc.id})">İndi Al</button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Xəta baş verdi:", err);
        alert(err.message);
    }
}

// Səhifə yüklənəndə kompüterləri gətir
getComputers();