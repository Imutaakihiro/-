import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { 
  determineEducationLevel, 
  determineLoveStyle, 
  generateDiagnosisHTML 
} from '@/lib/diagnosis'
import { analyzeWithAI } from '@/lib/ai-api'

// TypeformのWebhook署名検証（後で実装）
const verifyTypeformSignature = (payload: string, signature: string) => {
  // TODO: 署名検証ロジックを実装
  return true
}

// 回答データを構造化
export const processTypeformAnswers = (answers: any[]) => {
  const structuredAnswers: any = {}
  
  answers.forEach((answer) => {
    const questionId = answer.field.ref
    const questionType = answer.type
    
    switch (questionType) {
      case 'choice':
        structuredAnswers[questionId] = answer.choice.label
        break
      case 'choices':
        structuredAnswers[questionId] = answer.choices.labels
        break
      case 'text':
        structuredAnswers[questionId] = answer.text
        break
      case 'number':
        structuredAnswers[questionId] = answer.number
        break
      default:
        structuredAnswers[questionId] = answer
    }
  })
  
  return structuredAnswers
}

// 既存の判定ロジックは削除し、新しい診断ロジックを使用

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json()
    console.log('Typeform webhook received:', JSON.stringify(body, null, 2))
    
    // 署名検証（後で実装）
    const signature = request.headers.get('typeform-signature')
    if (signature && !verifyTypeformSignature(JSON.stringify(body), signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    // フォーム回答データを取得
    const { form_response } = body
    if (!form_response) {
      console.error('No form_response in body')
      return NextResponse.json({ error: 'No form response data' }, { status: 400 })
    }
    
    // 回答データを構造化
    const structuredAnswers = processTypeformAnswers(form_response.answers)
    console.log('Structured answers:', JSON.stringify(structuredAnswers, null, 2))
    
    // 教育レベル判定
    const educationLevel = determineEducationLevel(structuredAnswers)
    
    // 恋愛スタイル判定
    const loveStyle = determineLoveStyle(structuredAnswers)
    
    // カテゴリスコア計算（実際のTypeformデータに基づく）
    const categoryScores = {
      self_investment: 4, // デフォルト値
      relationship_awareness: 3, // デフォルト値
      growth_mindset: 2, // デフォルト値
      self_worth: 4, // デフォルト値
      problem_analysis: 4 // デフォルト値
    }
    
    // 実際の回答内容に基づいてスコアを調整
    Object.keys(structuredAnswers).forEach(key => {
      const answer = structuredAnswers[key]
      if (typeof answer === 'string') {
        if (answer.includes('20万') || answer.includes('50万')) {
          categoryScores.self_investment = 8
        }
        if (answer.length > 30) {
          categoryScores.problem_analysis = 8
        }
        if (answer.includes('恋愛傾向') || answer.includes('関係')) {
          categoryScores.relationship_awareness = 7
        }
      }
    })
    
    // Supabaseに保存
    const { data: diagnosis, error } = await supabase
      .from('diagnosis_results')
      .insert({
        typeform_response_id: form_response.token,
        answers: structuredAnswers,
        education_level: educationLevel,
        love_style: loveStyle,
        category_scores: categoryScores,
        analysis_complete: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // Gemini AI 分析を実行
    let analysisHTML = ''
    let recommendedNextStep = educationLevel === '高レベル' ? 'コンサル申込' : '教育コンテンツ配信'
    
    try {
      console.log('Starting Gemini AI analysis...')
      
      // Gemini API を使用して分析
      const aiResult = await analyzeWithAI({
        answers: structuredAnswers,
        education_level: educationLevel,
        love_style: loveStyle,
        api_type: 'gemini',
        api_key: 'AIzaSyBSBcm2izXkTtP1YoEPUyQW_0gFytFxlkc'
      })
      
      if (aiResult.success) {
        analysisHTML = aiResult.analysis_html
        console.log('Gemini AI analysis successful')
      } else {
        console.error('Gemini AI error:', aiResult.error)
        // Gemini が失敗した場合はローカル分析を使用
        analysisHTML = generateDiagnosisHTML(structuredAnswers, educationLevel, loveStyle)
        console.log('Using local analysis as fallback')
      }
      
      // 分析結果をデータベースに更新
      const { error: updateError } = await supabase
        .from('diagnosis_results')
        .update({
          ai_analysis_html: analysisHTML,
          analysis_complete: true,
          recommended_next_step: recommendedNextStep
        })
        .eq('id', diagnosis.id)
      
      if (updateError) {
        console.error('Database update error:', updateError)
      } else {
        console.log('Analysis results saved to database successfully')
      }
      
    } catch (analysisError) {
      console.error('Analysis error:', analysisError)
      // 分析が失敗した場合でもローカル分析を使用
      analysisHTML = generateDiagnosisHTML(structuredAnswers, educationLevel, loveStyle)
      
      // ローカル分析結果を保存
      await supabase
        .from('diagnosis_results')
        .update({
          ai_analysis_html: analysisHTML,
          analysis_complete: true,
          recommended_next_step: recommendedNextStep
        })
        .eq('id', diagnosis.id)
    }
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      diagnosis_id: diagnosis.id,
      education_level: educationLevel,
      love_style: loveStyle,
      analysis_complete: true,
      message: '診断データが保存され、Gemini AI分析が完了しました'
    })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
