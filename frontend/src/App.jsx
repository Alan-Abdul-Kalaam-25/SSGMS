import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NavbarThemeProvider } from "./contexts/NavbarThemeContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StudyGroups from "./pages/StudyGroups";
import Profile from "./pages/Profile";
import About from "./pages/About";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavbarThemeProvider>
          <BrowserRouter>
            <div className="min-h-screen text-foreground">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/study-groups" element={<StudyGroups />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </NavbarThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
