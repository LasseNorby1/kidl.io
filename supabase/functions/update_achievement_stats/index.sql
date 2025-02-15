create or replace function update_achievement_stats(user_id uuid, new_achievements integer, new_points integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update profiles
  set 
    achievements_count = achievements_count + new_achievements,
    total_points = total_points + new_points
  where id = user_id;
end;
$$;