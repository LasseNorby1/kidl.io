import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Rocket,
  Users,
  Star,
  Sparkles,
  Medal,
  ArrowRight,
} from "lucide-react";
import AuthModal from "../auth/AuthModal";

const LandingPage = () => {
  const [showAuth, setShowAuth] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">kidl.io</h1>
          <Button variant="ghost" onClick={() => setShowAuth(true)}>
            Sign In
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Learning Made Fun for Kids
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              An interactive learning platform designed to make education
              engaging and enjoyable for children while giving parents full
              visibility into their progress.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="text-lg px-8"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop"
              alt="Kids learning"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Parents Choose kidl.io
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to support your child's learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-purple-500" />}
              title="Personalized Learning"
              description="Adaptive lessons that adjust to your child's pace and learning style"
            />
            <FeatureCard
              icon={<Rocket className="w-12 h-12 text-blue-500" />}
              title="Progress Tracking"
              description="Real-time insights into your child's achievements and areas for improvement"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-green-500" />}
              title="Expert Support"
              description="Access to qualified teachers and a supportive learning community"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Child's Learning Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of families already using kidl.io to support their
            children's education
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowAuth(true)}
            className="text-lg px-8"
          >
            Try For Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#002333] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Parents</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Parent Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Progress Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Download App</h3>
              <div className="space-y-3">
                <a href="#" className="block">
                  <img
                    src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/app-store.svg"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </a>
                <a href="#" className="block">
                  <img
                    src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/google-play.svg"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>© kidl.io {new Date().getFullYear()}</span>
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Cookies
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="bg-transparent border border-gray-700 rounded px-2 py-1 text-sm"
                defaultValue="en"
              >
                <option value="en" className="text-black">
                  English
                </option>
                <option value="es" className="text-black">
                  Español
                </option>
                <option value="fr" className="text-black">
                  Français
                </option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
    <CardContent className="p-8">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
