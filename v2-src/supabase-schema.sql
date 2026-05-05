-- ============================================================
-- PlantasFácil Easy — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (extiende auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'vendor' check (role in ('admin', 'vendor')),
  store text,
  is_active boolean not null default true,
  invited_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Trigger: crear perfil automáticamente al registrar usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'vendor')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS para profiles
alter table public.profiles enable row level security;

create policy "Cada usuario lee su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins leen todos los perfiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Admins actualizan perfiles"
  on public.profiles for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- 2. AUDIT_SESSIONS
create table public.audit_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  user_email text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  last_seen_at timestamptz not null default now(),
  user_agent text,
  page_count int not null default 0
);

alter table public.audit_sessions enable row level security;

create policy "Usuarios gestionan sus propias sesiones"
  on public.audit_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins leen todas las sesiones"
  on public.audit_sessions for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- Índice para queries de "activos ahora"
create index idx_sessions_last_seen on public.audit_sessions (last_seen_at desc);
create index idx_sessions_user on public.audit_sessions (user_id, started_at desc);

-- 3. AUDIT_EVENTS
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.audit_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  event_type text not null, -- 'pageview' | 'search' | 'plant_view' | 'store_view' | 'logout'
  path text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_events enable row level security;

create policy "Usuarios insertan sus propios eventos"
  on public.audit_events for insert
  with check (auth.uid() = user_id);

create policy "Admins leen todos los eventos"
  on public.audit_events for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

create index idx_events_session on public.audit_events (session_id, created_at desc);
create index idx_events_user on public.audit_events (user_id, created_at desc);
create index idx_events_type on public.audit_events (event_type, created_at desc);

-- 4. HEATMAP_POINTS
create table public.heatmap_points (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.audit_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  path text not null,
  x float4 not null, -- 0.0–1.0 (fracción del ancho de pantalla)
  y float4 not null, -- 0.0–1.0 (fracción de la altura total de la página)
  created_at timestamptz not null default now()
);

alter table public.heatmap_points enable row level security;

create policy "Usuarios insertan sus propios puntos"
  on public.heatmap_points for insert
  with check (auth.uid() = user_id);

create policy "Admins leen todos los puntos"
  on public.heatmap_points for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

create index idx_heatmap_path on public.heatmap_points (path, created_at desc);

-- ============================================================
-- IMPORTANTE: después de ejecutar esto, en Supabase ir a:
-- Authentication → Settings → desactivar "Enable email confirmations"
-- Esto permite que los usuarios creados desde el admin puedan
-- ingresar de inmediato sin confirmar su correo.
-- ============================================================
