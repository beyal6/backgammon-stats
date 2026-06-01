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

export function calcStats(games: Game[]): StatsResult {
  const emptyWins = () => ({ 1: 0, 2: 0, 3: 0, 4: 0 } as Record<Points, number>)
  const ayalon = { wins: 0, losses: 0, points: 0, winPct: 0, winsByType: emptyWins() }
  const hines = { wins: 0, losses: 0, points: 0, winPct: 0, winsByType: emptyWins() }

  for (const g of games) {
    const pts = g.points as Points
    if (g.winner === 'אייל') {
      ayalon.wins++
      ayalon.points += pts
      ayalon.winsByType[pts]++
      hines.losses++
    } else {
      hines.wins++
      hines.points += pts
      hines.winsByType[pts]++
      ayalon.losses++
    }
  }

  const total = games.length
  ayalon.winPct = total ? Math.round((ayalon.wins / total) * 100) : 0
  hines.winPct = total ? Math.round((hines.wins / total) * 100) : 0

  const pointDiff = Math.abs(ayalon.points - hines.points)
  const pointLeader: Player | null =
    ayalon.points > hines.points ? 'אייל' : hines.points > ayalon.points ? 'הינס' : null

  const { currentStreak, bestStreak } = calcStreaks(games)

  return { ayalon, hines, pointDiff, pointLeader, currentStreak, bestStreak, totalGames: total }
}

function calcStreaks(games: Game[]) {
  if (!games.length) {
    return {
      currentStreak: null,
      bestStreak: { player: 'אייל' as Player, count: 0 },
    }
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
  let ayalonTotal = 0
  let hinesTotal = 0
  return games.map((g) => {
    const pts = g.points as Points
    if (g.winner === 'אייל') ayalonTotal += pts
    else hinesTotal += pts
    return {
      date: format(parseISO(g.created_at), 'dd/MM'),
      ayalon: ayalonTotal,
      hines: hinesTotal,
    }
  })
}

export function buildMonthlyWinPct(games: Game[]) {
  const map: Record<string, { ayalon: number; hines: number; total: number }> = {}
  for (const g of games) {
    const key = format(parseISO(g.created_at), 'MM/yy')
    if (!map[key]) map[key] = { ayalon: 0, hines: 0, total: 0 }
    map[key].total++
    if (g.winner === 'אייל') map[key].ayalon++
    else map[key].hines++
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      ayalon: Math.round((v.ayalon / v.total) * 100),
      hines: Math.round((v.hines / v.total) * 100),
    }))
}

export function buildCalendarData(games: Game[], year: number, month: number) {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  const days = eachDayOfInterval({ start, end })
  return days.map((day) => {
    const key = format(day, 'yyyy-MM-dd')
    const dayGames = games.filter(
      (g) => format(parseISO(g.created_at), 'yyyy-MM-dd') === key,
    )
    return { date: day, games: dayGames }
  })
}
