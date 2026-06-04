import os
from PIL import Image, ImageDraw, ImageFont

# Cores
bg_color = (11, 19, 37)  # #0b1325
surface_color = (19, 29, 54) # #131d36
accent_color = (212, 175, 55) # #d4af37
text_color = (241, 245, 249) # #f1f5f9
muted_color = (148, 163, 184) # #94a3b8

width, height = 800, 600

def create_base_image():
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    # Desenhar um cabeçalho falso
    draw.rectangle([0, 0, width, 60], fill=surface_color)
    # Desenhar grid sutil
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 10), width=1)
    return img, draw

def draw_bar_chart(draw, x_start, y_start, w, h, bars, color):
    draw.rectangle([x_start, y_start, x_start+w, y_start+h], fill=surface_color, outline=(255,255,255,30), width=1)
    bar_width = (w - 40) // len(bars)
    for i, val in enumerate(bars):
        bar_h = int((val / 100) * (h - 40))
        bx1 = x_start + 20 + i * bar_width + 10
        by1 = y_start + h - 20 - bar_h
        bx2 = bx1 + bar_width - 20
        by2 = y_start + h - 20
        draw.rectangle([bx1, by1, bx2, by2], fill=color)

def draw_line_chart(draw, x_start, y_start, w, h, points, color):
    draw.rectangle([x_start, y_start, x_start+w, y_start+h], fill=surface_color, outline=(255,255,255,30), width=1)
    if not points: return
    x_step = (w - 40) / (len(points) - 1) if len(points) > 1 else 0
    px = [x_start + 20 + i * x_step for i in range(len(points))]
    py = [y_start + h - 20 - int((v / 100) * (h - 40)) for v in points]
    for i in range(len(points) - 1):
        draw.line([(px[i], py[i]), (px[i+1], py[i+1])], fill=color, width=4)
        draw.ellipse([px[i]-4, py[i]-4, px[i]+4, py[i]+4], fill=text_color)
    draw.ellipse([px[-1]-4, py[-1]-4, px[-1]+4, py[-1]+4], fill=text_color)

# 1. Dashboard de Decisões
img1, draw1 = create_base_image()
draw_bar_chart(draw1, 50, 100, 700, 200, [40, 60, 30, 80, 95, 50, 70], accent_color)
draw_line_chart(draw1, 50, 330, 330, 220, [20, 35, 30, 50, 80, 75], (100, 150, 255))
draw_line_chart(draw1, 420, 330, 330, 220, [80, 70, 50, 60, 40, 20], (255, 100, 100))
# Texto falso simulado (linhas brancas)
for i in range(3):
    draw1.rectangle([50, 20 + i*15, 200, 25 + i*15], fill=muted_color)

# 2. Dashboard de Segurança
img2, draw2 = create_base_image()
# Desenhar anomalias
draw_line_chart(draw2, 50, 100, 700, 250, [10, 15, 12, 80, 14, 11, 90, 15, 10, 12], accent_color)
# Pontos vermelhos para anomalias
draw2.ellipse([50+20+3*(700-40)/9 - 8, 100+250-20-int(80/100*210)-8, 50+20+3*(700-40)/9 + 8, 100+250-20-int(80/100*210)+8], fill=(255, 50, 50))
draw2.ellipse([50+20+6*(700-40)/9 - 8, 100+250-20-int(90/100*210)-8, 50+20+6*(700-40)/9 + 8, 100+250-20-int(90/100*210)+8], fill=(255, 50, 50))
# Falsos logs
draw2.rectangle([50, 380, 750, 550], fill=surface_color, outline=(255,255,255,30))
for i in range(5):
    color = (255, 50, 50) if i in [1, 3] else muted_color
    draw2.rectangle([70, 400 + i*25, 600, 410 + i*25], fill=color)

# 3. Dashboard IA
img3, draw3 = create_base_image()
# Scatter / rede
draw3.rectangle([50, 100, 380, 550], fill=surface_color, outline=(255,255,255,30))
nodes = [(150, 200), (280, 250), (120, 350), (300, 450), (200, 500), (220, 300)]
for i in range(len(nodes)):
    for j in range(i+1, len(nodes)):
        draw3.line([nodes[i], nodes[j]], fill=accent_color, width=2)
for nx, ny in nodes:
    draw3.ellipse([nx-10, ny-10, nx+10, ny+10], fill=(100, 200, 255))

draw_bar_chart(draw3, 420, 100, 330, 210, [85, 90, 88, 92, 95], (100, 255, 100))
draw_line_chart(draw3, 420, 340, 330, 210, [10, 20, 40, 60, 85, 95], accent_color)

# Salvar imagens
output_dir = '../src'
os.makedirs(output_dir, exist_ok=True)
img1.save(os.path.join(output_dir, 'thumb_decisoes.png'))
img2.save(os.path.join(output_dir, 'thumb_seguranca.png'))
img3.save(os.path.join(output_dir, 'thumb_ia.png'))

print("Miniaturas geradas com sucesso em src/")
