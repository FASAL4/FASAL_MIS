import csv
import random
import os

regions = ['North', 'South', 'East', 'West']
products = ['Widget A', 'Gadget B', 'Gizmo C', 'Doohickey D', 'Thingamajig E']

with open('c:/Users/bentn/antigravity/Untitled/test_sales_data.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['region', 'product', 'quantity', 'unit_price', 'total_revenue'])
    for _ in range(50000):
        region = random.choice(regions)
        product = random.choice(products)
        quantity = random.randint(1, 100)
        unit_price = round(random.uniform(5.00, 500.00), 2)
        total_revenue = round(quantity * unit_price, 2)
        writer.writerow([region, product, quantity, unit_price, total_revenue])
print("CSV generation complete.")
