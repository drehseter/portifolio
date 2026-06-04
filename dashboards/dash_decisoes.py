import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd
from faker import Faker
import numpy as np
import requests
from datetime import datetime, timedelta

# Inicializar o Faker para fallback
fake = Faker('pt_BR')

COLORS = {
    'background': '#0b1325',
    'surface': '#131d36',
    'text': '#f1f5f9',
    'accent': '#d4af37',
    'accent_hover': '#ecd171'
}

def gerar_dados_fallback():
    dates = pd.date_range(start='2020-01-01', end=datetime.today(), freq='M')
    values = np.random.uniform(0.1, 1.2, len(dates))
    return pd.DataFrame({'Data': dates, 'Valor': values})

def fetch_ipca():
    data_final = datetime.today().strftime('%d/%m/%Y')
    data_inicial = (datetime.today() - timedelta(days=365*5)).strftime('%d/%m/%Y')
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial={data_inicial}&dataFinal={data_final}"
    try:
        response = requests.get(url, timeout=10)
        df = pd.DataFrame(response.json())
        df.columns = ['Data', 'Valor']
        df['Data'] = pd.to_datetime(df['Data'], dayfirst=True)
        df['Valor'] = df['Valor'].astype(float)
        return df
    except:
        return gerar_dados_fallback()

app = dash.Dash(__name__, title="Dados na Tomada de Decisões")

app.layout = html.Div(style={'backgroundColor': COLORS['background'], 'color': COLORS['text'], 'fontFamily': 'Open Sans, sans-serif', 'minHeight': '100vh', 'padding': '20px'}, children=[
    
    html.H1("Como Dados podem ajudar na Tomada de Decisões", style={'textAlign': 'center', 'color': COLORS['accent'], 'fontFamily': 'Montserrat, sans-serif'}),
    html.P("Este dashboard demonstra dados reais de IPCA do Banco Central do Brasil para análise de tendências econômicas.", style={'textAlign': 'center', 'marginBottom': '40px'}),
    
    dcc.Interval(id='interval', interval=5*60*1000, n_intervals=0),
    
    html.Div(style={'display': 'flex', 'gap': '20px', 'flexWrap': 'wrap', 'justifyContent': 'center'}, children=[
        
        html.Div(className='graph-container', children=[
            dcc.Graph(config={'displayModeBar': False}, id='bar-chart')
        ]),
        
        html.Div(className='graph-container', children=[
            dcc.Graph(config={'displayModeBar': False}, id='line-chart')
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
    [Output('bar-chart', 'figure'),
     Output('line-chart', 'figure')],
    [Input('interval', 'n_intervals')]
)
def update_graphs(n):
    df = fetch_ipca()
    
    # Gráfico de Barras: IPCA Acumulado por Ano
    df_ano = df.groupby(df['Data'].dt.year)['Valor'].sum().reset_index()
    fig_bar = px.bar(df_ano, x='Data', y='Valor', title='IPCA Acumulado por Ano (%)', color_discrete_sequence=[COLORS['accent']])
    fig_bar.update_layout(plot_bgcolor=COLORS['surface'], paper_bgcolor=COLORS['surface'], font_color=COLORS['text'])
    
    # Gráfico de Linhas: Tendência Mensal
    fig_line = px.line(df, x='Data', y='Valor', title='Tendência Mensal do IPCA (%)', color_discrete_sequence=[COLORS['accent_hover']])
    fig_line.update_layout(plot_bgcolor=COLORS['surface'], paper_bgcolor=COLORS['surface'], font_color=COLORS['text'])
    
    return fig_bar, fig_line

app.clientside_callback(
    "function(n) { if (n > 0) window.close(); return window.dash_clientside.no_update; }",
    dash.Output("fechar-aba", "id"),
    dash.Input("fechar-aba", "n_clicks"),
    prevent_initial_call=True
)

if __name__ == '__main__':
    app.run(debug=False, port=8050)
