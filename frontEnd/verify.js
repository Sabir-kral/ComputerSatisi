document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otp = document.getElementById('otp-code').value;
    const email = localStorage.getItem('pendingEmail'); // Register-də saxlayacağıq

    try {
        const response = await fetch('http://localhost:8080/api/users/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp })
        });

        if (response.ok) {
            alert("Hesabınız uğurla təsdiqləndi! İndi giriş edə bilərsiniz.");
            localStorage.removeItem('pendingEmail');
            window.location.href = "login.html";
        } else {
            alert("Kod yanlışdır və ya vaxtı bitib!");
        }
    } catch (err) {
        alert("Xəta baş verdi!");
    }
});

async function resendOTP() {
    const email = localStorage.getItem('pendingEmail');
    // Backend-də /resendOTP endpoint-inə sorğu atır
    await fetch('http://localhost:8080/api/users/resendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    });
    alert("Yeni kod göndərildi!");
}