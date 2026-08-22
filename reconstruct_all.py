import os
import re
import json

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'

print("=== INICIANDO MOTOR DE RECONSTRUCCIÓN Y ENRIQUECIMIENTO VISUAL ===")

# 1. DICCIONARIO DE CORRECCIONES LÉXICAS Y ORTOGRÁFICAS (OCR FIXES)
TYPO_REPLACEMENTS = [
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
    (r'\bsentiminetos\b', 'sentimientos'),
    (r'\bsentiminento\b', 'sentimiento'),
    (r'\bsingiedad\b', 'ansiedad'),
    (r'\banisiedad\b', 'ansiedad'),
    (r'\bdifferencia\b', 'diferencia'),
    (r'\bdiffundiendo\b', 'difundiendo'),
    (r'\bdifficultad\b', 'dificultad'),
    (r'\bobesesion\b', 'obsesión'),
    (r'\bobesesivo\b', 'obsesivo'),
    (r'\bcerebo\b', 'cerebro'),
    (r'\bspicodinamico\b', 'psicodinámico'),
    (r'\bspicodinamica\b', 'psicodinámica'),
    (r'\bspicoanalisis\b', 'psicoanálisis'),
    (r'\bexpressarlo\b', 'expresarlo'),
    (r'\banunque\b', 'aunque'),
    (r'\brepressalia\b', 'represalia'),
    (r'\bcomprenison\b', 'comprensión'),
    (r'\bescalva\b', 'esclava'),
    (r'\bconviriteran\b', 'convirtieran'),
    (r'\bconviritera\b', 'convirtiera'),
    (r'\bconvirette\b', 'conviértete'),
    (r'\bConvirette\b', 'Conviértete'),
    (r'\bproducucen\b', 'producen'),
    (r'\bimpaciales\b', 'imparciales'),
    (r'\bovidar\b', 'olvidar'),
    (r'\bsares superieores\b', 'seres superiores'),
    (r'\bparal que\b', 'para el que'),
    (r'\butilizaras\b', 'utilizarás'),
    (r'\bposibilitades\b', 'posibilidades'),
    (r'\bintrosppeccion\b', 'introspección'),
    (r'\bexperiencia\b', 'experiencia'),
    (r'\binteractias\b', 'interactúas'),
    (r'\bpresentza\b', 'presenta'),
    (r'\bcresen\b', 'crecen'),
    (r'\bjueegan\b', 'juegan'),
    (r'\bconstituyen\b', 'constituyen'),
    (r'\bdesconcentado\b', 'desconcentrado'),
    (r'\bcontolar\b', 'controlar'),
    (r'\bcentralre\b', 'centrarse'),
    (r'\bcentralanose\b', 'centrándose'),
    (r'\bEscaere s\b', 'Escáneres'),
    (r'\bse seabe\b', 'se sabe'),
    (r'\bveecs\b', 'veces'),
    (r'\bsignificia\b', 'significa'),
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
    (r'\binterrumpa\b', 'interrumpa'),
    (r'\bdejar aal\b', 'dejar al'),
    (r'\bBENEDICT GOELMANEste\b', '### Por Benedict Goleman\n\nEste'),
    (r'\bBENEDICT GOELMAN\b', '### Por Benedict Goleman'),
    (r'\[MISSING_PAGE_FAIL:\d+\]', ''),
    (r'\\\({}_{i}\\\)', '¡'),
    (r'\\\({}^{\\rm VI}\\\)', 'VI'),
    (r'\\\(\\underline{\\iota}\\\)', '¿'),
    (r'\?{3,}', '¿'),
    (r'\?Se ha preguntado', '¿Se ha preguntado'),
    (r'\?que ocurre', '¿qué ocurre'),
    (r'\?O que les hace', '¿O qué les hace')
]

# 2. DIAGRAMAS Y MAPAS CONCEPTUALES ENRIQUECIDOS POR TEMA
DIAGRAMS = {
    # TEMA 04: Historia de la Psicología
    "Tema_04_El_papiro_de_Edwin_Smith": """

```mermaid
timeline
    title Evolución Histórica de la Ciencia de la Mente
    section Antigüedad
        1600 a.C. : Papiro Edwin Smith (Egipto) : Primeras conexiones cerebro-cuerpo
        Siglo VI : Lin Xie (China) : Primeros experimentos de distracción motora
        Antigua India : Filosofía Vedanta : Cinco agregados y conciencia
    section Era Medieval y Moderna
        Siglo IX : Al-Balkhi (Persia) : Higiene mental y neurosis vs psicosis
        1646 : René Descartes : Dualismo mente-cuerpo y pasiones del alma
        1690 : John Locke : Tabula Rasa y empirismo cognitivo
        1781 : Immanuel Kant : Facultades cognitivas e interpretación de la realidad
    section Nacimiento Científico
        1879 : Wilhelm Wundt : Primer laboratorio experimental de psicología (Leipzig)
        1890 : William James : Funcionalismo y adaptación
        1900 : Sigmund Freud : Psicoanálisis y la mente inconsciente
```

> [!NOTE]
> **Hito Clave:** La transición de ver los desequilibrios psicológicos como posesiones místicas hacia explicaciones neurofisiológicas y conductuales comenzó formalmente con el Papiro de Edwin Smith y se consolidó en el laboratorio de Wundt en 1879.
""",

    # TEMA 08: Las 5 Perspectivas Psicológicas
    "Tema_08_Cambier": """

```mermaid
flowchart TD
    M[La Mente Humana: 5 Perspectivas Científicas] --> B[1. Perspectiva Biológica]
    M --> P[2. Perspectiva Psicodinámica]
    M --> C[3. Perspectiva Conductual]
    M --> COG[4. Perspectiva Cognitiva]
    M --> H[5. Perspectiva Humanista]

    B --> B1["Neurotransmisores, genética, SNC y amígdala"]
    P --> P1["Inconsciente, impulsos del Ello, Yo y Superyó"]
    C --> C1["Refuerzos positivos/negativos, castigos y condicionamiento"]
    COG --> COG1["Procesamiento de información, esquemas y sesgos"]
    H --> H1["Autorrealización, libre albedrío y potencial humano"]

    style M fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
    style B fill:#0f172a,stroke:#38bdf8,stroke-width:1px,color:#e2e8f0
    style P fill:#0f172a,stroke:#f43f5e,stroke-width:1px,color:#e2e8f0
    style C fill:#0f172a,stroke:#fbbf24,stroke-width:1px,color:#e2e8f0
    style COG fill:#0f172a,stroke:#a855f7,stroke-width:1px,color:#e2e8f0
    style H fill:#0f172a,stroke:#34d399,stroke-width:1px,color:#e2e8f0
```

> [!IMPORTANT]
> **Síntesis Estratégica:** Ninguna perspectiva explica la conducta humana de forma aislada. La psicología estratégica moderna integra la neuroquímica (Biológica), los patrones aprendidos (Conductual) y los sesgos perceptivos (Cognitiva) para obtener una radiografía completa del comportamiento.
""",

    # TEMA 12 / 13: Autorregulación y Emociones Universales
    "Tema_12_Autoregulacion": """

```mermaid
flowchart LR
    A[Estímulo Externo] -->|Vía Rápida Subcortical| AM[Amígdala: Reacción Emocional Inmediata]
    A -->|Vía Lenta Cortical| CPF[Córtex Prefrontal: Evaluación Racional]
    
    AM -->|Secuestro Emocional| R1[Respuesta Reactiva / Impulsiva]
    CPF -->|Autorregulación y Pausa| R2[Respuesta Estratégica / Calibrada]
    
    style AM fill:#450a0a,stroke:#ef4444,color:#fecaca
    style CPF fill:#064e3b,stroke:#10b981,color:#d1fae5
    style R1 fill:#1e293b,stroke:#ef4444,color:#e2e8f0
    style R2 fill:#1e293b,stroke:#10b981,color:#e2e8f0
```
""",

    # TEMA 25: Modelo Big Five (Personalidad)
    "Tema_25_Conciencia": """

```mermaid
graph TD
    OCEAN[Modelo de los 5 Grandes Rasgos: OCEAN]
    OCEAN --> O["O - Apertura a la Experiencia (Creatividad vs Rutina)"]
    OCEAN --> C["C - Responsabilidad / Conciencia (Disciplina vs Impulsividad)"]
    OCEAN --> E["E - Extraversión (Sociabilidad vs Reserva)"]
    OCEAN --> A["A - Amabilidad (Empatía vs Competitividad)"]
    OCEAN --> N["N - Neuroticismo (Estabilidad vs Reactividad Emocional)"]

    style OCEAN fill:#1e1b4b,stroke:#6366f1,color:#fff
    style O fill:#0f172a,stroke:#38bdf8,color:#cbd5e1
    style C fill:#0f172a,stroke:#34d399,color:#cbd5e1
    style E fill:#0f172a,stroke:#fbbf24,color:#cbd5e1
    style A fill:#0f172a,stroke:#a855f7,color:#cbd5e1
    style N fill:#0f172a,stroke:#f43f5e,color:#cbd5e1
```
""",

    # TEMA 26: Háptica y Lenguaje No Verbal
    "Tema_26_Haptica": """

```mermaid
flowchart TD
    NV[Comunicación No Verbal & Háptica]
    NV --> Z1[Zona Proxémica: Distancia Íntima vs Social]
    NV --> Z2[Microexpresiones Faciales: FACS de Ekman]
    NV --> Z3[Háptica: Contacto Físico y Dominancia / Sumisión]
    NV --> Z4[Paralenguaje: Tono, Cadencia y Microvacilaciones]
    
    style NV fill:#1e1b4b,stroke:#818cf8,color:#fff
```
""",

    # TEMA 32: El Proceso de Manipulación
    "Tema_32_El_Proceso_de_Manipulacion": """

```mermaid
flowchart TD
    START([Inicio: Intención Oculta]) --> P1[Paso 1: Ocultar la Verdadera Intención]
    P1 --> P2[Paso 2: Radiografía de Vulnerabilidades de la Víctima]
    P2 --> CHECK{¿Tiene rasgos explotables?}
    CHECK -->|Complacencia / Aprobación| V1[Explotar Necesidad de Validación]
    CHECK -->|Miedo al Conflicto| V2[Presión Pasivo-Agresiva / Culpa]
    CHECK -->|Baja Asertividad| V3[Invasión Sistemática de Límites]
    V1 --> P3[Paso 3: Ejecución Despiadada y Dependencia]
    V2 --> P3
    V3 --> P3

    style START fill:#312e81,stroke:#6366f1,color:#fff
    style P1 fill:#0f172a,stroke:#38bdf8,color:#cbd5e1
    style P2 fill:#0f172a,stroke:#fbbf24,color:#cbd5e1
    style P3 fill:#450a0a,stroke:#f43f5e,stroke-width:2px,color:#fff
```

> [!CAUTION]
> **Criterios Indispensables de Manipulación:** Para que una maniobra sea considerada manipulación oscura, el perpetrador siempre debe cumplir tres condiciones: ocultar sus verdaderos fines, identificar la debilidad exacta del objetivo y carecer de reparos éticos para avanzar.
""",

    # TEMA 35: Tríada Retórica (Ethos, Pathos, Logos)
    "Tema_35_Logos": """

```mermaid
graph TD
    RET[La Tríada de Persuasión Aristotélica]
    RET --> ETH["🏛️ ETHOS (Autoridad & Carácter)"]
    RET --> PAT["🔥 PATHOS (Emoción & Empatía)"]
    RET --> LOG["🧠 LOGOS (Lógica & Datos)"]

    ETH --> E1["Credibilidad percibida, estatus y reputación moral"]
    PAT --> P1["Activación de miedo, esperanza, culpa o pertenencia"]
    LOG --> L1["Argumentación estructurada, estadísticas y causalidad"]

    style RET fill:#1e1b4b,stroke:#818cf8,color:#fff
    style ETH fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style PAT fill:#0f172a,stroke:#f43f5e,color:#e2e8f0
    style LOG fill:#0f172a,stroke:#34d399,color:#e2e8f0
```
""",

    # TEMA 43: Principios de Persuasión (Cialdini)
    "Tema_43_Principios_de_la_Persuasion": """

```mermaid
mindmap
  root((6 Principios de Influencia))
    Reciprocidad
      Favores no solicitados
      Deuda psicológica
    Coherencia y Compromiso
      Técnica del pie en la puerta
      Autoimagen pública
    Aprobación Social
      Validación de grupo
      Comportamiento de rebaño
    Autoridad
      Símbolos de estatus
      Pericia percibida
    Simpatía y Rapport
      Atracción física
      Similitud y halagos
    Escasez
      FOMO
      Oportunidad limitada
```
""",

    # TEMA 46: PNL y Pacing & Leading
    "Tema_46_PNL_y_Ritmo_y_Liderazgo": """

```mermaid
flowchart LR
    A[Fase 1: Pacing / Acompasamiento] -->|Igualar postura, tono y velocidad de respiración| B[Fase 2: Construcción de Rapport Profundo]
    B -->|La otra persona entra en sincronía subconsciente| C[Fase 3: Leading / Guía]
    C -->|Cambiar tu postura o tono: el otro te seguirá sin notarlo| D([Dirección de la Conversación])

    style A fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style B fill:#0f172a,stroke:#a855f7,color:#e2e8f0
    style C fill:#0f172a,stroke:#fbbf24,color:#e2e8f0
    style D fill:#1e1b4b,stroke:#34d399,color:#fff
```
""",

    # TEMA 50: Cómo Funciona la TCC
    "Tema_50_Como_Funciona_la_TCC": """

```mermaid
flowchart TD
    S[Situación / Evento Desencadenante] --> P[Pensamiento Automático / Interpretación]
    P --> E[Respuesta Emocional: Ansiedad, Ira, Culpa]
    P --> F[Respuesta Fisiológica: Taquicardia, Tensión]
    E --> C[Conducta: Huida, Ataque o Procrastinación]
    F --> C
    C -->|Refuerza la distorsión original| P

    style S fill:#0f172a,stroke:#38bdf8,color:#cbd5e1
    style P fill:#1e1b4b,stroke:#f43f5e,stroke-width:2px,color:#fff
    style E fill:#0f172a,stroke:#fbbf24,color:#cbd5e1
    style F fill:#0f172a,stroke:#fbbf24,color:#cbd5e1
    style C fill:#0f172a,stroke:#a855f7,color:#cbd5e1
```

> [!TIP]
> **Premisa Fundamental de la TCC (Epicteto / Beck):** «No son las cosas las que atormentan a los hombres, sino la opinión que ellos tienen sobre las cosas». La TCC no cambia la realidad externa; reprograma el pensamiento intermedio para desarmar la reacción emocional destructiva.
""",

    # TEMA 63: El Ciclo del Abuso Narcisista
    "Tema_63_Abuso_narcisista": """

```mermaid
flowchart TD
    A[1. Fase de Idealización / Love Bombing] -->|Halagos desmedidos, conexión instantánea| B[2. Fase de Devaluación]
    B -->|Microcríticas, gaslighting, aislamiento| C[3. Fase de Descarte]
    C -->|Indiferencia cruel, reemplazo súbito| D[4. Fase de Reenganche / Hoovering]
    D -->|Falsas promesas, victimización para recuperar control| A

    style A fill:#064e3b,stroke:#10b981,color:#d1fae5
    style B fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style C fill:#450a0a,stroke:#ef4444,color:#fee2e2
    style D fill:#1e1b4b,stroke:#818cf8,color:#e0e7ff
```
""",

    # TEMA 67: DARVO y el Narcisista
    "Tema_67_DARVO_y_el_Narcisista": """

```mermaid
flowchart LR
    CONFRONT[Víctima Confronta Abuso] --> D[D: Deny / Negar el Hecho]
    D --> A[A: Attack / Atacar a la Víctima]
    A --> RVO[RVO: Reverse Victim and Offender / Invertir Roles]
    RVO --> OUT([Resultado: Víctima Pide Perdón y Siente Culpa])

    style CONFRONT fill:#0f172a,stroke:#38bdf8,color:#cbd5e1
    style D fill:#1e1b4b,stroke:#f59e0b,color:#fff
    style A fill:#451a03,stroke:#ef4444,color:#fff
    style RVO fill:#450a0a,stroke:#f43f5e,stroke-width:2px,color:#fff
    style OUT fill:#0f172a,stroke:#a855f7,color:#cbd5e1
```

> [!WARNING]
> **Mecanismo del DARVO:** Ante cualquier evidencia irrefutable, el agresor narcisista nunca pedirá disculpas sinceras; atacará la credibilidad del denunciante y se posicionará como el mártir atacado para forzar a la víctima a asumir la responsabilidad del conflicto.
""",

    # TEMA 71: Contacto Cero vs Piedra Gris
    "Tema_71_Convirette_en_la_Roca_Gris": """

```mermaid
flowchart TD
    DECISION{¿Es posible cortar el contacto por completo?}
    DECISION -->|SÍ| NC[Protocolo Contacto Cero]
    DECISION -->|NO: Hijos, Trabajo, Juicio| GR[Protocolo Piedra Gris]

    NC --> NC1[Bloqueo total en redes y teléfono]
    NC --> NC2[Cero intermediarios o amigos comunes]
    NC --> NC3[Extinción total del suministro narcisista]

    GR --> GR1[Respuestas monocordes: 'Sí', 'No', 'Ok']
    GR --> GR2[Cero reactividad emocional o justificaciones]
    GR --> GR3[Convertirse en el objeto más aburrido de la habitación]

    style DECISION fill:#1e1b4b,stroke:#818cf8,color:#fff
    style NC fill:#064e3b,stroke:#10b981,color:#d1fae5
    style GR fill:#334155,stroke:#94a3b8,color:#f8fafc
```
"""
}

# 3. PROCESAR TODOS LOS ARCHIVOS MARKDOWN
md_files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
md_files.sort()

clean_book_dict = {}

for f in md_files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()

    # A. Aplicar correcciones léxicas
    for pat, rep in TYPO_REPLACEMENTS:
        text = re.sub(pat, rep, text)

    # B. Limpiar espaciado y saltos de línea repetidos
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    # C. Inyectar diagrama si existe para este archivo
    key = f.replace('.md', '')
    if key in DIAGRAMS:
        text += "\n\n" + DIAGRAMS[key].strip() + "\n"
        print(f" -> Diagrama enriquecido inyectado en {key}")

    # D. Guardar versión limpia de vuelta en Psicologia_Oscura/
    with open(path, 'w', encoding='utf-8') as out_f:
        out_f.write(text)

    clean_book_dict[key] = text

# 4. RECOMPILAR JS/BOOK_CONTENT.JS
js_code = "var BOOK_CONTENT = " + json.dumps(clean_book_dict, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"\nReconstrucción completada: {len(clean_book_dict)} capítulos depurados y compilados en {BOOK_JS}.")

# 5. ACTUALIZAR APP.JS PARA QUE RE-RENDERICE MERMAID AL ABRIR ACORDEONES
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

old_toggle = "const p = this.nextElementSibling; p.classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180');"
new_toggle = "const p = this.nextElementSibling; p.classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180'); if(!p.classList.contains('hidden') && typeof mermaid !== 'undefined') { setTimeout(() => { try { mermaid.init(undefined, p.querySelectorAll('.mermaid')); } catch(e){} }, 50); }"

if old_toggle in app_js:
    app_js = app_js.replace(old_toggle, new_toggle)
    print("Actualizado app.js para renderizado dinámico de Mermaid en acordeones.")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== PROCESO DE RECONSTRUCCIÓN FINALIZADO CON ÉXITO ===")
