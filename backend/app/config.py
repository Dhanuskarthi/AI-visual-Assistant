import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")

IS_VERCEL = os.getenv("VERCEL") == "1" or "VERCEL_ENV" in os.environ

class Settings:
    PROJECT_NAME: str = "AI Visual Home Repair & Appliance Troubleshooter"
    
    @property
    def DATABASE_URL(self) -> str:
        if IS_VERCEL:
            return os.getenv("DATABASE_URL", "sqlite:////tmp/appliance_troubleshooter.db")
        return os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/appliance_troubleshooter.db")

    @property
    def UPLOAD_DIR(self) -> Path:
        if IS_VERCEL:
            p = Path("/tmp/uploads")
        else:
            p = BASE_DIR / "uploads"
        p.mkdir(parents=True, exist_ok=True)
        return p
    
    @property
    def GEMINI_API_KEY(self) -> str | None:
        return os.getenv("GEMINI_API_KEY")

    @property
    def OPENAI_API_KEY(self) -> str | None:
        return os.getenv("OPENAI_API_KEY")

    @property
    def NVIDIA_API_KEY(self) -> str | None:
        return os.getenv("NVIDIA_API_KEY")

    @property
    def LLM_PROVIDER(self) -> str:
        return os.getenv("LLM_PROVIDER", "auto")

settings = Settings()
