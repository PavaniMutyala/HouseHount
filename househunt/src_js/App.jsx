import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// Context & Components
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import ListProperty from "./pages/ListProperty";
import MyBookings from "./pages/MyBookings";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Protected Route Guard (General Users / Hosts)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for context load
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Admin Route Guard
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Wrapper to animate routes nicely
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar />

      {/* Main layout with fade animations */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Open Routes */}
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <PageWrapper>
                  <PropertyDetails />
                </PageWrapper>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/list-property"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <ListProperty />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <MyBookings />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Favorites />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Admin Exclusive Route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <PageWrapper>
                    <AdminDashboard />
                  </PageWrapper>
                </AdminRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Toast Alerts Manager */}
      <ToastContainer />

      {/* Elegant Footer */}
      <Footer />
    </div>
  );
}
