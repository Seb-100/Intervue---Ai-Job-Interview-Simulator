import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SETUP_SYSTEM_PROMPT = `You are Alex, a warm and professional AI interview coach. Your job is to have a friendly voice conversation to help the user create their personalized interview session.

You need to gather exactly these 4 things through natural conversation:
1. Their field/role (e.g. software engineer, nurse, data scientist, lawyer, teacher)
2. Experience level (junior 0-2yrs, mid 2-5yrs, senior 5-8yrs, or lead 8+yrs)
3. Number of questions (between 3 and 15)
4. Type of interview (technical, behavioral, mixed, or case-study)

IMPORTANT RULES:
- Be conversational and warm, like a real person - not robotic
- Ask ONE question at a time, never multiple at once
- Acknowledge their answer naturally before asking next question
- Keep responses SHORT (1-3 sentences max) - this is a voice conversation
- Use casual but professional language
- If something is unclear, ask for clarification naturally
- When you have all 4 pieces of info, confirm the summary and end with exactly: "SETUP_COMPLETE"

After SETUP_COMPLETE, include a JSON block like this on a new line:
CONFIG:{"field":"software engineer","experienceLevel":"mid","questionCount":8,"interviewType":"technical"}

Start by warmly greeting them and asking what field they're interviewing for.`

const INTERVIEW_SYSTEM_PROMPT = (config: {
  field: string
  experienceLevel: string
  questionCount: number
  interviewType: string
}) => `You are Jordan, a sharp and professional interviewer at a top company. You are conducting a ${config.interviewType} interview for a ${config.experienceLevel}-level ${config.field} position.

Interview plan: Ask exactly ${config.questionCount} questions total.

RULES:
- Be professional but human — use natural transitions like "Great", "Interesting", "I see"
- Keep your questions and responses concise — this is a voice interview
- After the user answers, give brief acknowledgment (1 sentence), then ask the next question
- Ask follow-up questions when an answer is interesting or incomplete
- Track question count internally. After the final answer, give a warm closing: "That wraps up our interview! You did great. Your results will be ready shortly. INTERVIEW_COMPLETE"
- Adapt difficulty to the ${config.experienceLevel} level
- For technical questions: focus on ${config.field}-specific concepts
- For behavioral: use STAR method prompts
- NEVER mention you're an AI unless directly asked
- Keep each response under 4 sentences

Begin the interview by introducing yourself as Jordan and welcoming them.`

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, config } = await req.json()

    const systemPrompt =
      mode === 'setup'
        ? SETUP_SYSTEM_PROMPT
        : INTERVIEW_SYSTEM_PROMPT(config)

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.85,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
