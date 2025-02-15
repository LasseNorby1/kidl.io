import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const ParentDashboard = ({
  childName = "Alex",
  totalLessonsCompleted = 42,
  averageScore = 85,
  timeSpent = 24,
  subjects = [
    { name: "Mathematics", progress: 75, score: 88, timeSpent: 8 },
    { name: "Science", progress: 60, score: 82, timeSpent: 6 },
    { name: "Languages", progress: 90, score: 95, timeSpent: 10 },
  ],
}: ParentDashboardProps) => {
  const { user } = useAuth();
  return (
    <div className="w-full h-full bg-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {childName}'s Learning Progress
        </h1>
        <p className="text-gray-600">
          Detailed analytics and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <h3 className="text-2xl font-bold">{totalLessonsCompleted}</h3>
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
                <h3 className="text-2xl font-bold">{averageScore}%</h3>
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
                <h3 className="text-2xl font-bold">{timeSpent}h</h3>
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
                <h3 className="text-2xl font-bold">12</h3>
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
            {subjects.map((subject, index) => (
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
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold">Quick Learner</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Completed 5 lessons in one day
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Math Master</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Achieved 100% in 3 math tests
                </p>
              </CardContent>
            </Card>
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
  );
};

export default ParentDashboard;
