document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            console.log('Form values:', { name, email, phone, password, confirmPassword });
            
            // Basic validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                console.log('Validation failed:', { name, email, phone, password, confirmPassword });
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('Please enter a valid 10-digit phone number', 'error');
                return;
            }
            
            // Password validation
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Confirm password
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            try {
                console.log('Sending registration request...');
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password })
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                // Store user data and token
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                showMessage('Registration successful! Redirecting to home page...', 'success');
                
                // Redirect to home page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } catch (error) {
                console.error('Registration error:', error);
                showMessage(error.message, 'error');
            }
        });
    }
    
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `register-message ${type}`;
        messageDiv.textContent = message;
        
        const existingMessage = document.querySelector('.register-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        registerForm.insertBefore(messageDiv, registerForm.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}); 