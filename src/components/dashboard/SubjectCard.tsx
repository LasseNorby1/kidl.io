import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface SubjectCardProps {
  title?: string;
  icon?: React.ReactNode;
  progress?: number;
  color?: string;
  onClick?: () => void;
}

const SubjectCard = ({
  title = "Mathematics",
  icon = <BookOpen className="w-12 h-12" />,
  progress = 65,
  color = "bg-blue-100",
  onClick = () => {},
}: SubjectCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <Card className={`h-full w-full ${color}`}>
        <CardHeader className="flex items-center justify-center pt-8">
          <div className="p-4 rounded-full bg-white shadow-md">{icon}</div>
          <h3 className="text-2xl font-bold mt-4 text-gray-800">{title}</h3>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 text-center mt-4">
              {progress < 100 ? "Keep going!" : "Complete!"}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;
