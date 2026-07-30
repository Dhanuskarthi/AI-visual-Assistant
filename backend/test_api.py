import requests
from pathlib import Path
from PIL import Image, ImageDraw

BASE_URL = "http://127.0.0.1:8000"

def create_dummy_image(filename: str, label: str):
    img = Image.new("RGB", (640, 480), color=(30, 41, 59))
    d = ImageDraw.Draw(img)
    d.text((40, 220), f"TEST FAULT: {label}", fill=(244, 63, 94))
    img_path = Path(filename)
    img.save(img_path)
    return img_path

def test_backend_flow():
    print("--- 1. Testing Root Endpoint ---")
    r = requests.get(f"{BASE_URL}/")
    print("Root response:", r.json())
    assert r.status_code == 200

    print("\n--- 2. Testing Safe DIY Scenario ---")
    dryer_img = create_dummy_image("test_dryer_lint.jpg", "Dryer Lint Screen Reset")
    with open(dryer_img, "rb") as f:
        r = requests.post(f"{BASE_URL}/diagnose", files={"file": ("dryer_lint.jpg", f, "image/jpeg")})
    print("Safe Diagnosis Status Code:", r.status_code)
    safe_data = r.json()
    print("Safe Diagnosis Appliance:", safe_data["diagnosis"]["appliance_type"])
    print("Is DIY Safe?:", safe_data["diagnosis"]["is_diy_safe"])
    print("Repair Steps Count:", len(safe_data["diagnosis"]["repair_steps"]))
    assert safe_data["diagnosis"]["is_diy_safe"] is True
    assert len(safe_data["diagnosis"]["repair_steps"]) > 0

    print("\n--- 3. Testing High-Risk Electrical/Gas Safety Gate ---")
    breaker_img = create_dummy_image("test_circuit_breaker.jpg", "Sparking Circuit Breaker")
    with open(breaker_img, "rb") as f:
        r = requests.post(f"{BASE_URL}/diagnose", files={"file": ("circuit_breaker.jpg", f, "image/jpeg")})
    print("Unsafe Diagnosis Status Code:", r.status_code)
    unsafe_data = r.json()
    print("Unsafe Diagnosis Appliance:", unsafe_data["diagnosis"]["appliance_type"])
    print("Is DIY Safe?:", unsafe_data["diagnosis"]["is_diy_safe"])
    print("Safety Risk Level:", unsafe_data["diagnosis"]["safety_risk_level"])
    print("Repair Steps Count:", len(unsafe_data["diagnosis"]["repair_steps"]))
    print("Professional Reason:", unsafe_data["diagnosis"]["requires_professional_reason"])
    assert unsafe_data["diagnosis"]["is_diy_safe"] is False
    assert len(unsafe_data["diagnosis"]["repair_steps"]) == 0
    assert unsafe_data["diagnosis"]["safety_risk_level"] in ("high", "call_a_professional")

    print("\n--- 4. Testing History Endpoint ---")
    r = requests.get(f"{BASE_URL}/history")
    history = r.json()
    print("History Item Count:", len(history))
    assert len(history) >= 2

    print("\n--- 5. Testing Feedback Endpoint ---")
    diag_id = safe_data["id"]
    r = requests.post(
        f"{BASE_URL}/feedback",
        json={"diagnosis_id": diag_id, "feedback": "worked", "notes": "Clear instructions!"}
    )
    print("Feedback Response:", r.json())
    assert r.status_code == 200

    print("\n=== ALL END-TO-END BACKEND TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_backend_flow()
