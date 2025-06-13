class ProductManager {
    constructor() {
        this.initializeEventListeners();
        this.filterByCategory();
    }

    initializeEventListeners() {
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: productCard.dataset.id || productCard.querySelector('h3').textContent,
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
                    image: productCard.querySelector('img').src,
                    quantity: 1
                };
                this.addToCart(product);
            });
        });

        // Category filter checkboxes
        const categoryCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterProducts());
        });

        // Price range filter
        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            input.addEventListener('change', () => this.filterProducts());
        });
    }

    filterByCategory() {
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
            // Check the corresponding category checkbox
            const categoryCheckbox = document.querySelector(`input[value="${selectedCategory}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
                this.filterProducts();
            }
            // Clear the selected category from localStorage
            localStorage.removeItem('selectedCategory');
        }
    }

    filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        
        const minPrice = parseFloat(document.querySelector('.price-input[placeholder="Min"]').value) || 0;
        const maxPrice = parseFloat(document.querySelector('.price-input[placeholder="Max"]').value) || Infinity;

        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const category = card.dataset.category;
            const price = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
            
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const priceMatch = price >= minPrice && price <= maxPrice;

            card.style.display = categoryMatch && priceMatch ? 'block' : 'none';
        });
    }

    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart by id
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.showMessage('Product added to cart successfully!', 'success');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the product manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
}); 