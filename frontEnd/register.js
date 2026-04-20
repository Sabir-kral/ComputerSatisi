document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        // Backend-dəki qeydiyyat endpoint-inə uyğunlaşdır (məs: /api/users və ya /api/auth/register)
        const response = await fetch('http://localhost:8080/api/customers', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            alert("Qeydiyyat uğurludur! İndi gmaile kod gelecek o kodu yazaraq giris edə bilərsiniz.");
            window.location.href = "verify.html";
        } else {
            const errorData = await response.json();
            alert("Xəta: " + (errorData.message || "Bu email artıq istifadə olunub!"));
        }
    } catch (err) {
        alert("Server xətası baş verdi!");
    }
});