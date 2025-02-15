import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<any[]>([]);
  const [newCourses, setNewCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const getSubjectIcon = (iconName: string) => {
    const icons = {
      Calculator: <Calculator className="w-5 h-5" />,
      Microscope: <Microscope className="w-5 h-5" />,
      Book: <Book className="w-5 h-5" />,
      Globe: <Globe className="w-5 h-5" />,
      Palette: <Palette className="w-5 h-5" />,
      Music: <Music className="w-5 h-5" />,
    };
    return icons[iconName] || <Book className="w-5 h-5" />;
  };

  useEffect(() => {
    const fetchSubjectsAndProgress = async () => {
      try {
        // Fetch courses with their subject relationships
        const { data: coursesData } = await supabase.from("courses").select(`
            *,
            subject_courses!inner(
              subjects!inner(*)
            )
          `);

        if (coursesData) {
          // Set featured courses (first 6)
          setFeaturedCourses(coursesData.slice(0, 6));

          // Set popular courses (sort by difficulty)
          setPopularCourses(
            [...coursesData]
              .sort((a, b) => (a.difficulty === "beginner" ? -1 : 1))
              .slice(0, 6),
          );

          // Set trending courses (random selection for demo)
          setTrendingCourses(
            [...coursesData].sort(() => Math.random() - 0.5).slice(0, 6),
          );

          // Set new courses (last 6)
          setNewCourses(coursesData.slice(-6));
        }

        // Fetch main subjects
        const { data: subjectsData } = await supabase
          .from("subjects")
          .select("*")
          .is("parent_id", null);

        setSubjects(subjectsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderCourseSection = (title: string, courses: any[]) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full">
              <div className="aspect-video relative">
                <img
                  src={
                    course.thumbnail_url ||
                    `https://source.unsplash.com/random/800x600/?education,${encodeURIComponent(course.title)}`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="capitalize">{course.difficulty}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{course.average_rating?.toFixed(1) || "New"}</span>
                  </div>
                  <span>•</span>
                  <span>{course.estimated_duration} mins</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  By{" "}
                  {course.course_authors
                    ?.map((ca) => ca.authors.name)
                    .join(", ")}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {featuredCourses.length > 0 &&
        renderCourseSection("Featured", featuredCourses)}
      {popularCourses.length > 0 &&
        renderCourseSection("Most Popular", popularCourses)}
      {trendingCourses.length > 0 &&
        renderCourseSection("Trending", trendingCourses)}
      {newCourses.length > 0 && renderCourseSection("New Courses", newCourses)}
    </div>
  );
};

export default SubjectGrid;
