# EXO AI Backend

## Local development

```powershell
cd backend
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

Health endpoint: `http://127.0.0.1:8002/api/v1/health`

Interactive API documentation: `http://127.0.0.1:8002/docs`

Set `CORS_ORIGINS` to a comma-separated list of frontend origins before production deployment.
