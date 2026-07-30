import pytest
from app.schemas import ApplianceDiagnosis
from app.safety import evaluate_safety

def test_gas_safety_override():
    diag = ApplianceDiagnosis(
        appliance_type="gas furnace",
        brand_model_guess=None,
        identified_issue="Noticeable gas smell near ignition burner",
        error_code=None,
        confidence_score=0.9,
        safety_risk_level="low",  # Wrong level from hypothetical weak LLM
        safety_reasoning="Gas smell observed",
        is_diy_safe=True,
        required_tools=["wrench"],
        repair_steps=["Check gas line"],
        estimated_time_minutes=15,
        requires_professional_reason=None
    )
    safe_diag = evaluate_safety(diag)
    assert safe_diag.is_diy_safe is False
    assert safe_diag.safety_risk_level == "call_a_professional"
    assert safe_diag.repair_steps == []
    assert "DANGER" in safe_diag.requires_professional_reason

def test_sparking_electrical_safety_override():
    diag = ApplianceDiagnosis(
        appliance_type="dryer outlet",
        brand_model_guess=None,
        identified_issue="sparking exposed wire behind wall outlet",
        error_code=None,
        confidence_score=0.88,
        safety_risk_level="medium",
        safety_reasoning="Visible spark",
        is_diy_safe=True,
        required_tools=["tape"],
        repair_steps=["Wrap tape around wire"],
        estimated_time_minutes=10,
        requires_professional_reason=None
    )
    safe_diag = evaluate_safety(diag)
    assert safe_diag.is_diy_safe is False
    assert safe_diag.safety_risk_level == "call_a_professional"
    assert safe_diag.repair_steps == []

def test_low_confidence_safety_override():
    diag = ApplianceDiagnosis(
        appliance_type="dishwasher",
        brand_model_guess=None,
        identified_issue="Mild noise",
        error_code=None,
        confidence_score=0.35,  # Low confidence (< 0.5)
        safety_risk_level="low",
        safety_reasoning="Low confidence reading",
        is_diy_safe=True,
        required_tools=[],
        repair_steps=["Inspect door latch"],
        estimated_time_minutes=5,
        requires_professional_reason=None
    )
    safe_diag = evaluate_safety(diag)
    assert safe_diag.is_diy_safe is False
    assert safe_diag.safety_risk_level == "call_a_professional"
    assert safe_diag.repair_steps == []
