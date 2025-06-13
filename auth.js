class AuthForm {
    constructor() {
        this.form = document.querySelector('.auth-form');
        this.togglePasswordButtons = document.querySelectorAll('.toggle-password');
        this.submitButton = document.querySelector('.auth-button');
        
        if (!this.form) {
            console.error('Auth form not found!');
            return;
        }
        
        console.log('Auth form initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle password visibility
        this.togglePasswordButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                button.querySelector('i').classList.toggle('fa-eye');
                button.querySelector('i').classList.toggle('fa-eye-slash');
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            console.log('Form submitted');
            this.handleSubmit(e);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log('Handling form submission');

        // Validate passwords match
        const password = this.form.querySelector('#password').value;
        const confirmPassword = this.form.querySelector('#confirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        // Validate terms checkbox
        const terms = this.form.querySelector('#terms').checked;
        if (!terms) {
            this.showMessage('Please agree to the Terms & Conditions', 'error');
            return;
        }

        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const formData = new FormData(this.form);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone')
        };

        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                throw new Error('Email already registered');
            }
            
            // Add new user
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Show success message
            this.showMessage('Registration successful! Redirecting...', 'success');

            // Redirect to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage(error.message, 'error');
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Create Account';
        }
    }

    showMessage(message, type) {
        console.log(`Showing ${type} message:`, message);
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        const existingMessage = this.form.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing auth form');
    new AuthForm();
}); 