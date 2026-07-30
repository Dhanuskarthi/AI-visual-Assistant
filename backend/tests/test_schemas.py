import pytest
from app.schemas import ApplianceDiagnosis

def test_is_diy_safe_autocorrect_when_high_risk():
    d = ApplianceDiagnosis(
        appliance_type="circuit breaker",
        brand_model_guess=None,
        identified_issue="sparking wire",
        error_code=None,
        confidence_score=0.9,
        safety_risk_level="high",
        safety_reasoning="Sparking high voltage",
        is_diy_safe=True,  # Should be auto-corrected to False
        required_tools=["screwdriver"],
        repair_steps=["Turn off power", "Replace wire"],
        estimated_time_minutes=15,
        requires_professional_reason="Severe electrical risk"
    )
    assert d.is_diy_safe is False
    assert d.repair_steps == []

def test_repair_steps_emptied_when_not_diy_safe():
    d = ApplianceDiagnosis(
        appliance_type="water heater",
        brand_model_guess=None,
        identified_issue="gas valve leak",
        error_code="E1",
        confidence_score=0.85,
        safety_risk_level="call_a_professional",
        safety_reasoning="Gas leak hazard",
        is_diy_safe=False,
        required_tools=["wrench"],
        repair_steps=["Tighten valve"],  # Should be cleared
        estimated_time_minutes=20,
        requires_professional_reason="Gas hazard"
    )
    assert d.is_diy_safe is False
    assert d.repair_steps == []

def test_error_code_with_unclear_appliance_type():
    d = ApplianceDiagnosis(
        appliance_type="unknown appliance",
        brand_model_guess=None,
        identified_issue="error code E4 displayed",
        error_code="E4",
        confidence_score=0.85,  # Should be forced < 0.6
        safety_risk_level="low",
        safety_reasoning="Unknown appliance type with error code",
        is_diy_safe=True,
        required_tools=[],
        repair_steps=["Clean filter"],
        estimated_time_minutes=5,
        requires_professional_reason=None
    )
    assert d.confidence_score < 0.6
