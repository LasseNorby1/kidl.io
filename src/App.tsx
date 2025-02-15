import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import SubjectContent from "./components/subjects/SubjectContent";
import SearchResults from "./components/search/SearchResults";
import routes from "tempo-routes";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/subject/:subjectId"
            element={isAuthenticated ? <SubjectContent /> : <Navigate to="/" />}
          />
          <Route
            path="/search"
            element={isAuthenticated ? <SearchResults /> : <Navigate to="/" />}
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
