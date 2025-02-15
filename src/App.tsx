import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProfileSettings from "./components/settings/ProfileSettings";
import BillingSettings from "./components/settings/BillingSettings";
import ReferralPage from "./components/settings/ReferralPage";
import { useAuth } from "@/lib/auth";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import SubjectContent from "./components/subjects/SubjectContent";
import SearchResults from "./components/search/SearchResults";

function App() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <AppLayout>
              <Home />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/subject/:subjectId"
        element={
          isAuthenticated ? (
            <AppLayout>
              <SubjectContent />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/search"
        element={
          isAuthenticated ? (
            <AppLayout>
              <SearchResults />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/settings/profile"
        element={
          isAuthenticated ? (
            <AppLayout>
              <ProfileSettings />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/settings/billing"
        element={
          isAuthenticated ? (
            <AppLayout>
              <BillingSettings />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/settings/refer"
        element={
          isAuthenticated ? (
            <AppLayout>
              <ReferralPage />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
