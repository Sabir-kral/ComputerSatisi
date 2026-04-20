document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otp = document.getElementById('otp-code').value;
    const email = localStorage.getItem('pendingEmail');

    if (!email) {
        alert("Email tapılmadı. Yenidən qeydiyyatdan keçin.");
        window.location.href = "register.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Backend-dəki VerifyRequest klasındakı field adları ilə eyni olmalıdır
            body: JSON.stringify({ email: email, otp: otp }) 
        });

        if (response.ok) {
            alert("Hesabınız uğurla təsdiqləndi!");
            localStorage.removeItem('pendingEmail');
            window.location.href = "login.html";
        } else {
            const errorText = await response.text();
            console.error("Server xətası:", errorText);
            alert("Kod yanlışdır və ya vaxtı bitib!");
        }
    } catch (err) {
        console.error("Bağlantı xətası:", err);
        alert("Serverlə bağlantı kəsildi!");
    }
});

async function resendOTP() {
    const email = localStorage.getItem('pendingEmail');
    if (!email) {
        alert("Sessiya bitib, yenidən qeydiyyatdan keçin.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/resendOTP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Əgər backend obyekt gözləyirsə:
            body: JSON.stringify({ email: email }) 
            // ƏGƏR YUXARIDAKİ İŞLƏMƏSƏ, sadəcə email-i belə göndər:
            // body: email 
        });

        if (response.ok) {
            alert("Yeni təsdiq kodu göndərildi!");
        } else {
            const msg = await response.text();
            alert("Xəta: " + msg);
        }
    } catch (err) {
        console.error("Resend xətası:", err);
        alert("Bağlantı xətası!");
    }
}