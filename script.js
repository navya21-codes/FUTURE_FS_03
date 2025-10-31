// Redirect and initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded:", window.location.href);
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log("Is logged in:", isLoggedIn);
    console.log("Current page:", currentPage);
    
    // Redirect logged-in users from signup page to HOME
    if (isLoggedIn && currentPage === 'account.html') {
        console.log("Redirecting to home page...");
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize signup form only if user is NOT logged in
    if (!isLoggedIn && currentPage === 'account.html') {
        initializeSignupForm();
    }
    
    // Update navigation and cart count
    updateNavigation();
    updateCartCount();
});

// -----------------------
// Nike Product Database
// -----------------------
const products = [
  { id: 1, title: "Nike Air Zoom Pegasus", category: "shoes", price: "$120", img: "Nike Air Zoom.png" },
  { id: 2, title: "Nike Revolution 5", category: "shoes", price: "$90", img: "Nike revolution 5.png" },
  { id: 3, title: "Nike Dri-FIT Tee", category: "clothing", price: "$40", img: "Nike Dri-FIT Tee.png" },
  { id: 4, title: "Nike Pro Shorts", category: "clothing", price: "$35", img: "Nike Pro Shorts.png" },
  { id: 5, title: "Nike Backpack", category: "accessories", price: "$70", img: "Nike Backpack.png" },
  { id: 6, title: "Nike Running Cap", category: "accessories", price: "$25", img: "Nike Running Cap.png" },
  { id: 7, title: "Nike Phantom Boots", category: "shoes", price: "$150", img: "Nike Phantom Boots.png" },
  { id: 8, title: "Nike Hoodie", category: "clothing", price: "$60", img: "Nike Hoodie.png" },
  { id: 9, title: "Nike Dri-FIT Academy Pants", category: "clothing", price: "$50", img: "Nike Dri-FIT Academy Pants.png" },
  { id: 10, title: "Nike Air Force 1", category: "shoes", price: "$300", img: "Nike Air Force 1.png" },
  { id: 11, title: "Nike Dunk Low", category: "shoes", price: "$200", img: "Nike Dunk Low.png" },
  { id: 12, title: "Nike Premier League Soccer Ball", category: "accessories", price: "$400", img: "Nike Premier League Soccer Ball.png" },
  { id: 13, title: "Nike Water Bottle", category: "accessories", price: "$170", img: "Nike Water Bottle.png" },
  { id: 14, title: "Nike Heritage Waist Pack", category: "accessories", price: "$200", img: "Nike Heritage Waist Pack.png" },
  { id: 15, title: "Nike Running Cap", category: "accessories", price: "$130", img: "Nike Running Cap.png" },
];

// -----------------------
// Cart Counter
// -----------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  });
}

// -----------------------
// Products Page Rendering
// -----------------------
const productsContainer = document.getElementById("productsContainer");
if (productsContainer) {
  function renderProducts(filterText = "", category = "all") {
    productsContainer.innerHTML = "";
    const filtered = products.filter(p => 
      (p.title.toLowerCase().includes(filterText.toLowerCase())) &&
      (category === "all" || p.category === category)
    );

    if (filtered.length === 0) {
      productsContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    filtered.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      productsContainer.appendChild(div);
    });
  }

  renderProducts();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderProducts(e.target.value, document.getElementById("categoryFilter").value);
  });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    renderProducts(document.getElementById("searchInput").value, e.target.value);
  });
}

// -----------------------
// Add to Cart Function
// -----------------------
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === productId);

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.title} added to cart!`);
}

// -----------------------
// Cart Page
// -----------------------
const cartItemsContainer = document.getElementById("cartItems");
if (cartItemsContainer) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("totalPrice").innerText = "Total: $0";
      return;
    }

    cart.forEach((item, index) => {
      let price = parseFloat(item.price.replace("$", ""));
      let qty = item.qty || 1;
      total += price * qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <p>Price: ${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <input type="number" min="1" value="${qty}" data-index="${index}">
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    document.getElementById("totalPrice").innerText = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll(".cart-item-actions input").forEach(input => {
      input.addEventListener("change", () => {
        let idx = input.getAttribute("data-index");
        cart[idx].qty = parseInt(input.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        let idx = btn.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      });
    });
  }

  renderCart();
}

// -----------------------
// Checkout Page
// -----------------------
function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        let price = parseFloat(item.price.replace("$", ""));
        let qty = item.qty || 1;
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-details">
                <h4>${item.title}</h4>
                <p>Qty: ${qty}</p>
            </div>
            <div class="checkout-item-price">$${(price * qty).toFixed(2)}</div>
        `;
        checkoutItems.appendChild(itemElement);
        total += price * qty;
    });
    
    checkoutTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Order placed successfully! Thank you for your purchase.');
            localStorage.removeItem('cart');
            updateCartCount();
            window.location.href = 'index.html';
        });
        
        loadCheckoutItems();
    }
});

// -----------------------
// Contact Page
// -----------------------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name, email, phone, message, date: new Date().toLocaleString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    document.getElementById("contactSuccess").style.display = "block";
    contactForm.reset();
  });
}

// -----------------------
// User Account System - FIXED
// -----------------------

function initializeSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        console.log("Initializing signup form...");
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Signup form submitted!");
            
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const birthday = document.getElementById('birthday').value;
            
            console.log("Form data:", { name, email, phone, birthday });
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (!name || !email || !phone || !birthday || !password) {
                alert('Please fill in all fields!');
                return;
            }
            
            // Save user data
            const userData = { name, email, phone, birthday };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            console.log("User data saved, redirecting to home...");
            alert('Account created successfully! Welcome to Nike Rebrand.');
            
            // FORCE REDIRECT TO HOME PAGE
            window.location.href = 'index.html';
        });
    }
}

// Update navigation based on login status
function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userSection = document.getElementById('userSection');
    
    if (userSection) {
        if (isLoggedIn) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userSection.innerHTML = `
                <span style="color: #00ffff; font-weight: bold; margin-right: 15px;">Welcome, ${user.name || 'User'}!</span>
                <button onclick="logout()" style="background: linear-gradient(45deg, #ff6b35, #00ffff); color: black; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Logout</button>
            `;
        } else {
            userSection.innerHTML = `
                <a href="account.html" id="loginBtn">Login / Sign Up</a>
            `;
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    updateNavigation();
    window.location.href = 'index.html';
}