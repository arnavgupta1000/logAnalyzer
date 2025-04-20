from fastapi import APIRouter, UploadFile, Depends
from services.llm_summary import generate_summary_parts
from sqlalchemy.orm import Session
import json
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal, init_db
from models import LogAnalysis
import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

init_db()

@router.post("/upload")
async def upload_log(file: UploadFile, db: Session = Depends(get_db)):
    content = await file.read()
    decoded = content.decode()
    summary_data = generate_summary_parts(decoded)
    filename = file.filename
    summary = summary_data.get("summary", "")
    parts = summary_data.get("parts", [])
    # Store in DB
    log_entry = LogAnalysis(
        filename=filename,
        summary=summary,
        parts=json.dumps(parts),
        created_at=datetime.datetime.utcnow()
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return {
        "summary": summary,
        "parts": parts,
        "id": log_entry.id
    }

@router.get("/analyses")
def list_analyses(db: Session = Depends(get_db)):
    results = db.query(LogAnalysis).order_by(LogAnalysis.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "created_at": r.created_at,
        } for r in results
    ]

@router.get("/analyses/{analysis_id}")
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(LogAnalysis).filter(LogAnalysis.id == analysis_id).first()
    if not analysis:
        return {"error": "Not found"}
    return {
        "id": analysis.id,
        "filename": analysis.filename,
        "summary": analysis.summary,
        "parts": json.loads(analysis.parts),
        "created_at": analysis.created_at,
    }
