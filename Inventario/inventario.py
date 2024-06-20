import csv
import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mysql",
        database="inventory_system"
    )

def update_stock_from_csv(csv_file):
    db = connect_db()
    cursor = db.cursor()

    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            product_id = row['ProductID']
            quantity = int(row['Quantity'])

            cursor.execute("SELECT stock FROM products WHERE product_id = %s", (product_id,))
            result = cursor.fetchone()

            if result:
                new_stock = result[0] - quantity
                cursor.execute("UPDATE products SET stock = %s WHERE product_id = %s", (new_stock, product_id))
            else:
                print(f"Product ID {product_id} not found in the database.")

    db.commit()
    cursor.close()
    db.close()

# Llama a la función con la ruta del archivo CSV
update_stock_from_csv('C:/Users/kevin/Desktop/ExamenProgreso2/Inventario/orders.csv')
