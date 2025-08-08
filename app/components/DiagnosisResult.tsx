'use client'

import { useState, useEffect } from 'react'

interface DiagnosisResultProps {
  diagnosisId: string
  onBack: () => void
}

interface DiagnosisData {
  id: string
  result: string
  analysis: string
  recommendations: string[]
  nextSteps: string[]
  createdAt: string
}

export function DiagnosisResult({ diagnosisId, onBack }: DiagnosisResultProps) {
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiagnosisResult = async () => {
      try {
        setLoading(true)
        // 診断結果を取得
        const response = await fetch(`/api/diagnosis-result?id=${diagnosisId}`)
        
        if (!response.ok) {
          throw new Error('診断結果の取得に失敗しました')
        }
        
        const data = await response.json()
        setDiagnosisData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchDiagnosisResult()
  }, [diagnosisId])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">診断結果を分析中...</p>
      </div>
    )
  }

  if (error && !diagnosisData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          診断に戻る
        </button>
      </div>
    )
  }

  if (!diagnosisData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">診断結果が見つかりませんでした</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          診断に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 結果ヘッダー */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          診断完了！
        </h2>
        <p className="text-lg text-gray-600">
          あなたの恋愛タイプを分析しました
        </p>
      </div>

      {/* メイン結果 */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">
            {diagnosisData?.result || '恋愛タイプ分析中...'}
          </h3>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            {diagnosisData?.analysis || '詳細な分析結果を読み込み中...'}
          </p>
        </div>
      </div>

      {/* 推奨事項 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          改善のためのアドバイス
        </h3>
        <div className="space-y-4">
          {diagnosisData.recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          )) || (
            <div className="text-center text-gray-500">
              <p>推奨事項を読み込み中...</p>
            </div>
          )}
        </div>
      </div>

      {/* 次のステップ */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          次のステップ
        </h3>
        <div className="grid md:grid-cols-1 gap-4">
          {diagnosisData.nextSteps?.map((step, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{step}</span>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  詳細を見る
                </button>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500">
              <p>次のステップを読み込み中...</p>
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="text-center space-y-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4"
        >
          診断をやり直す
        </button>
        <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          無料コンサルティングを予約
        </button>
      </div>

      {/* シェアセクション */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">この診断を友達とシェア</p>
        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            📘 Facebook
          </button>
          <button className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
            🐦 Twitter
          </button>
          <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
            📱 LINE
          </button>
        </div>
      </div>
    </div>
  )
}
