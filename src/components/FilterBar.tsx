import { useState } from 'react'
import type { FilterState } from '../types'
import { format, subMonths } from 'date-fns'

interface Props {
  filter: FilterState
  onChange: (f: FilterState) => void
}

const RANGE_OPTIONS = [
  { value: 'all', label: 'כל הזמנים' },
  { value: '7d', label: '7 ימים' },
  { value: '30d', label: '30 ימים' },
  { value: '90d', label: '90 ימים' },
  { value: '1y', label: 'שנה' },
  { value: 'month', label: 'חודש ספציפי' },
  { value: 'custom', label: 'טווח מותאם' },
] as const

function last12Months() {
  const months = []
  for (let i = 0; i < 12; i++) {
    const d = subMonths(new Date(), i)
    months.push(format(d, 'yyyy-MM'))
  }
  return months
}

export function FilterBar({ filter, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange({ range: opt.value as FilterState['range'] })
              setExpanded(opt.value === 'month' || opt.value === 'custom')
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter.range === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-surface-900 text-slate-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {expanded && filter.range === 'month' && (
        <select
          value={filter.specificMonth ?? ''}
          onChange={(e) => onChange({ ...filter, specificMonth: e.target.value })}
          className="bg-surface-900 text-white rounded-xl px-3 py-2 text-sm"
        >
          <option value="">בחר חודש</option>
          {last12Months().map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      )}

      {expanded && filter.range === 'custom' && (
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">מתאריך</label>
            <input
              type="date"
              value={filter.startDate ?? ''}
              onChange={(e) => onChange({ ...filter, startDate: e.target.value })}
              className="bg-surface-900 text-white rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">עד תאריך</label>
            <input
              type="date"
              value={filter.endDate ?? ''}
              onChange={(e) => onChange({ ...filter, endDate: e.target.value })}
              className="bg-surface-900 text-white rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
