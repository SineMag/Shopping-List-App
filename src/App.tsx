import "./App.css";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Dashboard from "./pages/Dashboard.tsx"; // 
import Profile from "./pages/ProfilePage.tsx"; // <-- Add this import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListsPage from "./pages/ListsPage.tsx";

function App() {
  return (
    <>
      <div className="container">
        <BrowserRouter>
          <Navbar />
          {/* Main section for the app */}
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/profile" element={<Profile />} />{" "}
              {/* Add this line */}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              {/* Add this line */}
              <Route path="/lists" element={<ListsPage />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
