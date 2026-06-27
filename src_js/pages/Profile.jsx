import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Phone, MapPin, Image as ImageIcon, Lock } from "lucide-react";

export default function Profile() {
  const { user, updateProfile, changePassword, showToast } = useAuth();
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast("Name and phone are required fields.", "error");
      return;
    }

    setProfileLoading(true);
    const success = await updateProfile({
      name,
      phone,
      address,
      profileImage: profileImage || undefined,
    });
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showToast("Please enter both old and new passwords.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    setPasswordLoading(true);
    const success = await changePassword(oldPassword, newPassword);
    setPasswordLoading(false);

    if (success) {
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Account Preferences
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update personal information, contact coordinates, or set a secure
            password.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar visual block */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 h-fit">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-blue-100 shadow">
              <img
                src={
                  profileImage ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                }
                alt={user?.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-950">
                {user?.name}
              </h3>
              <p className="text-xs text-blue-600 font-semibold capitalize mt-0.5">
                {user?.role} Account
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Joined{" "}
                {user?.createdDate
                  ? new Date(user.createdDate).toLocaleDateString()
                  : "2026"}
              </p>
            </div>
          </div>

          {/* Edit Forms Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Form 1: General Details */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-950 border-b border-slate-100 pb-3">
                General Profile Details
              </h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Full Name *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Phone Number *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Profile Image URL
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                    <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                    />
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
                      placeholder="e.g. 102 Main St, Boston, MA"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {profileLoading ? "Saving..." : "Save General Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Form 2: Change Password */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-950 border-b border-slate-100 pb-3">
                Security & Password Management
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Current Password *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      New Password *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {passwordLoading ? "Updating..." : "Change Secure Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
