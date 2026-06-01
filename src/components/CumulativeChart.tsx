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
import { buildCumulativePoints } from '../lib/stats'
import { useMemo } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props { games: Game[] }

export function CumulativeChart({ games }: Props) {
  const data = useMemo(() => buildCumulativePoints(games), [games])

  if (!data.length) return null

  const step = Math.max(1, Math.floor(data.length / 20))
  const labels = data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d) => d.date)
  const ayalonData = data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d) => d.ayalon)
  const hinesData = data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d) => d.hines)

  return (
    <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">נקודות מצטברות</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'אייל',
              data: ayalonData,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: 'הינס',
              data: hinesData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
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
