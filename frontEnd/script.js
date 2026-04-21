const API_BASE = "http://localhost:8080/api";
let currentIdx = 0;
let productImages = [];

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    fetchComputers();
});

function checkAuth() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const loginBtn = document.getElementById("loginBtn");
    const userProfile = document.getElementById("userProfile");
    const userInitial = document.getElementById("userInitial");

    if (token && email) {
        if(loginBtn) loginBtn.classList.add("hidden");
        userProfile.classList.remove("hidden");
        userInitial.innerText = email.charAt(0).toUpperCase();
    } else {
        if(loginBtn) loginBtn.classList.remove("hidden");
        userProfile.classList.add("hidden");
    }
}

async function fetchComputers() {
    try {
        const res = await fetch(`${API_BASE}/users/computers`);
        const data = await res.json();
        const container = document.getElementById("computer-container");
        
        container.innerHTML = data.map(pc => `
            <div class="pc-card" onclick="openDetails(${pc.id})">
                <h2 style="color:white; margin:0">${pc.name}</h2>
                <div style="height:2px; width:40px; background:var(--primary-blue); margin:10px 0"></div>
                <p style="color:var(--primary-blue); font-size:1.4rem; font-weight:bold">${pc.price} AZN</p>
            </div>
        `).join('');
    } catch (err) { console.error("Xəta:", err); }
}

async function openDetails(id) {
    const overlay = document.getElementById("detailOverlay");
    const content = document.getElementById("detailContent");
    overlay.classList.add("active");
    content.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE}/users/computers/${id}`);
        const pc = await res.json();
        productImages = pc.imageLinks || [];
        currentIdx = 0;

        setTimeout(() => {
            content.innerHTML = `
                <button class="back-btn" onclick="closeDetails()" style="margin-bottom:20px; background:transparent; border:2px solid #58a6ff; color:#58a6ff; padding:10px 30px; border-radius:50px; cursor:pointer; font-weight:bold;">← GERİ</button>
                <div class="slider-container" style="position:relative; width:90%; max-width:800px; height:400px; overflow:hidden; border-radius:20px;">
                    <div class="slider-wrapper" id="sliderWrapper" style="display:flex; transition:0.6s;">
                        ${productImages.map(img => `<img src="${img}" style="width:100%; flex-shrink:0; object-fit:cover;">`).join('')}
                    </div>
                    ${productImages.length > 1 ? `
                        <button onclick="moveSlider(-1)" style="position:absolute; left:10px; top:50%; background:rgba(0,0,0,0.5); color:white; border:none; padding:15px; cursor:pointer;">❮</button>
                        <button onclick="moveSlider(1)" style="position:absolute; right:10px; top:50%; background:rgba(0,0,0,0.5); color:white; border:none; padding:15px; cursor:pointer;">❯</button>
                    ` : ''}
                </div>
                <h1 style="color:#58a6ff; margin-top:20px;">${pc.name}</h1>
                <p>${pc.description}</p>
                <h2 style="background:rgba(88,166,255,0.1); padding:10px 30px; border-radius:10px;">${pc.price} AZN</h2>
            `;
            createBubbles();
        }, 800);
    } catch (e) { closeDetails(); }
}

function moveSlider(step) {
    const wrapper = document.getElementById("sliderWrapper");
    currentIdx = (currentIdx + step + productImages.length) % productImages.length;
    wrapper.style.transform = `translateX(-${currentIdx * 100}%)`;
}

function closeDetails() { document.getElementById("detailOverlay").classList.remove("active"); }

function createBubbles() {
    const container = document.getElementById("bubbleContainer");
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        const b = document.createElement("div");
        b.className = "bubble";
        b.style.width = b.style.height = Math.random() * 30 + 10 + "px";
        b.style.left = Math.random() * 100 + "%";
        b.style.animationDelay = Math.random() * 3 + "s";
        container.appendChild(b);
    }
}