import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Pre-fill token if in URL
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6"
      >
        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Password Reset Successful!
            </h2>
            <p className="text-white/70">
              Your password has been changed successfully. Redirecting to
              login...
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-white">
                Reset Your Password
              </h1>
              <p className="text-white/70">
                Enter your reset code and new password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="6-Digit Reset Code"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  maxLength={6}
                  className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder:text-white/40 text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder:text-white/40"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold py-3 px-6 hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </motion.button>
            </form>

            <div className="text-center text-sm text-white/50">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-violet-400 hover:text-violet-300 underline"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
