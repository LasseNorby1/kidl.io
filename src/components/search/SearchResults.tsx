import React from "react";
import { useSearch } from "@/lib/search";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Book, Search } from "lucide-react";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, loading } = useSearch();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Start Searching</h2>
          <p className="text-gray-600">
            Enter a search term to find subjects and lessons
          </p>
        </div>
      </div>
    );
  }

  if (results.subjects.length === 0 && results.lessons.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No Results Found</h2>
          <p className="text-gray-600">Try searching with different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.subjects.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Subjects</h2>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {results.subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(`/subject/${subject.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${subject.color || "bg-primary/10"}`}
                        >
                          {subject.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{subject.name}</h3>
                          <p className="text-sm text-gray-500">
                            {subject.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {results.lessons.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Lessons</h2>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {results.lessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        navigate(
                          `/subject/${lesson.subject_id}?lesson=${lesson.id}`,
                        )
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">
                          {lesson.description}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          {lesson.subjects?.name} • {lesson.difficulty} •{" "}
                          {lesson.estimated_duration} mins
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
