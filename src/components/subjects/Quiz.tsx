import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  lessonId: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const Quiz = ({ lessonId, onComplete, onBack }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("lesson_id", lessonId)
          .order("order_number");

        if (error) throw error;
        setQuestions(data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestionData = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = Math.round((newScore / questions.length) * 100);
      setShowResults(true);
      onComplete(finalScore);
    }
  };

  const handleComplete = () => {
    setShowResults(false);
    onBack();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <Button variant="outline" onClick={onBack}>
            Back to Lesson
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <div className="mb-6">
            <p className="text-lg mb-2">Your Score:</p>
            <Progress
              value={(score / questions.length) * 100}
              className="w-full h-4"
            />
            <p className="text-xl font-bold mt-2">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>
          <div className="space-x-4">
            <Button onClick={handleComplete} className="mr-2">
              Complete Lesson
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Question {currentQuestion + 1}</h2>
          <p className="text-gray-500">
            {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="w-[100px]"
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {questions[currentQuestion].question}
          </h3>
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back to Lesson
            </Button>
            <Button onClick={handleAnswer} disabled={selectedAnswer === null}>
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;
