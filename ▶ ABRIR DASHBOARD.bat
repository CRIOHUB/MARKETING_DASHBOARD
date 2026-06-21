@echo off
chcp 65001 >nul
title CrioCord Dashboard 2026

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   CRIOCORD PERU — Dashboard KPI 2026         ║
echo  ║   Actualizando datos desde Excel...          ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado. Instala Python desde https://python.org
    pause
    exit /b 1
)

:: Instalar openpyxl si no esta instalado
python -c "import openpyxl" >nul 2>&1
if errorlevel 1 (
    echo  Instalando openpyxl...
    pip install openpyxl --quiet
)

:: Ir a la carpeta del script
cd /d "%~dp0"

:: Regenerar HTML desde el Excel
echo  Leyendo CRIOCORD - DATA HUB 2026.xlsx...
python GENERAR_DASHBOARD.py
if errorlevel 1 (
    echo.
    echo [ERROR] No se pudo generar el dashboard. Revisa que el archivo
    echo         "CRIOCORD - DATA HUB 2026.xlsx" este en esta carpeta.
    pause
    exit /b 1
)

echo.
echo  Abriendo en el navegador...
start "" "DASHBOARD CRIOCORD 2026.html"
echo  Listo!
timeout /t 2 >nul
