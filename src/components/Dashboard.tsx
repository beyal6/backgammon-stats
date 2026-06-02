import { useMemo } from 'react'
import type { Game, FilterState } from '../types'
import { POINT_LABELS, ALL_PLAYERS } from '../types'
import { StatCard } from './StatCard'
import { FilterBar } from './FilterBar'
import { CumulativeChart } from './CumulativeChart'
import { MonthlyWinChart } from './MonthlyWinChart'
import { filterGames, calcStats } from '../lib/stats'

interface Props {
  games: Game[]
  filter: FilterState
  onFilterChange: (f: FilterState) => void
}

function StreakBadge({ label, player, count }: { label: string; player: string; count: number }) {
  return (
    <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">
        {player} <span className="text-indigo-400">{count}</span>
      </p>
    </div>
  )
}

export function Dashboard({ games, filter, onFilterChange }: Props) {
  const filtered = useMemo(() => filterGames(games, filter), [games, filter])
  const stats = useMemo(() => calcStats(filtered), [filtered])

  return (
    <div className="flex flex-col gap-5 pb-24">
      <FilterBar filter={filter} onChange={onFilterChange} />

      {/* Leader banner */}
      {stats.pointLeader && (
        <div className="bg-indigo-600/20 ring-1 ring-indigo-500/30 rounded-2xl p-4 text-center">
          <span className="text-indigo-300 font-semibold text-lg">
            מוביל: {stats.pointLeader} · {stats.players[stats.pointLeader].points} נקודות
          </span>
        </div>
      )}

      {/* Player cards */}
      <div className="grid grid-cols-1 gap-4">
        {ALL_PLAYERS.map((player) => {
          const s = stats.players[player]
          return (
            <div key={player} className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">{player}</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="סך משחקים" value={s.wins + s.losses} color="slate" />
                <StatCard label="ניצחונות" value={s.wins} color="indigo" />
                <StatCard label="נקודות" value={s.points} color="emerald" />
                <StatCard label="אחוז הצלחה" value={`${s.winPct}%`} color="amber" />
              </div>
              <div className="flex flex-col gap-1">
                {([1, 2, 3, 4] as const).map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12">{POINT_LABELS[p]}</span>
                    <div className="flex-1 bg-surface-900 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${s.wins ? (s.winsByType[p] / s.wins) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-300 w-6 text-left">{s.winsByType[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-3">
        {stats.currentStreak && (
          <StreakBadge label="רצף נוכחי" player={stats.currentStreak.player} count={stats.currentStreak.count} />
        )}
        <StreakBadge label="רצף שיא" player={stats.bestStreak.player} count={stats.bestStreak.count} />
      </div>

      {/* Charts */}
      <CumulativeChart games={filtered} />
      <MonthlyWinChart games={filtered} />
    </div>
  )
}
