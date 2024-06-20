import requests
import mysql.connector

# Conexión a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Mysql",
    database="inventory_system"
)

cursor = db.cursor()

# Obtener datos de productos de la API
response = requests.get("https://dummyjson.com/products?limit=0")
products = response.json().get("products", [])

# Insertar productos en la base de datos
for product in products:
    sql = "INSERT INTO products (product_name, product_image, product_price, stock) VALUES (%s, %s, %s, %s)"
    values = (product['title'], product['thumbnail'], product['price'], 100)
    cursor.execute(sql, values)

# Confirmar cambios y cerrar conexión
db.commit()
cursor.close()
db.close()

print("Productos insertados exitosamente.")
