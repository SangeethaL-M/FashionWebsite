let products = [];
let currentTopFilter = 'All';
let currentSideFilter = 'All';

async function fetchProducts() {
    try {
        const response = await fetch('Assets/js/products.json');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function renderProducts(data) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="group relative flex flex-col cursor-pointer">
            <div class="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100">
                <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="w-8 h-8 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>

                <div class="absolute inset-x-0 bottom-8 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button onclick="addToSidebarCart('${p.name}', ${p.price}, '${p.image}')" class="bg-[#FF7E67] text-white px-10 py-3 rounded-xl font-bold shadow-xl">Buy Now</button>
                </div>
            </div>

            <div class="mt-4">
                <div class="flex justify-between items-center mb-1">
                    <h3 class="font-bold text-lg">${p.name}</h3>
                    <span class="font-bold text-lg">$${p.price}</span>
                </div>
                <p class="text-zinc-500 text-sm">${p.description}</p>
            </div>
        </div>
    `).join('');
}

// Filtering Logic
function applyFilters() {
    let filtered = products;
    if (currentTopFilter !== 'All') filtered = filtered.filter(p => p.type === currentTopFilter);
    if (currentSideFilter !== 'All') filtered = filtered.filter(p => p.category === currentSideFilter);
    renderProducts(filtered);
}

// Event Listeners
document.querySelectorAll('.top-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.top-filter').forEach(b => b.classList.replace('text-[#FF7E67]', 'text-zinc-400'));
        btn.classList.replace('text-zinc-400', 'text-[#FF7E67]');
        currentTopFilter = btn.dataset.type;
        applyFilters();
    });
});

document.querySelectorAll('.side-filter').forEach(li => {
    li.addEventListener('click', () => {
        document.querySelectorAll('.side-filter').forEach(l => l.classList.remove('bg-zinc-200'));
        li.classList.add('bg-zinc-200');
        currentSideFilter = li.dataset.cat;
        applyFilters();
    });
});

// Size Toggle Logic
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('bg-[#FF7E67]');
        btn.classList.toggle('text-white');
        btn.classList.toggle('border-[#FF7E67]');
    });
});

fetchProducts();
// Function for the Login Button
function toggleLogin() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const isHidden = loginModal.classList.contains('hidden');
        loginModal.classList.toggle('hidden');
        loginModal.style.display = isHidden ? 'flex' : 'none';
        document.body.style.overflow = isHidden ? 'hidden' : 'auto';
    }
}

function toggleUser() {
    const userModal = document.getElementById('userModal');
    if (userModal) {
        const isHidden = userModal.classList.contains('hidden');
        userModal.classList.toggle('hidden');
        userModal.style.display = isHidden ? 'flex' : 'none';
        document.body.style.overflow = isHidden ? 'hidden' : 'auto';
    }
}


//Cart
let sidebarCart = [];

// Opens and closes the sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('translate-x-full');
        overlay.classList.toggle('hidden');
    }
}

// Adds item to array and refreshes sidebar
function addToSidebarCart(name, price, image) {
    // Your existing logic to push to the array
    const cleanPrice = parseFloat(price.toString().replace('$', ''));
    sidebarCart.push({ name, price, image, id: Date.now() });
    
    updateSidebarUI();
    
    // --- ADD THIS LINE ---
    updateNavCount(); 
    
    // Open the sidebar
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar && sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function updateSidebarUI() {
    const list = document.getElementById('sidebarItemList');
    const totalEl = document.getElementById('sidebarTotal');
    let total = 0;

    if (!list) return;

    list.innerHTML = sidebarCart.map(item => {
        total += item.price;
        return `
            <div class="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
                <img src="${item.image}" class="w-16 h-20 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="font-bold text-zinc-800 text-sm">${item.name}</h4>
                    <p class="text-[#FF7E67] font-bold">$${item.price}</p>
                </div>
                <button onclick="removeFromSidebar(${item.id})" class="text-zinc-300 hover:text-red-500 px-2">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromSidebar(id) {
    sidebarCart = sidebarCart.filter(item => item.id !== id);
    updateSidebarUI();
    
    // --- ADD THIS LINE ---
    updateNavCount(); 
}
function updateNavCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        // Sets the number to the length of your sidebarCart array
        countElement.innerText = sidebarCart.length;
        
        // This hides the red circle if the cart is empty (0)
        if (sidebarCart.length === 0) {
            countElement.classList.add('hidden');
        } else {
            countElement.classList.remove('hidden');
        }
    }
}

//Checkout
function proceedToCheckout() {
    if (sidebarCart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Save the sidebar items into localStorage so cart.html can see them
    localStorage.setItem('fashionCart', JSON.stringify(sidebarCart));
    
    // Navigate to your expected cart page
    window.location.href = 'cart.html';
}