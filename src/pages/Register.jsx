import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Phone, MapPin, UserCheck } from "lucide-react";

export default function Register() {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      showToast("Please enter all required fields.", "error");
      return;
    }

    // Front-end Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (phone.length < 8) {
      showToast("Please enter a valid phone number.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    const success = await register({
      name,
      email,
      phone,
      password,
      role,
      address,
      profileImage: profileImage || undefined,
    });
    setLoading(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-slate-500">
            Join HouseHunt to find, rent, or host modern real estate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Full Name *
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Email Address *
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Phone Number *
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  placeholder="+1 (555) 012-3456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Password *
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="•••••••• (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 font-medium">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "user"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Rent / Host</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "admin"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Admin Hub</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Residential Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Street address, City, State, Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
              />
            </div>
          </div>

          {/* Profile Picture URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Profile Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-500 text-sm placeholder-slate-400 text-slate-800"
            />

            {profileImage && (
              <div className="flex items-center gap-3 mt-2 p-2 border border-slate-100 rounded-xl bg-slate-50">
                <img
                  src={profileImage}
                  alt="Avatar Preview"
                  className="w-10 h-10 rounded-full object-cover border"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                  }}
                  referrerPolicy="no-referrer"
                />

                <span className="text-xs text-slate-500 font-medium">
                  Image Preview successful
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
