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