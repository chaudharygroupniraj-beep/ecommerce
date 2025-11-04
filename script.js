// Shopping Cart Functionality
let cart = [];

function addToCart(productName, price) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`✅ ${productName} added to cart!`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('totalAmount');
    const cartCount = document.getElementById('cartCount');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>NPR ${item.price.toLocaleString()} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity('${item.name}', -1)" style="background: #dc143c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">−</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button onclick="updateQuantity('${item.name}', 1)" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">+</button>
                <button onclick="removeFromCart('${item.name}')" style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Remove</button>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = total.toLocaleString();
}

function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
    showNotification("❌ Item removed from cart");
}

function checkout() {
    if (cart.length === 0) {
        showNotification("🛒 Please add items to cart first!");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order summary
    const orderDetails = cart.map(item => 
        `${item.name} (Qty: ${item.quantity}) - NPR ${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');
    
    // Create WhatsApp message
    const phoneNumber = "98XXXXXXX"; // Replace with your WhatsApp number
    const message = `Hello! I want to order:%0A%0A${orderDetails}%0A%0ATotal: NPR ${total.toLocaleString()}%0A%0APlease contact me for delivery details.`;
    
    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    showNotification("📱 Opening WhatsApp to confirm your order!");
}

function showNotification(message) {
    // Simple notification using alert
    alert(message);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});

// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
