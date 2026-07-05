import type { ProgressMap, Question } from '../types'

const STORAGE_KEY = 'cca-quiz-progress-v1'

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

export function saveProgress(progress: ProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function recordAnswer(questionId: string, isCorrect: boolean): ProgressMap {
  const progress = loadProgress()
  const prev = progress[questionId]
  progress[questionId] = {
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (isCorrect ? 1 : 0),
    lastResult: isCorrect ? 'ok' : 'ng',
    lastAt: new Date().toISOString(),
  }
  saveProgress(progress)
  return progress
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function reviewTargetIds(progress: ProgressMap): string[] {
  return Object.entries(progress)
    .filter(([, p]) => p.lastResult === 'ng')
    .map(([id]) => id)
}

export interface DomainStats {
  domain: number
  answered: number
  attempts: number
  correct: number
  wrong: number
  total: number
}

export function summarize(questions: Question[], progress: ProgressMap): DomainStats[] {
  const stats: Record<number, DomainStats> = {}
  for (const d of [1, 2, 3, 4, 5]) {
    stats[d] = { domain: d, answered: 0, attempts: 0, correct: 0, wrong: 0, total: 0 }
  }
  for (const q of questions) {
    const s = stats[q.domain]
    s.total += 1
    const p = progress[q.id]
    if (p) {
      s.answered += 1
      s.attempts += p.attempts
      s.correct += p.correct
      s.wrong += p.attempts - p.correct
    }
  }
  return Object.values(stats)
}
