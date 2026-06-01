type Tab = 'dashboard' | 'add' | 'h2h' | 'calendar' | 'history' | 'settings'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
  online: boolean
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'סטטס', icon: '📊' },
  { id: 'add',       label: 'הוסף',  icon: '➕' },
  { id: 'h2h',       label: 'מול מול', icon: '⚔️' },
  { id: 'calendar',  label: 'לוח',   icon: '📅' },
  { id: 'history',   label: 'היסטוריה', icon: '📋' },
  { id: 'settings',  label: 'כלים',  icon: '⚙️' },
]

export function NavBar({ active, onChange, online }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur border-t border-white/5 safe-bottom z-50">
      <div className="flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
              active === t.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            <span className="text-[9px] font-medium leading-tight">{t.label}</span>
          </button>
        ))}
      </div>
      {!online && (
        <div className="text-center text-[10px] text-amber-400 pb-1 bg-amber-500/10">
          מצב לא מקוון
        </div>
      )}
    </nav>
  )
}

export type { Tab }
