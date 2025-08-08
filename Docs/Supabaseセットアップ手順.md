# Supabaseセットアップ手順

## 1. Supabaseプロジェクト作成

### 1.1 Supabaseにアクセス
1. [Supabase](https://supabase.com/)にアクセス
2. GitHubアカウントでログイン
3. 「New Project」をクリック

### 1.2 プロジェクト設定
- **Organization**: デフォルトまたは新規作成
- **Name**: `love-diagnosis-system`
- **Database Password**: 安全なパスワードを設定
- **Region**: `Asia Pacific (Tokyo)` を選択
- **Pricing Plan**: `Free tier` を選択

### 1.3 プロジェクト作成完了
- プロジェクト作成には数分かかります
- 完了後、ダッシュボードが表示されます

## 2. 環境変数の取得

### 2.1 Project Settings
1. 左サイドバーの「Settings」→「API」をクリック
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2.2 環境変数ファイル作成
プロジェクトルートに`.env.local`ファイルを作成：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Typeform設定
TYPEFORM_WEBHOOK_SECRET=your_typeform_webhook_secret
TYPEFORM_FORM_ID=your_typeform_form_id

# Dify設定
DIFY_API_ENDPOINT=your_dify_endpoint
DIFY_API_KEY=your_dify_api_key

# Next.js設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. データベーススキーマの作成

### 3.1 SQL Editor
1. 左サイドバーの「SQL Editor」をクリック
2. 「New query」をクリック

### 3.2 スキーマ実行
`supabase/schema.sql`の内容をコピーして実行：

```sql
-- 恋愛診断システム データベーススキーマ

-- 診断結果テーブル
CREATE TABLE diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  typeform_response_id VARCHAR UNIQUE NOT NULL,
  answers JSONB NOT NULL,
  education_level VARCHAR CHECK (education_level IN ('高レベル', '中レベル', '低レベル')),
  love_style VARCHAR CHECK (love_style IN ('依存型・自己否定', '理想追求型', '自己抑圧型')),
  category_scores JSONB,
  ai_analysis_html TEXT,
  recommended_next_step VARCHAR,
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
CREATE POLICY "診断結果は誰でも読み取り可能" ON diagnosis_results
  FOR SELECT USING (true);

CREATE POLICY "診断結果の作成は誰でも可能" ON diagnosis_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "診断結果の更新は誰でも可能" ON diagnosis_results
  FOR UPDATE USING (true);

CREATE POLICY "コンサル申込の作成は誰でも可能" ON consultation_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "コンサル申込の読み取りは管理者のみ" ON consultation_applications
  FOR SELECT USING (true);

CREATE POLICY "メール配信登録の作成は誰でも可能" ON email_subscriptions
  FOR INSERT WITH CHECK (true);

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
```

## 4. テーブル確認

### 4.1 Table Editor
1. 左サイドバーの「Table Editor」をクリック
2. 以下のテーブルが作成されていることを確認：
   - `diagnosis_results`
   - `consultation_applications`
   - `email_subscriptions`

### 4.2 テーブル構造確認
各テーブルをクリックして、カラムが正しく作成されていることを確認

## 5. テストデータの挿入（オプション）

### 5.1 テスト用データ
SQL Editorで以下を実行：

```sql
-- テスト用診断結果
INSERT INTO diagnosis_results (
  typeform_response_id,
  answers,
  education_level,
  love_style,
  category_scores,
  ai_analysis_html,
  recommended_next_step,
  analysis_complete
) VALUES (
  'test_response_001',
  '{"q1": "25〜29歳", "q2": "片思い中", "q3": "LINEの頻度や彼の態度が冷たい"}',
  '中レベル',
  '依存型・自己否定',
  '{"self_investment": 15, "relationship_awareness": 8, "growth_mindset": 6, "self_worth": 4, "problem_analysis": 7}',
  '<h1>あなたの恋愛スタイル診断結果</h1><p>依存型・自己否定の傾向があります...</p>',
  '教育コンテンツの提供',
  true
);
```

## 6. 接続テスト

### 6.1 開発サーバー起動
```bash
npm run dev
```

### 6.2 接続確認
ブラウザで http://localhost:3000 にアクセスして、エラーがないことを確認

## 7. トラブルシューティング

### 7.1 よくあるエラー
- **環境変数エラー**: `.env.local`ファイルが正しく作成されているか確認
- **RLSエラー**: ポリシーが正しく作成されているか確認
- **接続エラー**: Supabase URLとAPI Keyが正しいか確認

### 7.2 ログ確認
- Supabaseダッシュボードの「Logs」でエラーログを確認
- ブラウザの開発者ツールでコンソールエラーを確認

## 8. 次のステップ

Supabaseセットアップ完了後：
1. Typeformフォーム作成
2. Webhook設定
3. Dify API連携
4. フロントエンド開発
