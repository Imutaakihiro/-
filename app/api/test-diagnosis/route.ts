import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// テスト用の診断データ
const testDiagnosisData = {
  typeform_response_id: 'test_response_' + Date.now(),
  answers: {
    q1: '25〜29歳',
    q2: '片思い中',
    q3: 'LINEの頻度や彼の態度が冷たい',
    q4: '気づいたら相手中心になっている',
    q5: ['自分の恋愛傾向を知りたい', '今の彼との関係を改善したい'],
    q6: '20万〜50万円（自分を磨くことには前向き）',
    q7: ['気づけば色々やっていることが多い', 'プレゼント、ご飯代など積極的に出す'],
    q8: '28歳',
    q9: '3ヶ月',
    q10: '最近LINEの返信が遅くなって、何かあったのか心配です。以前はすぐに返してくれたのに、今は数時間かかることもあります。'
  },
  education_level: '高レベル',
  love_style: '依存型・自己否定',
  category_scores: {
    self_investment: 8,
    relationship_awareness: 7,
    growth_mindset: 4,
    self_worth: 4,
    problem_analysis: 8
  }
}

export async function POST(request: NextRequest) {
  try {
    // Supabaseに保存
    const { data: diagnosis, error } = await supabase
      .from('diagnosis_results')
      .insert({
        typeform_response_id: testDiagnosisData.typeform_response_id,
        answers: testDiagnosisData.answers,
        education_level: testDiagnosisData.education_level,
        love_style: testDiagnosisData.love_style,
        category_scores: testDiagnosisData.category_scores,
        analysis_complete: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      diagnosis_id: diagnosis.id,
      education_level: testDiagnosisData.education_level,
      love_style: testDiagnosisData.love_style,
      message: 'テスト診断データが保存されました',
      result_url: `http://localhost:3000/diagnosis/${diagnosis.id}`
    })
    
  } catch (error) {
    console.error('Test diagnosis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'テスト診断API',
    usage: 'POST /api/test-diagnosis でテストデータを送信',
    test_data: testDiagnosisData
  })
}
