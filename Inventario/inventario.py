import csv
import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mysql",
        database="inventory_system"
    )

def update_stock_and_insert_orders(csv_file):
    db = connect_db()
    cursor = db.cursor()

    customer_id = 1
    customer_name = 'Kevin Cardenas'
    customer_address = 'Quito'
    customer_phone = '123456789'

    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Insert into orders table
        cursor.execute("""
            INSERT INTO orders (customer_id, customer_name, customer_address, customer_phone)
            VALUES (%s, %s, %s, %s)
        """, (customer_id, customer_name, customer_address, customer_phone))
        order_id = cursor.lastrowid

        for row in reader:
            product_id = row['ProductID']
            quantity = int(row['Quantity'])
            product_image = row['ProductImage']
            product_name = row['ProductName']
            product_price = row['ProductPrice']

            # Update stock in products table
            cursor.execute("SELECT stock FROM products WHERE product_id = %s", (product_id,))
            result = cursor.fetchone()

            if result:
                new_stock = result[0] - quantity
                cursor.execute("UPDATE products SET stock = %s WHERE product_id = %s", (new_stock, product_id))
            else:
                print(f"Product ID {product_id} not found in the database.")

            # Insert into order_details table
            cursor.execute("""
                INSERT INTO order_details (order_id, product_id, quantity)
                VALUES (%s, %s, %s)
            """, (order_id, product_id, quantity))

    db.commit()
    cursor.close()
    db.close()

# Llama a la función con la ruta del archivo CSV
update_stock_and_insert_orders('C:/Users/kevin/Desktop/ExamenProgreso2/Inventario/orders.csv')
