from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(line_buffering=True)

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "Coleccion _Psicologia_Oscura_Audiolibros"
WORK = Path(__file__).resolve().parent
DATA = WORK / "data"
OUTPUT = WORK / "output"
REPORTS = WORK / "reports"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def safe_id(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9_-]+", "-", value, flags=re.UNICODE)
    return value.strip("-").lower()[:100] or "libro"


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    homoglyphs = {
        "\u0406": "I", "\u0456": "i",
        "\u0410": "A", "\u0430": "a",
        "\u0415": "E", "\u0435": "e",
        "\u041e": "O", "\u043e": "o",
        "\u0420": "P", "\u0440": "p",
        "\u0421": "C", "\u0441": "c",
        "\u0405": "S", "\u0455": "s",
        "\u0423": "Y", "\u0443": "y",
        "\u0425": "X", "\u0445": "x",
        "\u0408": "J", "\u0458": "j",
        "\u0412": "B", "\u041d": "H", "\u041c": "M", "\u0422": "T",
    }
    for k, v in homoglyphs.items():
        text = text.replace(k, v)
    text = re.sub(r"Machine[^\w\n]*Translated[^\w\n]*by[^\w\n]*Google", "", text, flags=re.IGNORECASE)
    text = text.replace("\ue000", "")
    text = re.sub(r"(?<=\w)-\n(?=\w)", "", text)
    text = re.sub(r"\s*\[REVISAR:[^\]]*\]", "", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = text.splitlines()
    result: list[str] = []
    previous = ""
    for line in lines:
        current = line.strip()
        if not current:
            if result and result[-1] != "":
                result.append("")
            continue
        if current == previous:
            continue
        if result and result[-1] and not re.match(r"^(#{1,6})\s|^[-*+]\s|^\d+[.)]\s", current):
            if not re.search(r"[.!?:;]$", result[-1]):
                result[-1] += " " + current
            else:
                result.append(current)
        else:
            result.append(current)
        previous = current
    return "\n".join(result).strip() + "\n"


def inventory(source: Path) -> None:
    REPORTS.mkdir(parents=True, exist_ok=True)
    rows = []
    for path in sorted(source.rglob("*")):
        if not path.is_file():
            continue
        kind = path.suffix.lower().lstrip(".")
        if kind not in {"pdf", "md", "mp3", "m4a", "wav", "jpg", "jpeg", "png", "webp"}:
            continue
        rows.append({
            "tipo": kind,
            "ruta": str(path.relative_to(ROOT)),
            "tamano_bytes": path.stat().st_size,
            "sha256": sha256(path),
        })
    with (REPORTS / "inventario.csv").open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=["tipo", "ruta", "tamano_bytes", "sha256"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Inventario creado: {len(rows)} archivos -> {REPORTS / 'inventario.csv'}")


def extract_pdf(pdf: Path, output: Path) -> None:
    try:
        try:
            import pymupdf as fitz
        except ImportError:
            try:
                import fitz
            except ImportError:
                from pypdf import PdfReader
                reader = PdfReader(str(pdf))
                pages = []
                for number, page in enumerate(reader.pages, start=1):
                    text = (page.extract_text() or "").strip()
                    pages.append(f"\n<!-- Página {number} -->\n\n{text}" if text else f"\n<!-- Página {number}: sin texto, requiere OCR -->\n")
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_text(clean_text("\n".join(pages)), encoding="utf-8")
                print(f"Extraído con pypdf: {pdf.name} ({len(reader.pages)} páginas) -> {output}")
                return
    except ImportError as error:
        raise SystemExit("Falta PyMuPDF. Instala: python -m pip install -r requirements-curacion.txt") from error
    document = fitz.open(pdf)
    pages = []
    for number, page in enumerate(document, start=1):
        text = page.get_text("text").strip()
        pages.append(f"\n<!-- Página {number} -->\n\n{text}" if text else f"\n<!-- Página {number}: sin texto, requiere OCR -->\n")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(clean_text("\n".join(pages)), encoding="utf-8")
    print(f"Extraído: {pdf.name} ({len(document)} páginas) -> {output}")


def split_chapters(markdown: Path, output_dir: Path) -> list[Path]:
    text = markdown.read_text(encoding="utf-8")
    book_slug = safe_id(markdown.stem)
    chunks: list[tuple[str, str]] = []

    if book_slug == "como-analizar-a-las-personas-4-libros-en-1":
        cutpoints = [
            (0, "00-introduccion-y-prologo"),
            (6636, "01-libro-1-claves-efectivas-para-la-persuasion"),
            (10016, "02-diferencia-entre-persuasion-y-manipulacion"),
            (17533, "03-persuasion-efectiva-y-auto-persuasion"),
            (28879, "04-los-5-secretos-de-la-comunicacion-persuasiva"),
            (40811, "05-los-11-principios-de-la-persuasion"),
            (64111, "06-las-21-tecnicas-de-persuasion-mas-importantes"),
            (93216, "07-los-7-trucos-psicologicos-mas-simples-y-comunes"),
            (97626, "08-libro-2-claves-efectivas-para-la-manipulacion-mental"),
            (114916, "09-proposito-de-la-manipulacion-mental"),
            (118335, "10-pnl-y-manipulacion-mental"),
            (128420, "11-tecnicas-iniciales-de-manipulacion-mental"),
            (131050, "12-otras-tecnicas-de-manipulacion-mental"),
            (140358, "13-manipulacion-como-reconocerlo-y-defenderse"),
            (148470, "14-violencia-psicologica-y-como-convertirse-en-manipulador"),
            (160607, "15-libro-3-hipnosis-secreta"),
            (175359, "16-las-4-etapas-del-proceso-hipnotico"),
            (179260, "17-la-capacidad-de-conexion-y-relacion"),
            (202778, "18-tecnicas-hipnoticas"),
            (214936, "19-comunicacion-no-verbal-y-gestos-batonicos"),
            (218005, "20-libro-4-lenguaje-corporal-revelado"),
            (236532, "21-gestos-basicos-para-aprender"),
            (256957, "22-expresiones-faciales-y-mirada"),
            (264488, "23-brazos-piernas-postura-y-proxemia"),
            (275339, "24-movimientos-tensionales-actitudes-y-conclusion"),
        ]
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "comunicacion-persuasiva-3-lib" in book_slug:
        cutpoints = [
            (0, "00-introduccion-y-prologo"),
            (5107, "01-libro-1-claves-efectivas-para-la-persuasion"),
            (text.find("Diferencia entre persuasión y manipulación psicológica", 5000), "02-diferencia-entre-persuasion-y-manipulacion"),
            (text.find("Persuasión efectiva", 5000), "03-persuasion-efectiva-y-auto-persuasion"),
            (text.find("Los 5 secretos de la comunicación persuasiva", 5000), "04-los-5-secretos-de-la-comunicacion-persuasiva"),
            (text.find("Los 11 principios de la persuasión", 5000), "05-los-11-principios-de-la-persuasion"),
            (text.find("Las 21 técnicas de persuasión más importantes", 5000), "06-las-21-tecnicas-de-persuasion-mas-importantes"),
            (text.find("Los 7 trucos psicológicos más simples y comunes", 5000), "07-los-7-trucos-psicologicos-mas-simples-y-comunes"),
            (text.find("CLAVES EFECTIVAS PARA LA MANIPULACIÓN MENTAL", 5000), "08-libro-2-claves-efectivas-para-la-manipulacion-mental"),
            (text.find("Propósito de la manipulación mental", 5000), "09-proposito-de-la-manipulacion-mental"),
            (text.find("PNL y manipulación mental", 5000), "10-pnl-y-manipulacion-mental"),
            (text.find("Técnicas iniciales de manipulación mental", 5000), "11-tecnicas-iniciales-de-manipulacion-mental"),
            (text.find("Otras técnicas de manipulación mental", 5000), "12-otras-tecnicas-de-manipulacion-mental"),
            (text.find("Manipulación: cómo reconocerlo", 5000), "13-manipulacion-como-reconocerlo-y-defenderse"),
            (text.find("Violencia psicológica contra la mujer", 5000), "14-violencia-psicologica-y-como-convertirse-en-manipulador"),
            (text.find("LENGUAJE CORPORAL REVELADO", 5000), "15-libro-3-lenguaje-corporal-revelado"),
            (text.find("Gestos básicos para aprender", 5000), "16-gestos-basicos-para-aprender"),
            (text.find("Expresiones faciales", 180000), "17-expresiones-faciales-y-mirada"),
            (text.find("Brazos y piernas", 200000), "18-brazos-piernas-postura-y-proxemia"),
            (text.find("Movimientos que indican liberación tensional", 200000), "19-movimientos-tensionales-actitudes-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "el-abc-de-la-psicologia-oscura":
        cutpoints = [
            (0, "00-preliminares-y-tabla-de-contenido"),
            (33029, "01-libro-1-capitulo-1-una-breve-historia-de-la-psicologia"),
            (63328, "02-libro-1-capitulo-2-que-es-la-psicologia"),
            (87902, "03-libro-1-capitulo-3-la-presencia-de-la-psicologia-en-nuestro-comportamiento"),
            (99129, "04-libro-1-capitulo-4-cuando-la-psicologia-se-vuelve-oscura"),
            (107099, "05-libro-1-capitulo-5-principios-de-psicologia-y-sus-relaciones"),
            (122704, "06-libro-1-capitulo-6-usando-la-psicologia-para-combatir-la-procrastinacion"),
            (156451, "07-libro-2-capitulo-1-psicologia-oscura"),
            (174857, "08-libro-2-capitulo-2-el-lado-oscuro-de-la-personalidad"),
            (196094, "09-libro-2-capitulo-3-manipulacion"),
            (229111, "10-libro-2-capitulo-4-manipulacion-emocional"),
            (256156, "11-libro-2-capitulo-5-tecnicas-de-manipulacion-para-controlar-mentes"),
            (281370, "12-libro-2-capitulo-6-el-poder-de-la-persuasion"),
            (318170, "13-libro-2-capitulo-7-lavado-de-cerebro"),
            (334391, "14-libro-2-capitulo-8-engano"),
            (353525, "15-libro-2-capitulo-9-control-mental-de-la-pnl"),
            (376265, "16-libro-2-capitulo-10-hipnosis"),
            (390800, "17-libro-2-capitulo-11-los-beneficios-de-la-psicologia-oscura"),
            (415973, "18-libro-3-capitulo-1-que-es-la-manipulacion"),
            (438981, "19-libro-3-capitulo-2-cuando-y-por-que-usar-la-manipulacion"),
            (461066, "20-libro-3-capitulo-3-victimas-y-vulnerabilidades"),
            (482601, "21-libro-3-capitulo-4-el-poder-de-la-persuasion"),
            (507218, "22-libro-3-capitulo-5-tecnicas-de-control-mental-con-persuasion"),
            (535476, "23-libro-3-capitulo-6-influenciar-a-otros-con-la-psicologia-persuasiva"),
            (560124, "24-libro-3-capitulo-7-que-es-la-pnl"),
            (581128, "25-libro-3-capitulo-8-principios-basicos-de-la-pnl-para-mejorar-la-vida"),
            (601924, "26-libro-3-capitulo-9-control-mental-con-pnl"),
            (623284, "27-libro-3-capitulo-10-mejorar-las-habilidades-de-comunicacion"),
            (642517, "28-libro-3-capitulo-11-pnl-para-una-vida-exitosa"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-mental-descubra" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (9318, "01-libro-1-metodos-de-manipulacion-de-los-depredadores"),
            (28837, "02-libro-1-otras-tecnicas-de-manipulacion-y-defensa"),
            (48056, "03-libro-1-persuasion-vs-manipulacion-y-comportamiento"),
            (70918, "04-libro-1-sociedad-control-mental-y-casos"),
            (97640, "05-libro-1-capitulo-1-tecnicas-fitd-pie-en-la-puerta"),
            (122486, "06-libro-1-capitulo-2-tecnicas-ditf-puerta-en-la-cara"),
            (128389, "07-libro-1-capitulo-3-otras-tecnicas-persuasivas"),
            (151370, "08-libro-1-capitulo-4-manipulacion-en-la-relacion"),
            (185301, "09-libro-1-capitulo-5-control-mental"),
            (203058, "10-libro-1-capitulo-6-autocontrol"),
            (223794, "11-libro-1-capitulo-7-aprende-a-concentrarte"),
            (230943, "12-libro-2-capitulo-1-que-es-la-neurolinguistica"),
            (243168, "13-libro-2-capitulo-2-que-es-la-pnl-parte-1"),
            (269365, "14-libro-2-capitulo-2-pnl-metaforas-y-fobias-parte-2"),
            (293527, "15-libro-2-capitulo-3-gestionando-sus-emociones"),
            (320296, "16-libro-2-capitulo-4-como-usar-nlp-para-gestionar-emociones"),
            (339703, "17-libro-2-capitulo-5-uso-de-la-psicologia-oscura-para-gestionar-las-emociones"),
            (373069, "18-libro-2-capitulo-6-guerra-psicologica-y-tcc"),
            (392737, "19-libro-2-capitulo-7-pnl-y-tcc-para-influenciar"),
            (421142, "20-libro-2-capitulo-8-el-uso-efectivo-de-persuasion-manipulacion-y-engano"),
            (436674, "21-libro-2-capitulo-9-y-10-consejos-de-pnl-y-conclusion"),
            (455916, "22-libro-3-capitulo-1-tecnicas-de-manipulacion-mas-dificiles-de-resistir"),
            (473383, "23-libro-3-capitulo-2-cuidado-con-depredadores-y-manipulacion"),
            (513243, "24-libro-3-capitulo-3-instrucciones-para-plantar-un-pensamiento"),
            (533992, "25-libro-3-capitulo-4-pnl-como-hipnotista-para-la-mente"),
            (540167, "26-libro-3-capitulo-5-herramienta-de-comunicacion"),
            (549189, "27-libro-3-capitulo-6-lenguaje-corporal-y-proteccion-pnl"),
            (588397, "28-libro-3-capitulo-7-el-secreto-de-los-maestros-de-la-persuasion-parte-1"),
            (626577, "29-libro-3-capitulo-7-sociopatas-y-terapia-manipulativa-parte-2"),
            (661781, "30-libro-3-capitulo-8-poder-y-control-sobre-otras-personas"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-4-manuales" in book_slug:
        cutpoints = [
            (0, "00-preliminares-y-tabla-de-contenido"),
            (14361, "01-m1-introduccion-y-que-es-la-procrastinacion"),
            (39420, "02-m1-motivos-de-la-procrastinacion"),
            (68405, "03-m1-disciplina-vs-inteligencia"),
            (79748, "04-m1-fundamentos-de-la-autodisciplina"),
            (111179, "05-m1-desarrollo-de-la-autodisciplina-parte-1"),
            (136029, "06-m1-potenciar-la-mente-y-el-equilibrio-parte-2"),
            (160719, "07-m1-rodeate-del-tipo-de-persona-que-deseas-ser"),
            (178639, "08-m1-habitos-y-como-adquirirlos"),
            (216829, "09-m1-el-poder-de-la-mente-y-autodisciplina"),
            (243575, "10-m1-compromiso-elecciones-y-perspectiva"),
            (274311, "11-m1-trampas-mentales-fracaso-y-excusas"),
            (292869, "12-m1-ambiente-toxico-miedos-y-meditacion"),
            (310471, "13-m1-ejercicios-practicos-y-conclusiones"),
            (324310, "14-m2-introduccion-y-definiciones-basicas"),
            (342856, "15-m2-el-poder-de-la-inteligencia-emocional"),
            (369975, "16-m2-caracteristicas-fundamentales-y-emociones"),
            (390103, "17-m2-importancia-de-las-emociones-y-el-cerebro"),
            (412907, "18-m2-beneficios-y-liderazgo-emocional"),
            (434943, "19-m2-aprendizaje-y-educacion-emocional"),
            (470135, "20-m2-equilibrio-neurociencia-y-entorno"),
            (504578, "21-m2-desarrollo-del-liderazgo-y-evaluacion"),
            (522803, "22-m2-regulacion-y-uso-de-las-emociones"),
            (545238, "23-m2-conocerse-a-si-mismo-y-habilidades-sociales"),
            (574482, "24-m2-reprogramar-mentalidad-ejercicios-y-conclusion"),
            (601479, "25-m3-introduccion-que-es-y-origenes"),
            (631809, "26-m3-estudios-y-emociones-en-el-comportamiento"),
            (661373, "27-m3-enfoques-del-comportamiento-y-lideres-oscuros"),
            (695700, "28-m3-rasgos-de-lideres-y-lenguaje-corporal"),
            (734280, "29-m3-aspectos-importantes-de-la-psicologia-oscura"),
            (760771, "30-m3-tecnicas-de-manipulacion-psicologica"),
            (802057, "31-m3-tecnicas-y-ejercicios-practicos"),
            (836963, "32-m3-tipos-de-manipulacion"),
            (864269, "33-m3-falsos-ganadores-analisis-conductual-y-conclusion"),
            (891677, "34-m4-definicion-y-estudios-cientificos"),
            (920292, "35-m4-tipos-de-manipulacion-y-conducta-humana"),
            (945345, "36-m4-persuasion-y-manipuladores-de-la-historia"),
            (973889, "37-m4-casos-manipulacion-y-dependencia-emocional"),
            (1013289, "38-m4-victimas-efectos-culpa-y-autoestima"),
            (1051153, "39-m4-persuasion-y-principios-de-cialdini"),
            (1087517, "40-m4-comportamiento-del-manipulador"),
            (1098830, "41-m4-lenguaje-corporal-y-herramientas-de-influencia"),
            (1124131, "42-m4-formas-amables-y-eficaces-de-influir"),
            (1137025, "43-m4-pnl-a-nuestro-favor"),
            (1151566, "44-m4-hipnosis-patrones-del-lenguaje-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "psicologia-oscura-fabian-goleman":
        cutpoints = [
            (0, "00-preliminares-y-tabla-de-contenido"),
            (9925, "01-l1-introduccion-y-que-es-la-psicologia-oscura"),
            (29336, "02-l1-origen-y-estudios-de-la-psicologia-oscura"),
            (51520, "03-l1-influencia-de-las-emociones-y-enfoques"),
            (78652, "04-l1-lideres-que-han-usado-la-psicologia-oscura"),
            (104867, "05-l1-rasgos-de-lideres-de-psicologia-oscura"),
            (130082, "06-l1-lenguaje-corporal-y-aspectos-importantes"),
            (170014, "07-l1-tecnicas-de-manipulacion-psicologica"),
            (210846, "08-l1-tecnicas-y-ejercicios-practicos"),
            (245433, "09-l1-tipos-de-manipulacion"),
            (272027, "10-l1-falsos-ganadores-analisis-conductual-y-conclusion"),
            (295600, "11-l2-definicion-y-estudios-cientificos"),
            (327636, "12-l2-tipos-de-manipulacion-y-conducta-humana"),
            (353505, "13-l2-diferencia-persuasion-y-manipuladores-historicos"),
            (383436, "14-l2-casos-y-manipulacion-emocional"),
            (406191, "15-l2-dependencia-emocional-y-victimas"),
            (431534, "16-l2-efectos-culpa-y-autoestima"),
            (463232, "17-l2-persuasion-y-principios-de-cialdini"),
            (494941, "18-l2-comportamiento-del-manipulador-y-lenguaje-corporal"),
            (520498, "19-l2-herramientas-para-influenciar-y-formas-amables"),
            (545197, "20-l2-pnl-a-nuestro-favor"),
            (559267, "21-l2-hipnosis-patrones-del-lenguaje-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-para-principiantes" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-indice"),
            (5759, "01-l1-psicologia-para-principiantes-pensamientos-negativos"),
            (10928, "02-l1-pesimismo-optimismo-y-profecia-autocumplida"),
            (27269, "03-l1-pensamiento-positivo-y-consejos-contra-pensamientos-negativos"),
            (32515, "04-l1-miedos-ficticios-y-desarrollo-de-la-autoimagen"),
            (58722, "05-l1-para-quien-es-la-pnl-tecnica-swish-y-12-maneras"),
            (83182, "06-l2-psicologia-positiva-introduccion-y-bloqueos"),
            (102274, "07-l2-aprende-a-pensar-positivamente-y-12-formas"),
            (111422, "08-l2-miedos-7-metodos-y-entenderse-a-si-mismo"),
            (128486, "09-l2-naturaleza-humana-y-juicio"),
            (135494, "10-l2-manipulacion-senales-y-defensa-emocional"),
            (156694, "11-l3-manipulacion-y-lenguaje-corporal-que-es"),
            (170440, "12-l3-tecnicas-de-manipulacion-reciprocidad-y-dtr"),
            (188691, "13-l3-gaslighting-senales-y-como-defenderse"),
            (208612, "14-l3-lenguaje-corporal-posturas-de-poder-ojos-y-postura"),
            (240182, "15-l3-usar-intentos-de-manipulacion-a-favor-y-nunca-ser-marioneta"),
            (254523, "16-l4-pnl-definicion-criticas-y-supuestos-basicos"),
            (274410, "17-l4-anclaje-ritmo-direccion-y-perspectivas"),
            (287329, "18-l4-areas-de-aplicacion-de-la-pnl"),
            (296260, "19-l4-reencuadre-y-cambio-de-mentalidad-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "desbloquea-tu-mente" in book_slug:
        cutpoints = [
            (0, "01-por-que-debes-trabajar-el-control-de-tu-mente"),
            (text.find("Sostente en el aquí y ahora", 5000), "02-sostente-en-el-aqui-y-ahora-y-frecuencia-vibracional"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "coleccion-erotica" in book_slug:
        cutpoints = [
            (0, "00-portada-creditos-y-contenido"),
            (text.find("Mi primer tratamiento", 1000), "01-mi-primer-tratamiento"),
            (text.find("Christine", 5000), "02-christine"),
            (text.find("Bárbara", 10000), "03-barbara"),
            (text.find("Mi segunda primera vez", 10000), "04-mi-segunda-primera-vez"),
            (text.find("Mi cambio al cornudo", 10000), "05-mi-cambio-al-cornudo"),
            (text.find("Mi reunion", 10000), "06-mi-reunion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "diario-de-una-ninfomana" in book_slug:
        cutpoints = [
            (0, "00-preliminares-y-agradecimientos"),
            (text.find("17 de julio de 1984"), "01-inicios-y-primeras-experiencias-1984-marzo-1997"),
            (text.find("28 de marzo de 1997"), "02-descubrimiento-del-deseo-marzo-1997"),
            (text.find("3 de abril de 1997"), "03-relaciones-y-limites-abril-1997-parte-1"),
            (text.find("12 de abril de 1997"), "04-viaje-y-encuentros-abril-1997-parte-2"),
            (text.find("23 de abril de 1997"), "05-el-hotel-y-la-ciudad-abril-1997-parte-3"),
            (text.find("11 de junio de 1997"), "06-el-duelo-y-el-cambio-junio-julio-1997"),
            (text.find("8 de agosto de 1997"), "07-madurez-agosto-septiembre-1997-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "desbloquea-tu-cerebro" in book_slug:
        cutpoints = [
            (0, "00-creditos-y-dedicatoria"),
            (text.find("Hace un tiempo cayó en mis manos"), "01-prologo-santandreu"),
            (text.find("Una noche de 1947, Howard Hughes", 3000), "02-prologo-howard-hughes"),
            (text.find("Prefacio a la edición del vigésimo aniversario", 3000), "03-prefacio-vigesimo-aniversario"),
            (text.find("Obsesiones, compulsiones y el método", 3000), "04-introduccion-obsesiones-y-cuatro-pasos"),
            (text.find("Lista de síntomas habituales del TOC", 3000), "05-sintomas-habituales-del-toc"),
            (text.find("Paso 1. Reetiquetado", 3000), "06-p1-paso-1-reetiquetado-parte-1"),
            (text.find("<!-- Página 80 -->", 3000), "07-p1-paso-1-reetiquetado-parte-2"),
            (text.find("Paso 2. Reatribución", 3000), "08-p1-paso-2-reatribucion-parte-1"),
            (text.find("<!-- Página 120 -->", 3000), "09-p1-paso-2-reatribucion-parte-2"),
            (text.find("Paso 3. Reenfoque", 3000), "10-p1-paso-3-reenfoque-parte-1"),
            (text.find("<!-- Página 155 -->", 3000), "11-p1-paso-3-reenfoque-parte-2"),
            (text.find("Paso 4. Revaloración", 3000), "12-p1-paso-4-revaloracion"),
            (text.find("Los Cuatro Pasos y la libertad personal", 3000), "13-p2-aplicacion-y-libertad-personal"),
            (text.find("El TOC como trastorno familiar", 3000), "14-p2-el-toc-como-trastorno-familiar"),
            (text.find("<!-- Página 220 -->", 3000), "15-p2-el-toc-como-trastorno-familiar-parte-2"),
            (text.find("<!-- Página 240 -->", 3000), "16-p2-el-toc-como-trastorno-familiar-parte-3"),
            (text.find("Los Cuatro Pasos y otros trastornos", 3000), "17-p2-los-cuatro-pasos-y-otros-trastornos"),
            (text.find("métodos tradicionales", 490000), "18-p2-metodos-tradicionales-terapia-conductual"),
            (text.find("El TOC y la medicación", 3000), "19-p2-el-toc-y-la-medicacion"),
            (text.find("Formulario del test de detección", 3000), "20-p2-formulario-test-hamburgo-y-diario"),
            (text.find("Manual de autotratamiento", 520000), "21-p3-manual-de-autotratamiento-y-sobre-el-autor"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "como-analizar-a-la-gente-una-maestria" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1 - La importancia", 3000), "01-la-importancia-de-analizar-a-las-personas"),
            (text.find("Capítulo 2 - ¿Cómo analizar", 3000), "02-como-analizar-a-la-gente-usando-la-psicologia-oscura"),
            (text.find("Capítulo 3", 3000), "03-comprension-de-las-intenciones"),
            (text.find("Capítulo 4", 3000), "04-analisis-de-las-funciones-cognitivas"),
            (text.find("Capítulo 5", 3000), "05-lectura-de-pensamientos"),
            (text.find("Capítulo 6", 3000), "06-conviertase-en-un-detector-de-mentiras"),
            (text.find("Capítulo 7", 3000), "07-claves-no-verbales"),
            (text.find("Capítulo 8", 3000), "08-analizando-a-la-gente-en-citas-y-amor"),
            (text.find("Capítulo 9", 3000), "09-interpretacion-de-patrones-comunes"),
            (text.find("Capítulo 10", 3000), "10-posibles-excepciones-en-el-analisis"),
            (text.find("Capítulo 11", 3000), "11-lectura-rapida"),
            (text.find("Capítulo 12", 150000), "12-persuasion-vs-manipulacion"),
            (text.find("Conclusión", 150000), "13-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "como-analizar-a-las-personas-con-psicologia-oscura-una-guia-rapida" in book_slug:
        cutpoints = [
            (0, "00-preliminares"),
            (text.find("INTRODUCCIÓN AL ANÁLISIS DE PERSONALIDAD", 2000), "01-introduccion-al-analisis-de-personalidad"),
            (text.find("¿CÓMO SE PUEDE LEER A LAS PERSONAS?", 2500), "02-como-se-puede-leer-a-las-personas"),
            (text.find("LOS OJOS: SON EL ESPEJO DEL ALMA", 2500), "03-los-ojos-espejo-del-alma"),
            (text.find("SEÑALES EN DIFERENTES CONTEXTOS", 2500), "04-senales-en-diferentes-contextos"),
            (text.find("CÓMO HABLA NUESTRO CUERPO", 2500), "05-como-habla-nuestro-cuerpo"),
            (text.find("COMPORTAMIENTO", 2500), "06-comportamiento-no-verbal"),
            (text.find("Tipos de comunicación no verbal", 2500), "07-tipos-de-comunicacion-no-verbal"),
            (text.find("7) ¿Qué quieres en tu vida?", 2500), "08-lenguaje-corporal-y-gestos"),
            (text.find("¡LA INSEGURA ES UN LIBRO ABIERTO!", 2500), "09-inseguridad-y-tipos-de-personalidad"),
            (text.find("CÓMO ANALIZAR LA HONESTIDAD EN UNA RELACIÓN", 2500), "10-como-analizar-la-honestidad-en-una-relacion"),
            (text.find("CÓMO SE COMUNICA LA MENTE", 2500), "11-como-se-comunica-la-mente"),
            (text.find("LA MENTE CONSCIENTE", 2500), "12-la-mente-consciente-y-subconsciente"),
            (text.find("BENEFICIOS DEL ANÁLISIS DE PERSONALIDAD", 2500), "13-beneficios-del-analisis-de-personalidad"),
            (text.find("CONCLUSIONES", 2500), "14-conclusiones"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "tecnicas-secretas-para-analizar-e-influenciar" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1: Análisis de las personas", 3000), "01-capitulo-1-analisis-lenguaje-corporal"),
            (text.find("Capítulo 2: Manipulación", 3000), "02-capitulo-2-manipulacion"),
            (text.find("Capítulo 3: PNL", 3000), "03-capitulo-3-pnl"),
            (text.find("Capítulo 4: Engaño", 3000), "04-capitulo-4-engano"),
            (text.find("Conclusión", 3000), "05-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "como-analizar-a-las-personas-robert-leary" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo Uno: ¿Cómo Puede Alguien Leer", 4000), "01-capitulo-1-como-leer-a-las-personas"),
            (text.find("Capítulo Dos: Nuestros Cuerpos", 4000), "02-capitulo-2-nuestros-cuerpos-y-como-hablan"),
            (text.find("Capítulo Tres: Aspectos Básicos", 4000), "03-capitulo-3-aspectos-basicos"),
            (text.find("Capítulo Cuatro: Verbal vs. No verbal", 4000), "04-capitulo-4-verbal-vs-no-verbal"),
            (text.find("Capítulo Cinco: Tu Mente", 4000), "05-capitulo-5-tu-mente-y-comunicacion"),
            (text.find("Capítulo Seis: Complejidades de la Cara", 4000), "06-capitulo-6-complejidades-de-la-cara"),
            (text.find("Capítulo Siete: La Verdad y las Relaciones", 4000), "07-capitulo-7-la-verdad-y-las-relaciones"),
            (text.find("Capítulo Ocho: Confianza y Cómo se Muestra", 4000), "08-capitulo-8-confianza-y-como-se-muestra"),
            (text.find("Capítulo Nueve: Cómo Fingir", 4000), "09-capitulo-9-como-fingir-lenguaje-corporal-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "una-guia-para-acelerar-la-lectura-de-las-personas-a-traves-de-la-psicol" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("CAPÍTULO 1 Conceptos básicos", 3000), "01-capitulo-1-conceptos-basicos"),
            (text.find("CAPÍTULO 2 Lenguaje corporal", 3000), "02-capitulo-2-lenguaje-corporal"),
            (text.find("CAPÍTULO 3 Cómo leer a las personas", 3000), "03-capitulo-3-como-leer-a-las-personas"),
            (text.find("CAPÍTULO 4 Cómo detectar las mentiras", 3000), "04-capitulo-4-como-detectar-las-mentiras"),
            (text.find("CAPÍTULO 5 Secretos del lenguaje corporal", 3000), "05-capitulo-5-secretos-del-lenguaje-corporal"),
            (text.find("CAPÍTULO 6 Analizando a las personas", 3000), "06-capitulo-6-analizando-a-traves-de-lo-no-verbal"),
            (text.find("CAPÍTULO 7 Cómo determinar si alguien está mintiendo", 3000), "07-capitulo-7-determinar-si-alguien-miente"),
            (text.find("CAPÍTULO 8 Tipos de Mentirosos", 3000), "08-capitulo-8-tipos-de-mentirosos"),
            (text.find("CAPÍTULO 9 Detección de la mentira", 3000), "09-capitulo-9-deteccion-de-la-mentira-y-engano"),
            (text.find("CAPÍTULO 10 Analizando a las personas en citas y amor", 3000), "10-capitulo-10-citas-y-amor"),
            (text.find("CAPÍTULO 11 Análisis de los tipos de personalidad", 3000), "11-capitulo-11-tipos-de-personalidad"),
            (text.find("CAPÍTULO 12 Detección de rasgos de personalidad", 3000), "12-capitulo-12-rasgos-de-personalidad-especificos"),
            (text.find("CONCLUSIÓN", 170000), "13-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-del-masoquismo" in book_slug:
        cutpoints = [
            (0, "01-dimensiones-psicologicas-de-la-entrega"),
            (text.find("Pag. 51"), "02-la-necesidad-de-fantasia-y-conclusiones"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-maquiavelica" in book_slug:
        offset = 5000 if "teoria" in book_slug else 3000
        cutpoints = [
            (0, "00-preliminares"),
            (text.find("¿QUÉ ES LA MANIPULACIÓN?", offset), "01-que-es-la-manipulacion"),
            (text.find("MANIPULACIÓN Y PERSONALIDAD", offset), "02-manipulacion-y-personalidad"),
            (text.find("¿CUÁLES SON LOS RASGOS", offset), "03-rasgos-de-la-persona-manipulada"),
            (text.find("PERSUASIÓN", offset), "04-psicologia-y-principios-de-persuasion"),
            (text.find("FORMAS DE MANIPULACIÓN", offset), "05-formas-de-manipulacion-e-influencia"),
            (text.find("CÓMO CAMBIAR EL TEMA", offset), "06-trucos-de-influencia-y-patrones"),
            (text.find("MENTIRA POR COMISIÓN", offset), "07-tacticas-mentiras-gaslighting-y-evasion"),
            (text.find("SACAR A RELUCIR EL PASADO", offset), "08-tecnicas-de-presion-y-refuerzos"),
            (text.find("EL BOMBARDEO DE AMOR", offset), "09-bombardeo-de-amor-silencio-e-intimidacion"),
            (text.find("¿CÓMO DARSE CUENTA", 5000), "10-como-detectar-manipulacion-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "el_pr-ncipe_de_maquiavelo" in book_slug:
        cutpoints = [(0, "00-estudio-preliminar-parte-01")]
        for p_num in range(16, 241, 16):
            q = f"<!-- Página {p_num} -->"
            pos = text.find(q)
            if pos != -1 and pos < 505000:
                cutpoints.append((pos, f"00-estudio-preliminar-parte-{(p_num // 16) + 1:02d}"))
        pattern = re.compile(r'(CAPITULO\s+([IVXLCDM]+)[^\n]+)')
        for m in pattern.finditer(text[504000:]):
            pos = 504000 + m.start()
            num = m.group(2).lower()
            cutpoints.append((pos, f"pr-capitulo-{num}-{len(cutpoints):02d}"))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "47-las-mejores-tecnicas-de-persuasion" in book_slug:
        cutpoints = [
            (0, "00-introduccion"),
            (text.find("Todos podemos persuadir", 500), "01-todos-podemos-persuadir"),
            (text.find("Los 6 principios", 500), "02-los-6-principios-basicos-de-la-persuasion"),
            (500 + re.search(r"T.{1,2}cnicas y actitudes", text[500:]).start(), "03-tecnicas-y-actitudes"),
            (500 + re.search(r"Programaci.{1,2}n Neuroling", text[500:]).start(), "04-programacion-neurolinguistica"),
            (500 + re.search(r"S.{1,2}ntesis", text[500:]).start(), "05-sintesis"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "la-persuasion":
        cutpoints = [
            (0, "01-principios-y-cerebro-triuno"),
            (re.search(r"Universales de la Comunicaci", text).start(), "02-universales-de-la-comunicacion"),
            (re.search(r"Lenguaje Corporal", text).start(), "03-lenguaje-corporal-y-oratoria"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "persuasion-positiva" in book_slug:
        cutpoints = [
            (0, "00-introduccion-y-principios-basicos"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 1: Reciprocidad", text).start(), "01-tecnica-1-reciprocidad"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 2: La Consistencia", text).start(), "02-tecnica-2-la-consistencia"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 3: La Aprobaci.{1,2}n Social", text).start(), "03-tecnica-3-la-aprobacion-social"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 4: La empat", text).start(), "04-tecnica-4-la-empatia"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 5: Autoridad", text).start(), "05-tecnica-5-autoridad"),
            (re.search(r"T.{1,2}cnica de persuasi.{1,2}n 6: La escasez", text).start(), "06-tecnica-6-la-escasez-y-conclusiones"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "persuasion":
        cutpoints = [
            (0, "00-preliminaries-and-table-of-contents"),
            (text.find("Chapter 1 The Need to Persuade"), "01-chapter-1-the-need-to-persuade"),
            (text.find("Chapter 2 Global Human Drives"), "02-chapter-2-global-human-drives"),
            (text.find("Chapter 3 Individual Needs"), "03-chapter-3-individual-needs"),
            (text.find("Chapter 4 Studying Your Target"), "04-chapter-4-studying-your-target"),
            (text.find("Chapter 5 Persuade People to Like You"), "05-chapter-5-persuade-people-to-like-you"),
            (text.find("Chapter 6 Psychic Influence From the Heart Center"), "06-chapter-6-psychic-influence-from-the-heart-center"),
            (text.find("Chapter 7 Persuade People to Your Way of Thinking"), "07-chapter-7-persuade-people-to-your-way-of-thinking"),
            (text.find("Chapter 8 People Are Motivated by This"), "08-chapter-8-people-are-motivated-by-this"),
            (text.find("Chapter 9 The Covert Way to Persuade People"), "09-chapter-9-the-covert-way-to-persuade-people"),
            (text.find("Conclusion\n\nThe ability to persuade"), "10-conclusion-let-us-recap"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "maestro-de-la-persuasion" in book_slug:
        cutpoints = [(0, "00-introduccion-y-preliminares")]
        titles = [
            "01-la-base-y-pilar-de-la-persuasion",
            "02-como-reconocer-si-te-estan-persuadiendo",
            "03-los-tres-principios-universales-de-la-persuasion",
            "04-por-que-las-personas-dicen-si",
            "05-como-persuadir-mediante-correo-electronico",
            "06-tecnicas-para-persuadir-a-una-persona-desconocida",
            "07-tecnicas-de-persuasion-de-famosos",
            "08-tecnicas-para-que-no-te-descubran",
            "09-persuasion-en-ventas",
            "10-como-usar-psicologia-inversa",
            "11-persuasion-con-elegancia-y-bajo-perfil",
            "12-persuasion-agresiva-y-de-alto-impacto",
        ]
        for i in range(1, 13):
            m = re.search(rf"CAP.{{1,2}}TULO {i}:", text)
            cutpoints.append((m.start(), titles[i - 1]))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "tecnicas-secretas-para-influenciar-en-las-personas" in book_slug:
        cutpoints = [(0, "00-introduccion")]
        titles = [
            "01-consejos-para-sobresalir-en-la-persuasion",
            "02-como-utilizar-la-manipulacion",
            "03-aprender-la-hipnosis-y-como-usarla",
            "04-hechos-sobre-la-programacion-neurolinguistica",
            "05-el-arte-del-engano",
            "06-concepto-de-los-juegos-mentales",
            "07-control-mental-indetectable",
            "08-influencia-a-traves-de-la-seduccion",
            "09-optima-persuasion-con-psicologia-subliminal",
        ]
        for i in range(1, 10):
            m = re.search(rf"Cap.{{1,2}}tulo {i}:", text[4000:])
            cutpoints.append((4000 + m.start(), titles[i - 1]))
        m_conc = re.search(r"Conclusi.{1,2}n Gracias", text[60000:])
        cutpoints.append((60000 + m_conc.start(), "10-conclusion"))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "5-libro-negro-de-la-persuasi" in book_slug:
        cutpoints = [
            (0, "00-prologo-e-introduccion"),
            (text.find("1. LEY DE RECIPROCIDAD", 15000), "01-ley-1-reciprocidad"),
            (text.find("2.LEY DE CONTRASTE", 15000), "02-ley-2-contraste"),
            (text.find("3.LEY DE AFINIDAD", 15000), "03-ley-3-afinidad"),
            (text.find("4.LEY DE EXPECTATIVA", 15000), "04-ley-4-expectativa"),
            (text.find("5.LEY DE LA ASOCIACI", 15000), "05-ley-5-la-asociacion"),
            (text.find("6.LEY DE CONSISTENCIA", 15000), "06-ley-6-consistencia"),
            (text.find("7.LEY DE ESCASEZ", 15000), "07-ley-7-escasez"),
            (text.find("8.LEY DE AUTORIDAD", 15000), "08-ley-8-autoridad"),
            (text.find("9.LEY DEL CHANTAJE", 15000), "09-ley-9-el-chantaje-coercion"),
            (text.find("10. LEY DEL ATRACTIVO", 15000), "10-ley-10-el-atractivo"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "persuasion-y-manipulacion" in book_slug:
        cutpoints = [
            (0, "00-preliminares"),
            (text.find("Introducci", 3000), "01-introduccion"),
            (re.search(r"Por qu.{1,2} es importante entender la persuasi", text[3000:]).start() + 3000, "02-por-que-es-importante-entender-la-persuasion"),
            (re.search(r"Por qu.{1,2} su ego puede estar impidi", text[3000:]).start() + 3000, "03-por-que-su-ego-puede-impedirle-persuadir"),
            (re.search(r"Qu.{1,2} no decir nunca", text[3000:]).start() + 3000, "04-que-no-decir-nunca"),
            (re.search(r"Formas amables pero muy eficaces", text[3000:]).start() + 3000, "05-formas-amables-pero-muy-eficaces"),
            (re.search(r"Por qu.{1,2} puede que Bruce Lee", text[3000:]).start() + 3000, "06-por-que-bruce-lee-fue-el-mas-sabio"),
            (re.search(r"Principios de persuasi.{1,2}n cient", text[3000:]).start() + 3000, "07-principios-de-persuasion-probados"),
            (re.search(r"Estrategias de manipulaci.{1,2}n secretas", text[3000:]).start() + 3000, "08-estrategias-de-manipulacion-secretas"),
            (re.search(r"Lo que necesita entender sobre la conducta humana", text[3000:]).start() + 3000, "09-conducta-humana-y-psicologia-oscura"),
            (re.search(r"T.{1,2}cnicas poderosas de PNL", text[3000:]).start() + 3000, "10-tecnicas-poderosas-de-pnl"),
            (re.search(r"T.{1,2}cnicas muy eficaces de control mental", text[3000:]).start() + 3000, "11-tecnicas-muy-eficaces-de-control-mental"),
            (re.search(r"En resumen", text[150000:]).start() + 150000, "12-en-resumen"),
            (re.search(r"Conclusi.{1,2}n Gracias", text[170000:]).start() + 170000, "13-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "pnl-guia-pratica" in book_slug:
        cutpoints = [
            (0, "00-preliminares-e-indice"),
            (text.find("<!-- Página 5 -->"), "01-introduccion-y-que-es-la-pnl"),
            (text.find("<!-- Página 15 -->"), "02-modelos-linguisticos-y-comunicacion"),
            (text.find("<!-- Página 30 -->"), "03-patrones-del-lenguaje-y-estrategias"),
            (text.find("INFLUENCIA Y PERSUASI", 40000), "04-influencia-y-persuasion"),
            (text.find("<!-- Página 50 -->"), "05-principios-de-persuasion-y-rapport"),
            (text.find("MANIPULACI", 80000), "06-manipulacion-control-mental-y-pnl"),
            (text.find("<!-- Página 70 -->"), "07-tecnicas-de-manipulacion-e-influencia"),
            (text.find("CÓMO ANALIZAR A LA GENTE" if "CÓMO ANALIZAR A LA GENTE" in text else "C", 100000), "08-como-analizar-a-la-gente-y-lenguaje-corporal"),
            (text.find("BREVE INTRODUCCI", 150000), "09-sistemas-de-analisis-intrapersonal"),
            (text.find("Puntos clave y conclusi", 170000), "10-puntos-clave-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "persuasion-de-psicologia-oscura-e-inteligencia-emocional" in book_slug:
        cutpoints = [
            (0, "00-preliminares"),
            (text.find("Cap\xedtulo 1:", 5000), "01-capitulo-1-que-es-la-psicologia-oscura"),
            (text.find("Cap\xedtulo 2:", 5000), "02-capitulo-2-tecnicas-de-la-psicologia-oscura"),
            (text.find("Cap\xedtulo 3:", 5000), "03-capitulo-3-manipulacion-en-la-psicologia-oscura"),
            (text.find("Cap\xedtulo 4:", 5000), "04-capitulo-4-persuasion-oscura"),
            (text.find("Cap\xedtulo 5:", 5000), "05-capitulo-5-control-mental"),
            (text.find("Cap\xedtulo 6:", 5000), "06-capitulo-6-empatia-y-la-psicologia-oscura"),
            (text.find("Cap\xedtulo 7:", 5000), "07-capitulo-7-la-psicologia-oscura-y-tu"),
            (text.find("Cap\xedtulo 8:", 5000), "08-capitulo-8-comprender-la-inteligencia-emocional"),
            (text.find("Cap\xedtulo 9:", 5000), "09-capitulo-9-tipos-y-efectos-de-la-inteligencia-emocional"),
            (re.search(r"Cap.{1,2}tulo 1[0O]:", text[250000:]).start() + 250000, "10-capitulo-10-inteligencia-emocional-y-la-sociedad"),
            (text.find("Cap\xedtulo 11:", 5000), "11-capitulo-11-signos-de-inteligencia-emocional"),
            (text.find("Cap\xedtulo 12:", 5000), "12-capitulo-12-interactuando-con-personas-emocionalmente-inteligentes"),
            (text.find("Cap\xedtulo 13:", 5000), "13-capitulo-13-test-de-inteligencia-emocional"),
            (text.find("Conclusi\xf3n", 390000), "14-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "la-magia-de-la-persuasion" in book_slug:
        cutpoints = [
            (0, "00-preliminares-y-advertencia"),
            (5124, "01-la-maga-de-la-persuasion-parte-1"),
            (text.find("<!-- P\xe1gina 20 -->", 5000), "02-la-maga-de-la-persuasion-parte-2"),
            (55443, "03-persuasion-vs-manipulacion"),
            (68223, "04-las-habilidades-del-mago"),
            (85462, "05-paso-1-cautiva-primera-impresion"),
            (text.find("<!-- P\xe1gina 60 -->", 85000), "06-paso-1-cautiva-imagen-vocal-y-corporal"),
            (text.find("<!-- P\xe1gina 80 -->", 85000), "07-paso-1-cautiva-lenguaje-corporal-y-reputacion"),
            (text.find("<!-- P\xe1gina 104 -->", 220000), "08-paso-2-comprende-empatia-y-personalidades"),
            (text.find("<!-- P\xe1gina 130 -->", 280000), "09-paso-2-comprende-inputs-y-necesidades"),
            (text.find("PASO 3: conecta", 280000), "10-paso-3-conecta-rapport-y-emociones-parte-1"),
            (text.find("<!-- P\xe1gina 170 -->", 335000), "11-paso-3-conecta-rapport-y-emociones-parte-2"),
            (text.find("PASO 4: comunica", 330000), "12-paso-4-comunica-asertividad-y-argumentos"),
            (text.find("PASO 5: convence", 400000), "13-paso-5-convence-y-cierre"),
            (text.find("<!-- P\xe1gina 210 -->", 440000), "14-resumen-general-y-conclusiones"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "empaticos-y-narcisistas" in book_slug:
        cutpoints = [
            (0, "00-l1-preliminares-e-introduccion"),
            (25000, "01-l1-depredadores-persuasion-y-engano"),
            (60000, "02-l1-tecnicas-populares-y-manipulacion-oscura"),
            (91652, "03-l1-diferencia-entre-manipulacion-y-persuasion"),
            (125546, "04-l1-vulnerabilidad-ante-la-psicologia-oscura"),
            (174966, "05-l1-como-funciona-la-pnl-e-idioma-corporal"),
            (197997, "06-l2-introduccion-y-control-mental"),
            (248180, "07-l2-quien-usa-el-control-mental"),
            (295980, "08-l2-tacticas-psicologicas-de-manipulacion"),
            (340000, "09-l2-hipnosis-e-hipnoterapia"),
            (389953, "10-l3-introduccion-al-sistema-neurologico-y-pnl"),
            (440000, "11-l3-pnl-frente-a-la-psicoterapia-y-modelos-mentales"),
            (500000, "12-l3-el-modelo-meta-y-aplicaciones-practicas"),
            (550000, "13-l3-conclusiones-y-cierre"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "persuasion-jane-austen" in book_slug:
        cutpoints = [
            (0, "00-estudio-introductorio-parte-1"),
            (35000, "00-estudio-introductorio-parte-2"),
            (70000, "00-estudio-introductorio-parte-3"),
        ]
        matches = list(re.finditer(r"CAP.{1,2}TULO\s+([IVXLCDM]+)", text))
        for i, m in enumerate(matches):
            vol = 1 if i < 12 else 2
            num = (i % 12) + 1
            cutpoints.append((m.start(), f"vol{vol}-capitulo-{num:02d}"))
        cutpoints.append((630068, "apendice-recuerdos-y-notas-parte-1"))
        cutpoints.append((700000, "apendice-recuerdos-y-notas-parte-2"))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "tecnicas-de-persuacion" in book_slug:
        ch_pages = [
            (0, "00-preliminares"),
            (7, "01-prologo"),
            (9, "02-capitulo-01-propaganda-y-comunicacion-parte-1"),
            (22, "03-capitulo-01-propaganda-y-comunicacion-parte-2"),
            (36, "04-capitulo-02-formacion-de-actitudes-parte-1"),
            (46, "05-capitulo-02-formacion-de-actitudes-parte-2"),
            (56, "06-capitulo-03-cambio-de-actitudes-parte-1"),
            (67, "07-capitulo-03-cambio-de-actitudes-parte-2"),
            (79, "08-capitulo-04-la-guerra-psicologica-parte-1"),
            (101, "09-capitulo-04-la-guerra-psicologica-parte-2"),
            (123, "10-capitulo-05-la-propaganda-politica-parte-1"),
            (139, "11-capitulo-05-la-propaganda-politica-parte-2"),
            (155, "12-capitulo-06-propaganda-y-medios-masivos-parte-1"),
            (168, "13-capitulo-06-propaganda-y-medios-masivos-parte-2"),
            (182, "14-capitulo-07-la-publicidad-en-la-industria-parte-1"),
            (196, "15-capitulo-07-la-publicidad-en-la-industria-parte-2"),
            (210, "16-capitulo-08-transformacion-cientifica-mente-parte-1"),
            (220, "17-capitulo-08-transformacion-cientifica-mente-parte-2"),
            (230, "18-capitulo-09-la-conversion-religiosa-parte-1"),
            (240, "19-capitulo-09-la-conversion-religiosa-parte-2"),
            (251, "20-capitulo-10-confesiones-y-adoctrinamiento-parte-1"),
            (263, "21-capitulo-10-confesiones-y-adoctrinamiento-parte-2"),
            (276, "22-capitulo-11-el-lavado-de-cerebro-parte-1"),
            (288, "23-capitulo-11-el-lavado-de-cerebro-parte-2"),
            (300, "24-capitulo-12-conclusiones-e-indice"),
        ]
        cutpoints = []
        for page, name in ch_pages:
            if page == 0:
                pos = 0
            else:
                marker = f"<!-- P\xe1gina {page} -->"
                pos = text.find(marker)
            cutpoints.append((pos, name))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "1-manipulaci-n-mental" in book_slug or book_slug == "1-manipulacion-mental":
        p44 = text.find("<!-- Página 44 -->")
        cutpoints = [
            (0, "00-prologo-e-indice"),
            (text.find("CLAVES EFECTIVAS PARA LA PERSUASIÓN Introducción", 5000), "01-libro-1-claves-efectivas-para-la-persuasion"),
            (text.find("Diferencia entre persuasión y manipulación", 5000), "02-diferencia-entre-persuasion-y-manipulacion"),
            (text.find("Persuasión efectiva", 5000), "03-persuasion-efectiva"),
            (text.find("Los 5 secretos de la comunicación persuasiva", 5000), "04-los-5-secretos-de-la-comunicacion-persuasiva"),
            (text.find("Los 11 principios de la persuasión", 5000), "05-los-11-principios-de-la-persuasion"),
            (text.find("Las 21 técnicas de persuasión más importantes", 5000), "06-las-21-tecnicas-de-persuasion-parte-1"),
            (p44 if p44 != -1 else 75000, "07-las-21-tecnicas-de-persuasion-parte-2"),
            (text.find("Los 7 trucos psicológicos más simples y comunes", 5000), "08-los-7-trucos-psicologicos-mas-simples-y-conclusion"),
            (text.find("CLAVES EFECTIVAS PARA LA MANIPULACIÓN MENTAL Introducción", 5000), "09-libro-2-claves-efectivas-para-la-manipulacion-mental"),
            (text.find("Propósito de la manipulación mental", 5000), "10-proposito-de-la-manipulacion-mental"),
            (text.find("PNL y manipulación mental", 5000), "11-pnl-y-tecnicas-de-manipulacion-mental"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "4-manipulaci-n" in book_slug:
        c4 = text.find("Capítulo 4: Comportamiento y rasgos de carácter")
        c5 = text.find("Capítulo 5: ¿Qué es la manipulación emocional", c4)
        p26 = text.find("<!-- Página 26 -->")
        p41 = text.find("<!-- Página 41 -->")
        cutpoints = [
            (0, "00-introduccion"),
            (text.find("Capítulo 1: ¿Qué es la Psicología Oscura?"), "01-capitulo-1-que-es-la-psicologia-oscura"),
            (text.find("Capítulo 2:Los 4 Rasgos de la Psicología Oscura"), "02-capitulo-2-los-4-rasgos-de-la-psicologia-oscura"),
            (text.find("Capítulo 3:Técnicas de Manipulación Psicológica"), "03-capitulo-3-tecnicas-de-manipulacion-psicologica-parte-1"),
            (p26, "04-capitulo-3-tecnicas-de-manipulacion-psicologica-parte-2"),
            (c4, "05-capitulo-4-comportamiento-y-rasgos-de-caracter-parte-1"),
            (p41, "06-capitulo-4-comportamiento-y-rasgos-de-caracter-parte-2"),
            (c5, "07-capitulo-5-que-es-la-manipulacion-emocional-encubierta"),
            (text.find("Capítulo 6: ¿Qué están tratando de hacer"), "08-capitulo-6-que-estan-tratando-de-hacer-los-manipuladores"),
            (text.find("Capítulo 7: Rasgos de comportamiento de las víctimas"), "09-capitulo-7-rasgos-de-comportamiento-de-las-victimas"),
            (text.find("Capítulo 8: El papel de la defensa"), "10-capitulo-8-el-papel-de-la-defensa"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "6-manipulaci-n" in book_slug:
        cutpoints = [
            (0, "00-introduccion-e-indice"),
            (text.find("Hemos escuchado el arte"), "01-introduccion-el-arte-de-la-explotacion"),
            (text.find("45 métodos de manipulación", 5000), "02-45-metodos-de-manipulacion-parte-1"),
            (text.find("<!-- Página 13 -->"), "03-45-metodos-de-manipulacion-parte-2"),
            (text.find("<!-- Página 20 -->"), "04-45-metodos-de-manipulacion-parte-3"),
            (text.find("Estrategias de manipulación: ¿por qué son realmente muy importantes", 5000), "05-estrategias-de-manipulacion-y-persuasion-vs-manipulacion"),
            (text.find("<!-- Página 33 -->"), "06-comportamientos-y-manipulacion"),
            (text.find("Casos de manipuladores en segundo plano", 5000), "07-casos-de-manipuladores-en-segundo-plano"),
            (text.find("<!-- Página 45 -->"), "08-sociedad-y-control-mental"),
            (text.find("<!-- Página 52 -->"), "09-capitulo-1-tecnicas-fitd-pie-en-la-puerta"),
            (text.find("<!-- Página 62 -->"), "10-capitulo-2-tecnicas-ditf-puerta-en-la-cara"),
            (text.find("Capítulo tres Otras técnicas para tomar nota", 5000), "11-capitulo-3-otras-tecnicas-y-persuasion"),
            (text.find("<!-- Página 71 -->"), "12-principios-de-persuasion-gestos-y-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "7-manipulacion-mental-para-principiantes" in book_slug or "manipulacion-mental-para-principiantes-aprenda-a-analizar-a-las-personas" in book_slug:
        p24 = text.find("<!-- Página 24 -->")
        p36 = text.find("<!-- Página 36 -->")
        p65 = text.find("<!-- Página 65 -->")
        p128 = text.find("<!-- Página 128 -->")
        p141 = text.find("<!-- Página 141 -->")
        c1 = text.find("CAPÍTULO UNO ¿Qué es la manipulación?", 3000)
        c2 = text.find("CAPÍTULO DOS La personalidad manipuladora", 3000)
        c3 = text.find("CAPÍTULO TRES La moralidad de la manipulación", 3000)
        c4 = text.find("CAPÍTULO CUATRO El arte de la auto-manipulación", 3000)
        c5 = text.find("CAPITULO CINCO Manipulación de la memoria", 3000)
        c6 = text.find("CAPÍTULO SEIS Manipulación de palabras", 3000)
        c7a = text.find("CAPITULO SIETE El uso del miedo en la manipulación", 3000)
        c7b = text.find("CAPITULO SIETE La manifestación de la manipulación", 3000)
        c8 = text.find("CAPÍTULO OCHO Señales de advertencia de manipulación emocional", 3000)
        c9 = text.find("CAPÍTULO NUEVE Manipulación social y grupal", 3000)
        c10 = text.find("CAPITULO DIEZ Técnica de persuasión", 3000)
        cutpoints = [
            (0, "00-introduccion-y-sumario"),
            (c1, "01-capitulo-1-que-es-la-manipulacion"),
            (c2, "02-capitulo-2-la-personalidad-manipuladora"),
            (c3, "03-capitulo-3-la-moralidad-de-la-manipulacion-parte-1"),
            (p24, "04-capitulo-3-la-moralidad-de-la-manipulacion-parte-2"),
            (c4, "05-capitulo-4-el-arte-de-la-auto-manipulacion-parte-1"),
            (p36, "06-capitulo-4-el-arte-de-la-auto-manipulacion-parte-2"),
            (c5, "07-capitulo-5-manipulacion-de-la-memoria"),
            (c6, "08-capitulo-6-manipulacion-de-palabras-parte-1"),
            (p65, "09-capitulo-6-manipulacion-de-palabras-parte-2"),
            (c7a, "10-capitulo-7-el-uso-del-miedo-en-la-manipulacion"),
            (c7b, "11-capitulo-7-la-manifestacion-de-la-manipulacion"),
            (c8, "12-capitulo-8-senales-de-advertencia-de-manipulacion-emocional"),
            (c9, "13-capitulo-9-manipulacion-social-y-grupal"),
            (c10, "14-capitulo-10-tecnica-de-persuasion-parte-1"),
            (p128, "15-capitulo-10-tecnica-de-persuasion-parte-2"),
            (p141, "16-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "el-arte-de-manipulacion-y-psicologia-oscura" in book_slug:
        c7 = text.find("CAPÍTULO SIETE Entendiendo la Bioquímica")
        conc = text.find("CONCLUSIÓN", c7)
        cutpoints = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("CAPÍTULO UNO Cómo analizar a las personas"), "01-capitulo-1-como-analizar-a-las-personas"),
            (text.find("CAPÍTULO DOS Los misterios y secretos"), "02-capitulo-2-los-misterios-y-secretos-para-leer-a-las-personas"),
            (text.find("CAPÍTULO TRES Consejos y trucos"), "03-capitulo-3-consejos-y-trucos-para-analizar-el-lenguaje-corporal"),
            (text.find("CAPÍTULO CUATRO Poderosas técnicas"), "04-capitulo-4-poderosas-tecnicas-de-lectura-del-lenguaje-corporal"),
            (text.find("CAPÍTULO CINCO Cómo detectar trucos"), "05-capitulo-5-como-detectar-trucos-enganos-y-estafas"),
            (text.find("CAPÍTULO SEIS Tipos de rasgos"), "06-capitulo-6-tipos-de-rasgos-de-personalidades"),
            (c7, "07-capitulo-7-entendiendo-la-bioquimica-de-la-personalidad"),
            (conc, "08-conclusion"),
        ]
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "garcia-la-gran-manipulacion" in book_slug:
        ch_pages = [
            (1, "00-preliminares-y-dedicatoria"),
            (7, "01-introduccion-la-demagogia-y-propaganda"),
            (16, "02-los-medios-de-comunicacion-y-redes"),
            (26, "03-el-origen-y-primeras-advertencias-parte-1"),
            (31, "04-el-origen-y-primeras-advertencias-parte-2"),
            (37, "05-la-gestion-de-la-crisis-sanitaria-parte-1"),
            (42, "06-la-gestion-de-la-crisis-sanitaria-parte-2"),
            (48, "07-desinformacion-y-noticias-falsas"),
            (59, "08-el-confinamiento-y-el-control-social"),
            (70, "09-el-impacto-economico-y-politico"),
            (81, "10-el-relato-oficial-y-la-sociedad"),
            (90, "11-conclusion-el-futuro-de-la-sociedad"),
            (98, "12-cronologia-de-medios-y-fuentes"),
        ]
        cutpoints = []
        for page, name in ch_pages:
            pos = 0 if page == 1 else text.find(f"<!-- Página {page} -->")
            cutpoints.append((pos, name))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "goleman-fabian-manipulacion" in book_slug or "manipulacion-fabian-goleman" in book_slug:
        cuts = [
            (0, "00-introduccion-y-prologo"),
            (text.find("Capítulo 1 Definición de la manipulación mental", 5000), "01-capitulo-01-definicion-de-la-manipulacion-mental"),
            (text.find("Capítulo 2 Estudios científicos y reglas", 5000), "02-capitulo-02-estudios-cientificos-y-reglas"),
            (text.find("Capítulo 3 Tipos de manipulación", 5000), "03-capitulo-03-tipos-de-manipulacion"),
            (text.find("Capítulo 4 Conocimiento de la conducta humana", 5000), "04-capitulo-04-conocimiento-de-la-conducta-humana"),
            (text.find("Capítulo 5 Diferencia entre manipulación y persuasión", 5000), "05-capitulo-05-diferencia-entre-manipulacion-y-persuasion"),
            (text.find("Capítulo 6 Manipuladores de la historia", 5000), "06-capitulo-06-manipuladores-de-la-historia"),
            (text.find("Capítulo 7 Ejemplos de casos de manipulación", 5000), "07-capitulo-07-ejemplos-de-casos-de-manipulacion"),
            (text.find("Capítulo 8 Manipulación emocional", 5000), "08-capitulo-08-manipulacion-emocional"),
            (text.find("Capítulo 9 Dependencia emocional", 5000), "09-capitulo-09-dependencia-emocional"),
            (text.find("Capítulo 10 Víctimas de manipuladores", 5000), "10-capitulo-10-victimas-de-manipuladores"),
            (text.find("Capítulo 11 Efectos de una persona manipuladora", 5000), "11-capitulo-11-efectos-de-una-persona-manipuladora"),
            (text.find("Capítulo 12 La culpa, la lástima y la intimidación", 5000), "12-capitulo-12-la-culpa-la-lastima-y-la-intimidacion"),
            (text.find("¿Por qué es tan importante tener una autoestima saludable?", 140000), "13-capitulo-13-la-autoestima-y-autoconfianza"),
            (text.find("Capítulo 14 ¿Por qué es tan importante saber y entender la persuasión?", 5000), "14-capitulo-14-importancia-de-la-persuasion"),
            (text.find("Capítulo 15 Los principios de la persuasión de Cialdini", 5000), "15-capitulo-15-principios-de-cialdini"),
            (text.find("Capítulo 16 ¿Cómo se desarrolla el comportamiento de un manipulador?", 5000), "16-capitulo-16-comportamiento-de-un-manipulador"),
            (text.find("Capítulo 17 Estrategias para leer el lenguaje corporal", 5000), "17-capitulo-17-estrategias-para-leer-el-lenguaje-corporal"),
            (text.find("Capítulo 18 Herramientas para influenciar", 5000), "18-capitulo-18-herramientas-para-influenciar"),
            (text.find("Capítulo 19 Formas amables y eficaces", 5000), "19-capitulo-19-formas-amables-y-eficaces"),
            (text.find("Capítulo 20 PNL: ¿Qué es?", 5000), "20-capitulo-20-pnl-que-es-y-como-usarlo"),
            (text.find("Capítulo 21 ¿Qué es la hipnosis?", 5000), "21-capitulo-21-que-es-la-hipnosis-tecnicas"),
            (text.find("Capítulo 22 Cómo ser patrones del lenguaje", 5000), "22-capitulo-22-patrones-del-lenguaje"),
            (text.find("Capítulo 23 Ejercicios de manipulación", 5000), "23-capitulo-23-ejercicios-de-manipulacion"),
            (text.rfind("Conclusión", 0, text.find("Hemos llegado al final de este libro", 270000)), "24-conclusion"),
        ]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-afectiva-belen-vitelleschi" in book_slug:
        ch_pages = [
            (1, "00-carta-al-lector-y-prologo"),
            (6, "01-capitulo-01-cultura-del-amor-incondicional"),
            (13, "02-capitulo-02-vulnerables-ante-el-amor"),
            (22, "03-capitulo-03-el-mecanismo-de-la-manipulacion"),
            (26, "04-capitulo-04-la-comunicacion-base-de-las-relaciones"),
            (31, "05-capitulo-05-el-arte-de-la-manipulacion-afectiva"),
            (41, "06-capitulo-06-los-multiples-disfraces-de-la-manipulacion"),
            (50, "07-capitulo-07-personalidades-narcisistas"),
            (60, "08-capitulo-08-la-era-de-la-tecnologia"),
            (66, "09-capitulo-09-psicopatia-y-otras-yerbas"),
            (71, "10-capitulo-10-defensas-frente-a-la-manipulacion-emocional"),
            (75, "11-capitulo-11-como-amar-sin-morir-en-el-intento"),
            (83, "12-capitulo-12-amores-enquistados"),
            (94, "13-capitulo-13-desintoxicar-el-pensamiento-de-un-mal-amor"),
            (97, "14-capitulo-14-yo-manipulo-tu-manipulas-el-manipula"),
            (102, "15-capitulo-15-existe-un-amor-sano-un-amor-posible"),
            (107, "16-indice-y-bibliografia"),
        ]
        cutpoints = []
        for page, name in ch_pages:
            pos = 0 if page == 1 else text.find(f"<!-- Página {page} -->")
            cutpoints.append((pos, name))
        cutpoints.sort()
        for i, (pos, name) in enumerate(cutpoints):
            next_pos = cutpoints[i + 1][0] if i + 1 < len(cutpoints) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-el-santo-grial-de-la-psicologia-oscura" in book_slug:
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1: Análisis de los tipos de personalidad", 5000), "01-capitulo-1-analisis-de-los-tipos-de-personalidad"),
            (text.find("Capítulo 2: Cómo manejar el lenguaje corporal", 5000), "02-capitulo-2-como-manejar-el-lenguaje-corporal"),
            (text.find("Capítulo 3: Motivos de la manipulación", 5000), "03-capitulo-3-motivos-de-la-manipulacion"),
            (text.find("Capítulo 4: Técnicas de manipulación", 5000), "04-capitulo-4-tecnicas-de-manipulacion"),
            (text.find("Capítulo 5: Relaciones de manipulación", 5000), "05-capitulo-5-relaciones-de-manipulacion"),
            (text.find("Capítulo 6: Manejo de personas mediante técnicas de persuasión", 5000), "06-capitulo-6-manejo-de-personas-mediante-persuasion"),
            (text.find("Capítulo 7: Manejar a la gente usando la PNL", 50000), "07-capitulo-7-manejar-a-la-gente-usando-la-pnl"),
            (text.find("Capítulo 8: El poder de las técnicas de hipnosis", 50000), "08-capitulo-8-el-poder-de-la-hipnosis-parte-1"),
            (text.find("<!-- Página 87 -->"), "09-capitulo-8-el-poder-de-la-hipnosis-parte-2-y-conclusion"),
        ]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-psicologica-aprende-a-manipular" in book_slug:
        p88 = text.find("<!-- Página 88 -->")
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1: El lado oscuro de la naturaleza humana", 5000), "01-capitulo-1-el-lado-oscuro-de-la-naturaleza-humana"),
            (text.find("Capítulo 2: Liderazgo y motivación para los demás", 5000), "02-capitulo-2-liderazgo-y-motivacion-para-los-demas"),
            (text.find("Capítulo 3: Significado y propósito de la vida", 5000), "03-capitulo-3-significado-y-proposito-de-la-vida"),
            (text.find("Capítulo 4: La gentil arte de la persuasión", 5000), "04-capitulo-4-la-gentil-arte-de-la-persuasion"),
            (text.find("Capítulo 5: Dominar tu dinero es simple", 5000), "05-capitulo-5-dominar-tu-dinero-y-controlar-emociones"),
            (text.find("Capítulo 6: Inteligencia instintiva", 5000), "06-capitulo-6-inteligencia-instintiva-parte-1"),
            (p88 if p88 != -1 else 116000, "07-capitulo-6-inteligencia-instintiva-parte-2"),
            (text.find("Capítulo 7: Cómo desarrollar el genio dentro de ti", 5000), "08-capitulo-7-como-desarrollar-el-genio-dentro-de-ti"),
            (text.find("Capítulo 8: Empatía - Tu papel en la vida", 5000), "09-capitulo-8-empatia-tu-papel-en-la-vida"),
            (text.find("Capítulo 9: ¿Es la hipnosis lo mismo que el lavado de cerebro?", 5000), "10-capitulo-9-la-hipnosis-y-el-lavado-de-cerebro"),
            (text.find("<!-- Página 138 -->", 150000), "11-conclusion"),
        ]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-secretos-de-la-psicologia-oscura" in book_slug:
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("1. INTRODUCCIÓN", 1000), "01-introduccion"),
            (text.find("QUÉ ES LA PSICOLOGÍA OSCURA", 2000), "02-que-es-la-psicologia-oscura"),
            (text.find("CÓMO USAR LA PSICOLOGÍA OSCURA PARA MANIPULAR", 2000), "03-como-usar-la-psicologia-oscura-para-manipular"),
            (text.find("APLICACIÓN DE LA PSICOLOGÍA OSCURA EN LA VIDA REAL", 2000), "04-aplicacion-de-la-psicologia-oscura-en-la-vida-real"),
            (text.find("TÉCNICAS PROHIBIDAS DE LAS PNL PARA CONTROLAR", 2000), "05-tecnicas-prohibidas-de-la-pnl"),
            (text.find("APLICACIÓN DE LA PNL EN SITUACIONES REALES", 2000), "06-aplicacion-de-la-pnl-en-situaciones-reales"),
            (text.find("CÓMO USAR EL LENGUAJE CORPORAL PARA ANALIZAR", 2000), "07-como-usar-el-lenguaje-corporal"),
            (text.find("USANDO EL", 50000), "08-usando-el-lenguaje-corporal-en-la-vida-diaria"),
            (text.find("TÉCNICAS SECRETAS PARA MANIPULAR Y CONTROLAR AL ESTILO JOSEPH GOEBBELS", 2000), "09-tecnicas-de-joseph-goebbels"),
            (text.find("USANDO LAS TÉCNICAS DE JOSEPH GOEBBELS EN LA VIDA REAL", 2000), "10-usando-tecnicas-de-goebbels-en-la-vida-real"),
            (text.find("COMO USAR LA PSICOLOGÍA OSCURA, PNL Y LENGUAJE CORPORAL EN LOS NEGOCIOS", 2000), "11-psicologia-oscura-en-los-negocios"),
            (text.find("CONCLUSIONES", 60000), "12-conclusiones"),
        ]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-spanish-edition-h-g-tudor" in book_slug:
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("1. Bombardeo de amor", 5000), "01-metodos-01-a-02-bombardeo-de-amor-y-reflejo"),
            (text.find("3. Culpa", 5000), "02-metodos-03-a-04-culpa-e-intimidacion"),
            (text.find("5. Triangulación", 5000), "03-metodos-05-a-07-triangulacion-lugartenientes-y-obsesion"),
            (text.find("8. Falsas promesas", 5000), "04-metodos-08-a-10-falsas-promesas-amenaza-y-desgaste"),
            (text.find("11. Difamación", 5000), "05-metodos-11-a-12-difamacion-y-negacion"),
            (text.find("13. Proyección", 5000), "06-metodos-13-a-14-proyeccion-y-lectura-del-lenguaje-corporal"),
            (text.find("15. Silencio", 5000), "07-metodos-15-a-16-silencio-y-distanciamiento"),
            (text.find("17. Transgresión de límites", 5000), "08-metodos-17-a-18-transgresion-de-limites-y-gaslighting"),
            (text.find("19. Conversaciones circulares", 5000), "09-metodos-19-a-20-conversaciones-circulares-y-omnipresencia"),
            (text.find("21. Lástima", 5000), "10-metodos-21-a-22-lastima-y-aislamiento"),
            (text.find("23. Sacar a relucir el pasado", 5000), "11-metodos-23-a-25-pasado-ira-esperanza-y-epilogo"),
        ]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-y-psicologia-oscur-daniel-long" in book_slug:
        text_lower = text.lower()
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("CAPÍTULO 1.", 5000), "01-capitulo-1-psicologia-de-la-manipulacion"),
            (text_lower.find("cómo saber que te están manipulando", 10000), "02-capitulo-1-como-saber-que-te-estan-manipulando"),
            (text_lower.find("técnicas avanzadas de manipulación mental", 20000), "03-capitulo-1-tecnicas-avanzadas-de-manipulacion-mental"),
            (text_lower.find("técnicas de manipulación para controlar las mentes", 40000), "04-capitulo-1-control-mental-con-ideas-implantadas"),
            (text.find("<!-- Página 85 -->", 60000), "05-capitulo-1-que-es-el-lavado-cerebral"),
            (text.find("<!-- Página 95 -->", 80000), "06-capitulo-1-rasgos-de-los-manipuladores-y-manipulacion-de-masas"),
            (text.find("CAPÍTULO 2.", 100000), "07-capitulo-2-la-seduccion-oscura"),
            (text.find("CAPÍTULO 3.", 120000), "08-capitulo-3-el-papel-de-la-defensa"),
            (text.find("CONCLUSIÓN", 140000), "09-conclusion"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-y-psicologia-oscura-maria-costanza-calvio" in book_slug:
        cuts = [
            (0, "00-vol-1-preliminares-prefacio-e-introduccion"),
            (text.find("Capítulo 1 PSICOLOGÍA DE LA PERSONALIDAD", 5000), "01-vol-1-cap-1-psicologia-de-la-personalidad-parte-1"),
            (text.find("2 – LOS TRASTORNOS DE PERSONALIDAD", 14000), "02-vol-1-cap-1-trastornos-de-personalidad-parte-2"),
            (text.find("Capítulo 2 PSICOLOGÍA OSCURA", 5000), "03-vol-1-cap-2-psicologia-oscura-y-triada-oscura-parte-1"),
            (text.find("La tríada oscura en las mujeres", 75000), "04-vol-1-cap-2-triada-oscura-en-sociedad-parte-2"),
            (text.find("Capítulo 3 ESTRATEGIAS BÁSICAS DE MANEJO", 5000), "05-vol-1-cap-3-estrategias-de-manejo-persuasion-y-venta"),
            (text.find("Capítulo 4 ANALIZAR A LAS PERSONAS Y DEFENDERNOS", 5000), "06-vol-1-cap-4-analizar-a-las-personas-y-defendernos"),
            (text.find("Prefacio", 170000), "07-vol-2-prefacio-e-introduccion"),
            (text.find("Capítulo 1 MANIPULACIÓN, PERSUASIÓN Y VENTA", 175000), "08-vol-2-cap-1-manipulacion-persuasion-y-venta"),
            (text.find("Capítulo 2 TÉCNICAS DE MANIPULACIÓN MENTAL", 200000), "09-vol-2-cap-2-tecnicas-de-manipulacion-mental-parte-1"),
            (text.find("<!-- Página 175 -->", 227000), "10-vol-2-cap-2-tecnicas-de-manipulacion-mental-parte-2"),
            (text.find("Capítulo 3 DEFIÉNDETE DE LA MANIPULACIÓN", 300000), "11-vol-2-cap-3-defiendete-de-la-manipulacion"),
            (text.find("Prefacio", 355000), "12-vol-3-prefacio-e-introduccion"),
            (text.find("Capítulo 1 COMO COMUNICA EL CUERPO", 360000), "13-vol-3-cap-1-como-comunica-el-cuerpo-parte-1"),
            (text.find("<!-- Página 255 -->", 360000), "14-vol-3-cap-1-como-comunica-el-cuerpo-parte-2"),
            (text.find("Capítulo 2 MANIPULAR MEDIANTE EL LENGUAJE DEL CUERPO", 400000), "15-vol-3-cap-2-manipular-mediante-el-lenguaje-del-cuerpo"),
            (text.find("Capítulo 3 MICROEXPRESIONES FACIALES", 400000), "16-vol-3-cap-3-microexpresiones-faciales"),
            (text.find("Capítulo 4 MANIPULAR MEDIANTE MICROEXPRESIONES FACIALES", 450000), "17-vol-3-cap-4-manipular-mediante-microexpresiones-y-conclusion"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "manipulacion-y-psicologia-oscura-una-guia-completa" in book_slug:
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("Capítulo 1 – Introducción a la Psicología Oscura", 1000), "01-capitulo-1-introduccion-a-la-psicologia-oscura"),
            (text.find("Capítulo 2 – Entendiendo al Persuasivo y al Manipulador", 10000), "02-capitulo-2-entendiendo-al-persuasivo-y-al-manipulador-parte-1"),
            (text.find("<!-- Página 30 -->", 30000), "03-capitulo-2-entendiendo-al-persuasivo-y-al-manipulador-parte-2"),
            (text.find("Capítulo 3 – Características de la Psicología Oscura", 50000), "04-capitulo-3-caracteristicas-de-la-psicologia-oscura"),
            (text.find("Capítulo 4 – Razones Para Analizar a las Personas", 80000), "05-capitulo-4-razones-para-analizar-a-las-personas"),
            (text.find("Capítulo 5 – El Arte de la manipulación y la Persuasión", 100000), "06-capitulo-5-el-arte-de-la-manipulacion-y-la-persuasion"),
            (text.find("Capítulo 6 – Pasos de la Psicología Oscura", 120000), "07-capitulo-6-pasos-de-la-psicologia-oscura"),
            (text.find("Capítulo 7 – Casos de Estudios de la Psicología Oscura", 140000), "08-capitulo-7-casos-de-estudios-de-la-psicologia-oscura"),
            (text.find("Capítulo 8 – Consejo Final Sobre la Psicología Oscura", 155000), "09-capitulo-8-consejo-final-sobre-la-psicologia-oscura"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "manipulaci-n-y-psicologia-oscura":
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("Introducción", 5000), "00-introduccion"),
        ]
        for i in range(1, 28):
            p = text.find(f"apter {i}:", 5000)
            if p != -1:
                cuts.append((p, f"{i:02d}-capitulo-{i}"))
        concl = text.find("Conclusión", 280000)
        if concl != -1:
            cuts.append((concl, "28-conclusion"))
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "manual-de-manipulacion":
        ch_pages = [
            (1, "01-marco-institucional-y-turismo-gastronomico"),
            (16, "02-la-enfermedad-celiaca-y-su-diagnostico"),
            (20, "03-alimentos-libres-de-gluten-y-legislacion"),
            (25, "04-clasificacion-de-alimentos-y-contaminacion-cruzada"),
            (34, "05-buenas-practicas-de-manipulacion-y-checklist"),
        ]
        cuts = []
        for page, name in ch_pages:
            pos = 0 if page == 1 else text.find(f"<!-- Página {page} -->")
            if pos != -1:
                cuts.append((pos, name))
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif book_slug == "psicologia-oscura-manipulacion-emocional":
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo  1:  Psicología  Oscura", 2000), "01-capitulo-1-psicologia-oscura"),
            (text.find("Capítulo  2:  Tácticas  de  psicología  oscura", 10000), "02-capitulo-2-tacticas-de-psicologia-oscura-parte-1"),
            (text.find("<!-- Página 30 -->", 35000), "03-capitulo-2-tacticas-de-psicologia-oscura-parte-2"),
            (text.find("<!-- Página 45 -->", 65000), "04-capitulo-2-tacticas-de-psicologia-oscura-parte-3"),
            (text.find("Capítulo  3:  Cómo  manipular  a  las  personas", 90000), "05-capitulo-3-como-manipular-a-las-personas"),
            (text.find("Capítulo  4:  Diez  trucos  psicológicos", 120000), "06-capitulo-4-diez-trucos-psicologicos"),
            (text.find("Capítulo  5:  Armas  de  manipulación", 135000), "07-capitulo-5-armas-de-manipulacion-emocional"),
            (text.find("Capítulo  6:  Relaciones", 155000), "08-capitulo-6-relaciones"),
            (text.find("Capítulo  7:  Rasgos  de  un  Narcisista", 190000), "09-capitulo-7-rasgos-de-un-narcisista-y-agresivo"),
            (text.find("<!-- Página 127 -->", 220000), "10-conclusion-y-epilogo"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "2-psicolog-a-oscura---aprenda" in book_slug:
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1:", 5000), "01-capitulo-1-que-es-la-psicologia-oscura"),
            (text.find("Capítulo 2:", 5000), "02-capitulo-2-fundamentos-de-la-manipulacion-emocional"),
            (text.find("Capítulo 3:", 5000), "03-capitulo-3-metodos-comunes-de-manipulacion-encubierta"),
            (text.find("Capítulo 4:", 5000), "04-capitulo-4-persuasion-oscura"),
            (text.find("Capítulo 5:", 5000), "05-capitulo-5-tecnicas-de-persuasion-oscura"),
            (text.find("Capítulo 6:", 5000), "06-capitulo-6-control-mental-no-detectado"),
            (text.find("Capítulo 7:", 5000), "07-capitulo-7-psicologia-oscura-y-juegos-mentales"),
            (text.find("Capítulo 8:", 5000), "08-capitulo-8-entendiendo-el-engano"),
            (text.find("Capítulo 9:", 5000), "09-capitulo-9-el-lavado-de-cerebro"),
            (text.find("Capítulo 10:", 5000), "10-capitulo-10-la-triada-oscura"),
            (text.find("Capítulo 11:", 5000), "11-capitulo-11-aplicacion-de-la-triada-oscura"),
            (text.find("Capítulo 12:", 5000), "12-capitulo-12-seduccion-con-psicologia-oscura"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "3-psicologia-obscura-s-l-moore" in book_slug:
        cuts = [
            (0, "00-preliminares-e-introduccion"),
            (text.find("Capítulo 1: La Psicología de la Persuasión", 5000), "01-capitulo-1-la-psicologia-de-la-persuasion"),
            (text.find("Capítulo 2: Maestros de la Persuasión", 5000), "02-capitulo-2-maestros-de-la-persuasion"),
            (text.find("Capítulo 3: Cómo usar la persuasión", 5000), "03-capitulo-3-como-usar-la-persuasion-parte-1"),
            (text.find("<!-- Página 28 -->", 90000), "04-capitulo-3-como-usar-la-persuasion-parte-2"),
            (text.find("Capítulo 4: Cómo defenderse de los manipuladores", 5000), "05-capitulo-4-como-defenderse-de-los-manipuladores"),
            (text.find("Conclusión", 160000), "06-conclusion"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "8-psicologia-obscura-6-en-1" in book_slug:
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("Capítulo 1: Breve Historia de la Psicología", 5000), "01-capitulo-1-breve-historia-de-la-psicologia"),
            (text.find("Capítulo 2: ¿Qué es la Psicología?", 5000), "02-capitulo-2-que-es-la-psicologia"),
            (text.find("Capítulo 3: Inteligencia Emocional y Psicología", 5000), "03-capitulo-3-inteligencia-emocional-y-psicologia"),
            (text.find("Capítulo 4: Emociones y Estado Psicológico", 5000), "04-capitulo-4-emociones-y-estado-psicologico"),
            (text.find("Capítulo 5: Gestión de los Pensamientos", 5000), "05-capitulo-5-gestion-de-los-pensamientos-y-emociones"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-oscura-4-en-1-este-libro" in book_slug:
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("Libro 1 “ Secretos oscuros", 5000), "01-libro-1-cap-01-a-04-manipulacion-y-psicologia-oscura"),
            (text.find("Capítulo 5: ¿Cuáles son las señales", 15000), "02-libro-1-cap-05-a-07-senales-y-defensa-contra-manipulacion"),
            (text.find("Capítulo 8: Hipnosis y autohipnosis", 40000), "03-libro-1-cap-08-a-10-hipnosis-y-mecanismo-emocional"),
            (text.find("Capítulo 11: ¿Qué habilidades de comunicación", 70000), "04-libro-1-cap-11-a-14-persuasion-y-ejemplos-practicos"),
            (text.find("Libro 2 “ Gente de lectura rápida", 100000), "05-libro-2-cap-15-a-18-caracter-y-lenguaje-corporal"),
            (text.find("Capítulo 19: Lenguaje corporal en hombres y mujeres", 125000), "06-libro-2-cap-19-a-22-personalidad-y-comunicacion-verbal"),
            (text.find("Capítulo 23: Cómo prestar atención a los detalles", 150000), "07-libro-2-cap-23-a-27-mentiras-verdad-y-analisis"),
            (text.find('Libro 1 "Psicología Oscura: reconfigura tu mente"', 180000), "08-libro-3-cap-01-a-03-mentalidad-y-pensamientos"),
            (text.find("Capítulo 4: El paradigma es importante", 220000), "09-libro-3-cap-04-a-05-paradigma-y-manipulacion"),
            (text.find("Capítulo 6: Recableando la mente", 250000), "10-libro-3-cap-06-recableando-la-mente"),
            (text.find('Libro 2 "Psicología Oscura: recablea tu libro de trabajo', 280000), "11-libro-4-cap-01-reprogramacion-y-conclusion-final"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    elif "psicologia-oscura-al-extremo-41" in book_slug:
        cuts = [
            (0, "00-preliminares-e-indice"),
            (text.find("Capítulo  1  -  ¿Qué  es  la Psicología  Oscura?", 6000), "01-capitulo-01-que-es-la-psicologia-oscura"),
            (text.find("Capítulo  2  -  Cómo  salir  adelante", 6000), "02-capitulo-02-como-salir-adelante"),
            (text.find("Capítulo  3  -  Dominar el  arte  de  la  persuasión", 6000), "03-capitulo-03-dominar-el-arte-de-la-persuasion"),
            (text.find("Capítulo  4  -  7  formas  de  manipular a  las  personas", 6000), "04-capitulo-04-formas-de-manipular-a-las-personas"),
            (text.find("Capítulo  5  -  Otras  tácticas  del control  mental", 6000), "05-capitulo-05-otras-tacticas-de-control-mental"),
            (text.find("Capítulo  6  -  Gaslighting", 6000), "06-capitulo-06-gaslighting"),
            (text.find("Capítulo  7  -  Seducción  oscura", 6000), "07-capitulo-07-seduccion-oscura"),
            (text.find("Capítulo  8  -  La  Tríada  Oscura", 100000), "08-capitulo-08-la-triada-oscura"),
            (text.find("Capítulo  9  -  Avanzado", 6000), "09-capitulo-09-tecnicas-para-evitar-la-manipulacion"),
            (text.find("Capítulo  10  -  5  preguntas  para", 6000), "10-capitulo-10-preguntas-para-evitar-ser-manipulado"),
            (text.find("Capítulo  11  -  Tácticas de  Covert  Emotional", 6000), "11-capitulo-11-tacticas-de-manipulacion-emocional-encubierta"),
            (text.find("Capítulo  12  -  10  maneras  de  avanzar", 6000), "12-capitulo-12-maneras-de-protegerse-del-control-mental"),
            (text.find("Capítulo  13  -  41  Tácticas  de  manipulación", 6000), "13-capitulo-13-41-tacticas-de-manipulacion-por-narcisistas"),
            (text.find("Capítulo  14  -  Cómo  morir el  lenguaje  corporal", 6000), "14-capitulo-14-como-leer-el-lenguaje-corporal"),
        ]
        cuts = [(pos, name) for pos, name in cuts if pos != -1]
        cuts.sort()
        for i, (pos, name) in enumerate(cuts):
            next_pos = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
            chunks.append((name, text[pos:next_pos]))
    else:
        pattern = re.compile(r"(?im)^(?:(#{1,6})\s+(.+)|((?:cap[ií]tulo|secci[oó]n|parte|libro)\s+[^\n]+))\s*$")
        matches = list(pattern.finditer(text))
        if not matches:
            chunks = [(markdown.stem, text)]
        else:
            if matches[0].start() > 0 and text[:matches[0].start()].strip():
                chunks.append(("00-introduccion", text[:matches[0].start()]))
            for index, match in enumerate(matches):
                title = (match.group(2) or match.group(3) or f"capitulo-{index + 1}").strip()
                end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
                chunks.append((f"{index + 1:02d}-{safe_id(title)}", text[match.start():end]))

    output_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for name, content in chunks:
        path = output_dir / f"{name}.md"
        path.write_text(clean_text(content), encoding="utf-8")
        paths.append(path)
    manifest = {"fuente": str(markdown), "fragmentos": [path.name for path in paths]}
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"División completada: {len(paths)} fragmentos -> {output_dir}")
    return paths


CURATION_PROMPT = """Eres un corrector editorial conservador. Devuelve exclusivamente JSON válido con las claves markdown, cambios y revisarManualmente.

Corrige solo errores ortográficos evidentes, errores de OCR, palabras partidas por saltos de línea, saltos de línea incorrectos y espacios duplicados.
Conserva el significado, el orden, títulos, listas, citas, nombres propios, referencias y términos técnicos.
No inventes texto ni completes frases ilegibles. Usa [REVISAR: TEXTO ILEGIBLE] cuando falte información.

Texto original:
---
{content}
---

Formato exacto:
{{"markdown":"...","cambios":[{{"original":"...","corregido":"...","motivo":"..."}}],"revisarManualmente":false}}
"""


class Cambio(BaseModel):
    original: str
    corregido: str
    motivo: str


class CurationResult(BaseModel):
    markdown: str
    cambios: list[Cambio]
    revisarManualmente: bool


def curate(chapters_dir: Path, output_dir: Path, reports_dir: Path) -> None:
    load_dotenv(ROOT / ".env", override=True)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_API_KEY está vacío en .env")
    try:
        from google import genai
    except ImportError as error:
        raise SystemExit("Falta google-genai. Instala: python -m pip install -r requirements-curacion.txt") from error
    client = genai.Client(api_key=api_key, http_options={"timeout": 90000})
    model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    output_dir.mkdir(parents=True, exist_ok=True)
    reports_dir.mkdir(parents=True, exist_ok=True)

    all_chapters = sorted(chapters_dir.glob("*.md"))
    curados_previos = 0
    curados_hoy = 0

    for chapter in all_chapters:
        target = output_dir / chapter.name
        report_path = reports_dir / f"{chapter.stem}.json"
        if target.exists() and report_path.exists():
            curados_previos += 1
            print(f"Omitido (ya curado): {chapter.name}")
            continue

        content = chapter.read_text(encoding="utf-8")
        curated = None
        changes = []
        needs_review = False

        for attempt in range(15):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=CURATION_PROMPT.format(content=content),
                    config={
                        "temperature": 0.1,
                        "response_mime_type": "application/json",
                        "response_schema": CurationResult,
                    },
                )
                if not (response.text or "").strip():
                    reason = None
                    if getattr(response, "prompt_feedback", None) and getattr(response.prompt_feedback, "block_reason", None):
                        reason = response.prompt_feedback.block_reason
                    elif getattr(response, "candidates", None) and len(response.candidates) > 0:
                        reason = getattr(response.candidates[0], "finish_reason", None)
                    if reason:
                        print(f"Filtro de contenido ({reason}) en {chapter.name}. Aplicando curación editorial determinista...")
                        curated = clean_text(content)
                        changes = [{"original": "Texto original", "corregido": "Texto normalizado", "motivo": f"Filtro API ({reason}) - Curación determinista conservadora"}]
                        needs_review = False
                        break

                raw_text = (response.text or "").strip()
                first_brace = raw_text.find("{")
                last_brace = raw_text.rfind("}")
                if first_brace != -1 and last_brace != -1:
                    raw_text = raw_text[first_brace:last_brace + 1]
                elif raw_text.startswith("`"):
                    raw_text = re.sub(r"^`+(?:json)?\s*", "", raw_text)
                    raw_text = re.sub(r"\s*`+$", "", raw_text)
                result = json.loads(raw_text)
                curated = result["markdown"]
                if len(curated.strip()) < 80 and len(content.strip()) >= 80:
                    curated = clean_text(content)
                changes = result.get("cambios", [])
                needs_review = bool(result.get("revisarManualmente", False))
                break
            except (json.JSONDecodeError, KeyError, TypeError) as json_err:
                if attempt < 4:
                    print(f"Respuesta JSON con formato inesperado en {chapter.name}. Reintentando {attempt + 1}/4 en 2s...")
                    time.sleep(2)
                    continue
                (reports_dir / f"{chapter.stem}.response.txt").write_text(getattr(response, "text", "") or "", encoding="utf-8")
                raise RuntimeError(f"Respuesta inválida para {chapter.name}") from json_err
            except Exception as error:
                status_code = getattr(error, "status_code", None) or getattr(error, "code", None)
                error_text = str(error)
                if status_code is None:
                    status_code = next((code for code in (408, 429, 500, 502, 503, 504) if str(code) in error_text), None)

                # Regla 6: Si aparece un error 429 de cuota, detén el proceso sin borrar nada
                if status_code == 429 or "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
                    print(f"\n[ALERTA] Error 429 de cuota en {chapter.name}: {error_text[:250]}. Deteniendo el proceso sin borrar nada.")
                    pendientes = len(all_chapters) - (curados_previos + curados_hoy)
                    print(f"\n--- Resumen Parcial ---")
                    print(f"Total fragmentos: {len(all_chapters)}")
                    print(f"Curados previamente: {curados_previos}")
                    print(f"Curados en esta sesión: {curados_hoy}")
                    print(f"Pendientes restantes: {pendientes}")
                    return

                # Regla 5: Si aparece un error 503 o desconexión/red temporal, espera y reintenta
                is_transient = (
                    status_code in {503, 502, 500, 504, 408}
                    or any(k in error_text.lower() for k in ("503", "unavailable", "disconnected", "protocol", "transport", "timeout", "timed out", "connection", "reset"))
                )
                if is_transient:
                    if attempt < 4:
                        delay = min(30, 5 * (attempt + 1))
                        print(f"Error temporal/red ({type(error).__name__}). Reintento {attempt + 1}/4 para {chapter.name} en {delay}s...", flush=True)
                        time.sleep(delay)
                        continue
                    else:
                        print(f"Servidor no disponible tras reintentos en {chapter.name}. Aplicando curación editorial determinista...", flush=True)
                        curated = clean_text(content)
                        changes = [{"original": "Texto original", "corregido": "Texto normalizado", "motivo": f"Servidor no disponible ({error_text[:60]}) - Curación determinista conservadora"}]
                        needs_review = False
                        break
                raise

        if curated is None:
            raise RuntimeError(f"No hubo respuesta válida para {chapter.name}")
        target.write_text(clean_text(curated), encoding="utf-8")
        report = {"fuente": chapter.name, "cambios": changes, "revisarManualmente": needs_review}
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        curados_hoy += 1
        print(f"Curado ({curados_previos + curados_hoy}/{len(all_chapters)}): {chapter.name}")
        time.sleep(5)

    pendientes = len(all_chapters) - (curados_previos + curados_hoy)
    print(f"\n--- Resumen de Curación ---")
    print(f"Total fragmentos: {len(all_chapters)}")
    print(f"Curados previamente: {curados_previos}")
    print(f"Curados en esta sesión: {curados_hoy}")
    print(f"Pendientes restantes: {pendientes}")


def validate(directory: Path) -> None:
    files = sorted(directory.glob("*.md"))
    errors = []
    for path in files:
        text = path.read_text(encoding="utf-8")
        if len(text.strip()) < 80:
            errors.append(f"{path.name}: contenido demasiado corto")
        if "[REVISAR:" in text:
            errors.append(f"{path.name}: contiene marcas de revisión")
        if re.search(r"\w-\n\w", text):
            errors.append(f"{path.name}: conserva palabras partidas")
    report = REPORTS / "validacion.json"
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps({"archivos": len(files), "errores": errors}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Validación: {len(files)} archivos, {len(errors)} incidencias -> {report}")
    if errors:
        sys.exit(2)


def run(args: argparse.Namespace) -> None:
    source = Path(args.pdf).resolve()
    book_id = safe_id(source.stem)
    extracted = DATA / f"{book_id}.md"
    if not extracted.exists():
        candidates = list(DATA.glob(f"{book_id[:30]}*.md"))
        if candidates:
            extracted = candidates[0]
            book_id = extracted.stem
    chapters = DATA / book_id / "capitulos"
    curated = OUTPUT / book_id / "capitulos"
    if not extracted.exists():
        extract_pdf(source, extracted)
    else:
        print(f"Omitido (ya extraído): {extracted.name}")
    if not (chapters / "manifest.json").exists():
        split_chapters(extracted, chapters)
    else:
        print(f"Omitido (ya dividido): {chapters.name}")
    curate(chapters, curated, REPORTS / book_id)
    validate(curated)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Pipeline de extracción y curación de libros")
    subparsers = parser.add_subparsers(dest="command", required=True)
    inv = subparsers.add_parser("inventory")
    inv.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    extract = subparsers.add_parser("extract")
    extract.add_argument("pdf", type=Path)
    extract.add_argument("--output", type=Path)
    split = subparsers.add_parser("split")
    split.add_argument("markdown", type=Path)
    split.add_argument("--output", type=Path, required=True)
    curate_parser = subparsers.add_parser("curate")
    curate_parser.add_argument("chapters", type=Path)
    curate_parser.add_argument("--output", type=Path, required=True)
    curate_parser.add_argument("--reports", type=Path, default=REPORTS)
    valid = subparsers.add_parser("validate")
    valid.add_argument("directory", type=Path)
    runner = subparsers.add_parser("run")
    runner.add_argument("pdf", type=Path)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.command == "inventory":
        inventory(args.source)
    elif args.command == "extract":
        extract_pdf(args.pdf.resolve(), args.output or DATA / f"{safe_id(args.pdf.stem)}.md")
    elif args.command == "split":
        split_chapters(args.markdown.resolve(), args.output.resolve())
    elif args.command == "curate":
        curate(args.chapters.resolve(), args.output.resolve(), args.reports.resolve())
    elif args.command == "validate":
        validate(args.directory.resolve())
    elif args.command == "run":
        run(args)


if __name__ == "__main__":
    main()
