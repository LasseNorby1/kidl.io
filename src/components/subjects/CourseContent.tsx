import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Star, Clock, BookOpen, Play, Lock, CheckCircle } from "lucide-react";

const CourseContent = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const { data: courseData } = await supabase
          .from("courses")
          .select(
            `
            *,
            course_authors!inner(
              authors!inner(*)
            ),
            subject_courses!inner(
              subjects!inner(*)
            )
          `,
          )
          .eq("id", courseId)
          .single();

        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("created_at", { ascending: true });

        setLessons(lessonsData || []);

        // Fetch user progress if logged in
        if (user) {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .in("lesson_id", lessonsData?.map((l) => l.id) || []);

          setProgress(progressData || []);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalProgress = progress
    ? (progress.filter((p) => p.completed).length / lessons.length) * 100
    : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                {course?.subject_courses?.map((sc) => (
                  <Button
                    key={sc.subjects.id}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/subject/${sc.subjects.id}`)}
                  >
                    {sc.subjects.name}
                  </Button>
                ))}
              </div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-gray-600">{course?.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course?.average_rating?.toFixed(1) || "New"}</span>
                  {course?.total_ratings > 0 && (
                    <span>({course.total_ratings} ratings)</span>
                  )}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course?.estimated_duration} mins</span>
                </div>
                <span>•</span>
                <span className="capitalize">{course?.difficulty}</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="w-full md:w-80 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Course Instructor</h3>
              {course?.course_authors?.map((ca) => (
                <div key={ca.authors.id} className="flex items-start gap-3">
                  <img
                    src={
                      ca.authors.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${ca.authors.name}`
                    }
                    alt={ca.authors.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{ca.authors.name}</h4>
                    <p className="text-sm text-gray-500">{ca.authors.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Lessons List */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Course Content</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  {user && (
                    <div className="flex items-center gap-2">
                      <Progress value={totalProgress} className="w-32 h-2" />
                      <span>{Math.round(totalProgress)}% complete</span>
                    </div>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-gray-100">
                  {lessons.map((lesson, index) => {
                    const lessonProgress = progress?.find(
                      (p) => p.lesson_id === lesson.id,
                    );
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          {lessonProgress?.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {index + 1}. {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {lesson.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{lesson.estimated_duration} mins</span>
                          {!user && <Lock className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Course Info Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <Button className="w-full" size="lg">
                  {user ? "Continue Learning" : "Enroll Now"}
                </Button>
                <div className="space-y-4">
                  <h3 className="font-semibold">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {lessons.length} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {course?.estimated_duration} mins of content
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
