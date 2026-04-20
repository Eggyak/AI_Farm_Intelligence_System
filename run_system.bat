@echo off
setlocal

cd /d "%~dp0"

set "PYTHON_CMD="

if exist "venv\Scripts\python.exe" (
    set "PYTHON_CMD=%CD%\venv\Scripts\python.exe"
) else (
    where py >nul 2>nul
    if not errorlevel 1 (
        set "PYTHON_CMD=py -3"
    ) else (
        where python >nul 2>nul
        if not errorlevel 1 (
            set "PYTHON_CMD=python"
        )
    )
)

if not defined PYTHON_CMD (
    echo Python was not found.
    echo Install Python 3.8+ or create a venv in this project, then run this file again.
    pause
    exit /b 1
)

echo Starting backend on http://127.0.0.1:8000
start "Farm Backend" cmd /k "%PYTHON_CMD% -m uvicorn backend.api.server:app --host 127.0.0.1 --port 8000"

echo Starting frontend on http://127.0.0.1:3000
start "Farm Frontend" cmd /k "cd /d ""%CD%\frontend"" && %PYTHON_CMD% -m http.server 3000"

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:3000/index.html"

echo.
echo System launch started.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:3000/index.html
echo.
echo If the backend window shows missing modules, install them first, for example:
echo %PYTHON_CMD% -m pip install fastapi uvicorn pandas numpy requests python-dotenv pillow opencv-python scikit-learn tensorflow ollama
echo.
pause
