import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trophy, Book, Star, Medal } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  date: string;
}

interface ProgressSidebarProps {
  achievements?: Achievement[];
  completedLessons?: Lesson[];
  totalProgress?: number;
  weeklyProgress?: number;
}

const ProgressSidebar = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Get achievements
        const { data: achievementsData } = await supabase
          .from("user_achievements")
          .select("*, achievements(*)")
          .eq("user_id", user.id)
          .order("earned_at", { ascending: false });

        // Get completed lessons
        const { data: progressData } = await supabase
          .from("user_progress")
          .select(
            `
            *,
            lessons!inner (title),
            subjects!inner (name)
          `,
          )
          .eq("user_id", user.id)
          .eq("completed", true)
          .order("updated_at", { ascending: false });

        // Calculate total progress
        const { data: totalLessons } = await supabase
          .from("lessons")
          .select("id");

        const totalCompleted = progressData?.length || 0;
        const total = totalLessons?.length || 1;
        const progress = Math.round((totalCompleted / total) * 100);

        // Calculate weekly progress
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyCompleted = progressData?.filter(
          (p) => new Date(p.updated_at) > oneWeekAgo,
        ).length;
        const weeklyProgress = Math.round((weeklyCompleted / total) * 100);

        setAchievements(achievementsData || []);
        setCompletedLessons(
          progressData?.map((p) => ({
            id: p.id,
            title: p.lessons?.title,
            subject: p.subjects?.name,
            completed: p.completed,
            date: new Date(p.updated_at).toLocaleDateString(),
          })) || [],
        );
        setTotalProgress(progress);
        setWeeklyProgress(weeklyProgress);
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="w-[312px] h-full bg-gray-50 border-l border-gray-200 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="w-[312px] h-full bg-gray-50 border-l border-gray-200 p-4">
      <div className="space-y-6">
        {/* Overall Progress Section */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Overall Progress
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Progress</span>
                  <span>{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>This Week</span>
                  <span>{weeklyProgress}%</span>
                </div>
                <Progress value={weeklyProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Completed Lessons */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-500" />
              Recent Completed
            </h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {completedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-start justify-between p-2 bg-white rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-500">{lesson.date}</p>
                    </div>
                    <Badge variant="secondary">{lesson.subject}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Medal className="w-5 h-5 text-purple-500" />
              Achievements
            </h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-2 bg-white rounded-lg shadow-sm"
                  >
                    <Star
                      className={`w-5 h-5 mt-1 ${
                        achievement.earned ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-500">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressSidebar;
