# שש בש סטטיסטיקות — PWA

## דרישות מוקדמות
- Node.js 18+
- חשבון Supabase
- חשבון Vercel (לפרסום)

---

## שלב 1 — Supabase

1. פתח [supabase.com](https://supabase.com) → צור פרויקט חדש
2. לך ל **SQL Editor** → הדבק את תוכן `supabase.sql` → הרץ
3. לך ל **Project Settings → API**:
   - העתק את **Project URL**
   - העתק את **anon public key**

---

## שלב 2 — הגדרת משתני סביבה

צור קובץ `.env` בתיקיית הפרויקט:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## שלב 3 — התקנה והרצה מקומית

```bash
npm install
npm run dev
```

פתח: http://localhost:5173

---

## שלב 4 — פרסום ל-Vercel

```bash
npm run build
npx vercel --prod
```

בממשק Vercel הוסף את משתני הסביבה:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## מבנה הפרויקט

```
src/
  components/
    App.tsx          — ניהול ניווט ראשי
    Dashboard.tsx    — לוח בקרה עם סטטיסטיקות
    AddGame.tsx      — הוספת משחקון
    CalendarView.tsx — לוח שנה חודשי
    History.tsx      — היסטוריה וחיפוש
    ImportExport.tsx — ייצוא/ייבוא JSON
    NavBar.tsx       — ניווט תחתון
    StatCard.tsx     — כרטיס סטטיסטיקה
    FilterBar.tsx    — מסנן זמן
    CumulativeChart.tsx — גרף נקודות מצטברות
    MonthlyWinChart.tsx — גרף ניצחון חודשי
  hooks/
    useGames.ts      — ניהול נתונים + cache
  lib/
    supabase.ts      — client ו-queries
    stats.ts         — חישובי סטטיסטיקות
  types/
    index.ts         — טיפוסי TypeScript
```

---

## נקודות (Points)
| ערך | שם |
|---|---|
| 1 | רגיל |
| 2 | מארס |
| 3 | טורקי |
| 4 | יהלום |
