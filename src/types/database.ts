export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_id?: string;
  children?: Subject[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_duration: number;
  thumbnail_url: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_duration: number;
  order: number;
  created_at: string;
}

export interface SubjectCourse {
  subject_id: string;
  course_id: string;
}

export interface Activity {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  type: "quiz" | "exercise" | "game";
  content: any;
  points: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  time_spent: number;
  last_accessed: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  criteria: any;
  points: number;
  icon: string;
}
