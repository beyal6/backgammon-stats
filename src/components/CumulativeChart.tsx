import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { Game } from '../types'
import { ALL_PLAYERS } from '../types'
import { buildCumulativePoints } from '../lib/stats'
import { useMemo } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']

interface Props { games: Game[] }

export function CumulativeChart({ games }: Props) {
  const data = useMemo(() => buildCumulativePoints(games), [games])
  if (!data.length) return null

  const step = Math.max(1, Math.floor(data.length / 20))
  const rows = data.filter((_, i) => i % step === 0 || i === data.length - 1)

  return (
    <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">נקודות מצטברות</h3>
      <Line
        data={{
          labels: rows.map((d) => d.date),
          datasets: ALL_PLAYERS.map((p, i) => ({
            label: p,
            data: rows.map((d) => (d as Record<string, number>)[p]),
            borderColor: COLORS[i],
            backgroundColor: COLORS[i] + '1a',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          })),
        }}
        options={{
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
          },
        }}
      />
    </div>
  )
}
