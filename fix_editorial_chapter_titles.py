import json
import re

DATA_JS = 'js/data_libros.js'
APP_JS = 'js/app.js'

print("=== CREANDO MAPA EDITORIAL MAESTRO DE LOS 76 CAPÍTULOS ===")

CHAPTER_TITLES = {
    # LIBRO 1: Fundamentos de la Psicología Oscura
    'Tema_01_P____SICOLOGIA_OSCURA': 'Psicología Oscura: Introducción General',
    'Tema_02_Introduction': 'Introducción a la Psicología y la Mente Humana',
    'Tema_03_El_Antiguo_Pensamiento_Psicolo': 'El Antiguo Pensamiento Psicológico',
    'Tema_04_El_papiro_de_Edwin_Smith': 'El Papiro de Edwin Smith y la Neuroanatomía Antigua',
    'Tema_05_Describa': 'Describir la Conducta Humana',
    'Tema_06_Explique': 'Explicar los Procesos Mentales',
    'Tema_07_Predecir': 'Predecir el Comportamiento Humano',
    'Tema_08_Cambier': 'Cambiar y Modificar la Conducta',
    'Tema_09_La_Perspectiva_Cognitiva': 'La Perspectiva Cognitiva en la Psicología',
    'Tema_10_La_Perspectiva_Humanista': 'La Perspectiva Humanista',
    'Tema_11_Conciencia_de_si_mismo': 'Conciencia de Sí Mismo y Autoconocimiento',
    'Tema_12_Autoregulacion': 'Autorregulación Emocional y Control del Estrés',
    'Tema_13_Las_Emociones_Universales': 'Las Emociones Universales y el Reconocimiento Facial',
    'Tema_14_Capitulo_5__Gestion_de_los_Pen': 'Capítulo 5: Gestión de los Pensamientos',
    'Tema_15_Gestionar_los_Pensamientos_y_l': 'Gestionar los Pensamientos y las Creencias',
    'Tema_16_Afirmaciones': 'Afirmaciones y Reestructuración Cognitiva',
    'Tema_17_Regulacion_Emotional': 'Regulación Emocional y Fisiología',
    'Tema_18_Metodo_de_puesta_a_tierra': 'Método de Puesta a Tierra (Grounding)',
    'Tema_19_Respiracion_profunda': 'Respiración Profunda y Sistema Parasimpático',
    'Tema_20_El_Problema_de_la_Procrastinac': 'El Problema de la Procrastinación y la Voluntad',
    'Tema_21_Sobornos': 'Sobornos Emocionales y Recompensas',
    'Tema_22_Conclusion': 'Conclusión del Módulo 1: Fundamentos',

    # LIBRO 2: Comunicación No Verbal
    'Tema_23_Introduction': 'Introducción a la Comunicación No Verbal',
    'Tema_24_Apertura': 'Apertura y Canales de Comunicación Corporal',
    'Tema_25_Conciencia': 'Conciencia Kinésica y Calibración Corporal',
    'Tema_26_Haptica': 'Háptica y la Dinámica del Tacto',
    'Tema_27_Ejemplo_2__Ventas_con_Persuasi': 'Ejemplo Práctico 2: Ventas con Persuasión Kinésica',
    'Tema_28_Ejempllo_3__Manipulacion_Emoti': 'Ejemplo Práctico 3: Manipulación Emocional No Verbal',
    'Tema_29_Senales_de_Manipulacion': 'Señales Clave de Manipulación Corporal',
    'Tema_30_Conclusion': 'Conclusión del Módulo 2: Lenguaje No Verbal',

    # LIBRO 3: Psicología de la Persuasión
    'Tema_31_Introduction': 'Introducción a la Psicología de la Persuasión',
    'Tema_32_El_Proceso_de_Manipulacion': 'El Proceso de la Manipulación Psicológica',
    'Tema_33_Ethos': 'Ethos: La Autoridad y la Credibilidad',
    'Tema_34_Pathos': 'Pathos: La Apelación a las Emociones',
    'Tema_35_Logos': 'Logos: La Lógica y la Argumentación Racional',
    'Tema_36_Palabras_Cargadas': 'Palabras Cargadas y Carga Emocional',
    'Tema_37_Anclaje': 'Anclaje Psicológico y Condicionamiento',
    'Tema_38_Disociacion': 'Disociación y Anclajes Emocionales',
    'Tema_39_Reccuadre_de_Contentos': 'Reencuadre de Contextos y Marcos de Referencia',
    'Tema_40_Conclusion': 'Conclusión del Módulo 3: Persuasión',

    # LIBRO 4: Tácticas Avanzadas de Manipulación y PNL
    'Tema_41_Introduction': 'Introducción a las Tácticas Avanzadas y PNL',
    'Tema_42_Reconocer_al_Manipulador': 'Cómo Reconocer al Manipulador Encubierto',
    'Tema_43_Principios_de_la_Persuasion': 'Principios de la Persuasión y la Influencia',
    'Tema_44_Ethos': 'Ethos y la Creación de Confianza Ficticia',
    'Tema_45_Pathos': 'Pathos: El Control de las Emociones Ajenas',
    'Tema_46_PNL_y_Ritmo_y_Liderazgo': 'PNL: Pacing & Leading (Ritmo y Liderazgo)',
    'Tema_47_Conclusion': 'Conclusión del Módulo 4: Tácticas Avanzadas',

    # LIBRO 5: Terapia Cognitivo-Conductual (TCC)
    'Tema_48_Introduction': 'Introducción a la Terapia Cognitivo-Conductual (TCC)',
    'Tema_49_La_Historia_de_la_Inteligencia': 'La Historia de la TCC y la Terapia Racional Emotiva',
    'Tema_50_Como_Funciona_la_TCC': 'Cómo Funciona la TCC: Pensamiento, Emoción y Conducta',
    'Tema_51_Por_que_se_Utiliza_la_TCC': 'Por Qué se Utiliza la TCC en la Defensa Psicológica',
    'Tema_52_Entender_la_Terapia_Conductual': 'Entender la Terapia Conductual y el Condicionamiento',
    'Tema_53_Cuando_la_Terapia_Cognitiva_y_': 'Cuando la Terapia Cognitiva y Conductual se Unen',
    'Tema_54_TCC_y_Anisiedad': 'TCC y el Manejo Integral de la Ansiedad',
    'Tema_55_Exposicion_Graduada': 'Exposición Graduada y Desensibilización Sistemática',
    'Tema_56_Juegos_de_Rol__Que_pasa_si': 'Juegos de Rol y la Técnica del "¿Qué pasa si...?"',
    'Tema_57_Aproximacion_Sucesiva': 'Aproximación Sucesiva y Moldeamiento de Conductas',
    'Tema_58_Programacion_de_Actividades': 'Programación de Actividades y Activación Conductual',
    'Tema_59_Conclusion': 'Conclusión del Módulo 5: TCC Aplicada',

    # LIBRO 6: Recuperación del Abuso Narcisista
    'Tema_60_Introduction': 'Introducción a la Recuperación del Abuso Narcisista',
    'Tema_61_Abuso_sexual': 'Detección y Ruptura del Abuso Coercitivo',
    'Tema_62_Abuso_espiritual': 'Abuso Espiritual y Manipulación Ideológica',
    'Tema_63_Abuso_narcisista': 'Anatomía del Abuso Narcisista y la Desvalorización',
    'Tema_64_Perdonate_a_ti_Mismo': 'Perdónate a Ti Mismo: Rompiendo la Culpa Inducida',
    'Tema_65_Reclama_tu_Narrativa': 'Reclama Tu Narrativa y Recupera Tu Identidad',
    'Tema_66_El_Narcisista': 'El Perfil del Narcisista Patológico y sus Máscaras',
    'Tema_67_DARVO_y_el_Narcisista': 'La Dinámica DARVO: Negar, Atacar e Invertir Víctima y Agresor',
    'Tema_68_Perder_la_Confianza_en_uno_Mis': 'Recuperar la Autoconfianza tras el Gaslighting',
    'Tema_69_Problemas_de_Salud_Mental': 'Impacto en la Salud Mental y Estrés Postraumático',
    'Tema_70_Cortar_el_Contacto_por_Complet': 'Contacto Cero: Cómo Cortar el Vínculo por Completo',
    'Tema_71_Convirette_en_la_Roca_Gris': 'Conviértete en la Roca Gris: Neutralidad Absoluta',
    'Tema_72_Buscar_Apoyo': 'Creación de una Red de Apoyo Seguro y Validación',
    'Tema_73_Escriba_sus_Razones_para_Irse': 'Escribe tus Razones para Salir y Mantenerte Firme',
    'Tema_74_Inteligencia_Emocional': 'Inteligencia Emocional Aplicada a la Recuperación',
    'Tema_75_Afirmaciones': 'Afirmaciones y Reprogramación del Autoconcepto',
    'Tema_76_Conclusion': 'Conclusión Final: Blindaje Psicológico Integral'
}

# 1. Inyectar CHAPTER_TITLES en data_libros.js
with open(DATA_JS, 'r', encoding='utf-8') as f:
    data_content = f.read()

titles_js = "var CHAPTER_TITLES = " + json.dumps(CHAPTER_TITLES, ensure_ascii=False, indent=2) + ";\nwindow.CHAPTER_TITLES = CHAPTER_TITLES;\n\n"

if 'var CHAPTER_TITLES =' not in data_content:
    data_content = titles_js + data_content
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(data_content)
    print("Inyectado diccionario CHAPTER_TITLES en data_libros.js")
else:
    # Reemplazar existente
    data_content = re.sub(r'var CHAPTER_TITLES =[\s\S]*?window\.CHAPTER_TITLES = CHAPTER_TITLES;\n\n', titles_js, data_content)
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(data_content)
    print("Actualizado diccionario CHAPTER_TITLES en data_libros.js")

# 2. Actualizar openLessonModal en app.js para usar CHAPTER_TITLES
with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

old_clean_title_line = "const cleanTitle = chapterName.replace(/_/g, ' ').replace(/^Tema\\s*\\d+\\s*/i, '').trim();"
new_clean_title_line = """const titlesMap = (typeof CHAPTER_TITLES !== 'undefined' ? CHAPTER_TITLES : null) || (typeof window !== 'undefined' ? window.CHAPTER_TITLES : null) || {};
         const cleanTitle = titlesMap[chapterName] || chapterName.replace(/_/g, ' ').replace(/^Tema\\s*\\d+\\s*/i, '').trim();"""

if old_clean_title_line in app_js:
    app_js = app_js.replace(old_clean_title_line, new_clean_title_line)
    with open(APP_JS, 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Actualizado app.js para renderizar los títulos editoriales corregidos en los acordeones.")
else:
    # Check if alternate match
    idx_title = app_js.find('cleanTitle =')
    if idx_title != -1:
        print("Found cleanTitle at:", idx_title)

print("=== ACTUALIZACIÓN EDITORIAL DE LOS 76 TÍTULOS FINALIZADA CON ÉXITO ===")
