import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import DiagnosisRecord, FeedbackRecord
from app.schemas import ApplianceDiagnosis, FeedbackSubmission

def create_diagnosis_record(
    db: Session,
    media_url: str,
    media_type: str,
    diagnosis: ApplianceDiagnosis
) -> DiagnosisRecord:
    record = DiagnosisRecord(
        media_url=media_url,
        media_type=media_type,
        appliance_type=diagnosis.appliance_type,
        brand_model_guess=diagnosis.brand_model_guess,
        identified_issue=diagnosis.identified_issue,
        error_code=diagnosis.error_code,
        confidence_score=diagnosis.confidence_score,
        safety_risk_level=diagnosis.safety_risk_level,
        safety_reasoning=diagnosis.safety_reasoning,
        is_diy_safe=diagnosis.is_diy_safe,
        required_tools_json=json.dumps(diagnosis.required_tools or []),
        repair_steps_json=json.dumps(diagnosis.repair_steps or []),
        estimated_time_minutes=diagnosis.estimated_time_minutes,
        requires_professional_reason=diagnosis.requires_professional_reason
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_diagnosis_history(db: Session, limit: int = 50) -> List[DiagnosisRecord]:
    return db.query(DiagnosisRecord).order_by(DiagnosisRecord.created_at.desc()).limit(limit).all()

def get_diagnosis_by_id(db: Session, diagnosis_id: int) -> Optional[DiagnosisRecord]:
    return db.query(DiagnosisRecord).filter(DiagnosisRecord.id == diagnosis_id).first()

def save_feedback(db: Session, feedback_data: FeedbackSubmission) -> Optional[DiagnosisRecord]:
    record = get_diagnosis_by_id(db, feedback_data.diagnosis_id)
    if not record:
        return None
    
    # Update status on main record
    record.feedback = feedback_data.feedback
    if feedback_data.notes:
        record.feedback_notes = feedback_data.notes
        
    # Also log detailed feedback record
    fb_entry = FeedbackRecord(
        diagnosis_id=feedback_data.diagnosis_id,
        feedback_type=feedback_data.feedback,
        notes=feedback_data.notes
    )
    db.add(fb_entry)
    db.commit()
    db.refresh(record)
    return record
