document.addEventListener("DOMContentLoaded", () => {
    const pcList = document.getElementById("pc-list");

    // Serverdən məlumatları gətirən funksiya
    async function fetchComputers() {
        try {
            // Endpoint-i öz backend-inə uyğun olaraq dəyiş (məsələn: /api/computers)
            const response = await fetch('http://localhost:8080/api/customers/v2');
            
            if (!response.ok) {
                throw new Error("Məlumat alına bilmədi");
            }

            const data = await response.json();
            renderComputers(data);
        } catch (error) {
            pcList.innerHTML = `<p style="color: red;">Xəta baş verdi: ${error.message}</p>`;
        }
    }

    // Məlumatları ekrana çıxaran funksiya
    function renderComputers(computers) {
        pcList.innerHTML = ""; // Yüklənir yazısını silirik

        if (computers.length === 0) {
            pcList.innerHTML = "<p>Hazırda anbarda kompüter yoxdur.</p>";
            return;
        }

        computers.forEach(pc => {
            const card = document.createElement("div");
            card.className = "pc-card";
            
            card.innerHTML = `
                <i class="fas fa-laptop-code"></i>
                <h3>${pc.name}</h3>
                <p>${pc.description || 'Yüksək performanslı cihaz'}</p>
                <div class="price">${pc.price} AZN</div>
                <button class="buy-btn">Sifariş et</button>
            `;
            
            pcList.appendChild(card);
        });
    }

    fetchComputers();
});