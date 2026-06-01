-- Run this in the Supabase SQL editor
-- Project: Backgammon Statistics

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  winner text not null check (winner in ('אייל', 'הינס')),
  loser  text not null check (loser  in ('אייל', 'הינס')),
  points integer not null check (points between 1 and 4),
  constraint winner_ne_loser check (winner <> loser)
);

-- Enable Row Level Security (open access - no auth)
alter table games enable row level security;

create policy "public read"  on games for select using (true);
create policy "public insert" on games for insert with check (true);
create policy "public delete" on games for delete using (true);

-- Optional: index for date queries
create index games_created_at_idx on games(created_at desc);
