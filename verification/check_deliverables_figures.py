import re

files = ['FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA_2026.md', 'FASAL_2026_RECONCILIATION_LEDGER.md']

figures = [
    ('3,02,14,192', '2025 Cost'),
    ('11,12,46,772', '2025 Gross'),
    ('8,10,32,580', '2025 Net'),
    ('54,494', '2025 Mean Net'),
    ('3,31,24,177', '2026 Cost'),
    ('12,81,70,176', '2026 Gross'),
    ('9,50,45,999', '2026 Net'),
    ('63,917.95', '2026 Mean Net'),
    ('17.29%', 'Net Growth Delta'),
    ('333', 'Turmeric 2025 Growers'),
    ('328', 'Turmeric 2026 Growers'),
    ('93,08,860', 'Turmeric 2025 Net'),
    ('98,38,392', 'Turmeric 2026 Net'),
    ('1,535', 'Questionnaire Row Count'),
    ('891', 'OBC Count'),
    ('377', 'ST Count'),
    ('259', 'SC Count'),
    ('1,506', 'Complete Surveys'),
    ('1,520', 'Physical Books'),
    ('1,102', 'Paid Surveys'),
    ('408', 'Pending Surveys'),
    ('3,623.50', 'Numeric Land Sum'),
    ('5,233.84', 'Regex Land Sum'),
    ('1,046.77', 'Acres @ 0.20'),
    ('Row 1488', 'Row 1488 Slice Label')
]

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f'Checking {fn} ({len(text)} chars)...')
    missing = 0
    for fig, label in figures:
        if fig not in text:
            print(f'  [MISSING] {label}: "{fig}"')
            missing += 1
        else:
            count = text.count(fig)
            print(f'  [FOUND] {label}: "{fig}" (x{count})')
    print(f'Done {fn}: missing={missing}')
