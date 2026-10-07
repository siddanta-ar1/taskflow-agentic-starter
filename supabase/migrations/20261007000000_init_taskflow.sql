create type public.task_status as enum ('backlog', 'in_progress', 'review', 'done');

-- Waitlist: RLS on with NO policies, so only the server (secret key) can touch it
create table public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (position('@' in email) > 1),
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  primary key (workspace_id, user_id)
);
create index on public.workspace_members (user_id);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  status public.task_status not null default 'backlog',
  assignee_id uuid references auth.users on delete set null,
  position double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.tasks (workspace_id, status, position);
create index on public.tasks (assignee_id);

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.tasks             enable row level security;

-- Helper used by every policy. security definer avoids RLS recursion on
-- workspace_members; (select auth.uid()) is evaluated once per query.
create or replace function public.is_member(ws uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws and user_id = (select auth.uid())
  );
$$;

create policy "members read workspaces" on public.workspaces
  for select to authenticated using ((select public.is_member(id)));

create policy "members read memberships" on public.workspace_members
  for select to authenticated using ((select public.is_member(workspace_id)));

create policy "members manage tasks" on public.tasks
  for all to authenticated
  using ((select public.is_member(workspace_id)))
  with check ((select public.is_member(workspace_id)));

-- Every new user gets a personal workspace, so the board works right after sign-in
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare ws uuid;
begin
  insert into public.workspaces (name) values ('My workspace') returning id into ws;
  insert into public.workspace_members (workspace_id, user_id, role) values (ws, new.id, 'owner');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime: stream task changes to subscribed browsers (RLS still applies)
alter publication supabase_realtime add table public.tasks;
