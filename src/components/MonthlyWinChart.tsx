import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { Game } from '../types'
import { buildMonthlyWinPct } from '../lib/stats'
import { useMemo } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props { games: Game[] }

export function MonthlyWinChart({ games }: Props) {
  const data = useMemo(() => buildMonthlyWinPct(games), [games])

  if (!data.length) return null

  return (
    <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">אחוז ניצחון חודשי</h3>
      <Bar
        data={{
          labels: data.map((d) => d.month),
          datasets: [
            {
              label: 'אייל',
              data: data.map((d) => d.ayalon),
              backgroundColor: '#6366f1',
              borderRadius: 4,
            },
            {
              label: 'הינס',
              data: data.map((d) => d.hines),
              backgroundColor: '#10b981',
              borderRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: {
              ticks: { color: '#64748b', callback: (v) => v + '%' },
              grid: { color: '#1e293b' },
              max: 100,
            },
          },
        }}
      />
    </div>
  )
}
