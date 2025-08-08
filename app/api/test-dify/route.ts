import { NextResponse } from 'next/server'
import { callDifyChat } from '@/lib/dify'

export async function GET() {
  try {
    // Dify API 接続テスト
    const response = await callDifyChat([
      {
        role: 'user',
        content: 'こんにちは！Dify API の接続テストです。'
      }
    ])

    return NextResponse.json({
      success: true,
      message: 'Dify API 接続成功！',
      response: response.answer,
      usage: response.metadata.usage
    })

  } catch (error) {
    console.error('Dify API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Dify API 接続エラー',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
