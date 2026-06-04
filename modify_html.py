import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Nav
content = content.replace('<!-- <li><a href="#projects">Projetos</a></li> -->', '<li><a href="#projects">Projetos</a></li>')

# Replace the Projects section
pattern = re.compile(r'<!--\s*<section id="projects">.*?</section>\s*-->', re.DOTALL)
replacement = """<section id="projects">
            <div class="container">
                <h2>Projetos</h2>
                <div class="project-gallery">
                    <!-- Dashboard 1: Tomada de Decisões -->
                    <div class="project-item">
                        <img src="src/thumb_decisoes.png" alt="Miniatura do Dashboard de Tomada de Decisões" class="project-image">
                        <div class="project-info">
                            <h3>Tomada de Decisões</h3>
                            <p>Como Dados podem ajudar na Tomada de Decisões. Dashboard interativo gerado com Dash e Plotly.</p>
                            <span class="project-tags">#Dash #Pandas #Business</span>
                            <a href="http://127.0.0.1:8050" class="btn btn-small" target="_blank">Ver Projeto</a>
                        </div>
                    </div>

                    <!-- Dashboard 2: Segurança -->
                    <div class="project-item">
                        <img src="src/thumb_seguranca.png" alt="Miniatura do Dashboard de Segurança" class="project-image">
                        <div class="project-info">
                            <h3>Segurança</h3>
                            <p>Como Dados podem ajudar na Segurança. Utiliza Machine Learning (Isolation Forest) para detecção de anomalias.</p>
                            <span class="project-tags">#Scikit-learn #Dash #Cybersecurity</span>
                            <a href="http://127.0.0.1:8051" class="btn btn-small" target="_blank">Ver Projeto</a>
                        </div>
                    </div>

                    <!-- Dashboard 3: IA -->
                    <div class="project-item">
                        <img src="src/thumb_ia.png" alt="Miniatura do Dashboard de IA" class="project-image">
                        <div class="project-info">
                            <h3>Inteligência Artificial</h3>
                            <p>Como a IA pode ajudar na Tomada de Decisões preditivas. Análise de tendências vs histórico real.</p>
                            <span class="project-tags">#AI #Previsão #Plotly</span>
                            <a href="http://127.0.0.1:8052" class="btn btn-small" target="_blank">Ver Projeto</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>"""

content = pattern.sub(replacement, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html updated successfully!")
