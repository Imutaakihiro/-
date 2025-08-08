import { NextRequest, NextResponse } from 'next/server'
import { analyzeWithAI } from '@/lib/ai-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      api_type, 
      api_key, 
      api_endpoint,
      answers = {
        q1: '3年以上',
        q2: 'とても上手',
        q3: 'よくする',
        q4: '積極的に',
        q5: '深い関係'
      }
    } = body

    // 必須パラメータチェック
    if (!api_type) {
      return NextResponse.json(
        { success: false, error: 'api_type is required' },
        { status: 400 }
      )
    }

    if (api_type === 'custom' && !api_endpoint) {
      return NextResponse.json(
        { success: false, error: 'api_endpoint is required for custom API' },
        { status: 400 }
      )
    }

    if (!api_key) {
      return NextResponse.json(
        { success: false, error: 'api_key is required' },
        { status: 400 }
      )
    }

    // AI 分析実行
    const result = await analyzeWithAI({
      answers,
      education_level: '高レベル',
      love_style: '積極的',
      api_type,
      api_key,
      api_endpoint
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'AI API 分析成功！',
        analysis_html: result.analysis_html,
        api_type
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'AI API 分析失敗',
        details: result.error,
        api_type
      }, { status: 500 })
    }

  } catch (error) {
    console.error('AI API test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'AI API テストエラー',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// GET リクエストでサンプルデータを返す
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI API テストエンドポイント',
    usage: {
      method: 'POST',
      body: {
        api_type: 'openai | anthropic | custom',
        api_key: 'your_api_key',
        api_endpoint: 'your_custom_endpoint (for custom API only)',
        answers: 'optional test answers'
      }
    },
    examples: {
      openai: {
        api_type: 'openai',
        api_key: 'sk-...'
      },
      anthropic: {
        api_type: 'anthropic',
        api_key: 'sk-ant-...'
      },
      custom: {
        api_type: 'custom',
        api_key: 'your_key',
        api_endpoint: 'https://your-api.com/analyze'
      }
    }
  })
}
