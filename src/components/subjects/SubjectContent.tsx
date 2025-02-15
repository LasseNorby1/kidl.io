import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Lesson } from "@/types/database";
import { BookOpen, Clock, Star } from "lucide-react";

const SubjectContent = () => {
  const { subjectId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchProgress = async (lessonId: string) => {
    if (!user) return;
    const progressData = await getProgress(user.id, lessonId);
    setProgress((prev) => ({ ...prev, [lessonId]: progressData }));
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from("lessons")
          .select("*")
          .eq("subject_id", subjectId)
          .order("order_number");

        if (error) throw error;
        setLessons(data || []);
        if (data?.length > 0) {
          setSelectedLesson(data[0]);
          // Fetch progress for all lessons
          data.forEach((lesson) => fetchProgress(lesson.id));
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [subjectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Lessons Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                className={`cursor-pointer transition-colors ${selectedLesson?.id === lesson.id ? "bg-primary/10" : ""}`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">
                        {lesson.estimated_duration} mins
                      </p>
                    </div>
                    <Progress
                      value={
                        progress[lesson.id]?.completed
                          ? 100
                          : progress[lesson.id]?.score || 0
                      }
                      className="w-16 h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {selectedLesson ? (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {selectedLesson.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedLesson.estimated_duration} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{selectedLesson.difficulty}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                <Card>
                  <CardContent className="prose max-w-none p-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedLesson.content || "",
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Activity cards would go here */}
                      <Card>
                        <CardHeader>
                          <h3 className="font-semibold">Quiz</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            Test your knowledge
                          </p>
                          <Button className="mt-4">Start Quiz</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">No Lesson Selected</h2>
              <p className="text-gray-600">
                Select a lesson from the sidebar to begin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectContent;
