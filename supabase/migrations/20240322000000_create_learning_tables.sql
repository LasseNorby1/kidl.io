-- Create subjects table
create table subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon text,
  color text,
  created_at timestamp with time zone default now()
);

-- Create lessons table
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) not null,
  title text not null,
  description text,
  content text,
  age_range text not null,
  difficulty text not null,
  estimated_duration integer not null,
  order_number integer not null,
  created_at timestamp with time zone default now()
);

-- Create activities table
create table activities (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references lessons(id) not null,
  title text not null,
  description text,
  type text not null,
  content jsonb,
  points integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Create user_progress table
create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  lesson_id uuid references lessons(id) not null,
  completed boolean default false,
  score integer,
  time_spent integer default 0,
  last_accessed timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);

-- Enable RLS
alter table subjects enable row level security;
alter table lessons enable row level security;
alter table activities enable row level security;
alter table user_progress enable row level security;

-- Create policies
create policy "Subjects are viewable by everyone" 
  on subjects for select 
  using (true);

create policy "Lessons are viewable by everyone" 
  on lessons for select 
  using (true);

create policy "Activities are viewable by everyone" 
  on activities for select 
  using (true);

create policy "Users can view their own progress" 
  on user_progress for select 
  using (auth.uid() = user_id);

create policy "Users can update their own progress" 
  on user_progress for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own progress" 
  on user_progress for update 
  using (auth.uid() = user_id);

-- Add progress tracking fields to profiles
alter table profiles 
  add column total_lessons_completed integer default 0,
  add column total_time_spent integer default 0,
  add column average_score integer default 0;
