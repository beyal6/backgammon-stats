import {
  subDays,
  subYears,
  parseISO,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'
import type { Game, FilterState, StatsResult, Player, Points } from '../types'
import { ALL_PLAYERS } from '../types'

export function filterGames(games: Game[], filter: FilterState): Game[] {
  const now = new Date()
  let start: Date | null = null
  let end: Date | null = null

  switch (filter.range) {
    case '7d':
      start = subDays(now, 7)
      break
    case '30d':
      start = subDays(now, 30)
      break
    case '90d':
      start = subDays(now, 90)
      break
    case '1y':
      start = subYears(now, 1)
      break
    case 'month':
      if (filter.specificMonth) {
        const d = parseISO(filter.specificMonth + '-01')
        start = startOfMonth(d)
        end = endOfMonth(d)
      }
      break
    case 'custom':
      if (filter.startDate) start = parseISO(filter.startDate)
      if (filter.endDate) end = parseISO(filter.endDate)
      break
    default:
      return games
  }

  return games.filter((g) => {
    const d = parseISO(g.created_at)
    if (start && d < start) return false
    if (end && d > end) return false
    return true
  })
}

function emptyPlayerStats() {
  return { wins: 0, losses: 0, points: 0, winPct: 0, winsByType: { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<Points, number> }
}

export function calcStats(games: Game[]): StatsResult {
  const players = Object.fromEntries(ALL_PLAYERS.map((p) => [p, emptyPlayerStats()])) as Record<Player, ReturnType<typeof emptyPlayerStats>>

  for (const g of games) {
    const pts = g.points as Points
    const w = g.winner as Player
    const l = g.loser as Player
    if (players[w]) { players[w].wins++; players[w].points += pts; players[w].winsByType[pts]++ }
    if (players[l]) { players[l].losses++ }
  }

  const total = games.length
  for (const p of ALL_PLAYERS) {
    const s = players[p]
    const played = s.wins + s.losses
    s.winPct = played ? Math.round((s.wins / played) * 100) : 0
  }

  const sorted = [...ALL_PLAYERS].sort((a, b) => players[b].points - players[a].points)
  const pointLeader: Player | null = players[sorted[0]].points > 0 ? sorted[0] : null

  const { currentStreak, bestStreak } = calcStreaks(games)

  return { players, pointLeader, currentStreak, bestStreak, totalGames: total }
}

function calcStreaks(games: Game[]) {
  if (!games.length) {
    return { currentStreak: null, bestStreak: { player: 'אייל' as Player, count: 0 } }
  }

  let current = { player: games[games.length - 1].winner as Player, count: 1 }
  for (let i = games.length - 2; i >= 0; i--) {
    if (games[i].winner === current.player) current.count++
    else break
  }

  let best = { player: games[0].winner as Player, count: 1 }
  let run = { player: games[0].winner as Player, count: 1 }
  for (let i = 1; i < games.length; i++) {
    if (games[i].winner === run.player) {
      run.count++
      if (run.count > best.count) best = { ...run }
    } else {
      run = { player: games[i].winner as Player, count: 1 }
    }
  }

  return { currentStreak: current, bestStreak: best }
}

export function buildCumulativePoints(games: Game[]) {
  const totals = Object.fromEntries(ALL_PLAYERS.map((p) => [p, 0])) as Record<Player, number>
  return games.map((g) => {
    totals[g.winner as Player] = (totals[g.winner as Player] ?? 0) + g.points
    return { date: format(parseISO(g.created_at), 'dd/MM'), ...Object.fromEntries(ALL_PLAYERS.map((p) => [p, totals[p]])) }
  })
}

export function buildMonthlyWinPct(games: Game[]) {
  const map: Record<string, Record<Player, number> & { total: number }> = {}
  for (const g of games) {
    const key = format(parseISO(g.created_at), 'MM/yy')
    if (!map[key]) map[key] = { ...Object.fromEntries(ALL_PLAYERS.map((p) => [p, 0])), total: 0 } as Record<Player, number> & { total: number }
    map[key].total++
    const w = g.winner as Player
    if (w in map[key]) (map[key] as Record<string, number>)[w]++
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      ...Object.fromEntries(ALL_PLAYERS.map((p) => [p, Math.round(((v as Record<string, number>)[p] / v.total) * 100)])),
    }))
}

export function buildCalendarData(games: Game[], year: number, month: number) {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  const days = eachDayOfInterval({ start, end })
  return days.map((day) => {
    const key = format(day, 'yyyy-MM-dd')
    const dayGames = games.filter((g) => format(parseISO(g.created_at), 'yyyy-MM-dd') === key)
    return { date: day, games: dayGames }
  })
}
