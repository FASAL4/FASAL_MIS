import openpyxl

wb = openpyxl.load_workbook('FDB Survey as on 05112026.xlsx', data_only=True)
ws = wb['Income Data']

print("Income Data max_row:", ws.max_row, "max_column:", ws.max_column)

# Inspect first 5 rows and row 1490 to 1492
for r in range(1, 6):
    row_vals = [ws.cell(r, c).value for c in range(1, 15)]
    print(f"Row {r} (first 14 cols):", row_vals)

print("\nLast rows:")
for r in range(1488, ws.max_row + 1):
    row_vals = [ws.cell(r, c).value for c in range(1, 15)]
    print(f"Row {r} (first 14 cols):", row_vals)
