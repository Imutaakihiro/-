'use client'

import { useState } from 'react'
import { TypeformEmbed } from './components/TypeformEmbed'
import { DiagnosisResult } from './components/DiagnosisResult'

export default function Home() {
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleDiagnosisComplete = (id: string) => {
    setDiagnosisId(id)
    setShowResult(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">❤️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">恋愛診断</h1>
                <p className="text-sm text-gray-600">AI パーソナル診断</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">特徴</a>
              <a href="#diagnosis" className="text-gray-600 hover:text-purple-600 transition-colors">診断</a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">体験談</a>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResult ? (
          <div className="space-y-16">
            {/* ヒーローセクション */}
            <section className="text-center py-16">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                    🎯 3分で完了・無料診断
                  </span>
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    あなたの恋愛タイプを
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                      AI が分析
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    最新のAI技術があなたの恋愛パターンを深く分析し、
                    専門家レベルのアドバイスでより良い恋愛関係を築くお手伝いをします。
                  </p>
                </div>
                
                {/* CTA ボタン */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button 
                    onClick={() => document.getElementById('diagnosis-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🚀 無料診断を始める
                  </button>
                  <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300">
                    📖 診断サンプルを見る
                  </button>
                </div>

                {/* 統計情報 */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                    <div className="text-gray-600">診断完了者</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                    <div className="text-gray-600">満足度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">3分</div>
                    <div className="text-gray-600">平均診断時間</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 特徴セクション */}
            <section id="features" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  なぜ選ばれるのか
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  最新のAI技術と恋愛心理学を組み合わせた独自の診断システム
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">🤖</div>
                  <h4 className="text-xl font-semibold mb-3">AI 分析</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Google Gemini AI による詳細な恋愛パターン分析。
                    あなたの回答から深層的な心理傾向を読み取ります。
                  </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">📊</div>
                  <h4 className="text-xl font-semibold mb-3">専門的アドバイス</h4>
                  <p className="text-gray-600 leading-relaxed">
                    教育レベルに応じた具体的な改善提案。
                    実践的なアドバイスで恋愛スキルを向上させます。
                  </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="text-xl font-semibold mb-3">次のステップ</h4>
                  <p className="text-gray-600 leading-relaxed">
                    コンサルティングや教育コンテンツの提案。
                    継続的なサポートで恋愛力を高めます。
                  </p>
                </div>
              </div>
            </section>

            {/* 診断プロセス */}
            <section className="py-16 bg-white/50 rounded-2xl">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  診断の流れ
                </h3>
                <p className="text-lg text-gray-600">
                  たった3ステップで完了
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="text-lg font-semibold mb-2">簡単質問に回答</h4>
                  <p className="text-gray-600">恋愛に関する質問に素直に答えてください</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="text-lg font-semibold mb-2">AI が分析</h4>
                  <p className="text-gray-600">最新AIがあなたの恋愛タイプを分析します</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="text-lg font-semibold mb-2">結果とアドバイス</h4>
                  <p className="text-gray-600">詳細な分析結果と改善アドバイスを確認</p>
                </div>
              </div>
            </section>

            {/* 体験談セクション */}
            <section id="testimonials" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  利用者の声
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      A
                    </div>
                    <div>
                      <div className="font-semibold">田中さん (28歳)</div>
                      <div className="text-sm text-gray-500">会社員</div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    「診断結果を見て、自分の恋愛パターンがよく分かりました。アドバイスも具体的で実践しやすかったです。」
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      B
                    </div>
                    <div>
                      <div className="font-semibold">佐藤さん (25歳)</div>
                      <div className="text-sm text-gray-500">学生</div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    「AI の分析がとても的確でした。今まで気づかなかった自分の傾向を発見できて、恋愛に対する考え方が変わりました。」
                  </p>
                </div>
              </div>
            </section>

            {/* 診断フォーム */}
            <section id="diagnosis-section" className="py-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    無料診断を始めましょう
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    3分の簡単診断で、あなたの恋愛タイプを分析します
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>✅ 完全無料</span>
                    <span>✅ 個人情報保護</span>
                    <span>✅ 即座に結果表示</span>
                  </div>
                </div>
                <TypeformEmbed onComplete={handleDiagnosisComplete} />
              </div>
            </section>
          </div>
        ) : (
          <DiagnosisResult 
            diagnosisId={diagnosisId!} 
            onBack={() => setShowResult(false)}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">❤️</span>
                </div>
                <span className="font-bold text-lg">恋愛診断</span>
              </div>
              <p className="text-gray-400">
                AI 技術を活用した恋愛パーソナリティ診断サービス
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">恋愛診断</a></li>
                <li><a href="#" className="hover:text-white transition-colors">コンサルティング</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ワークショップ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">よくある質問</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">フォロー</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📱</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 恋愛診断・コンサルティング. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
