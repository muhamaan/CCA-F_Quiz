import { useMemo, useState } from 'react'
import { questions } from '../data'
import { loadProgress, recordAnswer } from '../lib/progress'
import { buildQueue, shuffleOptions } from '../lib/quiz'
import { DOMAIN_NAMES, type Question, type QuizMode } from '../types'

interface Props {
  mode: QuizMode
  onHome: () => void
}

function modeLabel(mode: QuizMode): string {
  switch (mode.kind) {
    case 'all':
      return '全問ランダム'
    case 'domain':
      return `Domain ${mode.domain}`
    case 'review':
      return '復習モード'
  }
}

export function Quiz({ mode, onHome }: Props) {
  const [queue] = useState<Question[]>(() => buildQueue(mode, questions, loadProgress()))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const question = queue[index]
  const shuffled = useMemo(
    () => (question ? shuffleOptions(question) : null),
    [question],
  )

  if (!question || !shuffled) {
    return (
      <div className="screen">
        <header className="quiz-header">
          <button type="button" className="link-btn" onClick={onHome}>
            ← ホーム
          </button>
          <span>{modeLabel(mode)}</span>
        </header>
        <div className="finish-card">
          <h2>{queue.length === 0 ? '出題できる問題がありません' : 'セッション終了！'}</h2>
          {queue.length > 0 && (
            <p>
              {queue.length}問中 {correctCount}問正解（
              {Math.round((correctCount / queue.length) * 100)}%）
            </p>
          )}
          <button type="button" className="mode-btn primary" onClick={onHome}>
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  const isAnswered = selected !== null
  const isCorrect = selected === shuffled.answerIndex

  const handleSelect = (i: number) => {
    if (isAnswered) return
    setSelected(i)
    const correct = i === shuffled.answerIndex
    recordAnswer(question.id, correct)
    setAnsweredCount((n) => n + 1)
    if (correct) setCorrectCount((n) => n + 1)
  }

  const handleNext = () => {
    setSelected(null)
    setIndex((i) => i + 1)
  }

  return (
    <div className="screen">
      <header className="quiz-header">
        <button type="button" className="link-btn" onClick={onHome}>
          ← ホーム
        </button>
        <span>{modeLabel(mode)}</span>
        <span className="quiz-progress">
          {Math.min(index + 1, queue.length)} / {queue.length}
        </span>
      </header>

      <div className="question-card">
        <div className="question-meta">
          D{question.domain} · Task {question.task} · {DOMAIN_NAMES[question.domain]}
          {question.type === 'sample' && <span className="badge">公式サンプル</span>}
        </div>
        <p className="question-text">{question.question}</p>
      </div>

      <div className="options">
        {shuffled.options.map((opt, i) => {
          let cls = 'option-btn'
          if (isAnswered) {
            if (i === shuffled.answerIndex) cls += ' correct'
            else if (i === selected) cls += ' wrong'
            else cls += ' dimmed'
          }
          return (
            <button
              type="button"
              key={`${question.id}-${i}`}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className={`explanation ${isCorrect ? 'ok' : 'ng'}`}>
          <div className="result-label">{isCorrect ? '✓ Correct' : '✗ Incorrect'}</div>
          <p>{question.explanation}</p>
          <button type="button" className="mode-btn primary" onClick={handleNext}>
            {index + 1 < queue.length ? '次の問題へ' : '結果を見る'}
          </button>
        </div>
      )}

      {answeredCount > 0 && !isAnswered && (
        <p className="session-note">
          このセッション: {correctCount} / {answeredCount} 正解
        </p>
      )}
    </div>
  )
}
