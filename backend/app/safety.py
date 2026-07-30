import re
from typing import List, Tuple
from app.schemas import ApplianceDiagnosis

# Refined safety trigger patterns avoiding false positives on negative assertions (e.g. "no gas")
SAFETY_RULES: List[Tuple[str, str, str]] = [
    (
        "gas_hazard",
        r"\b(gas leak|gas line|gas smell|smell.*gas|propane|methane|gas ignition|pilot light|gas valve|odor of gas|fuel line leak|petrol leak|diesel leak)\b",
        "DANGER: Potential gas or fuel leak. Fuel/gas repairs carry severe explosive and fire risks and must be handled by a certified technician or automotive specialist."
    ),
    (
        "electrical_hazard",
        r"\b(exposed wire|frayed wire|frayed cord|sparking|burning smell|smoke from wire|short circuit|arc flash|live wire|shock hazard|scorched wire|ev battery pack|high voltage line)\b",
        "DANGER: Electrical hazard detected (exposed wiring, high-voltage battery, or sparking). Attempting DIY work presents severe risk of electrical shock or fire."
    ),
    (
        "swollen_battery",
        r"\b(swollen battery|bloated battery|puffed battery|punctured battery|lithium fire|thermal runaway)\b",
        "DANGER: Swollen or punctured Lithium-Ion battery (Phone/Laptop/EV). Swollen batteries carry extreme thermal runaway and fire risks. Do not puncture or attempt to force open."
    ),
    (
        "automotive_brake_fuel",
        r"\b(brake fluid leak|brake line leak|failed brakes|steering column failure|airbag light|engine block fracture|head gasket rupture)\b",
        "DANGER: Critical automotive safety system failure (Brakes/Steering/Airbags/Engine). Driving or DIY repairs on critical vehicle safety systems requires a certified mechanic."
    ),
    (
        "breaker_retrip",
        r"\b(re-trip|retrip|trips immediately|tripping immediately|breaker won't reset|breaker keeps tripping|repeatedly tripping)\b",
        "DANGER: Breaker re-trips immediately after reset. This indicates an active dead short or severe electrical overload fault. Forcing a reset can cause electrical fire."
    ),
    (
        "plumbing_structural",
        r"\b(main water shutoff|gas shutoff|behind.*wall|in-wall|wall pipe|inside the wall|under slab|main line leak)\b",
        "DANGER: In-wall plumbing or main shutoff valve work required. Improper repairs can cause catastrophic structural water damage or flooding."
    ),
    (
        "refrigerant_hvac",
        r"\b(refrigerant|freon|hvac compressor|r410a|r134a|r32|coolant leak|compressor line|sealed system)\b",
        "DANGER: Refrigerant / HVAC sealed system fault. EPA regulations mandate certified technicians for refrigerant recovery and sealed compressor repairs."
    )
]

def evaluate_safety(diagnosis: ApplianceDiagnosis) -> ApplianceDiagnosis:
    """
    Hard-coded post-processing safety filter.
    Evaluates the diagnosis and overrides safety risk level and is_diy_safe
    if any high-risk safety criteria are met.
    """
    reasons: List[str] = []
    
    # Combined text corpus for keyword inspection
    text_corpus = " ".join([
        diagnosis.appliance_type or "",
        diagnosis.identified_issue or "",
        diagnosis.safety_reasoning or "",
        " ".join(diagnosis.repair_steps or [])
    ]).lower()

    # Rule Check 1: Confidence Score < 0.5
    if diagnosis.confidence_score < 0.5:
        reasons.append(
            f"Low AI confidence ({int(diagnosis.confidence_score * 100)}%). "
            "Because the device or issue cannot be identified with high confidence, DIY repair is unsafe."
        )

    # Rule Check 2-7: Keyword / Hazard Regex Matching
    for rule_id, pattern, warning_msg in SAFETY_RULES:
        if re.search(pattern, text_corpus, re.IGNORECASE):
            # Exclude negative statements like "no gas leak" or "no exposed wire"
            match_obj = re.search(pattern, text_corpus, re.IGNORECASE)
            if match_obj:
                match_str = match_obj.group(0)
                pos = text_corpus.find(match_str)
                prefix = text_corpus[max(0, pos - 15):pos]
                if "no " not in prefix and "without " not in prefix:
                    reasons.append(warning_msg)

    # If any safety trigger fired: override model output
    if reasons:
        diagnosis.safety_risk_level = "call_a_professional"
        diagnosis.is_diy_safe = False
        diagnosis.repair_steps = []
        combined_reason = " ".join(reasons)
        
        if diagnosis.requires_professional_reason:
            diagnosis.requires_professional_reason = f"{diagnosis.requires_professional_reason} | {combined_reason}"
        else:
            diagnosis.requires_professional_reason = combined_reason
            
        diagnosis.safety_reasoning = f"SAFETY FILTER OVERRIDE: {combined_reason}"

    return diagnosis
