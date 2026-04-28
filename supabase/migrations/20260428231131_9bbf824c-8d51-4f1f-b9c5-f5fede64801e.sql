create table public.social_diagnostics_runs (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  report jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.social_diagnostics_runs enable row level security;
create policy "admins read diagnostics" on public.social_diagnostics_runs
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins insert diagnostics" on public.social_diagnostics_runs
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create index social_diagnostics_runs_created_at_idx on public.social_diagnostics_runs (created_at desc);