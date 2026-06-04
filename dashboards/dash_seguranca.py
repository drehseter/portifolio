import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd
from faker import Faker
import numpy as np
from sklearn.ensemble import IsolationForest
import requests

fake = Faker('pt_BR')

COLORS = {
    'background': '#0b1325',
    'surface': '#131d36',
    'text': '#f1f5f9',
    'accent': '#d4af37',
    'alert': '#ef4444' # Vermelho para anomalias
}

def gerar_dados_fallback():
    data = []
    for _ in range(300):
        data.append({'Hora': fake.date_time_between(start_date='-1d', end_date='now'), 'Característica 1': np.random.normal(50, 10), 'Característica 2': np.random.normal(80, 15)})
    for _ in range(15):
        data.append({'Hora': fake.date_time_between(start_date='-1d', end_date='now'), 'Característica 1': np.random.uniform(200, 500), 'Característica 2': np.random.uniform(200, 800)})
    df = pd.DataFrame(data)
    return df

def fetch_threats():
    try:
        response = requests.get("https://urlhaus-api.abuse.ch/v1/urls/recent/", timeout=10)
        urls = response.json().get('urls', [])
        
        data = []
        for item in urls:
            url = item.get('url', '')
            date_added = item.get('date_added')
            
            # Extraindo features para o IsolationForest
            feat1 = len(url) # Tamanho da URL
            feat2 = sum(not c.isalnum() for c in url) # Caracteres especiais
            
            data.append({'Hora': date_added, 'Característica 1': feat1, 'Característica 2': feat2, 'URL': url})
        
        df = pd.DataFrame(data)
        df['Hora'] = pd.to_datetime(df['Hora'], errors='coerce')
        df = df.dropna(subset=['Hora']).sort_values('Hora')
        
        if df.empty:
            return gerar_dados_fallback()
        return df
    except:
        return gerar_dados_fallback()

app = dash.Dash(__name__, title="Dados na Segurança")

app.layout = html.Div(style={'backgroundColor': COLORS['background'], 'color': COLORS['text'], 'fontFamily': 'Open Sans, sans-serif', 'minHeight': '100vh', 'padding': '20px'}, children=[
    
    html.H1("Como Dados ajudam na Segurança", style={'textAlign': 'center', 'color': COLORS['accent'], 'fontFamily': 'Montserrat, sans-serif'}),
    html.P("Monitoramento de URLs ameaçadoras reais (URLhaus). O modelo de Machine Learning (Isolation Forest) detecta as anomalias estruturais nas URLs maliciosas.", style={'textAlign': 'center', 'marginBottom': '40px'}),
    
    dcc.Interval(id='interval', interval=5*60*1000, n_intervals=0),
    
    html.Div(style={'display': 'flex', 'justifyContent': 'center'}, children=[
        html.Div(className='graph-wrapper-large', children=[
            dcc.Graph(config={'displayModeBar': False}, id='scatter-chart')
        ])
    ]),
    
    html.Div(style={'textAlign': 'center', 'marginTop': '40px'}, children=[
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

@app.callback(
    Output('scatter-chart', 'figure'),
    Input('interval', 'n_intervals')
)
def update_graph(n):
    df = fetch_threats()
    
    model = IsolationForest(contamination=0.05, random_state=42)
    df['Anomaly'] = model.fit_predict(df[['Característica 1', 'Característica 2']])
    df['Status'] = df['Anomaly'].apply(lambda x: 'Ameaça Crítica' if x == -1 else 'Ameaça Padrão')
    
    fig_scatter = px.scatter(df, x='Característica 1', y='Característica 2', color='Status', 
                             color_discrete_map={'Ameaça Padrão': COLORS['accent'], 'Ameaça Crítica': COLORS['alert']},
                             title="Análise de URLs Maliciosas (Isolation Forest)",
                             hover_data=['URL'] if 'URL' in df.columns else None)
                             
    fig_scatter.update_layout(plot_bgcolor=COLORS['surface'], paper_bgcolor=COLORS['surface'], font_color=COLORS['text'],
                              xaxis_title="Tamanho da URL", yaxis_title="Quantidade de Caracteres Especiais")
    return fig_scatter

app.clientside_callback(
    "function(n) { if (n > 0) window.close(); return window.dash_clientside.no_update; }",
    dash.Output("fechar-aba", "id"),
    dash.Input("fechar-aba", "n_clicks"),
    prevent_initial_call=True
)

if __name__ == '__main__':
    app.run(debug=False, port=8051)
