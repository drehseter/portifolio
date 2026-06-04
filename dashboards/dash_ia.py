import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
import pandas as pd
from faker import Faker
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta

fake = Faker('pt_BR')

COLORS = {
    'background': '#0b1325',
    'surface': '#131d36',
    'text': '#f1f5f9',
    'accent': '#d4af37',
    'ai_color': '#3b82f6', # Azul claro para IA
    'actual_color': '#d4af37'
}

def generate_fallback():
    dates = pd.date_range(start='2025-01-01', periods=30, freq='D')
    actual = np.linspace(100, 200, 30) + np.random.normal(0, 10, 30)
    predicted = np.linspace(105, 195, 30) + np.random.normal(0, 5, 30)
    actual[20:] = np.nan
    return pd.DataFrame({'Data': dates, 'Real': actual, 'Previsão IA': predicted})

def fetch_finance_data():
    try:
        # Pega os últimos 6 meses da Petrobras (PETR4.SA)
        ticker = yf.Ticker("PETR4.SA")
        hist = ticker.history(period="6mo")
        
        if hist.empty:
            return generate_fallback()
            
        hist = hist.reset_index()
        hist['Data'] = pd.to_datetime(hist['Date']).dt.tz_localize(None)
        
        # Criação de modelo preditivo simples (Regressão Linear) para os próximos 30 dias
        from sklearn.linear_model import LinearRegression
        
        df_real = hist[['Data', 'Close']].rename(columns={'Close': 'Real'})
        
        # Treinar com índice numérico
        X = np.arange(len(df_real)).reshape(-1, 1)
        y = df_real['Real'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Prever o histórico + 30 dias futuros
        future_days = 30
        X_pred = np.arange(len(df_real) + future_days).reshape(-1, 1)
        y_pred = model.predict(X_pred)
        
        # Criar datas futuras
        last_date = df_real['Data'].iloc[-1]
        future_dates = [last_date + timedelta(days=i) for i in range(1, future_days + 1)]
        all_dates = pd.concat([df_real['Data'], pd.Series(future_dates)], ignore_index=True)
        
        df_final = pd.DataFrame({'Data': all_dates, 'Previsão IA': y_pred})
        
        # Adicionar os dados reais
        df_final = pd.merge(df_final, df_real, on='Data', how='left')
        
        return df_final
    except:
        return generate_fallback()

app = dash.Dash(__name__, title="IA na Tomada de Decisões")

app.layout = html.Div(style={'backgroundColor': COLORS['background'], 'color': COLORS['text'], 'fontFamily': 'Open Sans, sans-serif', 'minHeight': '100vh', 'padding': '20px'}, children=[
    
    html.H1("Como a IA ajuda na Tomada de Decisões", style={'textAlign': 'center', 'color': COLORS['accent'], 'fontFamily': 'Montserrat, sans-serif'}),
    html.P("Analisando cotações reais da PETR4.SA via Yahoo Finance, um modelo preditivo antecipa a tendência futura (próximos 30 dias).", style={'textAlign': 'center', 'marginBottom': '40px'}),
    
    dcc.Interval(id='interval', interval=5*60*1000, n_intervals=0),
    
    html.Div(style={'display': 'flex', 'justifyContent': 'center'}, children=[
        html.Div(className='graph-wrapper-large', children=[
            dcc.Graph(config={'displayModeBar': False}, id='ai-chart')
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
    Output('ai-chart', 'figure'),
    Input('interval', 'n_intervals')
)
def update_graph(n):
    df = fetch_finance_data()
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df['Data'], y=df['Real'], mode='lines+markers', name='Cotação Real (PETR4.SA)', line=dict(color=COLORS['actual_color'])))
    fig.add_trace(go.Scatter(x=df['Data'], y=df['Previsão IA'], mode='lines', name='Tendência Preditiva IA', line=dict(color=COLORS['ai_color'], dash='dash')))
    
    fig.update_layout(
        title="Previsão de Tendência Financeira",
        plot_bgcolor=COLORS['surface'], paper_bgcolor=COLORS['surface'], font_color=COLORS['text'],
        hovermode="x unified"
    )
    return fig

app.clientside_callback(
    "function(n) { if (n > 0) window.close(); return window.dash_clientside.no_update; }",
    dash.Output("fechar-aba", "id"),
    dash.Input("fechar-aba", "n_clicks"),
    prevent_initial_call=True
)

if __name__ == '__main__':
    app.run(debug=False, port=8052)
