import "./App.css";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Dashboard from "./pages/Dashboard.tsx"; // 
import Profile from "./pages/ProfilePage.tsx"; // <-- Add this import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import HomePage from "./pages/HomePage.tsx";
import ListsPage from "./pages/ListsPage.tsx";

function App() {
  const isAuthenticated = () => localStorage.getItem("auth") === "true";

  function ProtectedRoute({ children }: { children: ReactElement }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  }

  function UnauthOnlyRoute({ children }: { children: ReactElement }) {
    return isAuthenticated() ? <Navigate to="/home" replace /> : children;
  }

  return (
    <>
      <div className="container">
        <BrowserRouter>
          <Navbar />
          {/* Main section for the app */}
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={<UnauthOnlyRoute><RegisterPage /></UnauthOnlyRoute>}
              />
              <Route
                path="/login"
                element={<UnauthOnlyRoute><LoginPage /></UnauthOnlyRoute>}
              />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/profile" element={<Profile />} />{" "}
              {/* Add this line */}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              {/* Add this line */}
              <Route
                path="/lists"
                element={
                  <ProtectedRoute>
                    <ListsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
