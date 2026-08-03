from typing import Literal, Optional, List
from pydantic import BaseModel, Field, field_validator, model_validator

class ApplianceDiagnosis(BaseModel):
    appliance_type: str = Field(
        ...,
        description="Type of the appliance (e.g., 'washing machine', 'circuit breaker', 'refrigerator')"
    )
    brand_model_guess: Optional[str] = Field(
        default=None,
        description="Best guess from visible branding/model plate, or null if not confidently identifiable"
    )
    identified_issue: str = Field(
        ...,
        description="Plain-language description of the observed fault or issue"
    )
    error_code: Optional[str] = Field(
        default=None,
        description="Visible digital/blinking error code (e.g. 'E4', 'LE', 'F21'), or null"
    )
    confidence_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score between 0.0 and 1.0"
    )
    safety_risk_level: Literal["low", "medium", "high", "call_a_professional"] = Field(
        ...,
        description="Safety risk assessment classification"
    )
    safety_reasoning: str = Field(
        ...,
        description="Detailed explanation of why this safety risk level was assigned"
    )
    is_diy_safe: bool = Field(
        ...,
        description="Whether this fix is safe for a homeowner DIY attempt"
    )
    required_tools: List[str] = Field(
        default_factory=list,
        description="List of tools required for the repair"
    )
    repair_steps: List[str] = Field(
        default_factory=list,
        description="Ordered, plain-language DIY repair instructions"
    )
    estimated_time_minutes: Optional[int] = Field(
        default=None,
        description="Estimated time required in minutes if DIY safe"
    )
    requires_professional_reason: Optional[str] = Field(
        default=None,
        description="Required explanation when is_diy_safe is False"
    )
    ai_model_used: Optional[str] = Field(
        default="FixVision AI Vision Engine",
        description="The multimodal vision model that generated this diagnosis"
    )

    @field_validator("confidence_score", mode="after")
    @classmethod
    def validate_confidence_score(cls, v: float) -> float:
        return round(max(0.0, min(1.0, float(v))), 2)

    @model_validator(mode="after")
    def validate_safety_and_diy(self) -> "ApplianceDiagnosis":
        if self.safety_risk_level in ("high", "call_a_professional"):
            self.is_diy_safe = False

        if not self.is_diy_safe:
            self.repair_steps = []
            if not self.requires_professional_reason or not self.requires_professional_reason.strip():
                self.requires_professional_reason = self.safety_reasoning or (
                    "This repair involves high risk (electrical, gas, or structural plumbing) "
                    "and requires a licensed professional."
                )

        if self.error_code and self.error_code.strip():
            appliance_lower = (self.appliance_type or "").lower().strip()
            unclear_keywords = ["unknown", "unclear", "unidentified", "general", "other", "appliance", "something"]
            is_unclear = any(kw in appliance_lower for kw in unclear_keywords) or len(appliance_lower) < 3
            if is_unclear and self.confidence_score >= 0.6:
                self.confidence_score = 0.55

        return self

class DiagnosisCreateResponse(BaseModel):
    id: int
    media_url: str
    media_type: str
    diagnosis: ApplianceDiagnosis
    created_at: str

class DiagnosisHistoryItem(BaseModel):
    id: int
    media_url: str
    media_type: str
    appliance_type: str
    brand_model_guess: Optional[str]
    identified_issue: str
    error_code: Optional[str]
    confidence_score: float
    safety_risk_level: str
    is_diy_safe: bool
    requires_professional_reason: Optional[str]
    ai_model_used: Optional[str] = "FixVision AI Vision Engine"
    created_at: str
    feedback: Optional[str] = None

class FeedbackSubmission(BaseModel):
    diagnosis_id: int
    feedback: Literal["worked", "didnt_work", "called_pro"]
    notes: Optional[str] = None

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    appliance_type: str
    identified_issue: str
    is_diy_safe: bool
    messages: List[ChatMessage]

class ContactRequest(BaseModel):
    brand: str = Field(..., description="Device brand name")
    model: str = Field(..., description="Device model number")
    phone: str = Field(..., description="User contact phone number")
    appliance_type: Optional[str] = Field(default=None, description="Appliance or device category")

class ContactResponse(BaseModel):
    status: str = "success"
    ticket_id: str
    message: str
