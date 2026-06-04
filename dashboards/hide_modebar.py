import glob

for file in glob.glob('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_*.py'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Adicionar o config displayModeBar=False para remover a barra de ferramentas do Plotly
    if "config={'displayModeBar': False}" not in content:
        content = content.replace('dcc.Graph(', "dcc.Graph(config={'displayModeBar': False}, ")
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Modificada barra de ferramentas em: {file}")
