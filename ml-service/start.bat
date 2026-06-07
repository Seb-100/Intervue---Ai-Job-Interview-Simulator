@echo off
echo ==========================================
echo  Intervue.ai  — ML Service Setup
echo ==========================================

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install from https://python.org
    pause & exit /b 1
)

:: Create venv if missing
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Activate venv
call .venv\Scripts\activate.bat

:: Install dependencies
echo Installing dependencies (first run takes ~3 min for sentence-transformers)...
pip install -r requirements.txt -q

:: Train salary model if not already trained
if not exist "models\salary_model.joblib" (
    echo Training salary model...
    python train_salary.py
)

:: Start FastAPI
echo.
echo Starting ML service on http://localhost:8000
echo Press Ctrl+C to stop.
echo.
uvicorn main:app --reload --port 8000
