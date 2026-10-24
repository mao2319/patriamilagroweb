-- Ranking de Firme por la Patria Game: jugadores (nombre único, país) y
-- puntajes por partida. Las tablas solo las usa el portal desde el servidor
-- (llave de servicio): RLS activo y sin políticas para anon/authenticated.

create table if not exists public.players (
  id uuid primary key,
  -- Hash SHA-256 del secreto que guarda el juego en el dispositivo (prueba que es el mismo jugador).
  secret_hash text not null,
  name text not null,
  name_key text generated always as (lower(name)) stored,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint players_name_length check (char_length(name) between 3 and 16),
  constraint players_country_code check (country is null or country ~ '^[A-Z]{2}$')
);

create unique index if not exists players_name_key_unique on public.players (name_key);

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  player_id uuid not null references public.players (id) on delete cascade,
  level_id text not null,
  score integer not null check (score between 0 and 100000),
  time_seconds real not null check (time_seconds >= 0),
  won boolean not null default false,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists scores_player_idx on public.scores (player_id);
create index if not exists scores_created_idx on public.scores (created_at desc);

alter table public.players enable row level security;
alter table public.scores enable row level security;

-- Mejor puntaje por jugador en un alcance: semanal (desde el lunes), global o un país.
create or replace function public.leaderboard(p_scope text, p_country text, p_limit integer)
returns table (rank bigint, player_id uuid, name text, country text, best integer)
language sql
stable
security invoker
set search_path = public
as $$
  with best as (
    select s.player_id, max(s.score)::integer as best
    from public.scores s
    where p_scope <> 'weekly' or s.created_at >= date_trunc('week', now())
    group by s.player_id
  ),
  ranked as (
    select rank() over (order by b.best desc) as rank, p.id as player_id, p.name, p.country, b.best
    from best b
    join public.players p on p.id = b.player_id
    where p_scope <> 'country' or p.country = p_country
  )
  select * from ranked order by rank, name limit greatest(1, least(p_limit, 100));
$$;

-- Puesto de un jugador en ese mismo alcance (null si aún no tiene puntaje ahí).
create or replace function public.player_rank(p_scope text, p_country text, p_player uuid)
returns table (rank bigint, best integer)
language sql
stable
security invoker
set search_path = public
as $$
  with best as (
    select s.player_id, max(s.score)::integer as best
    from public.scores s
    where p_scope <> 'weekly' or s.created_at >= date_trunc('week', now())
    group by s.player_id
  ),
  ranked as (
    select rank() over (order by b.best desc) as rank, b.player_id, b.best
    from best b
    join public.players p on p.id = b.player_id
    where p_scope <> 'country' or p.country = p_country
  )
  select rank, best from ranked where player_id = p_player;
$$;

-- Solo el servidor (service_role) puede usar las funciones.
revoke all on function public.leaderboard(text, text, integer) from public, anon, authenticated;
revoke all on function public.player_rank(text, text, uuid) from public, anon, authenticated;
grant execute on function public.leaderboard(text, text, integer) to service_role;
grant execute on function public.player_rank(text, text, uuid) to service_role;
