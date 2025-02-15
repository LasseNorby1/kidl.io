-- Create achievements table
create table achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text not null,
  points integer not null default 0,
  criteria jsonb not null,
  created_at timestamp with time zone default now()
);

-- Create user_achievements table
create table user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  achievement_id uuid references achievements(id) not null,
  earned_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, achievement_id)
);

-- Enable RLS
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- Create policies
create policy "Achievements are viewable by everyone" 
  on achievements for select 
  using (true);

create policy "User achievements are viewable by the user" 
  on user_achievements for select 
  using (auth.uid() = user_id);

-- Insert some default achievements
insert into achievements (title, description, icon, points, criteria) values
  ('First Steps', 'Complete your first lesson', 'BookOpen', 10, '{"type": "lesson_completed", "count": 1}'),
  ('Quick Learner', 'Complete 5 lessons in one day', 'Zap', 50, '{"type": "lessons_per_day", "count": 5}'),
  ('Math Master', 'Complete all math lessons with perfect scores', 'Calculator', 100, '{"type": "subject_mastery", "subject": "math", "score": 100}'),
  ('Science Explorer', 'Complete 10 science experiments', 'Flask', 75, '{"type": "subject_progress", "subject": "science", "count": 10}'),
  ('Language Pro', 'Learn 100 new words', 'Languages', 60, '{"type": "vocabulary", "count": 100}'),
  ('Perfect Week', 'Study every day for a week', 'Calendar', 70, '{"type": "daily_streak", "days": 7}'),
  ('Time Master', 'Spend 10 hours learning', 'Clock', 80, '{"type": "time_spent", "hours": 10}'),
  ('Helper', 'Help 3 other students', 'Users', 40, '{"type": "helped_others", "count": 3}'),
  ('Quiz Champion', 'Get perfect scores in 5 quizzes', 'Award', 90, '{"type": "perfect_quizzes", "count": 5}'),
  ('Early Bird', 'Complete 3 lessons before 9 AM', 'Sun', 30, '{"type": "early_lessons", "count": 3}');

-- Add achievements count to profiles
alter table profiles add column achievements_count integer default 0;
alter table profiles add column total_points integer default 0;
