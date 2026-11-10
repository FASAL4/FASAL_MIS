import openpyxl

wb = openpyxl.load_workbook('FDB Survey as on 05112026.xlsx', read_only=True, data_only=True)
ws = wb['Income Data']

rows = list(ws.iter_rows(values_only=True))
print("Total rows read in Income Data:", len(rows))
for r_idx in range(min(5, len(rows))):
    print(f"Row {r_idx+1}:", rows[r_idx][:25])

print("\nRow 1490 (index 1489):", rows[1489][:10] if len(rows) > 1489 else "N/A")
print("Row 1491 (index 1490):", rows[1490][:10] if len(rows) > 1490 else "N/A")
print("Row 1492 (index 1491):", rows[1491][:10] if len(rows) > 1491 else "N/A")
