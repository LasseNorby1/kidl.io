import { supabase } from "./supabase";
import { checkAchievements } from "./achievements";

export interface Progress {
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
}

export const updateProgress = async (
  userId: string,
  lessonId: string,
  progress: Partial<Progress>,
) => {
  try {
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from("user_progress")
        .update({
          ...progress,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", existingProgress.id);
    } else {
      // Create new progress entry
      await supabase.from("user_progress").insert({
        user_id: userId,
        lesson_id: lessonId,
        ...progress,
      });
    }

    // Update profile statistics
    await updateProfileStats(userId);

    // Check for achievements
    if (progress.completed) {
      await checkAchievements(userId, {
        type: "lesson_completed",
        count: 1,
      });
    }

    if (progress.score === 100) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("subject_id")
        .eq("id", lessonId)
        .single();

      if (lesson) {
        await checkAchievements(userId, {
          type: "subject_mastery",
          subject: lesson.subject_id,
          score: 100,
        });
      }
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};

const updateProfileStats = async (userId: string) => {
  try {
    // Get all user progress
    const { data: progress } = await supabase
      .from("user_progress")
      .select("completed, score, time_spent")
      .eq("user_id", userId);

    if (!progress) return;

    const totalCompleted = progress.filter((p) => p.completed).length;
    const totalTimeSpent = progress.reduce(
      (sum, p) => sum + (p.time_spent || 0),
      0,
    );
    const scores = progress.filter((p) => p.score != null).map((p) => p.score!);
    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length,
          )
        : 0;

    // Update profile
    await supabase
      .from("profiles")
      .update({
        total_lessons_completed: totalCompleted,
        total_time_spent: totalTimeSpent,
        average_score: averageScore,
      })
      .eq("id", userId);
  } catch (error) {
    console.error("Error updating profile stats:", error);
  }
};

export const getProgress = async (userId: string, lessonId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
};

export const getSubjectProgress = async (userId: string, subjectId: string) => {
  try {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("subject_id", subjectId);

    if (!lessons) return { completed: 0, total: 0, percentage: 0 };

    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .in(
        "lesson_id",
        lessons.map((l) => l.id),
      );

    const completed = progress?.filter((p) => p.completed).length || 0;
    const total = lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  } catch (error) {
    console.error("Error fetching subject progress:", error);
    return { completed: 0, total: 0, percentage: 0 };
  }
};
