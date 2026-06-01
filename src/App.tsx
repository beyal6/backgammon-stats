import { useState } from 'react'
import { useGames } from './hooks/useGames'
import { NavBar, type Tab } from './components/NavBar'
import { Dashboard } from './components/Dashboard'
import { AddGame } from './components/AddGame'
import { CalendarView } from './components/CalendarView'
import { History } from './components/History'
import { ImportExport } from './components/ImportExport'
import type { FilterState, Player, Points } from './types'

export default function App() {
  const { games, loading, error, online, addGame, removeGame, importGames } = useGames()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [filter, setFilter] = useState<FilterState>({ range: 'all' })

  const pageTitle: Record<Tab, string> = {
    dashboard: '🎲 השש בש של הברווזים',
    add: 'הוספת משחקון',
    calendar: 'לוח שנה',
    history: 'היסטוריה',
    settings: 'כלים',
  }

  return (
    <div className="min-h-screen bg-surface-900" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <h1 className={`font-bold text-white flex items-center gap-2 ${tab === 'dashboard' ? 'text-xl' : 'text-lg'}`}>
          {tab === 'dashboard'
            ? <><span>🎲</span><img src="/backgammon-stats/duck.svg" alt="duck" className="h-8 w-8 inline-block" /><span>השש בש של הברווזים</span></>
            : pageTitle[tab]
          }
        </h1>
        {error && (
          <span className="text-xs text-amber-400 bg-amber-500/10 rounded-full px-2 py-0.5">
            שגיאת חיבור
          </span>
        )}
        {loading && (
          <span className="text-xs text-indigo-400 animate-pulse">טוען...</span>
        )}
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        {tab === 'dashboard' && (
          <Dashboard games={games} filter={filter} onFilterChange={setFilter} />
        )}
        {tab === 'add' && (
          <AddGame
            onAdd={async (winner: Player, loser: Player, points: Points) => {
              await addGame(winner, loser, points)
            }}
          />
        )}
        {tab === 'calendar' && <CalendarView games={games} />}
        {tab === 'history' && <History games={games} onDelete={removeGame} />}
        {tab === 'settings' && <ImportExport games={games} onImport={importGames} />}
      </main>

      <NavBar active={tab} onChange={setTab} online={online} />
    </div>
  )
}
