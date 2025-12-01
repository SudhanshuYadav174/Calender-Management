import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CalendarView from "./components/CalendarView";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();
  const videoRef = useRef(null);

  // Ensure video keeps playing even when switching accounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/space-bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-0"></div>
      <div className="relative z-10">
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<CalendarView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
