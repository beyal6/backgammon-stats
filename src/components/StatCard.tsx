interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: 'indigo' | 'emerald' | 'amber' | 'slate'
}

export function StatCard({ label, value, sub, color = 'indigo' }: StatCardProps) {
  const ring = {
    indigo: 'ring-indigo-500/30',
    emerald: 'ring-emerald-500/30',
    amber: 'ring-amber-500/30',
    slate: 'ring-slate-500/30',
  }[color]

  const text = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    slate: 'text-slate-300',
  }[color]

  return (
    <div className={`bg-surface-800 ring-1 ${ring} rounded-2xl p-4 flex flex-col gap-1`}>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className={`text-2xl font-bold ${text}`}>{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  )
}
