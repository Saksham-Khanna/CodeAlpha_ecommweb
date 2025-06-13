// Initialize Swiper for category slider
document.addEventListener('DOMContentLoaded', function() {
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
        },
    });
});

class CategoryManager {
    constructor() {
        this.categories = {
            'Clothing': [
                {
                    id: 1,
                    name: 'Men\'s Casual Shirt',
                    price: 29.99,
                    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop',
                    rating: 4.5
                },
                {
                    id: 2,
                    name: 'Women\'s Summer Dress',
                    price: 39.99,
                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop',
                    rating: 4.8
                },
                {
                    id: 3,
                    name: 'Kids\' T-Shirt',
                    price: 19.99,
                    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1974&auto=format&fit=crop',
                    rating: 4.2
                }
            ],
            'Electronics': [
                {
                    id: 4,
                    name: 'Wireless Headphones',
                    price: 99.99,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
                    rating: 4.7
                },
                {
                    id: 5,
                    name: 'Smart Watch',
                    price: 199.99,
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                    rating: 4.6
                },
                {
                    id: 6,
                    name: 'Bluetooth Speaker',
                    price: 79.99,
                    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1936&auto=format&fit=crop',
                    rating: 4.4
                }
            ],
            'Gaming': [
                {
                    id: 7,
                    name: 'Gaming Mouse',
                    price: 49.99,
                    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=2070&auto=format&fit=crop',
                    rating: 4.9
                },
                {
                    id: 8,
                    name: 'Gaming Keyboard',
                    price: 89.99,
                    image: 'https://images.unsplash.com/photo-1595225476471-ec5f8f1a3b0a?q=80&w=1974&auto=format&fit=crop',
                    rating: 4.7
                },
                {
                    id: 9,
                    name: 'Gaming Headset',
                    price: 69.99,
                    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1925&auto=format&fit=crop',
                    rating: 4.5
                }
            ],
            'Watches': [
                {
                    id: 10,
                    name: 'Classic Watch',
                    price: 149.99,
                    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1974&auto=format&fit=crop',
                    rating: 4.8
                },
                {
                    id: 11,
                    name: 'Sports Watch',
                    price: 129.99,
                    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974&auto=format&fit=crop',
                    rating: 4.6
                },
                {
                    id: 12,
                    name: 'Smart Watch',
                    price: 199.99,
                    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1972&auto=format&fit=crop',
                    rating: 4.7
                }
            ]
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add click event listeners to category slides
        const categorySlides = document.querySelectorAll('.swiper-slide');
        categorySlides.forEach(slide => {
            slide.addEventListener('click', () => {
                const category = slide.querySelector('h3').textContent;
                this.navigateToCategory(category);
            });
        });
    }

    navigateToCategory(category) {
        // Store the selected category in localStorage
        localStorage.setItem('selectedCategory', category);
        // Navigate to all-products.html
        window.location.href = 'all-products.html';
    }

    showCategoryProducts(category) {
        // Create modal for category products
        const modal = document.createElement('div');
        modal.className = 'category-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${category}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="products-grid"></div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Get products for category
        const products = this.categories[category] || [];
        const productsGrid = modal.querySelector('.products-grid');

        // Display products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}
                    <span>(${product.rating})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productsGrid.appendChild(productCard);
        });

        // Add event listener to close button
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Add event listeners to Add to Cart buttons
        const addToCartButtons = modal.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Find product in categories
        let product = null;
        for (const category in this.categories) {
            const found = this.categories[category].find(p => p.id === parseInt(productId));
            if (found) {
                product = found;
                break;
            }
        }

        if (product) {
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show success message
            this.showMessage('Product added to cart!', 'success');
        }
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

// Initialize category manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const categoryManager = new CategoryManager();
});

function updateNavbarAuthLinks() {
    const token = localStorage.getItem('token');
    document.querySelectorAll('.nav-right').forEach(navRight => {
        const loginLink = navRight.querySelector('a[href="login.html"]');
        let logoutLink = navRight.querySelector('.logout-link');
        // Remove duplicate logout links if any
        navRight.querySelectorAll('.logout-link').forEach((el, idx) => {
            if (idx > 0) el.remove();
        });
        if (token) {
            if (loginLink) loginLink.style.display = 'none';
            if (!logoutLink) {
                logoutLink = document.createElement('a');
                logoutLink.textContent = 'Logout';
                logoutLink.className = 'logout-link';
                logoutLink.style.cursor = 'pointer';
                logoutLink.onclick = function() {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    updateNavbarAuthLinks();
                    window.location.href = 'index.html';
                };
                navRight.appendChild(logoutLink);
            } else {
                logoutLink.style.display = '';
            }
        } else {
            if (loginLink) loginLink.style.display = '';
            if (logoutLink) logoutLink.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', updateNavbarAuthLinks); 