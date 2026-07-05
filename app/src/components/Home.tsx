import { useMemo } from 'react'
import { questions } from '../data'
import { loadProgress, reviewTargetIds } from '../lib/progress'
import { DOMAIN_NAMES, DOMAIN_WEIGHTS, type QuizMode } from '../types'

interface Props {
  onStart: (mode: QuizMode) => void
  onShowStats: () => void
}

export function Home({ onStart, onShowStats }: Props) {
  const progress = useMemo(() => loadProgress(), [])
  const reviewCount = reviewTargetIds(progress).length
  const totals = useMemo(() => {
    let attempts = 0
    let correct = 0
    for (const p of Object.values(progress)) {
      attempts += p.attempts
      correct += p.correct
    }
    return { attempts, correct }
  }, [progress])

  const domainCount = (d: number) => questions.filter((q) => q.domain === d).length

  return (
    <div className="screen">
      <header className="app-header">
        <h1>CCA-F Quiz</h1>
        <p className="subtitle">
          Claude Certified Architect – Foundations 穴あき練習問題（全{questions.length}問）
        </p>
      </header>

      <div className="summary-card">
        <span>
          総回答 <strong>{totals.attempts}</strong> 回
        </span>
        <span>
          正答率{' '}
          <strong>
            {totals.attempts > 0
              ? Math.round((totals.correct / totals.attempts) * 100)
              : '--'}
            %
          </strong>
        </span>
        <button type="button" className="link-btn" onClick={onShowStats}>
          統計を見る
        </button>
      </div>

      <button type="button" className="mode-btn primary" onClick={() => onStart({ kind: 'all' })}>
        全問ランダム出題
      </button>

      <button
        type="button"
        className="mode-btn review"
        disabled={reviewCount === 0}
        onClick={() => onStart({ kind: 'review' })}
      >
        間違えた問題を復習{reviewCount > 0 ? `（${reviewCount}問）` : '（なし）'}
      </button>

      <h2 className="section-title">ドメイン別に出題</h2>
      <div className="domain-list">
        {([1, 2, 3, 4, 5] as const).map((d) => (
          <button
            type="button"
            key={d}
            className="mode-btn domain"
            onClick={() => onStart({ kind: 'domain', domain: d })}
          >
            <span className="domain-label">
              D{d}: {DOMAIN_NAMES[d]}
            </span>
            <span className="domain-meta">
              {DOMAIN_WEIGHTS[d]}% / {domainCount(d)}問
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
