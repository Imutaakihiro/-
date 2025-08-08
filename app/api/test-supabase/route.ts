import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 保存された診断結果を取得
    const { data, error } = await supabase
      .from('diagnosis_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: 'Supabase接続エラー'
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase接続成功！',
      count: data?.length || 0,
      data: data
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '予期しないエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
