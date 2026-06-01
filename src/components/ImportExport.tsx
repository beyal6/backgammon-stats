import { useRef } from 'react'
import type { Game } from '../types'

interface Props {
  games: Game[]
  onImport: (games: Game[]) => void
}

export function ImportExport({ games, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backgammon-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (Array.isArray(data)) {
          onImport(data as Game[])
          alert(`יובאו ${data.length} משחקונים בהצלחה`)
        }
      } catch {
        alert('קובץ לא תקין')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="bg-surface-800 ring-1 ring-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white">ייצוא / ייבוא</h2>
        <p className="text-sm text-slate-400">{games.length} משחקונים במסד הנתונים</p>

        <button
          onClick={handleExport}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-colors"
        >
          ⬇ ייצוא JSON
        </button>

        <div className="relative">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-4 bg-surface-900 hover:bg-surface-800 text-slate-300 hover:text-white ring-1 ring-white/10 rounded-2xl font-bold transition-colors"
          >
            ⬆ ייבוא JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <p className="text-xs text-slate-500">
          ייבוא יחליף את כל הנתונים המקומיים. לשחזור מ-Supabase רענן את הדף.
        </p>
      </div>
    </div>
  )
}
