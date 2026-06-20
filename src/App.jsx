import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import StudyTracker from "./pages/StudyTracker";
import Notes from "./pages/Notes";
import ChatAssistant from "./pages/ChatAssistant";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<StudyTracker />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/chat" element={<ChatAssistant />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;