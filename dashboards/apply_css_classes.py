import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Substituições para dash_decisoes.py
replacements_decisoes = [
    ("style={'backgroundColor': COLORS['surface'], 'padding': '20px', 'borderRadius': '12px', 'width': '45%', 'minWidth': '400px'}", "className='graph-container'"),
    ("""style={
            'backgroundColor': 'transparent',
            'color': COLORS['text'], 
            'border': f'1px solid {COLORS["accent"]}', 
            'padding': '10px 20px', 
            'borderRadius': '5px',
            'cursor': 'pointer'
        }""", "className='back-btn'")
]
replace_in_file('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_decisoes.py', replacements_decisoes)

# Substituições para dash_seguranca.py e dash_ia.py
replacements_others = [
    ("style={'backgroundColor': COLORS['surface'], 'padding': '20px', 'borderRadius': '12px', 'width': '80%'}", "className='graph-wrapper-large'"),
    ("""style={
            'backgroundColor': 'transparent',
            'color': COLORS['text'], 
            'border': f'1px solid {COLORS["accent"]}', 
            'padding': '10px 20px', 
            'borderRadius': '5px',
            'cursor': 'pointer'
        }""", "className='back-btn'")
]
replace_in_file('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_seguranca.py', replacements_others)
replace_in_file('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_ia.py', replacements_others)

print("Classes CSS injetadas com sucesso!")
