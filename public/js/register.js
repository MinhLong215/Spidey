// public/js/register.js
async function registerUser() {
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if (password !== passwordConfirm) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password })
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('token', result.token); // Lưu JWT vào localStorage
        window.location.href = '/'; // Chuyển hướng đến trang chủ
    } else {
        alert(result.message); // Hiển thị thông báo lỗi nếu có
    }
}

// Gán sự kiện cho nút đăng ký
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', event => {
            event.preventDefault();
            registerUser();
        });
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = "/";
        } else {
            document.querySelector('.errorMessage').textContent = data.message;
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});

