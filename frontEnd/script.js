const PC_CONTAINER = document.getElementById('pc-grid');

async function getComputers() {
    try {
        // BURANI ÖZ SERVER IP-NƏ GÖRƏ DƏYİŞ!
        const response = await fetch('http://localhost:8080/api/customers/v2', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('403 və ya Server Xətası');

        const data = await response.json();
        PC_CONTAINER.innerHTML = '';

        data.forEach(pc => {
            PC_CONTAINER.innerHTML += `
                <div class="card">
                    <h3>${pc.name}</h3>
                    <p>${pc.description || 'Yüksək Keyfiyyət'}</p>
                    <div class="price">${pc.price} AZN</div>
                </div>
            `;
        });
    } catch (err) {
        PC_CONTAINER.innerHTML = `<p style="color:red">Xəta: ${err.message}</p>`;
    }
}

getComputers();

async function findComputerById(id) {
    const token = localStorage.getItem('accessToken');

    // Əgər token yoxdursa, backend-ə getmədən xəbərdarlıq edirik
    if (!token) {
        alert("Bu funksiya üçün əvvəlcə login olmalısınız!");
        window.location.href = "/login.html"; // Login səhifəsinə yönləndir
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

        if (response.status === 403 || response.status === 401) {
            throw new Error('Zəhmət olmasa login olun!');
        }

        if (!response.ok) throw new Error('Kompüter tapılmadı!');

        const pc = await response.json();
        // Ekranda yalnız həmin kompüteri göstər
        PC_CONTAINER.innerHTML = `
            <div class="card" style="border-color: var(--primary-blue); grid-column: 1/-1;">
                <button onclick="getComputers()">Geri qayıt</button>
                <h3>${pc.name}</h3>
                <p>${pc.description}</p>
                <div class="price">${pc.price} AZN</div>
            </div>
        `;
    } catch (err) {
        alert(err.message);
    }
}