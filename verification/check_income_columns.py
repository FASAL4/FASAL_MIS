import openpyxl

wb = openpyxl.load_workbook('FDB Survey as on 05112026.xlsx', read_only=True, data_only=True)
ws = wb['Income Data']
rows = list(ws.iter_rows(values_only=True))

r2 = rows[1]
r3 = rows[2]

current_crop = None
cols_info = []
for c_idx in range(len(r2)):
    val2 = r2[c_idx]
    val3 = r3[c_idx]
    if val2 is not None:
        current_crop = val2
    cols_info.append((c_idx, current_crop, val3))

for idx, crop, yr in cols_info:
    if 'total' in str(crop).lower() or 'turmeric' in str(crop).lower() or idx >= 155:
        print(f"Col {idx}: Crop/Field='{crop}', Year={yr}")
