# FixVision AI 3.0 — AI Visual Diagnostic & Safety Assistant

FixVision AI 3.0 is a production-grade, multimodal AI visual diagnostic application designed to identify faults, verify safety rules, and provide step-by-step repair guides for home appliances, mobiles, laptops, vehicles, and electrical circuit breaker panels from photos or short video clips.

---

## 🌟 Key Features

1. **Multimodal AI Vision Diagnostic Pipeline**
   - Integrates NVIDIA Llama 3.2 11B Vision, Google Gemini 2.5 Flash, and OpenAI GPT-4o-mini vision models.
   - Automatically identifies device categories, brand names, model tags, and digital error codes (e.g., `E4`, `LE`, `d80`).
   - Honest fallback & certainty levels: Returns structured "analysis unavailable" notifications if vision providers fail instead of fabricating unverified repair steps.

2. **Hard-Coded Safety Gate Filter**
   - Automated safety rules inspect for high-risk hazards (flammable gas leaks, mains high-voltage wiring, swollen lithium batteries, brake line failures).
   - Immediately blocks DIY repair steps when high risk is detected and displays emergency helpline numbers (e.g., **1906** for LPG/PNG Gas Safety).

3. **Interactive Onboarding & Framing Guidance**
   - "How It Works" 4-step modal breakdown.
   - Category-specific photo framing guidelines for Home Appliances, Mobiles, Vehicles, and Circuit Breakers.

4. **Results Display & Progressive Disclosure**
   - Prominent AI Certainty Level meter (`High`, `Moderate`, `Tentative`).
   - AI Model Transparency badge (`NVIDIA Llama 3.2 Vision`, `Gemini 2.5 Flash`, `OpenAI GPT-4o-mini`).
   - Expandable/collapsible step-by-step DIY repair guide with tool checklists and built-in Text-to-Speech Voice Audio Player.

5. **Official Brand Support & Service Directory**
   - Instant routing for Indian market brands (Samsung, LG, Whirlpool, Apple, Xiaomi, Maruti Suzuki, Tata, etc.).
   - Direct links to official brand portals, toll-free customer care hotlines, Urban Company, Justdial, and Google Maps.
   - Real `/api/contact` service ticket logging endpoint.

6. **Diagnostic History Vault**
   - Outcome tagging (`✓ Fixed`, `✕ Still Broken`, `🛠 Called Pro`) synced with the database.
   - Export formatted printable PDF diagnostic reports.
   - One-click copy summary for sharing with technicians.

---

## 🏗️ System Architecture

```
                               ┌───────────────────────────┐
                               │     Next.js 16 App        │
                               │  React 19 + Tailwind CSS  │
                               └─────────────┬─────────────┘
                                             │ HTTP / API
                                             ▼
                               ┌───────────────────────────┐
                               │   FastAPI Python Backend  │
                               │     (api/server.py)       │
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │ NVIDIA NIM Vision API │   │ Gemini Flash 2.5 API  │   │ OpenAI GPT-4o-mini    │
   │ (Llama 3.2 11B Vision)│   │ (google.genai SDK)    │   │ (OpenAI Vision API)   │
   └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

---

## 🛠️ Local Environment Setup

### Prerequisites
- Node.js 20+
- Python 3.10+

### Step 1: Clone Repository
```bash
git clone https://github.com/Dhanuskarthi/AI-visual-Assistant.git
cd AI-visual-Assistant
```

### Step 2: Set Up Python Backend (Terminal 1)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Activate (Linux/Mac): source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI dev server on port 8000
uvicorn api.server:app --reload --port 8000
```

### Step 3: Set Up Next.js Frontend (Terminal 2)
```bash
# Install frontend dependencies
npm install

# Start Next.js dev server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables Reference

Create a `.env` file in the root directory (refer to `.env.example`):

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | `None` |
| `OPENAI_API_KEY` | OpenAI API Key | `None` |
| `NVIDIA_API_KEY` | NVIDIA NIM API Key | `None` |
| `LLM_PROVIDER` | Preferred provider (`auto`, `nvidia`, `gemini`, `openai`) | `auto` |
| `CORS_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000,https://ai-visual-assistant.vercel.app` |
| `DATABASE_URL` | SQLAlchemy SQLite or PostgreSQL connection URL | `sqlite:///backend/appliance_troubleshooter.db` |

---

## 🧪 Running Tests

### Backend Pytest Suite
```bash
# From repository root
python -m pytest backend/tests/
```

### Frontend Build Verification
```bash
npm run build
```

---

## ⚠️ Known Limitations & Deployment Notes

- **Ephemeral Storage on Vercel**: On serverless Vercel deployments, media uploads saved to `/tmp/uploads` and local SQLite records in `/tmp/appliance_troubleshooter.db` are ephemeral and reset when serverless instances spin down. For multi-user production, attach Vercel Blob Storage and PostgreSQL (Neon/Supabase).
- **FastAPI Interactive Docs**: OpenAPI Swagger docs are accessible at [http://localhost:8000/docs](http://localhost:8000/docs) locally and routed via `/docs` on Vercel.