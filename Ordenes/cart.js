const customerData = {
    id: 1,
    name: 'Kevin Cardenas',
    address: 'Quito',
    phone: '123456789'
};
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    document.getElementById('generateOrderButton').addEventListener('click', generateOrder);
});

function displayCart() {
    const cartGrid = document.getElementById('cartGrid');
    cartGrid.innerHTML = '';

    cart.forEach(product => {
        const cartCard = document.createElement('div');
        cartCard.className = 'cart-card';
        cartCard.innerHTML = `
            <img src="${product.productImage}" alt="${product.productName}">
            <h2>${product.productName}</h2>
            <p>ID: ${product.productId}</p>
            <p>Price: $${product.productPrice}</p>
            <p>Quantity: ${product.quantity}</p>
            <button class="remove-button" onclick="removeFromCart(${product.productId})">Remove</button>
        `;
        cartGrid.appendChild(cartCard);
    });
}

function removeFromCart(productId) {
    cart = cart.filter(product => product.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function generateOrder() {
    const csvHeader = "ID,Nombre,Direccion,Telefono,ProductID,ProductName,ProductPrice,Quantity,ProductImage\n";
    const csvRows = cart.map(product => {
        return `${customerData.id},${customerData.name},${customerData.address},${customerData.phone},${product.productId},${product.productName},${product.productPrice},${product.quantity},${product.productImage}`;
    });
    const csvContent = csvHeader + csvRows.join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clear cart after generating order
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
    alert('Order generated and cart cleared');
}
