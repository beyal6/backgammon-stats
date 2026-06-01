import { useState, useMemo } from 'react'
import { format, addMonths, subMonths, startOfMonth, getDay, getDaysInMonth } from 'date-fns'
import { he } from 'date-fns/locale'
import type { Game } from '../types'
import { POINT_LABELS } from '../types'

interface Props { games: Game[] }

function GamePill({ game }: { game: Game }) {
  return (
    <div className="text-xs bg-indigo-600/20 rounded px-1.5 py-0.5 text-indigo-300">
      {game.winner[0]} +{game.points}
    </div>
  )
}

export function CalendarView({ games }: Props) {
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<string | null>(null)

  const year = current.getFullYear()
  const month = current.getMonth()

  const dayMap = useMemo(() => {
    const m: Record<string, Game[]> = {}
    for (const g of games) {
      const key = g.created_at.slice(0, 10)
      if (!m[key]) m[key] = []
      m[key].push(g)
    }
    return m
  }, [games])

  const daysInMonth = getDaysInMonth(new Date(year, month))
  const firstDow = getDay(startOfMonth(new Date(year, month))) // 0=Sun

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const DOW = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

  const selectedGames = selected ? (dayMap[selected] ?? []) : []

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Month nav */}
      <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrent(subMonths(current, 1))} className="text-slate-400 hover:text-white p-2">‹</button>
          <span className="text-white font-semibold">
            {format(current, 'MMMM yyyy', { locale: he })}
          </span>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="text-slate-400 hover:text-white p-2">›</button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2">
          {DOW.map((d) => (
            <div key={d} className="text-center text-xs text-slate-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayGames = dayMap[key] ?? []
            const isSelected = selected === key
            return (
              <button
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                className={`rounded-xl p-1.5 flex flex-col items-center gap-0.5 min-h-[52px] transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/30 ring-1 ring-indigo-500'
                    : dayGames.length
                    ? 'bg-surface-900 hover:bg-surface-800'
                    : 'hover:bg-surface-900/50'
                }`}
              >
                <span className={`text-xs font-medium ${dayGames.length ? 'text-white' : 'text-slate-600'}`}>{day}</span>
                {dayGames.length > 0 && (
                  <span className="text-[10px] text-indigo-400 font-bold">{dayGames.length}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && selectedGames.length > 0 && (
        <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-300">
            {format(new Date(selected), 'dd/MM/yyyy')} · {selectedGames.length} משחקונים
          </h3>
          {selectedGames.map((g) => (
            <div key={g.id} className="flex justify-between items-center bg-surface-900 rounded-xl px-3 py-2">
              <span className="text-white font-medium">{g.winner}</span>
              <span className="text-xs text-indigo-400 bg-indigo-600/20 rounded-full px-2 py-0.5">
                {POINT_LABELS[g.points as 1 | 2 | 3 | 4]} ({g.points} נק׳)
              </span>
              <span className="text-xs text-slate-400">{g.created_at.slice(11, 16)}</span>
            </div>
          ))}
        </div>
      )}

      {selected && selectedGames.length === 0 && (
        <div className="text-center text-slate-500 text-sm">אין משחקונים ביום זה</div>
      )}
    </div>
  )
}
