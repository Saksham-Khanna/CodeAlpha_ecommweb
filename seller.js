document.addEventListener('DOMContentLoaded', function() {
    const sellerForm = document.getElementById('seller-form');
    
    if (sellerForm) {
        sellerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const businessName = document.getElementById('business-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const description = document.getElementById('description').value;
            
            // Basic validation
            if (!businessName || !email || !phone || !address || !description) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Phone validation (basic format)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Description length validation
            if (description.length < 50) {
                alert('Business description must be at least 50 characters long');
                return;
            }
            
            // If validation passes, you would typically send this to a server
            // For now, we'll just show a success message
            alert('Application submitted successfully! We will review your application and get back to you soon.');
            
            // Clear form
            sellerForm.reset();
        });
    }
}); 