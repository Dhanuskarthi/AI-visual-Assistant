export type SafetyRiskLevel = "low" | "medium" | "high" | "call_a_professional";

export interface ApplianceDiagnosis {
  appliance_type: string;
  brand_model_guess?: string | null;
  identified_issue: string;
  error_code?: string | null;
  confidence_score: number;
  safety_risk_level: SafetyRiskLevel;
  safety_reasoning: string;
  is_diy_safe: boolean;
  required_tools: string[];
  repair_steps: string[];
  estimated_time_minutes?: number | null;
  requires_professional_reason?: string | null;
  ai_model_used?: string;
}

export interface DiagnosisCreateResponse {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  diagnosis: ApplianceDiagnosis;
  created_at: string;
}

export interface DiagnosisHistoryItem {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  appliance_type: string;
  brand_model_guess?: string | null;
  identified_issue: string;
  error_code?: string | null;
  confidence_score: number;
  safety_risk_level: SafetyRiskLevel;
  is_diy_safe: boolean;
  requires_professional_reason?: string | null;
  ai_model_used?: string;
  created_at: string;
  feedback?: "worked" | "didnt_work" | "called_pro" | null;
}
