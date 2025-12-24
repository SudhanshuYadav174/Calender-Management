import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import Antigravity from "./components/Antigravity";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {!user && (
        <>
          <div className="fixed top-0 left-0 w-full h-full -z-10">
            <Antigravity
              count={300}
              magnetRadius={6}
              ringRadius={7}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={1.5}
              lerpSpeed={0.05}
              color={"#FF9FFC"}
              autoAnimate={true}
              particleVariance={1}
            />
          </div>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-0"></div>
        </>
      )}
      <div className="relative z-10">
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
