import { useState } from 'react'
import { questions } from '../data'
import { loadProgress, resetProgress, summarize } from '../lib/progress'
import { DOMAIN_NAMES } from '../types'

interface Props {
  onHome: () => void
}

export function Stats({ onHome }: Props) {
  const [progress, setProgress] = useState(() => loadProgress())
  const stats = summarize(questions, progress)
  const totalAttempts = stats.reduce((s, d) => s + d.attempts, 0)
  const totalCorrect = stats.reduce((s, d) => s + d.correct, 0)

  const handleReset = () => {
    if (window.confirm('学習履歴をすべてリセットしますか？')) {
      resetProgress()
      setProgress({})
    }
  }

  return (
    <div className="screen">
      <header className="quiz-header">
        <button type="button" className="link-btn" onClick={onHome}>
          ← ホーム
        </button>
        <span>学習統計</span>
      </header>

      <div className="summary-card">
        <span>
          総回答 <strong>{totalAttempts}</strong> 回
        </span>
        <span>
          正答率{' '}
          <strong>
            {totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : '--'}%
          </strong>
        </span>
      </div>

      {stats.map((s) => {
        const rate = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0
        return (
          <div className="stat-row" key={s.domain}>
            <div className="stat-title">
              D{s.domain}: {DOMAIN_NAMES[s.domain]}
            </div>
            <div className="stat-bar-bg">
              <div className="stat-bar" style={{ width: `${rate}%` }} />
            </div>
            <div className="stat-detail">
              進捗 {s.answered}/{s.total}問 · 回答{s.attempts}回 · 正答率{' '}
              {s.attempts > 0 ? `${rate}%` : '--'} · 誤答 {s.wrong}回
            </div>
          </div>
        )
      })}

      <button type="button" className="mode-btn danger" onClick={handleReset}>
        学習履歴をリセット
      </button>
    </div>
  )
}
