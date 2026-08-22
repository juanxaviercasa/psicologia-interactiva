import os
import re
import json

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'

ACCENT_FIXES = [
    (r'\bdeclaracion\b', 'declaración'),
    (r'\bduplicacion\b', 'duplicación'),
    (r'\breproduccion\b', 'reproducción'),
    (r'\btransmision\b', 'transmisión'),
    (r'\bcontinuacion\b', 'continuación'),
    (r'\bsituacion\b', 'situación'),
    (r'\bsituaciones\b', 'situaciones'),
    (r'\bgarantia\b', 'garantía'),
    (r'\bgarantias\b', 'garantías'),
    (r'\bprocrastinacion\b', 'procrastinación'),
    (r'\bantiguedad\b', 'antigüedad'),
    (r'\bdisenados\b', 'diseñados'),
    (r'\bdisenado\b', 'diseñado'),
    (r'\bdisenada\b', 'diseñada'),
    (r'\bdisenadas\b', 'diseñadas'),
    (r'\bcomenzo\b', 'comenzó'),
    (r'\bevolucion\b', 'evolución'),
    (r'\bdescubrio\b', 'descubrió'),
    (r'\bconvirtio\b', 'convirtió'),
    (r'\blinea\b', 'línea'),
    (r'\blineas\b', 'líneas'),
    (r'\bunica\b', 'única'),
    (r'\bunicas\b', 'únicas'),
    (r'\bunico\b', 'único'),
    (r'\bunicos\b', 'únicos'),
    (r'\bautonomos\b', 'autónomos'),
    (r'\bautonomo\b', 'autónomo'),
    (r'\bautonoma\b', 'autónoma'),
    (r'\bautonomas\b', 'autónomas'),
    (r'\bdecision\b', 'decisión'),
    (r'\bdecisiones\b', 'decisiones'),
    (r'\belectricos\b', 'eléctricos'),
    (r'\belectrico\b', 'eléctrico'),
    (r'\belectrica\b', 'eléctrica'),
    (r'\belectricas\b', 'eléctricas'),
    (r'\bquimica\b', 'química'),
    (r'\bquimico\b', 'químico'),
    (r'\bquimicos\b', 'químicos'),
    (r'\bquimicas\b', 'químicas'),
    (r'\balegria\b', 'alegría'),
    (r'\brecien\b', 'recién'),
    (r'\bnumeros\b', 'números'),
    (r'\bnumero\b', 'número'),
    (r'\bcientifico\b', 'científico'),
    (r'\bcientifica\b', 'científica'),
    (r'\bcientificos\b', 'científicos'),
    (r'\bcientificas\b', 'científicas'),
    (r'\bbiologico\b', 'biológico'),
    (r'\bbiologica\b', 'biológica'),
    (r'\bbiologicos\b', 'biológicos'),
    (r'\bbiologicas\b', 'biológicas'),
    (r'\bbasico\b', 'básico'),
    (r'\bbasica\b', 'básica'),
    (r'\bbasicos\b', 'básicos'),
    (r'\bbasicas\b', 'básicas'),
    (r'\btecnologia\b', 'tecnología'),
    (r'\btecnologias\b', 'tecnologías'),
    (r'\bsolida\b', 'sólida'),
    (r'\bsolido\b', 'sólido'),
    (r'\bsolidos\b', 'sólidos'),
    (r'\bsolidas\b', 'sólidas'),
    (r'\bpodra\b', 'podrá'),
    (r'\bpodran\b', 'podrán'),
    (r'\bhara\b', 'hará'),
    (r'\bharan\b', 'harán'),
    (r'\bactua\b', 'actúa'),
    (r'\bactuan\b', 'actúan'),
    (r'\bguia\b', 'guía'),
    (r'\bGuia\b', 'Guía'),
    (r'\bguias\b', 'guías'),
    (r'\bGuias\b', 'Guías'),
    (r'\brelacion\b', 'relación'),
    (r'\brelaciones\b', 'relaciones'),
    (r'\bcomunicacion\b', 'comunicación'),
    (r'\bobservacion\b', 'observación'),
    (r'\bexplicacion\b', 'explicación'),
    (r'\bexplicaciones\b', 'explicaciones'),
    (r'\bprediccion\b', 'predicción'),
    (r'\bpredicciones\b', 'predicciones'),
    (r'\bfuncion\b', 'función'),
    (r'\bfunciones\b', 'funciones'),
    (r'\bvision\b', 'visión'),
    (r'\bposicion\b', 'posición'),
    (r'\bcondicion\b', 'condición'),
    (r'\bcondiciones\b', 'condiciones'),
    (r'\baccion\b', 'acción'),
    (r'\bacciones\b', 'acciones'),
    (r'\breaccion\b', 'reacción'),
    (r'\breacciones\b', 'reacciones'),
    (r'\bproceso\b', 'proceso'),
    (r'\bprocesos\b', 'procesos'),
    (r'\bpatron\b', 'patrón'),
    (r'\bpatrones\b', 'patrones'),
    (r'\bcorazon\b', 'corazón'),
    (r'\bpresion\b', 'presión'),
    (r'\btension\b', 'tensión'),
    (r'\bdepresion\b', 'depresión'),
    (r'\bcompasion\b', 'compasión'),
    (r'\bvalida\b', 'válida'),
    (r'\bvalido\b', 'válido'),
    (r'\bambito\b', 'ámbito'),
    (r'\bterapéutica\b', 'terapéutica'),
    (r'\bterapéutico\b', 'terapéutico'),
    (r'\bterapéuticos\b', 'terapéuticos'),
    (r'\bterapéuticas\b', 'terapéuticas'),
    (r'\bterapeutica\b', 'terapéutica'),
    (r'\bterapeutico\b', 'terapéutico'),
    (r'\bterapeuticos\b', 'terapéuticos'),
    (r'\bterapeuticas\b', 'terapéuticas'),
    (r'\bfilosofica\b', 'filosófica'),
    (r'\bfilosofico\b', 'filosófico'),
    (r'\bfilosoficos\b', 'filosóficos'),
    (r'\bfilosoficas\b', 'filosóficas'),
    (r'\bfilosofia\b', 'filosofía'),
    (r'\bempatia\b', 'empatía'),
    (r'\benergia\b', 'energía'),
    (r'\baronia\b', 'agonía'),
    (r'\barmonia\b', 'armonía'),
    (r'\bautonomia\b', 'autonomía'),
    (r'\bjerarquia\b', 'jerarquía'),
    (r'\bcategoria\b', 'categoría'),
    (r'\bcategorias\b', 'categorías'),
    (r'\bestrategia\b', 'estrategia'),
    (r'\bestrategias\b', 'estrategias'),
    (r'\bestrategico\b', 'estratégico'),
    (r'\bestrategica\b', 'estratégica'),
    (r'\bestrategicos\b', 'estratégicos'),
    (r'\bestrategicas\b', 'estratégicas')
]

files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
files.sort()

clean_dict = {}

for f in files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()

    for pat, rep in ACCENT_FIXES:
        text = re.sub(pat, rep, text)

    # Save cleaned file
    with open(path, 'w', encoding='utf-8') as out_fh:
        out_fh.write(text.strip())

    key = f.replace('.md', '')
    clean_dict[key] = text.strip()

# Recompile JS
js_code = "var BOOK_CONTENT = " + json.dumps(clean_dict, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Gramática y acentuación perfeccionada en los {len(clean_dict)} archivos.")
