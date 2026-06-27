import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Home,
  Heart,
  Calendar,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Bell,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  React.useEffect(() => {
    if (user && user.role === "admin") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 12000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Browse Listings", path: "/" },
    ...(user
      ? [
          { name: "Favorites", path: "/favorites", icon: Heart },
          { name: "My Bookings", path: "/bookings", icon: Calendar },
          { name: "List Property", path: "/list-property", icon: PlusCircle },
        ]
      : []),
    ...(user && user.role === "admin"
      ? [{ name: "Admin Hub", path: "/admin", icon: ShieldAlert }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              {/* Animated/Glowing outer halo */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
              {/* Core container */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 border border-blue-400/20 group-hover:scale-105 transition-transform duration-300">
                <Home className="w-5 h-5 text-white" />
                {/* Active radar pulser tag */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse border border-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1 leading-none">
                <span>House</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                  Hunt
                </span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase leading-none mt-1">
                Smart Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.path)
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Admin-only Notifications Bell */}
            {user && user.role === "admin" && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative cursor-pointer"
                  title="Admin Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Admin Alerts</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          No alerts right now.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                              !notif.read ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">
                              {new Date(notif.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                    referrerPolicy="no-referrer"
                  />

                  <div className="text-left leading-none">
                    <p className="text-xs font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-medium text-blue-600 capitalize">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {user && user.role === "admin" && (
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center px-4 mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>Admin Alerts ({notifications.filter(n => !n.read).length})</span>
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 px-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-2">No alerts right now.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        !notif.read ? "bg-blue-50/70 border border-blue-100" : "bg-slate-50 border border-slate-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900 leading-tight">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl"
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-blue-100"
                    referrerPolicy="no-referrer"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-sm font-medium text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl border border-slate-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
