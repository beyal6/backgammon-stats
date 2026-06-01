import { useState, useMemo } from 'react'
import type { Game, Player, Points } from '../types'
import { ALL_PLAYERS, POINT_LABELS, wonVerb } from '../types'
import { StatCard } from './StatCard'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface Props { games: Game[] }

function PlayerPicker({
  label, value, exclude, onChange,
}: {
  label: string
  value: Player | null
  exclude: Player | null
  onChange: (p: Player) => void
}) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <p className="text-xs text-slate-400 font-medium text-center">{label}</p>
      <div className="flex flex-col gap-1.5">
        {ALL_PLAYERS.filter(p => p !== exclude).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
              value === p
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                : 'bg-surface-900 text-slate-300 hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

export function HeadToHead({ games }: Props) {
  const [playerA, setPlayerA] = useState<Player | null>(null)
  const [playerB, setPlayerB] = useState<Player | null>(null)

  const h2hGames = useMemo(() => {
    if (!playerA || !playerB) return []
    return games.filter(g =>
      (g.winner === playerA && g.loser === playerB) ||
      (g.winner === playerB && g.loser === playerA)
    ).sort((a, b) => a.created_at.localeCompare(b.created_at))
  }, [games, playerA, playerB])

  const stats = useMemo(() => {
    if (!playerA || !playerB) return null
    const emptyWins = () => ({ 1: 0, 2: 0, 3: 0, 4: 0 } as Record<Points, number>)
    const a = { wins: 0, points: 0, winsByType: emptyWins() }
    const b = { wins: 0, points: 0, winsByType: emptyWins() }

    for (const g of h2hGames) {
      const pts = g.points as Points
      if (g.winner === playerA) { a.wins++; a.points += pts; a.winsByType[pts]++ }
      else { b.wins++; b.points += pts; b.winsByType[pts]++ }
    }

    const total = h2hGames.length
    const aWinPct = total ? Math.round((a.wins / total) * 100) : 0
    const bWinPct = total ? Math.round((b.wins / total) * 100) : 0

    // Current streak
    let streak = { player: playerA, count: 0 }
    if (h2hGames.length) {
      const last = h2hGames[h2hGames.length - 1].winner as Player
      let count = 1
      for (let i = h2hGames.length - 2; i >= 0; i--) {
        if (h2hGames[i].winner === last) count++
        else break
      }
      streak = { player: last, count }
    }

    // Best streak
    let best = { player: playerA, count: 0 }
    if (h2hGames.length) {
      let run = { player: h2hGames[0].winner as Player, count: 1 }
      best = { ...run }
      for (let i = 1; i < h2hGames.length; i++) {
        if (h2hGames[i].winner === run.player) { run.count++; if (run.count > best.count) best = { ...run } }
        else run = { player: h2hGames[i].winner as Player, count: 1 }
      }
    }

    return { a, b, aWinPct, bWinPct, total, streak, best }
  }, [h2hGames, playerA, playerB])

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Player selectors */}
      <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
        <p className="text-sm font-semibold text-slate-300 mb-4 text-center">בחר שני שחקנים</p>
        <div className="flex gap-3">
          <PlayerPicker label="שחקן א׳" value={playerA} exclude={playerB}
            onChange={p => { setPlayerA(p); if (p === playerB) setPlayerB(null) }} />
          <div className="flex items-center justify-center text-2xl text-slate-600 pt-6">⚔️</div>
          <PlayerPicker label="שחקן ב׳" value={playerB} exclude={playerA}
            onChange={p => { setPlayerB(p); if (p === playerA) setPlayerA(null) }} />
        </div>
      </div>

      {/* No selection */}
      {(!playerA || !playerB) && (
        <p className="text-center text-slate-500 py-8">בחר שני שחקנים כדי לראות סטטיסטיקות</p>
      )}

      {/* Stats */}
      {playerA && playerB && stats && (
        <>
          {/* Total games */}
          <div className="bg-indigo-600/20 ring-1 ring-indigo-500/30 rounded-2xl p-4 text-center">
            <p className="text-indigo-300 font-bold text-lg">
              {playerA} מול {playerB}
            </p>
            <p className="text-slate-400 text-sm mt-1">{stats.total} משחקונים סה״כ</p>
          </div>

          {stats.total === 0 && (
            <p className="text-center text-slate-500 py-4">אין משחקונים בין שחקנים אלה עדיין</p>
          )}

          {stats.total > 0 && (
            <>
              {/* Win bar */}
              <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-indigo-400">{playerA} {stats.aWinPct}%</span>
                  <span className="text-emerald-400">{stats.bWinPct}% {playerB}</span>
                </div>
                <div className="flex rounded-full overflow-hidden h-4">
                  <div className="bg-indigo-600 transition-all" style={{ width: `${stats.aWinPct}%` }} />
                  <div className="bg-emerald-600 flex-1" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{stats.a.wins} ניצחונות</span>
                  <span>{stats.b.wins} ניצחונות</span>
                </div>
              </div>

              {/* Player cards side by side */}
              <div className="grid grid-cols-2 gap-3">
                {([playerA, playerB] as const).map((player, idx) => {
                  const s = idx === 0 ? stats.a : stats.b
                  const color = idx === 0 ? 'indigo' : 'emerald'
                  return (
                    <div key={player} className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4 flex flex-col gap-3">
                      <h3 className="font-bold text-white text-center">{player}</h3>
                      <StatCard label="ניצחונות" value={s.wins} color={color} />
                      <StatCard label="נקודות" value={s.points} color={color} />
                      <div className="flex flex-col gap-1 mt-1">
                        {([1, 2, 3, 4] as const).map(p => (
                          <div key={p} className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 w-10">{POINT_LABELS[p]}</span>
                            <div className="flex-1 bg-surface-900 rounded-full h-1">
                              <div className={`h-1 rounded-full ${color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                                style={{ width: `${s.wins ? (s.winsByType[p] / s.wins) * 100 : 0}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400">{s.winsByType[p]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Streaks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 mb-1">רצף נוכחי</p>
                  <p className="text-white font-bold">{stats.streak.player} <span className="text-indigo-400">{stats.streak.count}</span></p>
                </div>
                <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 mb-1">רצף שיא</p>
                  <p className="text-white font-bold">{stats.best.player} <span className="text-indigo-400">{stats.best.count}</span></p>
                </div>
              </div>

              {/* Points chart */}
              <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">נקודות לפי סוג</h3>
                <Bar
                  data={{
                    labels: [1, 2, 3, 4].map(p => POINT_LABELS[p as Points]),
                    datasets: [
                      { label: playerA, data: [1,2,3,4].map(p => stats.a.winsByType[p as Points]), backgroundColor: '#6366f1', borderRadius: 4 },
                      { label: playerB, data: [1,2,3,4].map(p => stats.b.winsByType[p as Points]), backgroundColor: '#10b981', borderRadius: 4 },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { labels: { color: '#94a3b8' } } },
                    scales: {
                      x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
                      y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: '#1e293b' } },
                    },
                  }}
                />
              </div>

              {/* Last 5 games */}
              <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">5 משחקונים אחרונים</h3>
                {[...h2hGames].reverse().slice(0, 5).map(g => (
                  <div key={g.id} className="flex justify-between items-center bg-surface-900 rounded-xl px-3 py-2">
                    <span className="text-white text-sm font-medium">
                      {g.winner}
                      <span className="text-slate-500 text-xs font-normal"> {wonVerb(g.winner as Player)} </span>
                      <span className="text-slate-400 text-xs">את {g.loser}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-indigo-300 bg-indigo-600/20 rounded-full px-2 py-0.5">{POINT_LABELS[g.points as Points]}</span>
                      <span className="text-xs text-slate-500">{g.created_at.slice(0,10)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
