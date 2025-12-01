import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (e) {
      const errorData = e?.response?.data;
      setErr(errorData?.message || "Login failed");

      if (errorData?.requiresVerification) {
        setShowOTPScreen(true);
        setSuccess("Please verify your email to continue");
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      setSuccess(res.data.message);
      setTimeout(() => {
        login(res.data.token, res.data.user);
        navigate("/");
      }, 1000);
    } catch (e) {
      setErr(e?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/resend-otp", { email });
      setSuccess(res.data.message);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-indigo-500/30">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">One Calendar</h1>
          <p className="text-gray-300">Your Digital Event Manager</p>
        </div>

        {!showOTPScreen ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>
            {err && (
              <div className="text-red-400 mb-4 bg-red-900/50 p-3 rounded-lg flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{err}</span>
              </div>
            )}
            {success && (
              <div className="text-green-400 mb-4 bg-green-900/50 p-3 rounded-lg flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}
            <form onSubmit={submit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="mt-6 text-center text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-400 hover:text-purple-300 font-semibold transition"
              >
                Create Account
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-300">We've sent a 6-digit code to</p>
              <p className="text-purple-400 font-semibold">{email}</p>
            </div>

            {err && (
              <div className="text-red-400 mb-4 bg-red-900/50 p-3 rounded-lg flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{err}</span>
              </div>
            )}
            {success && (
              <div className="text-green-400 mb-4 bg-green-900/50 p-3 rounded-lg flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={verifyOTP}>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium text-center">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full p-4 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-2">Didn't receive the code?</p>
              <button
                onClick={resendOTP}
                disabled={loading}
                className="text-purple-400 hover:text-purple-300 font-semibold transition disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={() => setShowOTPScreen(false)}
              className="mt-4 w-full text-gray-400 hover:text-gray-300 transition text-sm"
            >
              ← Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
