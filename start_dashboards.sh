#!/bin/bash
VENV=/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards/venv/bin/python
DIR=/home/dreh_sete/Documents/Portifolio/portifolio-main/dashboards

$VENV $DIR/dash_decisoes.py &
$VENV $DIR/dash_seguranca.py &
$VENV $DIR/dash_ia.py &

echo "Dashboards rodando em:"
echo "  http://127.0.0.1:8050"
echo "  http://127.0.0.1:8051"
echo "  http://127.0.0.1:8052"
