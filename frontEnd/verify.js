document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otpInput = document.getElementById('otp-code').value; 
    const email = localStorage.getItem('pendingEmail');

    if (!email) {
        alert("Email tapılmadı. Zəhmət olmasa yenidən qeydiyyatdan keçin.");
        window.location.href = "register.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Backend AddVerifyRequest gözləyir: { "email": "...", "code": "..." }
            body: JSON.stringify({ 
                email: email, 
                code: otpInput 
            })
        });

        // Backend MessageResponse qaytarır
        const data = await response.json();

        if (response.ok && data.isVerified === true) {
            alert("Təsdiqləndi! İndi giriş edə bilərsiniz.");
            localStorage.removeItem('pendingEmail');
            window.location.href = "login.html";
        } else {
            // Backend-dən gələn CustomException mesajını göstəririk
            alert("Xəta: " + (data.message || "Kod yanlışdır və ya vaxtı keçib!"));
        }
    } catch (err) {
        console.error("Verify xətası:", err);
        alert("Serverlə bağlantı kəsildi!");
    }
});

async function resendOTP() {
    const email = localStorage.getItem('pendingEmail');
    
    if (!email) {
        alert("Sessiya bitib, yenidən qeydiyyatdan keçin.");
        window.location.href = "register.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/resendOtp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Backend ResendOtpRequest gözləyir: { "email": "..." }
            body: JSON.stringify({ email: email }) 
        });

        if (response.ok) {
            alert("Yeni 6 rəqəmli təsdiq kodu emailinizə göndərildi!");
        } else {
            const data = await response.json();
            alert("Xəta: " + (data.message || "Kod göndərilə bilmədi!"));
        }
    } catch (err) {
        console.error("Resend xətası:", err);
        alert("Bağlantı xətası! İnterneti yoxlayın.");
    }
}