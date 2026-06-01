import { useState, useEffect, useCallback } from 'react'
import type { Game } from '../types'
import { fetchGames, insertGame, deleteGame } from '../lib/supabase'

const CACHE_KEY = 'bgames_cache'

function loadCache(): Game[] {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveCache(games: Game[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(games))
}

export function useGames() {
  const [games, setGames] = useState<Game[]>(loadCache)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGames()
      setGames(data)
      saveCache(data)
    } catch (e) {
      setError((e as Error).message)
      // use cache silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addGame = useCallback(async (winner: string, loser: string, points: number) => {
    const g = await insertGame(winner, loser, points)
    setGames((prev) => {
      const next = [...prev, g]
      saveCache(next)
      return next
    })
    return g
  }, [])

  const removeGame = useCallback(async (id: string) => {
    await deleteGame(id)
    setGames((prev) => {
      const next = prev.filter((g) => g.id !== id)
      saveCache(next)
      return next
    })
  }, [])

  const importGames = useCallback((imported: Game[]) => {
    setGames(imported)
    saveCache(imported)
  }, [])

  return { games, loading, error, online, reload: load, addGame, removeGame, importGames }
}
