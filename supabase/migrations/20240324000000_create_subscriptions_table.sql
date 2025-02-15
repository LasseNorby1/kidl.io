create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null,
  status text not null,
  current_period_end timestamp with time zone,
  cancel_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table subscriptions enable row level security;

-- Policies
create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update own subscription"
  on subscriptions for update
  using (auth.uid() = user_id);

-- Add subscription status to profiles
alter table profiles add column subscription_status text default 'inactive';
