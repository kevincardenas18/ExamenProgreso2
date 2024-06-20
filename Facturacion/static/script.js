document.getElementById('generateInvoiceButton').addEventListener('click', async () => {
    const orderId = document.getElementById('orderIdInput').value;
    if (!orderId) {
        alert('Please enter an Order ID');
        return;
    }

    try {
        const response = await fetch('/api/generate_invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId })
        });

        if (!response.ok) {
            throw new Error('Failed to generate invoice');
        }

        const invoice = await response.json();
        displayInvoice(invoice);
    } catch (error) {
        alert(error.message);
    }
});

function displayInvoice(invoice) {
    const invoiceDetails = document.getElementById('invoiceDetails');
    invoiceDetails.innerHTML = `
        <div class="invoice-card">
            <h2>Invoice ID: ${invoice.invoice_id}</h2>
            <p>Order ID: ${invoice.order_id}</p>
            <p>Date: ${invoice.invoice_date}</p>
            <h3>Products:</h3>
            <ul>
                ${invoice.products.map(product => `
                    <li>${product.product_name} - Quantity: ${product.quantity}</li>
                `).join('')}
            </ul>
            <h3>Total: $${invoice.total}</h3>
        </div>
    `;
}
