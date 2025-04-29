// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartCount = document.querySelectorAll('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsList = document.querySelector('.cart-items-list');
const subtotalElement = document.querySelector('.subtotal');
const totalAmountElement = document.querySelector('.total-amount');
const clearCartButton = document.querySelector('.clear-cart');
const checkoutButton = document.querySelector('.checkout-btn');
const continueShoppingButton = document.querySelector('.continue-shopping');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const productCards = document.querySelectorAll('.product-card');
const contactForm = document.getElementById('contactForm');

// Cart array to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.forEach(element => {
        element.textContent = count;
    });
}

// Add to cart function
function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show added animation
    button.textContent = 'Added!';
    button.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = 'var(--primary-color)';
    }, 1000);
}

// Display cart items
function displayCartItems() {
    if (cartItemsList) {
        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <img src="images/product${item.id}.jpg" alt="${item.name}" class="cart-item-image">
                    <span class="cart-item-title">${item.name}</span>
                </div>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            `;
            cartItemsList.appendChild(cartItemElement);
        });
        
        updateCartTotal();
    }
}

// Update cart total
function updateCartTotal() {
    if (subtotalElement && totalAmountElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 5.00;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Update item quantity
function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity < 1) {
            removeItem(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
        }
    }
}

// Clear cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Filter products
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseFloat(card.getAttribute('data-price'));
        
        let categoryMatch = selectedCategory === 'all' || category === selectedCategory;
        let priceMatch = true;
        
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(Number);
            priceMatch = price >= min && price <= max;
        }
        
        if (categoryMatch && priceMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, subject, message });
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
}

// Event Listeners
if (addToCartButtons) {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

if (cartItemsList) {
    // Event delegation for dynamic elements
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
            const id = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id');
            removeItem(id);
        }
        
        if (e.target.classList.contains('minus')) {
            const id = e.target.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
            }
        }
        
        if (e.target.classList.contains('plus')) {
            const id = e.target.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
            }
        }
    });
    
    // Handle quantity input changes
    cartItemsList.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const id = e.target.getAttribute('data-id');
            const newQuantity = e.target.value;
            updateQuantity(id, newQuantity);
        }
    });
}

if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
}

if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout! This would redirect to a payment gateway in a real application.');
    });
}

if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', () => {
        window.location.href = 'products.html';
    });
}

if (categoryFilter && priceFilter) {
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
}

if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
}

// Initialize
updateCartCount();
displayCartItems();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.product-card, .team-member, .info-item, .form-group');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.product-card, .team-member, .info-item, .form-group');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger animation after a short delay
    setTimeout(animateOnScroll, 100);
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);