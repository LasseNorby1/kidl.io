import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Play, Book, CheckCircle } from "lucide-react";
import Quiz from "./Quiz";

const LessonContent = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // Fetch lesson details
        const { data: lessonData } = await supabase
          .from("lessons")
          .select(
            `
            *,
            courses!inner(
              *,
              course_authors!inner(
                authors!inner(*)
              )
            )
          `,
          )
          .eq("id", lessonId)
          .single();

        setLesson(lessonData);
        setCourse(lessonData?.courses);

        // Fetch user progress if logged in
        if (user) {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();

          setProgress(progressData);
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, user]);

  const handleComplete = async (score?: number) => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          score: score || null,
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();

      setProgress(data);
      navigate(`/course/${course.id}`);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Lesson Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/course/${course?.id}`)}
            className="mb-4"
          >
            ← Back to Course
          </Button>
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{lesson?.title}</h1>
              <p className="text-gray-600">{lesson?.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  <span>{lesson?.estimated_duration} mins</span>
                </div>
                <span>•</span>
                <span className="capitalize">{lesson?.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs
          defaultValue="content"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="content">Lesson Content</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-8">
            {/* Video Section */}
            <Card>
              <CardContent className="p-6">
                {lesson?.video_url ? (
                  <iframe
                    className="w-full aspect-video rounded-lg"
                    src={lesson.video_url}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Section */}
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson?.content }} />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("quiz")}>
                Continue to Quiz
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <Quiz
              lessonId={lessonId!}
              onComplete={handleComplete}
              onBack={() => setActiveTab("content")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonContent;
