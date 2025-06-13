window.addEventListener('load', function () {
  const swiper = new Swiper('.mySwiper', {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
});

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const navRight = document.querySelector('.nav-right');

menuIcon.addEventListener('click', () => {
  navRight.classList.toggle('mobile-open');
});

// Initialize Swiper for index.html
if (document.querySelector('.mySwiper')) {
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
}

// Price Range Slider for all-products.html
const priceSlider = document.querySelector('.price-slider');
const minPriceInput = document.querySelector('.price-input:first-child');
const maxPriceInput = document.querySelector('.price-input:last-child');

if (priceSlider) {
  priceSlider.addEventListener('input', function() {
    maxPriceInput.value = this.value;
  });

  minPriceInput.addEventListener('change', function() {
    if (parseInt(this.value) > parseInt(maxPriceInput.value)) {
      this.value = maxPriceInput.value;
    }
    priceSlider.min = this.value;
  });

  maxPriceInput.addEventListener('change', function() {
    if (parseInt(this.value) < parseInt(minPriceInput.value)) {
      this.value = minPriceInput.value;
    }
    priceSlider.max = this.value;
  });
}

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
if (addToCartButtons.length > 0) {
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      
      // Get existing cart items from localStorage
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      
      // Add new item
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: 1
      });
      
      // Save back to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Show confirmation
      alert('Product added to cart!');
    });
  });
}

// Cart page functionality
const cartItems = document.querySelector('.cart-items');
if (cartItems) {
  // Load cart items from localStorage
  const items = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  if (items.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart-message">
        <h2>Your cart is empty</h2>
        <a href="all-products.html" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
  } else {
    // Display cart items
    let total = 0;
    cartItems.innerHTML = items.map(item => {
      const price = parseFloat(item.price.replace('$', ''));
      total += price * item.quantity;
      return `
        <div class="cart-item">
          <h3>${item.name}</h3>
          <p>Price: ${item.price}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity('${item.name}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity('${item.name}', 1)">+</button>
          </div>
          <button onclick="removeItem('${item.name}')">Remove</button>
        </div>
      `;
    }).join('');
    
    // Update total
    document.querySelector('.summary-item.total').textContent = `Total: $${total.toFixed(2)}`;
  }
}

// Cart helper functions
function updateQuantity(productName, change) {
  let items = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = items.find(item => item.name === productName);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    localStorage.setItem('cartItems', JSON.stringify(items));
    location.reload(); // Refresh to update display
  }
}

function removeItem(productName) {
  let items = JSON.parse(localStorage.getItem('cartItems')) || [];
  items = items.filter(item => item.name !== productName);
  localStorage.setItem('cartItems', JSON.stringify(items));
  location.reload(); // Refresh to update display
}

// Form validation for login and seller pages
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });
    
    if (isValid) {
      // Form is valid, you can submit it here
      console.log('Form is valid, submitting...');
    }
  });
});