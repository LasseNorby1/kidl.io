import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Star, ChevronRight } from 'lucide-react';

const SubjectContent = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Most Popular');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all subjects with their relationships
        const { data: allSubjects } = await supabase.from('subjects').select(`
            *,
            children:subjects!parent_id(*)
          `);

        if (allSubjects) {
          // Get only root subjects (those without parents)
          const rootSubjects = allSubjects.filter((s) => !s.parent_id);
          setSubjects(rootSubjects);

          // Find current subject
          const current = allSubjects.find((s) => s.id === subjectId);
          setCurrentSubject(current);

          // Get all relevant subject IDs (current subject and its children)
          const allRelevantSubjectIds = [
            subjectId,
            ...(current?.children?.map((c) => c.id) || []),
          ];

          // Fetch courses for the current subject and its children
          const { data: coursesData } = await supabase
            .from('subject_courses')
            .select(
              `
              courses (*, course_authors(authors(*)))
            `
            )
            .in('subject_id', allRelevantSubjectIds);

          if (coursesData) {
            // Extract courses from the join table and remove duplicates
            const uniqueCourses = Array.from(
              new Set(
                coursesData
                  .map((sc) => sc.courses)
                  .filter(Boolean)
                  .map((course) => JSON.stringify(course))
              )
            ).map((str) => JSON.parse(str));

            setCourses(uniqueCourses);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='flex h-[calc(100vh-80px)]'>
      {/* Left Sidebar */}
      <div className='w-72 border-r border-gray-200 bg-background'>
        <ScrollArea className='h-full'>
          <div className='p-4 space-y-4'>
            {subjects.map((subject) => (
              <div key={subject.id} className='space-y-2'>
                <Button
                  variant='ghost'
                  className={`w-full justify-start font-medium ${
                    subject.id === currentSubject?.parent_id ||
                    subject.id === currentSubject?.id
                      ? 'bg-gray-100'
                      : ''
                  }`}
                  onClick={() => navigate(`/subject/${subject.id}`)}
                >
                  {subject.name}
                  {subject.children?.length > 0 && (
                    <ChevronRight className='ml-auto h-4 w-4' />
                  )}
                </Button>
                {(subject.id === currentSubject?.parent_id ||
                  subject.id === currentSubject?.id) &&
                  subject.children?.length > 0 && (
                    <div className='ml-4 space-y-1 border-l border-gray-200'>
                      {subject.children.map((child) => (
                        <Button
                          key={child.id}
                          variant='ghost'
                          className={`w-full justify-start pl-4 ${
                            child.id === currentSubject?.id ? 'bg-gray-100' : ''
                          }`}
                          onClick={() => navigate(`/subject/${child.id}`)}
                        >
                          {child.name}
                        </Button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2'>{currentSubject?.name}</h1>
            <p className='text-gray-600'>{currentSubject?.description}</p>
          </div>

          <div className='flex items-center justify-between mb-6'>
            <div className='text-sm text-gray-600'>
              {courses.length} courses
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm'>
                Sort by: {sortBy}
              </Button>
              <Button variant='outline' size='sm'>
                Filter
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
            {courses.map((course) => (
              <Card
                key={course.id}
                className='overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className='aspect-video relative'>
                  <img
                    src={
                      course.thumbnail_url ||
                      `https://source.unsplash.com/random/800x600/?learning,${encodeURIComponent(
                        course.title
                      )}`
                    }
                    alt={course.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <CardContent className='p-4'>
                  <h3 className='font-semibold mb-1'>{course.title}</h3>
                  <p className='text-sm text-gray-500 mb-2 line-clamp-2'>
                    {course.description}
                  </p>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <span className='capitalize'>{course.difficulty}</span>
                    <span>•</span>
                    <div className='flex items-center gap-1'>
                      <Star className='w-4 h-4 text-yellow-500' />
                      <span>{course.average_rating?.toFixed(1) || 'New'}</span>
                    </div>
                    <span>•</span>
                    <span>{course.estimated_duration} mins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectContent;
