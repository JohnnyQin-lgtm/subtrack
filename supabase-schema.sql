-- 在 Supabase 后台 SQL Editor 里运行这整个文件
-- (Dashboard → 左侧 SQL Editor → New query → 粘贴 → Run)

-- 1. 订阅表
create table if not exists subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  name          text not null,
  amount        numeric not null check (amount >= 0),
  currency      text not null default 'USD',
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  next_renewal  date not null,
  category      text not null default 'Other',
  color         text not null default '#6b7280',
  created_at    timestamptz not null default now()
);

-- 按用户查询的索引
create index if not exists subscriptions_user_id_idx on subscriptions (user_id);

-- 2. 开启行级安全(RLS)—— 多租户隔离的关键
alter table subscriptions enable row level security;

-- 3. 四条策略:每个用户只能操作自己的数据
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on subscriptions for delete
  using (auth.uid() = user_id);
