# SMT Backend (FastAPI)

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Health Check

```bash
curl http://localhost:8000/api/v1/health
```
