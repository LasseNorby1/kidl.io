import React, { useState, useEffect } from "react";
import AddChildModal from "./AddChildModal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Clock,
  Award,
  BookOpen,
  Brain,
  Rocket,
  Star,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface ParentDashboardProps {
  childName?: string;
  totalLessonsCompleted?: number;
  averageScore?: number;
  timeSpent?: number;
  subjects?: Array<{
    name: string;
    progress: number;
    score: number;
    timeSpent: number;
  }>;
}

const ParentDashboard = () => {
  const [stats, setStats] = useState({
    totalLessonsCompleted: 0,
    averageScore: 0,
    timeSpent: 0,
  });
  const [subjects, setSubjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const { user, getChildAccounts } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedChild) return;

      try {
        // Get all progress data for the selected child
        const { data: progressData } = await supabase
          .from("user_progress")
          .select(
            `
            *,
            lessons!inner (subject_id),
            subjects!inner (name)
          `,
          )
          .eq("user_id", selectedChild.id);

        if (progressData) {
          // Calculate overall stats
          const completed = progressData.filter((p) => p.completed).length;
          const scores = progressData
            .filter((p) => p.score != null)
            .map((p) => p.score || 0);
          const avgScore =
            scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : 0;
          const totalTime = Math.round(
            progressData.reduce((sum, p) => sum + (p.time_spent || 0), 0) / 60,
          ); // Convert to hours

          setStats({
            totalLessonsCompleted: completed,
            averageScore: avgScore,
            timeSpent: totalTime,
          });

          // Process subject progress
          const subjectProgress = progressData.reduce((acc, progress) => {
            const subjectId = progress.lessons?.subject_id;
            const subjectName = progress.subjects?.name;

            if (!acc[subjectId]) {
              acc[subjectId] = {
                name: subjectName,
                completed: 0,
                total: 0,
                totalScore: 0,
                scores: 0,
                timeSpent: 0,
              };
            }

            acc[subjectId].total++;
            if (progress.completed) acc[subjectId].completed++;
            if (progress.score) {
              acc[subjectId].totalScore += progress.score;
              acc[subjectId].scores++;
            }
            acc[subjectId].timeSpent += progress.time_spent || 0;

            return acc;
          }, {});

          const subjectsWithProgress = Object.values(subjectProgress).map(
            (subject: any) => ({
              name: subject.name,
              progress: Math.round((subject.completed / subject.total) * 100),
              score:
                subject.scores > 0
                  ? Math.round(subject.totalScore / subject.scores)
                  : 0,
              timeSpent: Math.round(subject.timeSpent / 60),
            }),
          );

          setSubjects(subjectsWithProgress);
        }

        // Get achievements
        const { data: achievementsData } = await supabase
          .from("user_achievements")
          .select("*, achievements(*)")
          .eq("user_id", selectedChild.id);

        setAchievements(achievementsData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [selectedChild]);

  useEffect(() => {
    const loadChildren = async () => {
      if (!user?.id) return;

      try {
        const { data: childAccounts, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("parent_id", user.id)
          .eq("role", "child");

        if (error) throw error;

        if (childAccounts) {
          setChildren(childAccounts);
          if (childAccounts.length > 0) {
            setSelectedChild(childAccounts[0]);
          }
        }
      } catch (error) {
        console.error("Error loading children:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <AddChildModal
        open={showAddChild}
        onClose={() => setShowAddChild(false)}
      />
      <div className="w-full h-full bg-white p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Parent Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">Viewing:</p>
                <select
                  className="border rounded-md p-1"
                  value={selectedChild?.id || ""}
                  onChange={(e) =>
                    setSelectedChild(
                      children.find((c) => c.id === e.target.value),
                    )
                  }
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowAddChild(true)}
            className="bg-primary text-white"
          >
            Add Child Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Lessons</p>
                  <h3 className="text-2xl font-bold">
                    {stats.totalLessonsCompleted}
                  </h3>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <h3 className="text-2xl font-bold">{stats.averageScore}%</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hours Spent</p>
                  <h3 className="text-2xl font-bold">{stats.timeSpent}h</h3>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <h3 className="text-2xl font-bold">
                    {achievements?.length || 0}
                  </h3>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Subject Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {subjects.map((subject: any, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{subject.name}</h3>
                    <span className="text-sm text-gray-600">
                      {subject.score}%
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress: {subject.progress}%</span>
                    <span>Time: {subject.timeSpent}h</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.length > 0 ? (
                achievements.map((achievement: any) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold">
                          {achievement.achievements.title}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {achievement.achievements.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Earned on{" "}
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No achievements yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Rocket className="h-5 w-5 text-blue-500" />
                    <p>Recommended: Advanced Mathematics Course</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <p>Suggested: Reading Comprehension Practice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ParentDashboard;
