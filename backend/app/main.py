import json
import uuid
from pathlib import Path
from typing import List
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, get_db
from app.schemas import ApplianceDiagnosis, DiagnosisCreateResponse, DiagnosisHistoryItem, FeedbackSubmission
from app.llm_service import diagnose_appliance
import app.crud as crud

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multimodal AI Visual Appliance Diagnostic & Safety Troubleshooter API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

@app.get("/api/health")
@app.get("/health")
def read_health():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs"
    }

@app.post("/diagnose")
@app.post("/api/diagnose")
async def diagnose_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type:
        mime = "image/jpeg"
    else:
        mime = file.content_type.lower()
        
    is_video = "video" in mime or file.filename.lower().endswith((".mp4", ".mov", ".webm", ".avi"))
    media_type = "video" if is_video else "image"

    file_ext = Path(file.filename).suffix or (".mp4" if is_video else ".jpg")
    filename = f"{uuid.uuid4().hex}{file_ext}"
    saved_path = settings.UPLOAD_DIR / filename

    with open(saved_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    try:
        diagnosis: ApplianceDiagnosis = diagnose_appliance(
            str(saved_path),
            media_type,
            original_filename=file.filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic analysis failed: {str(e)}")

    media_url = f"/uploads/{filename}"

    record = crud.create_diagnosis_record(
        db=db,
        media_url=media_url,
        media_type=media_type,
        diagnosis=diagnosis
    )

    return DiagnosisCreateResponse(
        id=record.id,
        media_url=record.media_url,
        media_type=record.media_type,
        diagnosis=diagnosis,
        created_at=record.created_at.isoformat()
    )

@app.get("/history")
@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    records = crud.get_diagnosis_history(db)
    history_items = []
    for r in records:
        history_items.append(
            DiagnosisHistoryItem(
                id=r.id,
                media_url=r.media_url,
                media_type=r.media_type,
                appliance_type=r.appliance_type,
                brand_model_guess=r.brand_model_guess,
                identified_issue=r.identified_issue,
                error_code=r.error_code,
                confidence_score=r.confidence_score,
                safety_risk_level=r.safety_risk_level,
                is_diy_safe=r.is_diy_safe,
                requires_professional_reason=r.requires_professional_reason,
                created_at=r.created_at.isoformat(),
                feedback=r.feedback
            )
        )
    return history_items

@app.post("/feedback")
@app.post("/api/feedback")
def submit_feedback(data: FeedbackSubmission, db: Session = Depends(get_db)):
    updated = crud.save_feedback(db, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Diagnosis record not found")
    return {"status": "success", "message": "Feedback submitted successfully"}
