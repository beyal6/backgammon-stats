import { useState } from 'react'
import type { Player, Points } from '../types'
import { POINT_LABELS, ALL_PLAYERS } from '../types'

interface Props {
  onAdd: (winner: Player, loser: Player, points: Points) => Promise<void>
}

const POINTS: Points[] = [1, 2, 3, 4]

export function AddGame({ onAdd }: Props) {
  const [winner, setWinner] = useState<Player | null>(null)
  const [loser, setLoser] = useState<Player | null>(null)
  const [points, setPoints] = useState<Points | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!winner || !loser || !points) return
    setLoading(true)
    try {
      await onAdd(winner, loser, points)
      setWinner(null)
      setLoser(null)
      setPoints(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = winner && loser && points && !loading

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-6 flex flex-col gap-6">

        {/* Winner */}
        <div>
          <p className="text-sm text-slate-400 mb-3 font-medium">מי ניצח?</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_PLAYERS.map((p) => (
              <button
                key={p}
                onClick={() => { setWinner(p); if (loser === p) setLoser(null) }}
                className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                  winner === p
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105'
                    : 'bg-surface-900 text-slate-300 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Loser */}
        <div>
          <p className="text-sm text-slate-400 mb-3 font-medium">מי הפסיד?</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_PLAYERS.filter((p) => p !== winner).map((p) => (
              <button
                key={p}
                onClick={() => setLoser(p)}
                className={`py-4 rounded-2xl text-lg font-bold transition-all ${
                  loser === p
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400 scale-105'
                    : 'bg-surface-900 text-slate-300 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Points */}
        <div>
          <p className="text-sm text-slate-400 mb-3 font-medium">סוג ניצחון</p>
          <div className="grid grid-cols-4 gap-2">
            {POINTS.map((pt) => (
              <button
                key={pt}
                onClick={() => setPoints(pt)}
                className={`py-3 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                  points === pt
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105'
                    : 'bg-surface-900 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-xl font-bold">{pt}</span>
                <span className="text-[10px] opacity-80">{POINT_LABELS[pt]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {winner && loser && points && (
          <div className="bg-indigo-600/10 ring-1 ring-indigo-500/30 rounded-xl p-4 text-center">
            <p className="text-white">
              <span className="font-bold text-indigo-300">{winner}</span>
              <span className="text-slate-400"> ניצח את </span>
              <span className="font-bold text-rose-300">{loser}</span>
              <span className="text-slate-400"> · {POINT_LABELS[points]} ({points} נק׳)</span>
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
            canSubmit
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-surface-900 text-slate-600 cursor-not-allowed'
          }`}
        >
          {loading ? 'שומר...' : success ? '✓ נשמר!' : 'הוסף משחקון'}
        </button>
      </div>
    </div>
  )
}
