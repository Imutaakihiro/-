import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: '診断IDが必要です' },
        { status: 400 }
      )
    }

    // Supabaseから診断結果を取得
    const { data: diagnosis, error } = await supabase
      .from('diagnosis_results')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '診断結果が見つかりません' },
        { status: 404 }
      )
    }

    // 診断結果を整形
    const result = {
      id: diagnosis.id,
      result: `${diagnosis.love_style} - ${diagnosis.education_level}`,
      analysis: generateAnalysisText(diagnosis),
      recommendations: generateRecommendations(diagnosis),
      nextSteps: generateNextSteps(diagnosis),
      createdAt: diagnosis.created_at
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Diagnosis result error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAnalysisText(diagnosis: any): string {
  const { love_style, education_level, category_scores } = diagnosis
  
  let analysis = `あなたは「${love_style}」の恋愛タイプで、教育レベルは「${education_level}」です。`
  
  if (category_scores) {
    if (category_scores.self_investment >= 7) {
      analysis += '自己投資への意識が高く、成長意欲が旺盛です。'
    }
    if (category_scores.relationship_awareness >= 7) {
      analysis += '人間関係への理解が深く、相手の気持ちを考えることができます。'
    }
    if (category_scores.growth_mindset < 5) {
      analysis += 'ただし、成長マインドセットの面で改善の余地があります。'
    }
    if (category_scores.self_worth < 5) {
      analysis += '自己価値の認識を高めることで、より良い関係を築けるでしょう。'
    }
  }
  
  return analysis
}

function generateRecommendations(diagnosis: any): string[] {
  const { love_style, category_scores } = diagnosis
  const recommendations = []
  
  if (love_style.includes('依存型')) {
    recommendations.push('自分の価値を認め、独立した生活を送ることを意識する')
    recommendations.push('相手に依存しすぎず、自分の趣味や目標を持つ')
  }
  
  if (category_scores?.self_worth < 5) {
    recommendations.push('自己肯定感を高めるためのセルフケアを実践する')
  }
  
  if (category_scores?.growth_mindset < 5) {
    recommendations.push('失敗を恐れず、新しいことに挑戦する習慣をつける')
  }
  
  recommendations.push('コミュニケーションスキルを向上させる')
  recommendations.push('相手との適切な距離感を保つことを意識する')
  
  return recommendations
}

function generateNextSteps(diagnosis: any): string[] {
  const { education_level } = diagnosis
  
  const nextSteps = [
    '1対1の恋愛コンサルティング（30分無料）',
    'コミュニケーションスキル向上ワークショップ'
  ]
  
  if (education_level === '高レベル') {
    nextSteps.push('上級者向け恋愛心理学講座')
    nextSteps.push('パーソナルコーチング（月額プラン）')
  } else {
    nextSteps.push('恋愛心理学基礎講座')
    nextSteps.push('グループセッション（週1回）')
  }
  
  return nextSteps
}
