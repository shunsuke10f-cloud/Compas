-- Compas shared foundation + job-hunting service tables.
-- MVP has no real auth yet: rows are keyed by an anonymous `session_id`
-- (see lib/session.ts) instead of a Supabase auth user id. Swap this out
-- once real accounts exist for either service.

-- Shared diagnosis table: used by BOTH the life-unit diagnosis (existing
-- concept, not yet built) and the job-hunting diagnosis. `service_type`
-- keeps them in one table without mixing their type taxonomies.
create table if not exists diagnoses (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  service_type text not null check (service_type in ('life', 'job_hunting')),
  type_key text not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists diagnoses_session_id_idx on diagnoses (session_id);

-- Job-hunting paid input: one row per free-text category per session.
create table if not exists job_hunting_inputs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  category text not null check (
    category in (
      'past_experience',
      'timeline',
      'likes_dislikes',
      'hobby',
      'relationships',
      'strengths_weaknesses',
      'want_to_do',
      'dont_want_to_do',
      'memorable_success_failure',
      'feedback_from_others',
      'free_text'
    )
  ),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, category)
);

-- Job-hunting generated analysis output (evidence-linked ES material).
create table if not exists job_hunting_outputs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  type_key text not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists job_hunting_outputs_session_id_idx on job_hunting_outputs (session_id);
