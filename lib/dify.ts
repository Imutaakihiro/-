// Dify API クライアント

const DIFY_API_ENDPOINT = process.env.DIFY_API_ENDPOINT!
const DIFY_API_KEY = process.env.DIFY_API_KEY!

export interface DifyMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface DifyChatRequest {
  inputs: Record<string, any>
  query: string
  response_mode: 'blocking' | 'streaming'
  user: string
}

export interface DifyChatResponse {
  answer: string
  conversation_id: string
  message_id: string
  metadata: {
    usage: {
      total_tokens: number
      prompt_tokens: number
      completion_tokens: number
    }
  }
}

// Dify チャット API を呼び出す
export async function callDifyChat(
  messages: DifyMessage[],
  inputs: Record<string, any> = {}
): Promise<DifyChatResponse> {
  const response = await fetch(`${DIFY_API_ENDPOINT}/completion-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs,
      query: messages[messages.length - 1].content,
      response_mode: 'blocking',
      user: 'diagnosis_user',
      conversation_id: undefined,
      files: []
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Dify API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

// 恋愛診断用のプロンプト生成
export function generateDiagnosisPrompt(answers: any, educationLevel: string, loveStyle: string) {
  return `
あなたは恋愛コンサルタントです。以下の診断結果を分析して、詳細なアドバイスを提供してください。

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
`
}

// 診断結果を HTML 形式で生成
export async function generateDiagnosisHTML(
  answers: any,
  educationLevel: string,
  loveStyle: string
): Promise<string> {
  const prompt = generateDiagnosisPrompt(answers, educationLevel, loveStyle)
  
  const response = await callDifyChat([
    {
      role: 'user',
      content: prompt
    }
  ])

  return response.answer
}
