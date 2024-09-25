// server only
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const responseSchema = z.object({
  quizzes: z.array(
    z.object({
      question: z.string(),
      correctAnswer: z.string(),
      incorrectAnswers: z.array(z.string()),
      comment: z.string(),
    }),
  ),
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (theme: string, difficulty: number) => {
  const prompt = `
  あなたはクイズ作成者です。以下のテーマと難易度に基づいてクイズを3問作成してください。

  テーマ: ${theme}
  難易度: ${difficulty} (0~100) (0:一般常識 25:普通 50:やや難しい 75:難しい 100:専門家レベル)

  クイズの形式は以下の通りです：
  - 質問文
  - 正しい答え
  - 間違った答え3つ
  - 簡潔な解説

  選択肢はすべて自然な言葉で作成してください(専門用語がだめというわけではありません)。
  (例えば:サムスクリューなどは、日本語では一般的に知られていないため、選択肢にはなりません)

  例:
クイズの形式は以下の通りです。必ずJSON形式でオブジェクトとして返答してください。
{
  "quizzes": [
    {
      "question": "質問文",
      "correctAnswer": "正しい答え",
      "incorrectAnswers": ["間違った答え1", "間違った答え2", "間違った答え3"],
      "comment": "簡潔な解説"
    },
    ...
  ]
}

  簡潔な解説: 日本の首都は東京です。

  それでは、クイズを作成してください。
  `;
  const response = await client.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
    response_format: zodResponseFormat(responseSchema, 'quiz'),
  });
  if (!response.choices[0].message.parsed) {
    return null;
  }
  return response.choices[0].message.parsed.quizzes;
};
