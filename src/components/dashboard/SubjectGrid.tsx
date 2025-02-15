import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import SubjectCard from "./SubjectCard";
import {
  Book,
  Calculator,
  Globe,
  Microscope,
  Music,
  Palette,
} from "lucide-react";

interface SubjectGridProps {
  onSubjectClick?: (subject: string) => void;
}

const SubjectGrid = ({
  onSubjectClick = (subject: string) => {
    // Navigate to subject page
    window.location.href = `/subject/${subject.toLowerCase()}`;
  },
}: SubjectGridProps) => {
  const { user } = useAuth();
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const subjects = [
    {
      title: "Mathematics",
      icon: <Calculator className="w-12 h-12" />,
      progress: 75,
      color: "bg-blue-100",
    },
    {
      title: "Science",
      icon: <Microscope className="w-12 h-12" />,
      progress: 60,
      color: "bg-green-100",
    },
    {
      title: "Languages",
      icon: <Book className="w-12 h-12" />,
      progress: 85,
      color: "bg-yellow-100",
    },
    {
      title: "Geography",
      icon: <Globe className="w-12 h-12" />,
      progress: 45,
      color: "bg-purple-100",
    },
    {
      title: "Art",
      icon: <Palette className="w-12 h-12" />,
      progress: 90,
      color: "bg-pink-100",
    },
    {
      title: "Music",
      icon: <Music className="w-12 h-12" />,
      progress: 30,
      color: "bg-orange-100",
    },
  ];

  useEffect(() => {
    if (user?.age) {
      // Filter subjects based on user's age
      const ageGroup = user.age <= 5 ? "3-5" : user.age <= 8 ? "6-8" : "9-12";
      // In a real app, you would filter based on subject's age range
      setFilteredSubjects(subjects);
    }
  }, [user]);

  return (
    <div className="w-full h-full bg-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredSubjects.map((subject, index) => (
          <SubjectCard
            key={index}
            title={subject.title}
            icon={subject.icon}
            progress={subject.progress}
            color={subject.color}
            onClick={() => onSubjectClick(subject.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;
