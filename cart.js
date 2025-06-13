// Cart functionality
class Cart {
    constructor() {
        this.loadCart();
        this.cartItemsList = document.getElementById('cartItemsList');
        this.emptyCartMessage = document.querySelector('.empty-cart-message');
        this.checkoutButton = document.querySelector('.checkout-button');
        this.subtotalElement = document.getElementById('subtotal');
        this.shippingElement = document.getElementById('shipping');
        this.taxElement = document.getElementById('tax');
        this.totalElement = document.getElementById('total');
        
        this.init();
    }

    loadCart() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    init() {
        this.loadCart();
        this.renderCart();
        this.updateSummary();
        this.setupEventListeners();
    }

    renderCart() {
        this.loadCart();
        if (this.items.length === 0) {
            this.emptyCartMessage.style.display = 'block';
            this.checkoutButton.disabled = true;
            return;
        }
        this.emptyCartMessage.style.display = 'none';
        this.checkoutButton.disabled = false;
        this.cartItemsList.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 10 : 0;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        this.shippingElement.textContent = `$${shipping.toFixed(2)}`;
        this.taxElement.textContent = `$${tax.toFixed(2)}`;
        this.totalElement.textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        this.cartItemsList.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.dataset.id;
            
            if (e.target.classList.contains('decrease')) {
                this.updateQuantity(itemId, -1);
            } else if (e.target.classList.contains('increase')) {
                this.updateQuantity(itemId, 1);
            } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                this.removeItem(itemId);
            }
        });

        this.cartItemsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity >= 1 && newQuantity <= 10) {
                    this.setQuantity(itemId, newQuantity);
                } else {
                    e.target.value = this.items.find(item => item.id === itemId).quantity;
                }
            }
        });

        this.checkoutButton.addEventListener('click', () => {
            if (this.items.length > 0) {
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            }
        });
    }

    updateQuantity(itemId, change) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity >= 1 && newQuantity <= 10) {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
                this.updateSummary();
            }
        }
    }

    setQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.renderCart();
            this.updateSummary();
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateSummary();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();
}); 