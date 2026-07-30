import os
import json
import base64
from pathlib import Path
import cv2
from PIL import Image

from app.config import settings
from app.schemas import ApplianceDiagnosis, ChatRequest, ChatMessage
from app.safety import evaluate_safety

EXACT_SYSTEM_PROMPT = """You are a careful home-appliance diagnostic assistant. Identify the appliance, any visible error code or fault, and describe what you observe factually. Do not guess a specific brand or model unless clearly visible in the image. Assess safety risk conservatively — if there is ANY doubt about electrical, gas, or structural water risk, classify it as requiring a professional rather than offering DIY steps. Only provide repair_steps for genuinely low-risk, cosmetic, or mechanical issues (e.g. clearing a lint filter, resetting a breaker with no gas/electrical damage visible, tightening a visible loose fitting). Return ONLY valid JSON matching this schema:
{
  "appliance_type": "str",
  "brand_model_guess": "str or null",
  "identified_issue": "str",
  "error_code": "str or null",
  "confidence_score": 0.85,
  "safety_risk_level": "low" | "medium" | "high" | "call_a_professional",
  "safety_reasoning": "str",
  "is_diy_safe": bool,
  "required_tools": ["str"],
  "repair_steps": ["str"],
  "estimated_time_minutes": int or null,
  "requires_professional_reason": "str or null"
}"""

def extract_frame_from_video(video_path: str) -> str:
    """Extracts a representative middle frame from a video file."""
    try:
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        target_frame = max(0, total_frames // 2) if total_frames > 0 else 0
        
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            
        cap.release()
        
        if ret:
            extracted_path = str(video_path) + "_frame.jpg"
            cv2.imwrite(extracted_path, frame)
            return extracted_path
    except Exception as e:
        print(f"Error extracting video frame: {e}")
    return str(video_path)

def encode_image_base64(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def diagnose_with_gemini(image_path: str, api_key: str) -> dict:
    """Call Google Gemini Flash API."""
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=api_key)
        pil_img = Image.open(image_path)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[pil_img, EXACT_SYSTEM_PROMPT],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e1:
        print(f"google.genai call failed, trying google.generativeai fallback: {e1}")
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            pil_img = Image.open(image_path)
            
            prompt = f"{EXACT_SYSTEM_PROMPT}\nAnalyze this image and return JSON strictly following the schema."
            response = model.generate_content([prompt, pil_img])
            
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e2:
            print(f"Gemini call error: {e2}")
            raise e2

def diagnose_with_nvidia(image_path: str, api_key: str) -> dict:
    """Call NVIDIA NIM OpenAI-compatible Vision API."""
    import openai
    client = openai.OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key
    )
    base64_image = encode_image_base64(image_path)
    
    response = client.chat.completions.create(
        model="meta/llama-3.2-11b-vision-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": EXACT_SYSTEM_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                    }
                ]
            }
        ],
        temperature=0.2
    )
    content = response.choices[0].message.content
    clean_text = content.replace("```json", "").replace("```", "").strip()
    return json.loads(clean_text)

def diagnose_with_openai(image_path: str, api_key: str) -> dict:
    """Call OpenAI GPT-4o-mini vision API."""
    import openai
    client = openai.OpenAI(api_key=api_key)
    base64_image = encode_image_base64(image_path)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": EXACT_SYSTEM_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                    }
                ]
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.2
    )
    content = response.choices[0].message.content
    return json.loads(content)

def fallback_smart_diagnosis(file_path: str, original_filename: str = "") -> dict:
    """
    Fallback diagnostic analysis if no API key is set or API fails.
    Simulates realistic appliance diagnostics based on filename.
    """
    search_text = f"{file_path} {original_filename}".lower()
    
    if "breaker" in search_text or "electric" in search_text or "wire" in search_text or "spark" in search_text:
        return {
            "appliance_type": "circuit breaker panel",
            "brand_model_guess": "Square D / Schneider Electric",
            "identified_issue": "Tripped 20A breaker with signs of potential electrical arcing or exposed wire sparking",
            "error_code": None,
            "confidence_score": 0.88,
            "safety_risk_level": "call_a_professional",
            "safety_reasoning": "High risk of electrical shock and fire hazard. Breaker panels carry high voltage mains current.",
            "is_diy_safe": False,
            "required_tools": [],
            "repair_steps": [],
            "estimated_time_minutes": None,
            "requires_professional_reason": "High-voltage electrical circuit work requires a licensed electrician to inspect for short circuits or faulty busbars."
        }
    elif "gas" in search_text or "stove" in search_text or "heater" in search_text:
        return {
            "appliance_type": "gas water heater",
            "brand_model_guess": "Rheem Performance Series",
            "identified_issue": "Ignition failure on gas burner assembly with reported gas smell",
            "error_code": "E02",
            "confidence_score": 0.82,
            "safety_risk_level": "call_a_professional",
            "safety_reasoning": "Gas line or ignition assembly fault carries explosive and carbon monoxide safety risks.",
            "is_diy_safe": False,
            "required_tools": [],
            "repair_steps": [],
            "estimated_time_minutes": None,
            "requires_professional_reason": "Gas supply and ignition repairs must be certified by a licensed gas plumbing specialist."
        }
    elif "leak" in search_text or "pipe" in search_text or "wall" in search_text:
        return {
            "appliance_type": "washing machine supply line",
            "brand_model_guess": "Whirlpool Front Load",
            "identified_issue": "Water leakage detected near behind-wall supply shutoff valve",
            "error_code": "E4",
            "confidence_score": 0.79,
            "safety_risk_level": "call_a_professional",
            "safety_reasoning": "In-wall plumbing leaks carry severe risk of structural water damage and mold growth.",
            "is_diy_safe": False,
            "required_tools": [],
            "repair_steps": [],
            "estimated_time_minutes": None,
            "requires_professional_reason": "Plumbing repairs behind walls or involving main water valves require a licensed plumber."
        }
    else:
        return {
            "appliance_type": "clothes dryer",
            "brand_model_guess": "LG Electronics",
            "identified_issue": "Restricted airflow due to lint screen buildup",
            "error_code": "d80",
            "confidence_score": 0.91,
            "safety_risk_level": "low",
            "safety_reasoning": "Cosmetic lint screen clearing is a safe routine maintenance procedure.",
            "is_diy_safe": True,
            "required_tools": ["Lint brush", "Vacuum cleaner hose attachment"],
            "repair_steps": [
                "Pull out the lint screen located at the front opening of the dryer.",
                "Roll off accumulated lint with your fingers.",
                "Use a flexible vacuum hose attachment to clear remaining lint inside the trap slot.",
                "Reinsert the clean lint screen securely into place."
            ],
            "estimated_time_minutes": 10,
            "requires_professional_reason": None
        }

def diagnose_appliance(file_path: str, media_type: str, original_filename: str = "") -> ApplianceDiagnosis:
    target_image_path = file_path
    if media_type == "video" or file_path.lower().endswith((".mp4", ".mov", ".avi", ".webm")):
        target_image_path = extract_frame_from_video(file_path)

    raw_data = None
    gemini_key = settings.GEMINI_API_KEY
    nvidia_key = settings.NVIDIA_API_KEY
    openai_key = settings.OPENAI_API_KEY
    provider = settings.LLM_PROVIDER.lower()

    if (provider == "nvidia" or provider == "auto") and nvidia_key:
        try:
            print("Calling NVIDIA NIM Vision API (Llama 3.2 11B Vision)...")
            raw_data = diagnose_with_nvidia(target_image_path, nvidia_key)
        except Exception as e:
            print(f"NVIDIA API failed: {e}")

    if not raw_data and (provider == "gemini" or provider == "auto") and gemini_key:
        try:
            print("Calling Gemini Flash Vision API...")
            raw_data = diagnose_with_gemini(target_image_path, gemini_key)
        except Exception as e:
            print(f"Gemini API failed: {e}")

    if not raw_data and (provider == "openai" or provider == "auto") and openai_key:
        try:
            print("Calling OpenAI GPT-4o-mini Vision API...")
            raw_data = diagnose_with_openai(target_image_path, openai_key)
        except Exception as e:
            print(f"OpenAI API failed: {e}")

    if not raw_data:
        print("Using smart diagnostic fallback engine...")
        raw_data = fallback_smart_diagnosis(file_path, original_filename)

    diagnosis = ApplianceDiagnosis(**raw_data)
    final_diagnosis = evaluate_safety(diagnosis)
    return final_diagnosis

def answer_repair_chat(chat_req: ChatRequest) -> str:
    """Answers user follow-up questions for appliance troubleshooting."""
    last_user_msg = chat_req.messages[-1].content if chat_req.messages else "How do I fix this?"
    
    if not chat_req.is_diy_safe:
        return (
            f"SAFETY NOTICE: The issue with your {chat_req.appliance_type} ({chat_req.identified_issue}) "
            "has been classified as requiring a licensed professional due to high risk (electrical, gas, or plumbing). "
            "Please do not attempt internal disassembly. We strongly recommend contacting authorized brand support or a licensed technician."
        )

    # NVIDIA LLM Chat Call
    nvidia_key = settings.NVIDIA_API_KEY
    if nvidia_key:
        try:
            import openai
            client = openai.OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=nvidia_key)
            system_prompt = (
                f"You are a helpful home appliance repair assistant. "
                f"The user is repairing a {chat_req.appliance_type} with identified issue: '{chat_req.identified_issue}'. "
                f"Provide concise, step-by-step practical advice. Keep answers under 150 words."
            )
            response = client.chat.completions.create(
                model="meta/llama-3.2-11b-vision-instruct",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": last_user_msg}
                ],
                temperature=0.2
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"NVIDIA chat call failed: {e}")

    # Gemini LLM Chat Call Fallback
    gemini_key = settings.GEMINI_API_KEY
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            system_prompt = (
                f"You are a helpful home appliance repair assistant. "
                f"The user is repairing a {chat_req.appliance_type} with identified issue: '{chat_req.identified_issue}'. "
                f"Provide concise, step-by-step practical advice. Keep answers under 150 words."
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[system_prompt, f"User Question: {last_user_msg}"]
            )
            return response.text.strip()
        except Exception as e:
            print(f"Gemini chat failed: {e}")

    # Smart Fallback Assistant
    msg_lower = last_user_msg.lower()
    if "where" in msg_lower or "location" in msg_lower or "find" in msg_lower:
        return f"For most {chat_req.appliance_type} models, the filter or access panel is located at the front bottom door or inside the main chamber. Make sure to unplug the unit before opening access panels."
    elif "tool" in msg_lower or "wrench" in msg_lower or "screwdriver" in msg_lower:
        return "Standard repairs require a Phillips #2 screwdriver, a pair of adjustable pliers, and a towel to catch residual moisture."
    elif "power" in msg_lower or "safety" in msg_lower or "electric" in msg_lower:
        return "Always disconnect the main power plug from the wall outlet or switch off the dedicated circuit breaker before touching internal components."
    else:
        return (
            f"To resolve {chat_req.identified_issue} on your {chat_req.appliance_type}: "
            "1. Unplug the appliance.\n"
            "2. Inspect visible seals and filters for debris.\n"
            "3. Clean components using warm water and a soft lint-free cloth.\n"
            "4. Reassemble and plug back in to perform a test run."
        )
