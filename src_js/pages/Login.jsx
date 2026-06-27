import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, user, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/");
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    const mockEmail =
      role === "admin" ? "admin@househunt.com" : "tenant@househunt.com";
    const mockPassword = role === "admin" ? "Admin123!" : "User123!";
    const success = await login(mockEmail, mockPassword);
    setLoading(false);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to manage and browse premium rentals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600">
                Password
              </label>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">
            Quick Demo Access
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickLogin("tenant")}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all"
          >
            <span>Demo Tenant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleQuickLogin("admin")}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all"
          >
            <span>Demo Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
