async function loginUser() {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                logUsername: document.getElementById('logUsername').value,
                logPassword: document.getElementById('logPassword').value
            })
        });

        // Kiểm tra mã trạng thái
        if (!response.ok) {
            const errorText = await response.text(); // Đọc phản hồi dưới dạng văn bản
            console.error('Error during login:', errorText);
            return;
        }

        // Phản hồi dự kiến là JSON
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Xử lý dữ liệu thành công (ví dụ: chuyển hướng)
        window.location.href = '/';

    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Sự kiện đăng nhập
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
});
