import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AgeFilterBarProps {
  selectedAge?: string;
  onAgeSelect?: (age: string) => void;
}

const AgeFilterBar = ({
  selectedAge = "3-5",
  onAgeSelect = () => {},
}: AgeFilterBarProps) => {
  const ageRanges = ["3-5", "6-8", "9-12"];

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-full h-[60px] bg-white border-b border-gray-200 shadow-sm px-4 flex items-center justify-center">
      <div className="flex gap-4">
        {ageRanges.map((age) => (
          <motion.div
            key={age}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant={selectedAge === age ? "default" : "outline"}
              className={`h-10 px-6 text-lg rounded-full ${
                selectedAge === age
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => onAgeSelect(age)}
            >
              {age} years
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgeFilterBar;
