import os
import glob

# Código a ser substituído
old_code = """html.Div(style={'textAlign': 'center', 'marginTop': '40px'}, children=[
        html.A("← Voltar para o Portfólio", href="javascript:window.close();", style={'color': COLORS['text'], 'textDecoration': 'none', 'border': f'1px solid {COLORS["accent"]}', 'padding': '10px 20px', 'borderRadius': '5px'})
    ])"""

# Novo código usando botão e clientside_callback
new_code = """html.Div(style={'textAlign': 'center', 'marginTop': '40px'}, children=[
        html.Button("← Voltar para o Portfólio", id="fechar-aba", style={
            'backgroundColor': 'transparent',
            'color': COLORS['text'], 
            'border': f'1px solid {COLORS["accent"]}', 
            'padding': '10px 20px', 
            'borderRadius': '5px',
            'cursor': 'pointer'
        })
    ])
])

app.clientside_callback(
    "function(n) { if (n > 0) window.close(); return window.dash_clientside.no_update; }",
    dash.Output("fechar-aba", "id"),
    dash.Input("fechar-aba", "n_clicks"),
    prevent_initial_call=True
)"""

for file in glob.glob('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_*.py'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Precisamos garantir que temos o dash importado para o Output/Input da callback (alguns usam from dash import dcc, html, Input, Output)
    # A callback acima usa dash.Output e dash.Input.
    
    # Substituir a div que contém o html.A pela que contém o html.Button
    if old_code in content:
        # Remover o último "])" do app.layout já que incluímos no new_code para colocar o callback depois
        content = content.replace(old_code + "\n])", new_code)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Corrigido: {file}")
    else:
        print(f"Padrão não encontrado em: {file}")
