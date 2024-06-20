const apiUrl = 'https://dummyjson.com/products';
let currentPage = 0;
const limit = 10;
const customerData = {
    id: 1,
    name: 'Kevin Cardenas',
    address: 'Quito',
    phone: '123456789'
};
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('searchButton').addEventListener('click', searchProducts);
    document.getElementById('prevButton').addEventListener('click', () => changePage(-1));
    document.getElementById('nextButton').addEventListener('click', () => changePage(1));
});

async function fetchProducts(skip = 0, query = '') {
    let url = `${apiUrl}?limit=${limit}&skip=${skip}`;
    if (query) {
        url = `${apiUrl}/search?q=${query}&limit=${limit}&skip=${skip}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayProducts(data.products);
        updatePagination(data.total);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>ID: ${product.id}</p>
            <p>Price: $${product.price}</p>
            <div class="quantity-selector">
                <button onclick="updateQuantity(${product.id}, -1)">-</button>
                <span id="quantity-${product.id}">1</span>
                <button onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
            <button class="order-button" onclick="addToCart(${product.id}, '${product.thumbnail}', '${product.title}', ${product.price})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

function updateQuantity(productId, change) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityElement.textContent);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    quantityElement.textContent = currentQuantity;
}

function addToCart(productId, productImage, productName, productPrice) {
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).textContent);
    const productInCart = cart.find(item => item.productId === productId);

    if (productInCart) {
        productInCart.quantity += quantity;
    } else {
        const product = {
            productId,
            productImage,
            productName,
            productPrice,
            quantity
        };
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
}

function updatePagination(totalItems) {
    const pageInfo = document.getElementById('pageInfo');
    const totalPages = Math.ceil(totalItems / limit);
    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    document.getElementById('prevButton').disabled = currentPage <= 0;
    document.getElementById('nextButton').disabled = currentPage >= totalPages - 1;
}

function changePage(offset) {
    currentPage += offset;
    fetchProducts(currentPage * limit, document.getElementById('searchInput').value);
}

function searchProducts() {
    currentPage = 0;
    fetchProducts(0, document.getElementById('searchInput').value);
}
