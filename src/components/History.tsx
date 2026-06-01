import { useState, useMemo } from 'react'
import type { Game, Player, Points } from '../types'
import { POINT_LABELS, ALL_PLAYERS, wonVerb } from '../types'
import { format, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'

interface Props {
  games: Game[]
  onDelete?: (id: string) => void
}

export function History({ games, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filterPlayer, setFilterPlayer] = useState<Player | 'all'>('all')

  const [filterType, setFilterType] = useState<Points | 'all'>('all')
  const [showAll, setShowAll] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return [...games]
      .reverse()
      .filter((g) => {
        if (filterPlayer !== 'all' && g.winner !== filterPlayer && g.loser !== filterPlayer) return false
        if (filterType !== 'all' && g.points !== filterType) return false
        if (search) {
          const s = search.toLowerCase()
          return (
            g.winner.includes(s) ||
            g.loser.includes(s) ||
            g.created_at.includes(s) ||
            POINT_LABELS[g.points as Points].includes(s)
          )
        }
        return true
      })
  }, [games, search, filterPlayer, filterType])

  const displayed = showAll ? filtered : filtered.slice(0, 5)

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Search & filters */}
      <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <input
          type="text"
          placeholder="חיפוש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface-900 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-600 w-full"
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', ...ALL_PLAYERS] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlayer(p as Player | 'all')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterPlayer === p ? 'bg-indigo-600 text-white' : 'bg-surface-900 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'כולם' : p}
            </button>
          ))}
          {(['all', 1, 2, 3, 4] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterType === t ? 'bg-emerald-600 text-white' : 'bg-surface-900 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'כל הסוגים' : POINT_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500 px-1">{filtered.length} משחקונים</p>

      {/* Game list */}
      <div className="flex flex-col gap-2">
        {displayed.map((g) => (
          <div key={g.id} className="bg-surface-800 ring-1 ring-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{g.winner}</span>
                <span className="text-slate-600 text-xs">{wonVerb(g.winner as Player)}</span>
                <span className="text-slate-400 text-sm">את {g.loser}</span>
              </div>
              <span className="text-xs text-slate-500">
                {format(parseISO(g.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}
              </span>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-600/20 rounded-full px-2.5 py-1 whitespace-nowrap">
              {POINT_LABELS[g.points as Points]} ({g.points})
            </span>
            {onDelete && (
              confirmId === g.id ? (
                <div className="flex gap-1">
                  <button onClick={() => { onDelete(g.id); setConfirmId(null) }} className="text-red-400 text-xs hover:text-red-300 px-2">מחק</button>
                  <button onClick={() => setConfirmId(null)} className="text-slate-500 text-xs hover:text-white px-2">ביטול</button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(g.id)} className="text-slate-600 hover:text-red-400 text-xs px-1">✕</button>
              )
            )}
          </div>
        ))}
      </div>

      {filtered.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-indigo-400 text-sm hover:text-indigo-300 text-center py-2"
        >
          {showAll ? 'הצג פחות' : `הצג את כל ${filtered.length} המשחקונים`}
        </button>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-8">לא נמצאו משחקונים</p>
      )}
    </div>
  )
}
