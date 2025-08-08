import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Simple webhook received:', JSON.stringify(body, null, 2))
    
    // フォーム回答データを取得
    const { form_response } = body
    if (!form_response) {
      return NextResponse.json({ error: 'No form response data' }, { status: 400 })
    }
    
    // 最小限のデータでテスト
    const testData = {
      typeform_response_id: form_response.token || 'test_token',
      answers: { test: 'test_answer' },
      education_level: '低レベル',
      love_style: '自己抑圧型',
      category_scores: { test: 1 },
      analysis_complete: false,
      created_at: new Date().toISOString()
    }
    
    console.log('Attempting to insert:', JSON.stringify(testData, null, 2))
    
    // Supabaseに保存
    const { data, error } = await supabase
      .from('diagnosis_results')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error details:', error)
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simple webhook test successful',
      data: data
    })
    
  } catch (error) {
    console.error('Simple webhook error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Simple webhook error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
