from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, projects, tasks
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.database import get_db

app = FastAPI(
    title="Task Management System API",
    description="REST API for managing projects and tasks",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "status": 200,
            "database": "Service is available",
        }

    except Exception:
        return {
            "status": "401",
            "database": "Service Unavailable",
        }