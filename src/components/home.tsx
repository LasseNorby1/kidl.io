import React, { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import AgeFilterBar from "@/components/dashboard/AgeFilterBar";
import SubjectGrid from "@/components/dashboard/SubjectGrid";
import ProgressSidebar from "@/components/dashboard/ProgressSidebar";
import ParentDashboard from "@/components/dashboard/ParentDashboard";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedAge, setSelectedAge] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAuth, setShowAuth] = useState(!isAuthenticated);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const handleVoiceSearch = () => {
    // Implement voice search functionality
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
  };

  const handleSubjectClick = (subject: string) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    if (!isSubscribed) {
      setShowSubscription(true);
      return;
    }
    // Handle subject selection
  };

  const handleSubscribe = (plan: string) => {
    // Here you would integrate with a payment provider like Stripe
    setIsSubscribed(true);
    setShowSubscription(false);
  };

  const isParentMode = user?.role === "parent";

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      {isAuthenticated && (
        <>
          <div className="flex">
            <div className="flex-1">
              {isParentMode ? (
                <ParentDashboard />
              ) : (
                <SubjectGrid onSubjectClick={handleSubjectClick} />
              )}
            </div>
            {!isParentMode && <ProgressSidebar />}
          </div>

          <SubscriptionModal
            open={showSubscription}
            onClose={() => setShowSubscription(false)}
            onSubscribe={handleSubscribe}
          />
        </>
      )}
    </div>
  );
};

export default Home;
