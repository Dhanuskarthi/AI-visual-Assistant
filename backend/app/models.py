import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class DiagnosisRecord(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    media_url = Column(String, nullable=False)
    media_type = Column(String, nullable=False)  # "image" or "video"
    
    appliance_type = Column(String, nullable=False)
    brand_model_guess = Column(String, nullable=True)
    identified_issue = Column(Text, nullable=False)
    error_code = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=False)
    safety_risk_level = Column(String, nullable=False)
    safety_reasoning = Column(Text, nullable=False)
    is_diy_safe = Column(Boolean, nullable=False)
    required_tools_json = Column(Text, nullable=False)  # JSON string array
    repair_steps_json = Column(Text, nullable=False)    # JSON string array
    estimated_time_minutes = Column(Integer, nullable=True)
    requires_professional_reason = Column(Text, nullable=True)
    ai_model_used = Column(String, nullable=True)
    
    feedback = Column(String, nullable=True)  # "worked", "didnt_work", "called_pro"
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    feedbacks = relationship("FeedbackRecord", back_populates="diagnosis", cascade="all, delete-orphan")

class FeedbackRecord(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_id = Column(Integer, ForeignKey("diagnoses.id"), nullable=False)
    feedback_type = Column(String, nullable=False)  # "worked", "didnt_work", "called_pro"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    diagnosis = relationship("DiagnosisRecord", back_populates="feedbacks")
