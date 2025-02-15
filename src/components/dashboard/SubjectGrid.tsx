import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import SubjectCard from "./SubjectCard";
import {
  Book,
  Calculator,
  Globe,
  Microscope,
  Music,
  Palette,
  Star,
} from "lucide-react";

interface SubjectGridProps {
  onSubjectClick?: (subject: string) => void;
}

const SubjectGrid = ({
  onSubjectClick = (subject: string) => {},
}: SubjectGridProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const getSubjectIcon = (iconName: string) => {
    const icons = {
      Calculator: <Calculator className="w-12 h-12" />,
      Microscope: <Microscope className="w-12 h-12" />,
      Book: <Book className="w-12 h-12" />,
      Globe: <Globe className="w-12 h-12" />,
      Palette: <Palette className="w-12 h-12" />,
      Music: <Music className="w-12 h-12" />,
    };
    return icons[iconName] || <Book className="w-12 h-12" />;
  };

  useEffect(() => {
    const fetchSubjectsAndProgress = async () => {
      try {
        const { data: subjects, error: subjectsError } = await supabase.from(
          "subjects",
        ).select(`
            *,
            subject_courses!inner(
              course_id,
              courses!inner(
                id,
                title,
                description,
                difficulty,
                estimated_duration,
                thumbnail_url,
                age_range,
                average_rating,
                total_ratings,
                course_authors!inner(
                  authors!inner(name)
                ),
                lessons(id)
              )
            )
          `);

        if (subjectsError) throw subjectsError;

        // For each subject, calculate progress across all courses
        const subjectsWithProgress = await Promise.all(
          subjects.map(async (subject) => {
            // Get all lessons from all courses in this subject
            const lessonIds = subject.subject_courses
              .flatMap((sc) => sc.courses.lessons)
              .map((l) => l.id);

            if (!lessonIds.length || !user)
              return {
                ...subject,
                title: subject.name,
                icon: getSubjectIcon(subject.icon),
                progress: 0,
              };

            // Get progress for all lessons
            const { data: progress } = await supabase
              .from("user_progress")
              .select("*")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds);

            // Calculate progress percentage
            const completedLessons =
              progress?.filter((p) => p.completed)?.length || 0;
            const progressPercentage =
              (completedLessons / lessonIds.length) * 100;

            return {
              ...subject,
              title: subject.name,
              icon: getSubjectIcon(subject.icon),
              progress: progressPercentage,
            };
          }),
        );

        setSubjects(subjectsWithProgress);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-8">
      {/* Featured Courses Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.slice(0, 3).map((subject) => {
            const featuredCourse = subject.subject_courses?.[0]?.courses;
            if (!featuredCourse) return null;

            const icon = getSubjectIcon(subject.icon);
            return (
              <div
                key={featuredCourse.id}
                className="group relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer bg-gray-100"
                onClick={() => handleSubjectClick(subject.id)}
              >
                <div className="w-full h-full">
                  <img
                    src={
                      featuredCourse.thumbnail_url ||
                      `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10) + 1}?w=800&auto=format&fit=crop`
                    }
                    alt={featuredCourse.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="text-sm font-medium mb-1 text-primary-foreground/80">
                      {subject.name}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {featuredCourse.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <span className="capitalize">
                          {featuredCourse.difficulty}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{featuredCourse.age_range} years</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span>
                          {featuredCourse.average_rating?.toFixed(1) || "New"}
                          {featuredCourse.total_ratings > 0 && (
                            <span className="text-xs">
                              {" "}
                              ({featuredCourse.total_ratings})
                            </span>
                          )}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{featuredCourse.estimated_duration} mins</span>
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      By{" "}
                      {featuredCourse.course_authors
                        .map((ca) => ca.authors.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Subjects Grid */}
      <h2 className="text-2xl font-bold mb-6">All Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
        {subjects.map((subject, index) => (
          <SubjectCard
            key={index}
            title={subject.title}
            icon={subject.icon}
            progress={subject.progress}
            color={subject.color}
            onClick={() => handleSubjectClick(subject.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;
