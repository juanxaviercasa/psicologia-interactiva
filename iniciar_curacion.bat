@echo off
setlocal
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo No existe el entorno virtual. Ejecuta primero:
  echo python -m venv .venv
  echo .venv\Scripts\pip install -r requirements-curacion.txt
  pause
  exit /b 1
)
if "%~1"=="" (
  echo Uso: iniciar_curacion.bat "ruta\al\libro.pdf"
  pause
  exit /b 1
)
.venv\Scripts\python.exe scripts\curacion_libros\pipeline.py run "%~1"
pause
