import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import StudyTracker from "./pages/StudyTracker";
import Notes from "./pages/Notes";
import ChatAssistant from "./pages/ChatAssistant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker" element={<StudyTracker />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;