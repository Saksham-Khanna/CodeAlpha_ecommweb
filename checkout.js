class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.shippingInfo = {};
        this.paymentInfo = {};
        
        this.initializeEventListeners();
        this.loadOrderSummary();
        this.updateStepIndicator();
    }

    initializeEventListeners() {
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Save shipping info checkbox
        const saveInfoCheckbox = document.getElementById('saveInfo');
        if (saveInfoCheckbox) {
            saveInfoCheckbox.addEventListener('change', (e) => this.handleSaveInfoChange(e));
        }
    }

    updateStepIndicator() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    loadOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        if (!orderItems || !this.cart.length) return;

        // Clear existing items
        orderItems.innerHTML = '';

        let subtotal = 0;

        // Add each cart item to the summary
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${item.price.toFixed(2)}</div>
                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                </div>
            `;
            orderItems.appendChild(itemElement);
        });

        // Calculate totals
        const shipping = 10.00; // Fixed shipping cost
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        // Update summary totals
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(e.target);
        const shippingInfo = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country')
        };

        // Validate form data
        if (!this.validateShippingInfo(shippingInfo)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Save shipping info
        this.shippingInfo = shippingInfo;

        // If save info is checked, save to localStorage
        if (document.getElementById('saveInfo').checked) {
            localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        }

        // Move to next step
        this.currentStep++;
        this.updateStepIndicator();
        this.showNextStep();
    }

    validateShippingInfo(info) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
        return requiredFields.every(field => info[field] && info[field].trim() !== '');
    }

    handleSaveInfoChange(e) {
        const saveInfo = e.target.checked;
        if (saveInfo) {
            // Load saved info if available
            const savedInfo = JSON.parse(localStorage.getItem('shippingInfo'));
            if (savedInfo) {
                Object.keys(savedInfo).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) input.value = savedInfo[key];
                });
            }
        }
    }

    showNextStep() {
        const steps = document.querySelectorAll('.checkout-step');
        steps.forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });
    }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkoutManager = new CheckoutManager();
}); 