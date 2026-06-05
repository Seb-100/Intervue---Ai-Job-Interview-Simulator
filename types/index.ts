export type InterviewType = 'technical' | 'behavioral' | 'mixed' | 'case-study'
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead'
export type InterviewMode = 'voice' | 'video'

export interface InterviewConfig {
  id: string
  field: string
  experienceLevel: ExperienceLevel
  questionCount: number
  interviewType: InterviewType
  createdAt: string
  status: 'ready' | 'in-progress' | 'completed'
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface SetupConversation {
  messages: Message[]
  config: Partial<InterviewConfig>
  isComplete: boolean
}

export interface InterviewQuestion {
  id: string
  question: string
  type: 'technical' | 'behavioral' | 'case-study'
  followUps?: string[]
}

export interface InterviewSession {
  config: InterviewConfig
  questions: InterviewQuestion[]
  currentQuestionIndex: number
  answers: { questionId: string; answer: string; feedback?: string }[]
  startedAt: string
  mode: InterviewMode
}
