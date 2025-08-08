// 外部 AI API クライアント

export interface AIAnalysisRequest {
  answers: any
  education_level: string
  love_style: string
  api_type: 'openai' | 'anthropic' | 'gemini' | 'custom'
  api_key?: string
  api_endpoint?: string
}

export interface AIAnalysisResponse {
  success: boolean
  analysis_html: string
  error?: string
}

// OpenAI API を使用した分析
async function analyzeWithOpenAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${request.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは恋愛コンサルタントです。診断結果を分析して、詳細で親しみやすいアドバイスをHTML形式で提供してください。'
          },
          {
            role: 'user',
            content: generateAnalysisPrompt(request.answers, request.education_level, request.love_style)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.choices[0].message.content

    return {
      success: true,
      analysis_html: analysis
    }
  } catch (error) {
    return {
      success: false,
      analysis_html: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Anthropic Claude API を使用した分析
async function analyzeWithClaude(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': request.api_key!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: generateAnalysisPrompt(request.answers, request.education_level, request.love_style)
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.content[0].text

    return {
      success: true,
      analysis_html: analysis
    }
  } catch (error) {
    return {
      success: false,
      analysis_html: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Google Gemini API を使用した分析
async function analyzeWithGemini(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${request.api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: generateAnalysisPrompt(request.answers, request.education_level, request.love_style)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.candidates[0].content.parts[0].text

    return {
      success: true,
      analysis_html: analysis
    }
  } catch (error) {
    return {
      success: false,
      analysis_html: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// カスタム API を使用した分析
async function analyzeWithCustomAPI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const response = await fetch(request.api_endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.api_key && { 'Authorization': `Bearer ${request.api_key}` })
      },
      body: JSON.stringify({
        prompt: generateAnalysisPrompt(request.answers, request.education_level, request.love_style),
        answers: request.answers,
        education_level: request.education_level,
        love_style: request.love_style
      })
    })

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      analysis_html: data.analysis || data.response || data.text || JSON.stringify(data)
    }
  } catch (error) {
    return {
      success: false,
      analysis_html: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// 分析プロンプト生成
function generateAnalysisPrompt(answers: any, educationLevel: string, loveStyle: string): string {
  return `
あなたは恋愛コンサルタントです。以下の診断結果を分析して、詳細で親しみやすいアドバイスをHTML形式で提供してください。

【診断結果】
- 教育レベル: ${educationLevel}
- 恋愛スタイル: ${loveStyle}
- 回答内容: ${JSON.stringify(answers, null, 2)}

【分析要求】
1. この人の恋愛パターンを分析
2. 現在の悩みの根本原因を特定
3. 教育レベルに応じた具体的な改善アドバイス
4. 次のステップの提案

【出力形式】
HTML形式で、見やすく構造化されたアドバイスを提供してください。
タイトル、セクション分け、箇条書きなどを適切に使用してください。
親しみやすく、励ましの言葉も含めてください。

【HTML例】
<div class="diagnosis-result">
  <h2>恋愛診断結果</h2>
  <div class="analysis">
    <h3>あなたの恋愛パターン</h3>
    <p>分析内容...</p>
  </div>
  <div class="advice">
    <h3>改善アドバイス</h3>
    <ul>
      <li>具体的なアドバイス1</li>
      <li>具体的なアドバイス2</li>
    </ul>
  </div>
</div>
`
}

// メインの分析関数
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  switch (request.api_type) {
    case 'openai':
      return await analyzeWithOpenAI(request)
    case 'anthropic':
      return await analyzeWithClaude(request)
    case 'gemini':
      return await analyzeWithGemini(request)
    case 'custom':
      return await analyzeWithCustomAPI(request)
    default:
      return {
        success: false,
        analysis_html: '',
        error: 'Unsupported API type'
      }
  }
}
