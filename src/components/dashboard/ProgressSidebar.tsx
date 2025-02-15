import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trophy, Book, Star, Medal } from "lucide-react";

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

const ProgressSidebar = ({
  achievements = [
    {
      id: "1",
      title: "Math Master",
      description: "Complete 10 math lessons",
      earned: true,
    },
    {
      id: "2",
      title: "Science Explorer",
      description: "Finish all science experiments",
      earned: false,
    },
    {
      id: "3",
      title: "Language Pro",
      description: "Learn 100 new words",
      earned: true,
    },
  ],
  completedLessons = [
    {
      id: "1",
      title: "Addition and Subtraction",
      subject: "Math",
      completed: true,
      date: "2024-03-20",
    },
    {
      id: "2",
      title: "Solar System",
      subject: "Science",
      completed: true,
      date: "2024-03-19",
    },
    {
      id: "3",
      title: "Basic Grammar",
      subject: "English",
      completed: true,
      date: "2024-03-18",
    },
  ],
  totalProgress = 65,
  weeklyProgress = 80,
}: ProgressSidebarProps) => {
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
