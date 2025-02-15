create table profiles (
  id uuid primary key references auth.users(id),
  name text,
  email text,
  role text check (role in ('parent', 'child')),
  parent_id uuid references profiles(id),
  age integer check (age >= 3 and age <= 12),
  stripe_customer_id text,
  subscription_status text default 'inactive',
  total_lessons_completed integer default 0,
  total_time_spent integer default 0,
  average_score integer default 0,
  achievements_count integer default 0,
  total_points integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Parents can view child profiles"
  on profiles for select
  using (auth.uid() = parent_id);
