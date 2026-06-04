import subprocess
import sys
import os

def run_dashboards():
    print("Iniciando os projetos de BI (Dashboards)...")
    
    # Caminhos para os scripts
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dash_dir = os.path.join(base_dir, 'dashboards')
    
    venv_python = os.path.join(dash_dir, 'venv', 'bin', 'python')
    
    scripts = [
        'dash_decisoes.py',
        'dash_seguranca.py',
        'dash_ia.py'
    ]
    
    processes = []
    for script in scripts:
        print(f"Iniciando {script}...")
        p = subprocess.Popen([venv_python, script], cwd=dash_dir)
        processes.append(p)
        
    print("\nTodos os dashboards foram iniciados e estão rodando em segundo plano!")
    print("- Tomada de Decisões: http://127.0.0.1:8050")
    print("- Segurança: http://127.0.0.1:8051")
    print("- Inteligência Artificial: http://127.0.0.1:8052")
    print("\nMantenha este terminal aberto. Pressione Ctrl+C para encerrar todos os dashboards.")
    
    try:
        for p in processes:
            p.wait()
    except KeyboardInterrupt:
        print("\nEncerrando dashboards...")
        for p in processes:
            p.terminate()
        print("Dashboards encerrados com sucesso.")

if __name__ == '__main__':
    run_dashboards()

