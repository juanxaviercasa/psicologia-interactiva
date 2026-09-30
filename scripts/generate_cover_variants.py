import os
from PIL import Image
import colorsys

# Directorio base
base_dir = r"C:\Users\cabel\Pictures\Libros_Interactivos"
output_dir = os.path.join(base_dir, "assets", "img", "covers")
os.makedirs(output_dir, exist_ok=True)

# Ruta de la imagen maestra (cambiar nombre según sea necesario)
master_image_path = r"C:\Users\cabel\.gemini\antigravity-ide\brain\0b775a47-405e-4d72-8e87-d2e9c2cfc420\cover_purple_geometry_1789314385985.jpg"

if not os.path.exists(master_image_path):
    print(f"Error: {master_image_path} no existe.")
    exit(1)

img = Image.open(master_image_path).convert('RGBA')

# Convertir imagen a HSV y aplicar variaciones de tono (hue)
def shift_hue(image, amount):
    if amount == 0:
        return image
    
    # Extraer canales
    r, g, b, a = image.split()
    r = list(r.getdata())
    g = list(g.getdata())
    b = list(b.getdata())
    
    new_r = []
    new_g = []
    new_b = []
    
    for i in range(len(r)):
        # Convertir RGB a HSV (en rango 0-1)
        h, s, v = colorsys.rgb_to_hsv(r[i]/255.0, g[i]/255.0, b[i]/255.0)
        # Desplazar Hue
        h = (h + amount) % 1.0
        # Convertir de vuelta a RGB
        nr, ng, nb = colorsys.hsv_to_rgb(h, s, v)
        new_r.append(int(nr * 255))
        new_g.append(int(ng * 255))
        new_b.append(int(nb * 255))
        
    out_r = Image.new('L', image.size)
    out_r.putdata(new_r)
    out_g = Image.new('L', image.size)
    out_g.putdata(new_g)
    out_b = Image.new('L', image.size)
    out_b.putdata(new_b)
    
    return Image.merge('RGBA', (out_r, out_g, out_b, a))

# Lista de desplazamientos de Hue (0.0 a 1.0)
# Esto generará variaciones de color espectaculares del diseño base.
hue_shifts = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

print("Generando 10 variaciones optimizadas en WebP...")

for i, shift in enumerate(hue_shifts):
    print(f"  Procesando variante {i+1}/10 (Hue: {shift})...")
    # Aplicar shift
    shifted_img = shift_hue(img, shift)
    
    # Redimensionar ligeramente para optimizar (ej. max ancho 600px)
    max_width = 600
    if shifted_img.width > max_width:
        ratio = max_width / shifted_img.width
        new_size = (max_width, int(shifted_img.height * ratio))
        shifted_img = shifted_img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Convertir a RGB puro antes de guardar a WebP
    final_img = shifted_img.convert('RGB')
    
    # Guardar optimizado
    output_path = os.path.join(output_dir, f"cover_{i+1}.webp")
    final_img.save(output_path, "webp", quality=80, method=4)
    print(f"    Guardado: {output_path}")

print("¡Listo! Las 10 imágenes maestras están generadas y optimizadas.")
