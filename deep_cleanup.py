import os
import re
import json

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'

print("=== INICIANDO LIMPIEZA PROFUNDA Y REESTRUCTURACIÓN EDITORIAL ===")

# DICCIONARIO EXHAUSTIVO DE SUSTITUCIONES Y CORRECCIONES EN ESPAÑOL
REPLACEMENTS = [
    # Metadatos y Autor
    (r'\b\*{0,3}###\s*Por Benedict Goleman\*{0,3}([A-ZÁÉÍÓÚa-z])', r'### Por Benedict Goleman\n\n\1'),
    (r'\bBENEDICT GOELMAN([A-ZÁÉÍÓÚa-z])', r'### Por Benedict Goleman\n\n\1'),
    (r'\bBENEDICT GOELMAN\b', '### Por Benedict Goleman'),
    (r'\bBenedict Goleman([A-ZÁÉÍÓÚa-z])', r'Benedict Goleman\n\n\1'),
    
    # Erratas graves de OCR
    (r'\bused\b', 'usted'),
    (r'\bUsed\b', 'Usted'),
    (r'\bal al\b', 'al'),
    (r'\bparal que\b', 'para el que'),
    (r'\bdejar aal\b', 'dejar al'),
    (r'\bse seabe\b', 'se sabe'),
    (r'\bveecs\b', 'veces'),
    (r'\bEscaere s\b', 'Escáneres'),
    (r'\bspicologos\b', 'psicólogos'),
    (r'\bspicologia\b', 'psicología'),
    (r'\bspique\b', 'psique'),
    (r'\bpisque\b', 'psique'),
    (r'\bpiscosis\b', 'psicosis'),
    (r'\binstitos\b', 'instintos'),
    (r'\binstitivas\b', 'instintivas'),
    (r'\bentrenraner\b', 'entrenar'),
    (r'\beticazmente\b', 'eficazmente'),
    (r'\bdesalntar\b', 'desalentar'),
    (r'\bovidar\b', 'olvidar'),
    (r'\bsares superieores\b', 'seres superiores'),
    (r'\bsingiedad\b', 'ansiedad'),
    (r'\bsingedad\b', 'ansiedad'),
    (r'\bsinguiedad\b', 'ansiedad'),
    (r'\banisiedad\b', 'ansiedad'),
    (r'\bAnisiedad\b', 'Ansiedad'),
    (r'\bobesesion\b', 'obsesión'),
    (r'\bobesesivo\b', 'obsesivo'),
    (r'\bobesesivos\b', 'obsesivos'),
    (r'\bcerebo\b', 'cerebro'),
    (r'\bspicodinamico\b', 'psicodinámico'),
    (r'\bspicodinamica\b', 'psicodinámica'),
    (r'\bspicoanalisis\b', 'psicoanálisis'),
    (r'\bexpressarlo\b', 'expresarlo'),
    (r'\banunque\b', 'aunque'),
    (r'\bAnunque\b', 'Aunque'),
    (r'\brepressalia\b', 'represalia'),
    (r'\bcomprenison\b', 'comprensión'),
    (r'\bComprenison\b', 'Comprensión'),
    (r'\bescalva\b', 'esclava'),
    (r'\bconviriteran\b', 'convirtieran'),
    (r'\bconviritera\b', 'convirtiera'),
    (r'\bconvirette\b', 'conviértete'),
    (r'\bConvirette\b', 'Conviértete'),
    (r'\bproducucen\b', 'producen'),
    (r'\bimpaciales\b', 'imparciales'),
    (r'\btransmisision\b', 'transmisión'),
    (r'\bjueegan\b', 'juegan'),
    (r'\bcresen\b', 'crecen'),
    (r'\bcrescio\b', 'creció'),
    (r'\bdesconcentado\b', 'desconcentrado'),
    (r'\bcontolar\b', 'controlar'),
    (r'\bcentralre\b', 'centrarse'),
    (r'\bcentralanose\b', 'centrándose'),
    (r'\bsignificia\b', 'significa'),
    (r'\bsignificicar\b', 'significar'),
    (r'\bdiffundiendo\b', 'difundiendo'),
    (r'\bdifficultad\b', 'dificultad'),
    (r'\bdifferencia\b', 'diferencia'),
    (r'\bcantiidad\b', 'cantidad'),
    (r'\bposibilitades\b', 'posibilidades'),
    (r'\bintrosppeccion\b', 'introspección'),
    (r'\binteractias\b', 'interactúas'),
    (r'\bpresentza\b', 'presenta'),
    (r'\bsentiminetos\b', 'sentimientos'),
    (r'\bsentiminento\b', 'sentimiento'),
    (r'\bspico\b', 'psico'),
    (r'\bP\*{3,4}SICOLOGIA\b', 'PSICOLOGÍA'),
    (r'\bpiscologia\b', 'psicología'),
    (r'\bPiscologia\b', 'Psicología'),
    (r'\bpscicologia\b', 'psicología'),
    (r'\bPscicologia\b', 'Psicología'),
    (r'\bpiscologos\b', 'psicólogos'),
    (r'\bPiscologos\b', 'Psicólogos'),
    (r'\bpiscologica\b', 'psicológica'),
    (r'\bPiscologica\b', 'Psicológica'),
    (r'\bpiscologico\b', 'psicológico'),
    (r'\bPiscologico\b', 'Psicológico'),
    (r'\bpiscologicos\b', 'psicológicos'),
    (r'\bPiscologicos\b', 'Psicológicos'),
    (r'\bpiscologicas\b', 'psicológicas'),
    (r'\bPiscologicas\b', 'Psicológicas'),

    # Restauración sistemática de la letra Ñ
    (r'\banos\b', 'años'),
    (r'\bAnos\b', 'Años'),
    (r'\bano\b', 'año'),
    (r'\bAno\b', 'Año'),
    (r'\bninos\b', 'niños'),
    (r'\bNinos\b', 'Niños'),
    (r'\bnino\b', 'niño'),
    (r'\bNino\b', 'Niño'),
    (r'\bnina\b', 'niña'),
    (r'\bNina\b', 'Niña'),
    (r'\bninas\b', 'niñas'),
    (r'\bNinas\b', 'Niñas'),
    (r'\bdano\b', 'daño'),
    (r'\bDano\b', 'Daño'),
    (r'\bdanos\b', 'daños'),
    (r'\bDanos\b', 'Daños'),
    (r'\bengano\b', 'engaño'),
    (r'\bEngano\b', 'Engaño'),
    (r'\benganar\b', 'engañar'),
    (r'\benganoso\b', 'engañoso'),
    (r'\benganosa\b', 'engañosa'),
    (r'\btamano\b', 'tamaño'),
    (r'\bTamano\b', 'Tamaño'),
    (r'\btamanos\b', 'tamaños'),
    (r'\bpequeno\b', 'pequeño'),
    (r'\bPequeno\b', 'Pequeño'),
    (r'\bpequena\b', 'pequeña'),
    (r'\bPequena\b', 'Pequeña'),
    (r'\bpequenos\b', 'pequeños'),
    (r'\bPequenos\b', 'Pequeños'),
    (r'\bpequenas\b', 'pequeñas'),
    (r'\bPequenas\b', 'Pequeñas'),
    (r'\bensenaba\b', 'enseñaba'),
    (r'\bensenanza\b', 'enseñanza'),
    (r'\bcompania\b', 'compañía'),
    (r'\bCompania\b', 'Compañía'),
    (r'\bresena\b', 'reseña'),

    # Acentuación común y gramática
    (r'\bIntroduccion\b', 'Introducción'),
    (r'\bintroduccion\b', 'introducción'),
    (r'\bPsicologia\b', 'Psicología'),
    (r'\bpsicologia\b', 'psicología'),
    (r'\bPsicologico\b', 'Psicológico'),
    (r'\bpsicologico\b', 'psicológico'),
    (r'\bPsicologica\b', 'Psicológica'),
    (r'\bpsicologica\b', 'psicológica'),
    (r'\bPsicologicos\b', 'Psicológicos'),
    (r'\bpsicologicos\b', 'psicológicos'),
    (r'\bPsicologicas\b', 'Psicológicas'),
    (r'\bpsicologicas\b', 'psicológicas'),
    (r'\bPsicologo\b', 'Psicólogo'),
    (r'\bpsicologo\b', 'psicólogo'),
    (r'\bPsicologos\b', 'Psicólogos'),
    (r'\bpsicologos\b', 'psicólogos'),
    (r'\bInformacion\b', 'Información'),
    (r'\binformacion\b', 'información'),
    (r'\bConclusion\b', 'Conclusión'),
    (r'\bconclusion\b', 'conclusión'),
    (r'\bTambien\b', 'También'),
    (r'\btambien\b', 'también'),
    (r'\bAdemas\b', 'Además'),
    (r'\bademas\b', 'además'),
    (r'\bDespues\b', 'Después'),
    (r'\bdespues\b', 'después'),
    (r'\butil\b', 'útil'),
    (r'\butiles\b', 'útiles'),
    (r'\bfacil\b', 'fácil'),
    (r'\bfaciles\b', 'fáciles'),
    (r'\bdificil\b', 'difícil'),
    (r'\bdificiles\b', 'difíciles'),
    (r'\bproposito\b', 'propósito'),
    (r'\bespecifico\b', 'específico'),
    (r'\bespecifica\b', 'específica'),
    (r'\bespecificos\b', 'específicos'),
    (r'\bespecificas\b', 'específicas'),
    (r'\bpractica\b', 'práctica'),
    (r'\bpracticas\b', 'prácticas'),
    (r'\bexposicion\b', 'exposición'),
    (r'\breaccion\b', 'reacción'),
    (r'\breacciones\b', 'reacciones'),
    (r'\bsituacion\b', 'situación'),
    (r'\bsituaciones\b', 'situaciones'),
    (r'\bemocion\b', 'emoción'),
    (r'\bEmocion\b', 'Emoción'),
    (r'\bemociones\b', 'emociones'),
    (r'\bEmociones\b', 'Emociones'),
    (r'\bregulacion\b', 'regulación'),
    (r'\bRegulacion\b', 'Regulación'),
    (r'\bafirmacion\b', 'afirmación'),
    (r'\bafirmaciones\b', 'afirmaciones'),
    (r'\bpersuasion\b', 'persuasión'),
    (r'\bPersuasion\b', 'Persuasión'),
    (r'\bmanipulacion\b', 'manipulación'),
    (r'\bManipulacion\b', 'Manipulación'),
    (r'\bconexion\b', 'conexión'),
    (r'\bconexiones\b', 'conexiones'),
    (r'\bintencion\b', 'intención'),
    (r'\bintenciones\b', 'intenciones'),
    (r'\batencion\b', 'atención'),
    (r'\bAtencion\b', 'Atención'),
    (r'\bfisiologico\b', 'fisiológico'),
    (r'\bfisiologica\b', 'fisiológica'),
    (r'\bbiologico\b', 'biológico'),
    (r'\bbiologica\b', 'biológica'),
    (r'\bquimico\b', 'químico'),
    (r'\bquimica\b', 'química'),
    (r'\bteoria\b', 'teoría'),
    (r'\bteorias\b', 'teorías'),
    (r'\bfilosofia\b', 'filosofía'),
    (r'\bfilosofico\b', 'filosófico'),
    (r'\bfilosofica\b', 'filosófica'),
    (r'\bfilosoficos\b', 'filosóficos'),
    (r'\bjuridicamente\b', 'jurídicamente'),
    (r'\bexito\b', 'éxito'),
    (r'\bterapeutico\b', 'terapéutico'),
    (r'\bterapeutica\b', 'terapéutica'),
    (r'\bterapeuticos\b', 'terapéuticos'),
    (r'\bterapeuticas\b', 'terapéuticas'),

    # Signos y fórmulas rotas de OCR
    (r'\[MISSING_PAGE_FAIL:\d+\]', ''),
    (r'\\\({}_{i}\\\)', '¡'),
    (r'\\\({}^{\\rm VI}\\\)', 'VI'),
    (r'\\\(\\underline{\\iota}\\\)', '¿'),
    (r'\?{3,}', '¿'),
    (r'\?Se ha preguntado', '¿Se ha preguntado'),
    (r'\?que ocurre', '¿qué ocurre'),
    (r'\?O que les hace', '¿O qué les hace'),
    (r'\?Qué\b', '¿Qué'),
    (r'\?Por qué\b', '¿Por qué'),
    (r'\?Cómo\b', '¿Cómo'),
    (r'\?Cuándo\b', '¿Cuándo'),
    (r'\?Quién\b', '¿Quién')
]

# TRANSFORMACIÓN ESTRUCTURAL DE ENCABEZADOS Y CAPÍTULOS
def restructure_headings(text):
    # 1. Convertir **Capitulo X: Nombre** o **Capítulo X: Nombre** en encabezados formales H2
    text = re.sub(r'\n*\*\*Cap[ií]tulo\s*(\d+)\s*:\s*(.*?)\*\*\n*', r'\n\n## 📖 Capítulo \1: \2\n\n', text, flags=re.IGNORECASE)
    
    # 2. Asegurar que ## y ### tengan doble salto de línea antes y después
    text = re.sub(r'([^\n])\n(#{1,4}\s+[^\n]+)', r'\1\n\n\2', text)
    text = re.sub(r'(#{1,4}\s+[^\n]+)\n([^\n#])', r'\1\n\n\2', text)
    
    # 3. Arreglar títulos pegados al inicio de archivos
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        # Si una línea empieza con **TÍTULO** y es corta, darle espacio
        if stripped.startswith('**') and stripped.endswith('**') and len(stripped) < 60:
            cleaned_lines.append('\n' + stripped + '\n')
        else:
            cleaned_lines.append(line)
    text = '\n'.join(cleaned_lines)
    
    # 4. Normalizar múltiples saltos de línea a máximo 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

# PROCESAR CADA ARCHIVO MARKDOWN
files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
files.sort()

clean_book_dict = {}

for f in files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        raw = fh.read()
    
    # Aplicar diccionario de reemplazos
    processed = raw
    for pat, rep in REPLACEMENTS:
        processed = re.sub(pat, rep, processed)
    
    # Aplicar reestructuración de encabezados
    processed = restructure_headings(processed)
    
    # Guardar archivo limpio
    with open(path, 'w', encoding='utf-8') as out_fh:
        out_fh.write(processed)
    
    key = f.replace('.md', '')
    clean_book_dict[key] = processed

# RECOMPILAR JS/BOOK_CONTENT.JS
js_code = "var BOOK_CONTENT = " + json.dumps(clean_book_dict, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Limpieza profunda completada: {len(clean_book_dict)} archivos depurados con ortografía, 'ñ', acentos y encabezados H2.")

# ENRIQUECER CSS EN INDEX.HTML PARA UNA TIPOGRAFÍA EDITORIAL MODERNA
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

custom_reader_css = """
  <!-- CUSTOM EDITORIAL READER STYLING -->
  <style>
    .prose-editorial {
      font-size: 0.975rem;
      line-height: 1.85;
      color: #cbd5e1;
    }
    .prose-editorial h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
    }
    .prose-editorial h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #22d3ee;
      margin-top: 2.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(34, 211, 238, 0.2);
      letter-spacing: -0.015em;
    }
    .prose-editorial h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #818cf8;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
    }
    .prose-editorial p {
      margin-bottom: 1.25rem;
      text-align: justify;
    }
    .prose-editorial strong {
      color: #f1f5f9;
      font-weight: 700;
    }
    .prose-editorial em {
      color: #94a3b8;
      font-style: italic;
    }
    .prose-editorial ul {
      margin-top: 0.75rem;
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
      list-style-type: disc;
    }
    .prose-editorial li {
      margin-bottom: 0.5rem;
      padding-left: 0.25rem;
    }
    .prose-editorial blockquote {
      border-left: 4px solid #6366f1;
      background: rgba(99, 102, 241, 0.08);
      padding: 1rem 1.25rem;
      border-radius: 0 0.75rem 0.75rem 0;
      margin: 1.5rem 0;
      color: #c7d2fe;
      font-style: italic;
    }
  </style>
"""

if 'CUSTOM EDITORIAL READER STYLING' not in html:
    html = html.replace('</head>', custom_reader_css + '\n</head>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Inyectado CSS editorial de alta legibilidad en index.html")

# ACTUALIZAR APP.JS PARA APLICAR LA NUEVA CLASE PROSE-EDITORIAL
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace prose class with prose-editorial
app_js = app_js.replace('prose prose-invert prose-cyan max-w-none', 'prose-editorial max-w-none')
app_js = app_js.replace('prose prose-invert prose-indigo max-w-none', 'prose-editorial max-w-none')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Actualizado app.js con estilos prose-editorial.")

print("=== LIMPIEZA PROFUNDA FINALIZADA CON ÉXITO ===")
