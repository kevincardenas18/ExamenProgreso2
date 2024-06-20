from flask import Flask, request, jsonify, render_template
import mysql.connector
from datetime import datetime

app = Flask(__name__)

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mysql",
        database="inventory_system"
    )

@app.route('/api/generate_invoice', methods=['POST'])
def generate_invoice():
    data = request.json
    order_id = data['order_id']

    db = connect_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM orders WHERE order_id = %s", (order_id,))
    order = cursor.fetchone()

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    cursor.execute("SELECT * FROM order_details WHERE order_id = %s", (order_id,))
    order_details = cursor.fetchall()

    total = 0
    for item in order_details:
        cursor.execute("SELECT product_name, product_price FROM products WHERE product_id = %s", (item['product_id'],))
        product = cursor.fetchone()
        item['product_name'] = product['product_name']
        item['product_price'] = product['product_price']
        total += item['quantity'] * product['product_price']

    cursor.execute("""
        INSERT INTO invoices (order_id, total)
        VALUES (%s, %s)
    """, (order_id, total))
    db.commit()
    invoice_id = cursor.lastrowid

    cursor.execute("SELECT * FROM invoices WHERE invoice_id = %s", (invoice_id,))
    invoice = cursor.fetchone()

    response = {
        'invoice_id': invoice['invoice_id'],
        'order_id': invoice['order_id'],
        'invoice_date': invoice['invoice_date'],
        'total': invoice['total'],
        'products': order_details
    }

    cursor.close()
    db.close()

    return jsonify(response)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
