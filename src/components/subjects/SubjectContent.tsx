import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { getProgress } from "@/lib/progress";
import { BookOpen, Clock, Star, ArrowLeft, GraduationCap } from "lucide-react";
import Quiz from "@/components/subjects/Quiz";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_duration: number;
  thumbnail_url: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  estimated_duration: number;
}

const SubjectContent = () => {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const { subjectId } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<any>(null);

  const fetchProgress = async (lessonId: string) => {
    if (!user) return;
    const progressData = await getProgress(user.id, lessonId);
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        ...progressData,
        videoWatched: progressData?.completed || false,
      },
    }));
  };

  useEffect(() => {
    const fetchSubjectAndCourses = async () => {
      try {
        // First fetch the subject
        const { data: subjectData, error: subjectError } = await supabase
          .from("subjects")
          .select("*")
          .eq("id", subjectId)
          .single();

        if (subjectError) throw subjectError;
        setSubject(subjectData);

        // Then fetch courses for this subject
        const { data: coursesData, error: coursesError } = await supabase
          .from("subject_courses")
          .select(
            `
            course_id,
            courses:courses!inner(*)
          `,
          )
          .eq("subject_id", subjectId);

        if (coursesError) throw coursesError;

        const courses = coursesData?.map((sc) => sc.courses) || [];
        setCourses(courses);

        if (courses.length > 0) {
          setSelectedCourse(courses[0]);
          // Fetch lessons for the first course
          const { data: lessonsData } = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", courses[0].id)
            .order("order_number");

          setLessons(lessonsData || []);
          if (lessonsData?.length > 0) {
            setSelectedLesson(lessonsData[0]);
            // Fetch progress for all lessons
            lessonsData.forEach((lesson) => fetchProgress(lesson.id));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectAndCourses();
    }
  }, [subjectId, user]);

  const handleCourseSelect = async (course: Course) => {
    setSelectedCourse(course);
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_number");

    setLessons(lessonsData || []);
    if (lessonsData?.length > 0) {
      setSelectedLesson(lessonsData[0]);
      lessonsData.forEach((lesson) => fetchProgress(lesson.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleQuizComplete = async (score: number) => {
    if (!user || !selectedLesson) return;

    try {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          lesson_id: selectedLesson.id,
          score: score,
          completed: score >= 70,
          time_spent: selectedLesson.estimated_duration || 0,
        },
        {
          onConflict: "user_id,lesson_id",
        },
      );

      await fetchProgress(selectedLesson.id);
      setShowQuiz(false);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <header className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl font-semibold">{subject?.name || "Subject"}</h1>
      </header>

      <div className="flex flex-1">
        {/* Course and Lessons Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <h2 className="font-semibold px-2">Courses</h2>
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCourse?.id === course.id ? "bg-primary/10" : ""
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          {course.estimated_duration} mins • {course.difficulty}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {selectedCourse && (
                <>
                  <h2 className="font-semibold px-2 mt-6">Lessons</h2>
                  {lessons.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer transition-colors ${
                        selectedLesson?.id === lesson.id ? "bg-primary/10" : ""
                      }`}
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
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {selectedLesson ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  {selectedCourse?.title}
                </div>
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

              {showQuiz ? (
                <Quiz
                  lessonId={selectedLesson.id}
                  onComplete={handleQuizComplete}
                  onBack={() => setShowQuiz(false)}
                />
              ) : (
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Lesson Content</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: selectedLesson.content || "",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activities" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <h3 className="font-semibold">Quiz</h3>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">
                                Test your knowledge with a short quiz
                              </p>
                              <Button
                                className="mt-4"
                                onClick={() => setShowQuiz(true)}
                              >
                                Start Quiz
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
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
    </div>
  );
};

export default SubjectContent;
