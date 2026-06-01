export type Player = 'אייל' | 'הינס' | 'עידן' | 'נועה' | 'יובל'

export const ALL_PLAYERS: Player[] = ['אייל', 'הינס', 'עידן', 'נועה', 'יובל']

export type Points = 1 | 2 | 3 | 4

export const POINT_LABELS: Record<Points, string> = {
  1: 'רגיל',
  2: 'מארס',
  3: 'טורקי',
  4: 'יהלום',
}

export interface Game {
  id: string
  created_at: string
  winner: Player
  loser: Player
  points: Points
}

export type FilterRange =
  | 'all'
  | '7d'
  | '30d'
  | '90d'
  | '1y'
  | 'month'
  | 'custom'

export interface FilterState {
  range: FilterRange
  specificMonth?: string   // 'YYYY-MM'
  startDate?: string       // 'YYYY-MM-DD'
  endDate?: string         // 'YYYY-MM-DD'
}

export interface PlayerStats {
  wins: number
  losses: number
  points: number
  winPct: number
  winsByType: Record<Points, number>
}

export interface StatsResult {
  players: Record<Player, PlayerStats>
  pointLeader: Player | null
  currentStreak: { player: Player; count: number } | null
  bestStreak: { player: Player; count: number }
  totalGames: number
}
