import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export interface DiagnosisResult {
  id: string
  typeform_response_id: string
  answers: any
  education_level: '高レベル' | '中レベル' | '低レベル'
  love_style: '依存型・自己否定' | '理想追求型' | '自己抑圧型'
  category_scores: {
    self_investment: number
    relationship_awareness: number
    growth_mindset: number
    self_worth: number
    problem_analysis: number
  }
  ai_analysis_html: string
  recommended_next_step: string
  analysis_complete: boolean
  created_at: string
  updated_at: string
}

export interface ConsultationApplication {
  id: string
  diagnosis_id: string
  name: string
  email: string
  phone?: string
  education_level: string
  current_challenges: string
  expected_outcomes: string
  application_status: 'pending' | 'contacted' | 'scheduled' | 'completed'
  created_at: string
}

export interface EmailSubscription {
  id: string
  diagnosis_id: string
  email: string
  education_level: string
  subscription_status: 'active' | 'inactive'
  created_at: string
}
