// 恋愛診断ロジック（Dify を使わない版）

export interface DiagnosisResult {
  education_level: string
  love_style: string
  analysis_html: string
  recommended_next_step: string
}

// 教育レベル判定
export function determineEducationLevel(answers: any): string {
  // 回答内容に基づいて教育レベルを判定
  const score = calculateEducationScore(answers)
  
  if (score >= 8) return '高レベル'
  if (score >= 5) return '中レベル'
  return '低レベル'
}

// 恋愛スタイル判定
export function determineLoveStyle(answers: any): string {
  // 回答内容に基づいて恋愛スタイルを判定
  const score = calculateLoveStyleScore(answers)
  
  // データベース制約に合わせて値を調整
  if (score >= 8) return '依存型・自己否定'
  if (score >= 5) return '理想追求型'
  return '自己抑圧型'
}

// 教育レベルスコア計算
function calculateEducationScore(answers: any): number {
  let score = 0
  
  // 年齢による基本スコア
  const age = answers['6968559e-fce5-4af4-a626-0fc7aac0ca8c'] // 年齢質問のID
  if (age === '20-29歳') score += 2
  else if (age === '30-39歳') score += 3
  else if (age === '40歳以上') score += 2
  
  // その他の質問に基づくスコア
  // 実際のTypeform質問IDに合わせて調整
  Object.keys(answers).forEach(key => {
    const answer = answers[key]
    if (typeof answer === 'string' && answer.length > 10) {
      score += 1 // 詳細な回答
    }
  })
  
  return score
}

// 恋愛スタイルスコア計算
function calculateLoveStyleScore(answers: any): number {
  let score = 0
  
  // 回答の内容に基づくスコア
  Object.keys(answers).forEach(key => {
    const answer = answers[key]
    if (typeof answer === 'string') {
      if (answer.includes('積極') || answer.includes('積極的')) score += 2
      if (answer.includes('慎重') || answer.includes('慎重に')) score += 1
      if (answer.includes('自然') || answer.includes('自然に')) score += 1
    }
  })
  
  return score
}

// 診断結果のHTML生成
export function generateDiagnosisHTML(
  answers: any,
  educationLevel: string,
  loveStyle: string
): string {
  const analysis = generateAnalysis(answers, educationLevel, loveStyle)
  
  return `
    <div class="diagnosis-result">
      <h2>恋愛診断結果</h2>
      
      <div class="result-summary">
        <h3>診断サマリー</h3>
        <p><strong>教育レベル:</strong> ${educationLevel}</p>
        <p><strong>恋愛スタイル:</strong> ${loveStyle}</p>
      </div>
      
      <div class="analysis">
        <h3>詳細分析</h3>
        ${analysis}
      </div>
      
      <div class="recommendations">
        <h3>おすすめの次のステップ</h3>
        <p>${getRecommendedNextStep(educationLevel)}</p>
      </div>
    </div>
  `
}

// 分析内容生成
function generateAnalysis(answers: any, educationLevel: string, loveStyle: string): string {
  let analysis = '<ul>'
  
  // 教育レベル別の分析
  if (educationLevel === '高レベル') {
    analysis += '<li>あなたは恋愛について深い理解を持っています</li>'
    analysis += '<li>コミュニケーション能力が高く、関係性を築くのが得意です</li>'
    analysis += '<li>自己分析ができており、成長意欲があります</li>'
  } else if (educationLevel === '中レベル') {
    analysis += '<li>基本的な恋愛スキルは持っています</li>'
    analysis += '<li>さらに深い関係性を築くための学習が必要です</li>'
    analysis += '<li>自己理解を深めることで成長できます</li>'
  } else {
    analysis += '<li>恋愛について学ぶ意欲があります</li>'
    analysis += '<li>基本的なコミュニケーションスキルから始めましょう</li>'
    analysis += '<li>段階的に成長していくことができます</li>'
  }
  
  // 恋愛スタイル別の分析
  if (loveStyle === '積極的') {
    analysis += '<li>積極的に相手にアプローチするタイプです</li>'
    analysis += '<li>深い関係性を求める傾向があります</li>'
  } else if (loveStyle === 'バランス型') {
    analysis += '<li>自然な流れで関係性を築くタイプです</li>'
    analysis += '<li>バランスの取れたアプローチが特徴です</li>'
  } else {
    analysis += '<li>慎重に相手を理解してから関係性を築くタイプです</li>'
    analysis += '<li>信頼関係を重視する傾向があります</li>'
  }
  
  analysis += '</ul>'
  return analysis
}

// 推奨次のステップ
function getRecommendedNextStep(educationLevel: string): string {
  switch (educationLevel) {
    case '高レベル':
      return 'プロの恋愛コンサルタントによる個別相談をお勧めします。より深い洞察と具体的なアドバイスが得られます。'
    case '中レベル':
      return '恋愛スキル向上のための教育コンテンツをご提供します。段階的に学習して成長しましょう。'
    default:
      return '恋愛の基礎から学べる教育コンテンツをご提供します。まずは基本的なスキルから始めましょう。'
  }
}
