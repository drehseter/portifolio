import glob

for file in glob.glob('/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/dash_*.py'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Substituir debug=True por debug=False para desativar a barra inferior do Dash
    content = content.replace("debug=True", "debug=False")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Modo debug desativado em: {file}")
