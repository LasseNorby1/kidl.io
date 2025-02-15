import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Rocket, Users, Star, Sparkles, Medal } from "lucide-react";
import AuthModal from "../auth/AuthModal";

const LandingPage = () => {
  const [showAuth, setShowAuth] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Learning is <span className="text-primary">Fun</span> with
              <span className="text-blue-500"> Friends</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Join our interactive learning platform where kids can explore,
              learn, and grow while parents track their progress!
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="text-lg"
              >
                Start Learning Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAuth(true)}
                className="text-lg"
              >
                Parent Dashboard
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop"
              alt="Kids learning"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600">
              Designed for both kids and parents
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-purple-500" />}
              title="Interactive Learning"
              description="Engaging lessons and activities that make learning fun and memorable"
            />
            <FeatureCard
              icon={<Rocket className="w-12 h-12 text-blue-500" />}
              title="Progress Tracking"
              description="Real-time progress monitoring and personalized learning paths"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-green-500" />}
              title="Parent Dashboard"
              description="Detailed insights into your child's learning journey"
            />
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Unlock Achievements</h2>
            <p className="text-xl text-gray-600">Learn, earn, and grow!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AchievementCard
              icon={<Star className="w-8 h-8 text-yellow-500" />}
              title="Quick Learner"
              description="Complete your first lesson"
            />
            <AchievementCard
              icon={<Medal className="w-8 h-8 text-blue-500" />}
              title="Math Master"
              description="Ace 3 math quizzes"
            />
            <AchievementCard
              icon={<Sparkles className="w-8 h-8 text-purple-500" />}
              title="Science Whiz"
              description="Complete all experiments"
            />
            <AchievementCard
              icon={<Brain className="w-8 h-8 text-green-500" />}
              title="Knowledge Seeker"
              description="Learn every day for a week"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy learners and start your educational journey
            today!
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowAuth(true)}
            className="text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const AchievementCard = ({ icon, title, description }: any) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-4 text-center">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
