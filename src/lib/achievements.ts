import { supabase } from "./supabase";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  criteria: {
    type: string;
    count?: number;
    subject?: string;
    score?: number;
    days?: number;
    hours?: number;
  };
  earned?: boolean;
  earnedAt?: string;
}

export const checkAchievements = async (
  userId: string,
  action: {
    type: string;
    subject?: string;
    count?: number;
    score?: number;
  },
) => {
  try {
    // Get all achievements
    const { data: achievements } = await supabase
      .from("achievements")
      .select("*");

    // Get user's current achievements
    const { data: userAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const earnedAchievementIds = new Set(
      userAchievements?.map((ua) => ua.achievement_id) || [],
    );

    // Check each achievement
    const newAchievements = achievements?.filter((achievement) => {
      if (earnedAchievementIds.has(achievement.id)) return false;

      const criteria = achievement.criteria;
      if (criteria.type !== action.type) return false;

      switch (criteria.type) {
        case "lesson_completed":
          return action.count && action.count >= (criteria.count || 0);
        case "subject_mastery":
          return (
            action.subject === criteria.subject &&
            action.score === criteria.score
          );
        case "subject_progress":
          return (
            action.subject === criteria.subject &&
            action.count >= (criteria.count || 0)
          );
        default:
          return false;
      }
    });

    // Award new achievements
    if (newAchievements && newAchievements.length > 0) {
      const achievementInserts = newAchievements.map((achievement) => ({
        user_id: userId,
        achievement_id: achievement.id,
      }));

      await supabase.from("user_achievements").insert(achievementInserts);

      // Update user's achievement count and points
      const totalNewPoints = newAchievements.reduce(
        (sum, achievement) => sum + achievement.points,
        0,
      );

      await supabase.rpc("update_achievement_stats", {
        user_id: userId,
        new_achievements: newAchievements.length,
        new_points: totalNewPoints,
      });

      return newAchievements;
    }

    return [];
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
};

export const getUserAchievements = async (
  userId: string,
): Promise<Achievement[]> => {
  try {
    const { data: achievements } = await supabase
      .from("achievements")
      .select("*");

    const { data: userAchievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId);

    return (
      achievements?.map((achievement) => {
        const userAchievement = userAchievements?.find(
          (ua) => ua.achievement_id === achievement.id,
        );
        return {
          ...achievement,
          earned: !!userAchievement,
          earnedAt: userAchievement?.earned_at,
        };
      }) || []
    );
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
};
