import type { ProgressMap, Question, QuizMode } from '../types'
import { reviewTargetIds } from './progress'

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Build a shuffled question queue for the given mode. */
export function buildQueue(
  mode: QuizMode,
  questions: Question[],
  progress: ProgressMap,
): Question[] {
  let pool: Question[]
  switch (mode.kind) {
    case 'all':
      pool = questions
      break
    case 'domain':
      pool = questions.filter((q) => q.domain === mode.domain)
      break
    case 'review': {
      const ids = new Set(reviewTargetIds(progress))
      pool = questions.filter((q) => ids.has(q.id))
      break
    }
  }
  return shuffle(pool)
}

export interface ShuffledQuestion {
  options: string[]
  answerIndex: number
}

/** Shuffle a question's options, returning the new correct index. */
export function shuffleOptions(question: Question): ShuffledQuestion {
  const indexed = question.options.map((text, i) => ({ text, i }))
  const shuffled = shuffle(indexed)
  return {
    options: shuffled.map((o) => o.text),
    answerIndex: shuffled.findIndex((o) => o.i === question.answerIndex),
  }
}
