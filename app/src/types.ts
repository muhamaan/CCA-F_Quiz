export interface Question {
  id: string
  domain: 1 | 2 | 3 | 4 | 5
  task: string
  type: 'knowledge' | 'skill' | 'sample'
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export type QuizMode =
  | { kind: 'all' }
  | { kind: 'domain'; domain: 1 | 2 | 3 | 4 | 5 }
  | { kind: 'review' }

export interface QuestionProgress {
  attempts: number
  correct: number
  lastResult: 'ok' | 'ng'
  lastAt: string
}

export type ProgressMap = Record<string, QuestionProgress>

export const DOMAIN_NAMES: Record<number, string> = {
  1: 'Agentic Architecture & Orchestration',
  2: 'Tool Design & MCP Integration',
  3: 'Claude Code Configuration & Workflows',
  4: 'Prompt Engineering & Structured Output',
  5: 'Context Management & Reliability',
}

export const DOMAIN_WEIGHTS: Record<number, number> = {
  1: 27,
  2: 18,
  3: 20,
  4: 20,
  5: 15,
}
