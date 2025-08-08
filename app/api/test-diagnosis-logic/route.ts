import { NextResponse } from 'next/server'
import { 
  determineEducationLevel, 
  determineLoveStyle, 
  generateDiagnosisHTML 
} from '@/lib/diagnosis'

export async function GET() {
  try {
    // テスト用の回答データ
    const testAnswers = {
      q1: '3年以上',
      q2: 'とても上手',
      q3: 'よくする',
      q4: '積極的に',
      q5: '深い関係'
    }
    
    // 診断実行
    const educationLevel = determineEducationLevel(testAnswers)
    const loveStyle = determineLoveStyle(testAnswers)
    const analysisHTML = generateDiagnosisHTML(testAnswers, educationLevel, loveStyle)
    
    return NextResponse.json({
      success: true,
      message: '診断ロジックテスト成功！',
      test_data: {
        answers: testAnswers,
        education_level: educationLevel,
        love_style: loveStyle,
        analysis_html: analysisHTML
      }
    })

  } catch (error) {
    console.error('Diagnosis logic error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '診断ロジックエラー',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
