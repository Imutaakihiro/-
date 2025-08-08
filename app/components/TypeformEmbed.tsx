'use client'

import { useEffect } from 'react'

interface TypeformEmbedProps {
  onComplete: (diagnosisId: string) => void
}

export function TypeformEmbed({ onComplete }: TypeformEmbedProps) {
  useEffect(() => {
    // フォーム完了イベントのリスナーを追加
    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'form-submit') {
        console.log('Typeform submitted:', event.data)
        
        try {
          // テスト診断データを生成
          const response = await fetch('/api/test-diagnosis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            onComplete(data.diagnosis_id)
          } else {
            // エラーの場合はフォールバック
            onComplete('test-diagnosis-' + Date.now())
          }
        } catch (error) {
          console.error('Error creating test diagnosis:', error)
          // エラーの場合はフォールバック
          onComplete('test-diagnosis-' + Date.now())
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onComplete])

  return (
    <div className="w-full">
      {/* Typeform の直接埋め込み */}
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <div data-tf-live="01K25CPHDKP6T0J8KMWQS7J20P"></div>
            <script src="//embed.typeform.com/next/embed.js"></script>
          `
        }}
        className="w-full min-h-[600px]"
      />
      
      {/* フォールバックメッセージ */}
      <div className="text-center mt-4">
        <p className="text-gray-600">
          フォームが表示されない場合は、以下のリンクから診断にお進みください
        </p>
        <a 
          href="https://form.typeform.com/to/01K25CPHDKP6T0J8KMWQS7J20P" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          診断ページを開く
        </a>
      </div>
    </div>
  )
}
