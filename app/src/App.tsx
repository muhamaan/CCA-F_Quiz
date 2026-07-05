import { useState } from 'react'
import type { QuizMode } from './types'
import { Home } from './components/Home'
import { Quiz } from './components/Quiz'
import { Stats } from './components/Stats'

type Screen =
  | { name: 'home' }
  | { name: 'quiz'; mode: QuizMode }
  | { name: 'stats' }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  switch (screen.name) {
    case 'home':
      return (
        <Home
          onStart={(mode) => setScreen({ name: 'quiz', mode })}
          onShowStats={() => setScreen({ name: 'stats' })}
        />
      )
    case 'quiz':
      return <Quiz mode={screen.mode} onHome={() => setScreen({ name: 'home' })} />
    case 'stats':
      return <Stats onHome={() => setScreen({ name: 'home' })} />
  }
}

export default App
