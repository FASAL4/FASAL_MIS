import pandas as pd
import json
import os

excel_file = 'Training Dashboard.xlsx'
df = pd.read_excel(excel_file, sheet_name='Training ')

# Clean data
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year.astype(str)
df['Training/ Capacity Building/ Interface meetings/ CRP Meetings (Title)'] = (
    df['Training/ Capacity Building/ Interface meetings/ CRP Meetings (Title)']
    .str.strip()
    .str.replace('\n', ' ')
    .str.replace(r'\s+', ' ', regex=True)
)

# Group and aggregate
agg = df.groupby(['Year', 'Training/ Capacity Building/ Interface meetings/ CRP Meetings (Title)'])['Total Participants'].sum().reset_index()
agg.columns = ['year', 'type', 'participants']
records = agg.to_dict(orient='records')

# Calculate intensity
intensity_agg = df.groupby('Year')['Total Participants'].sum().reset_index()
intensity_records = []
for _, row in intensity_agg.iterrows():
    yr = str(row['Year'])
    total = int(row['Total Participants'])
    sessions = round(total / 1329.0, 2)
    intensity_records.append({
        'year': yr,
        'sessionsPerHousehold': sessions
    })

output_data = {
    'trainings': records,
    'intensity': intensity_records
}

out_dir = os.path.join('src', 'data')
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(out_dir, 'training.json'), 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print("Extracted", len(records), "training records and", len(intensity_records), "intensity records successfully.")
