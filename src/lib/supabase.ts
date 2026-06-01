import { createClient } from '@supabase/supabase-js'
import type { Game } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Game[]
}

export async function insertGame(
  winner: string,
  loser: string,
  points: number,
): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .insert({ winner, loser, points })
    .select()
    .single()
  if (error) throw error
  return data as Game
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id)
  if (error) throw error
}
