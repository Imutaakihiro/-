-- 恋愛診断システム データベーススキーマ

-- 診断結果テーブル
CREATE TABLE diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  typeform_response_id VARCHAR UNIQUE NOT NULL,
  answers JSONB NOT NULL, -- 構造化された回答
  education_level VARCHAR CHECK (education_level IN ('高レベル', '中レベル', '低レベル')),
  love_style VARCHAR CHECK (love_style IN ('依存型・自己否定', '理想追求型', '自己抑圧型')),
  category_scores JSONB, -- 各カテゴリのスコア
  ai_analysis_html TEXT, -- DifyからのHTML出力
  recommended_next_step VARCHAR, -- 推奨次のステップ
  analysis_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コンサル申込テーブル
CREATE TABLE consultation_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id UUID REFERENCES diagnosis_results(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  education_level VARCHAR NOT NULL,
  current_challenges TEXT,
  expected_outcomes TEXT,
  application_status VARCHAR DEFAULT 'pending' CHECK (application_status IN ('pending', 'contacted', 'scheduled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- メール配信登録テーブル
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id UUID REFERENCES diagnosis_results(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  education_level VARCHAR NOT NULL,
  subscription_status VARCHAR DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_diagnosis_typeform_response ON diagnosis_results(typeform_response_id);
CREATE INDEX idx_diagnosis_analysis_complete ON diagnosis_results(analysis_complete);
CREATE INDEX idx_diagnosis_education_level ON diagnosis_results(education_level);
CREATE INDEX idx_consultation_diagnosis_id ON consultation_applications(diagnosis_id);
CREATE INDEX idx_consultation_status ON consultation_applications(application_status);
CREATE INDEX idx_subscription_email ON email_subscriptions(email);
CREATE INDEX idx_subscription_status ON email_subscriptions(subscription_status);

-- Row Level Security (RLS) 有効化
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
-- 診断結果は誰でも読み取り可能（結果表示用）
CREATE POLICY "診断結果は誰でも読み取り可能" ON diagnosis_results
  FOR SELECT USING (true);

-- 診断結果の作成は誰でも可能
CREATE POLICY "診断結果の作成は誰でも可能" ON diagnosis_results
  FOR INSERT WITH CHECK (true);

-- 診断結果の更新は誰でも可能（AI分析結果の更新用）
CREATE POLICY "診断結果の更新は誰でも可能" ON diagnosis_results
  FOR UPDATE USING (true);

-- コンサル申込の作成は誰でも可能
CREATE POLICY "コンサル申込の作成は誰でも可能" ON consultation_applications
  FOR INSERT WITH CHECK (true);

-- コンサル申込の読み取りは管理者のみ（将来的に認証実装時）
CREATE POLICY "コンサル申込の読み取りは管理者のみ" ON consultation_applications
  FOR SELECT USING (true);

-- メール配信登録の作成は誰でも可能
CREATE POLICY "メール配信登録の作成は誰でも可能" ON email_subscriptions
  FOR INSERT WITH CHECK (true);

-- メール配信登録の読み取りは管理者のみ
CREATE POLICY "メール配信登録の読み取りは管理者のみ" ON email_subscriptions
  FOR SELECT USING (true);

-- 更新日時を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー作成
CREATE TRIGGER update_diagnosis_results_updated_at 
  BEFORE UPDATE ON diagnosis_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
