import { NextRequest, NextResponse } from 'next/server'
import { processTypeformAnswers } from '../typeform-webhook/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test webhook received:', JSON.stringify(body, null, 2))
    
    // フォーム回答データを取得
    const { form_response } = body
    if (!form_response) {
      return NextResponse.json({ error: 'No form response data' }, { status: 400 })
    }
    
    // 回答データを構造化
    const structuredAnswers = processTypeformAnswers(form_response.answers)
    
    return NextResponse.json({
      success: true,
      message: 'Typeform webhook test successful',
      original_data: body,
      structured_answers: structuredAnswers,
      form_id: form_response.form_id,
      token: form_response.token
    })
    
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test webhook error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
