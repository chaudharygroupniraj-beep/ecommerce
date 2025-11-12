let cart = [];
let products = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCart();
});

async function loadProducts() {
    try {
        // Try to load from Firebase
        const snapshot = await db.collection('products').get();
        products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        if (products.length === 0) {
            loadSampleProducts();
        } else {
            displayProducts();
        }
    } catch (error) {
        console.log("Using sample products");
        loadSampleProducts();
    }
}

function loadSampleProducts() {
    products = [
        {
            id: '1',
            name: "Wireless Headphones",
            price: 2500,
            image: "https://via.placeholder.com/300x200/3498db/ffffff?text=Headphones",
            description: "High-quality wireless headphones"
        },
        {
            id: '2',
            name: "Smart Watch",
            price: 4500,
            image: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=Smart+Watch", 
            description: "Feature-rich smartwatch"
        }
    ];
    displayProducts();
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">NPR ${product.price.toLocaleString()}</p>
            <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    alert(`✅ ${name} added to cart!`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    const cartCount = document.getElementById('cartCount');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = itemCount;
    totalAmount.textContent = total.toLocaleString();
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>${item.name} × ${item.quantity}</div>
            <div>NPR ${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
}

function checkout() {
    if (cart.length === 0) {
        alert("🛒 Please add items to cart first!");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} (${item.quantity}) - NPR ${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');
    
    const name = prompt("Your name:");
    if (!name) return;
    
    const address = prompt("Delivery address:");
    if (!address) return;
    
    const phone = prompt("Your phone:");
    if (!phone) return;
    
    const message = `🛍️ NEW ORDER%0A%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0AOrder:%0A${orderDetails}%0A%0ATotal: NPR ${total.toLocaleString()}%0A%0APlease confirm.`;
    
    window.open(`https://wa.me/9779841234567?text=${message}`, '_blank');
    
    // Save order to Firebase
    saveOrder(name, phone, address, total);
    
    cart = [];
    updateCart();
    alert("✅ Order placed! We'll contact you soon.");
}

async function saveOrder(name, phone, address, total) {
    try {
        await db.collection('orders').add({
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            items: cart,
            total: total,
            timestamp: new Date(),
            status: 'pending'
        });
    } catch (error) {
        console.log("Order saved locally");
    }
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
