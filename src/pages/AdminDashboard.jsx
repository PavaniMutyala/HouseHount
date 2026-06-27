import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Building,
  Clock,
  Calendar,
  Trash2,
  ArrowUpRight,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminDashboard() {
  const { fetchWithAuth, showToast, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const [stats, setStats] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      showToast("Access denied. Administrator privileges required.", "error");
      navigate("/");
      return;
    }
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch statistics & all properties
      const statsRes = await fetchWithAuth("/api/admin/stats");
      const statsData = await statsRes.json();
      if (statsRes.ok) {
        setStats(statsData.stats);
        // We will modify adminController to return all properties, let's handle empty or full arrays safely
        setAllProperties(
          statsData.allProperties || statsData.recentProperties || [],
        );
      }

      // 2. Fetch all users
      const usersRes = await fetchWithAuth("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || []);
      }

      // 3. Fetch all bookings
      const bookRes = await fetchWithAuth("/api/admin/bookings");
      const bookData = await bookRes.json();
      if (bookRes.ok) {
        setBookings(bookData.bookings || []);
      }
    } catch (err) {
      showToast("Error syncing administrator details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyStatus = async (propertyId, status) => {
    try {
      const res = await fetchWithAuth(
        `/api/admin/properties/${propertyId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        },
      );
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || `Property ${status}!`, "success");
        // Instantly reload
        loadAdminData();
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("Connection error updating status.", "error");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this listing? This action is irreversible.",
      )
    ) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Property deleted successfully.", "success");
        loadAdminData();
      } else {
        const data = await res.json();
        showToast(data.message || "Error deleting property", "error");
      }
    } catch (err) {
      showToast("Network error deleting property", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? All their properties and bookings will be wiped too!",
      )
    ) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("User account wiped successfully.", "success");
        loadAdminData();
      } else {
        const data = await res.json();
        showToast(data.message || "Error deleting user", "error");
      }
    } catch (err) {
      showToast("Network error wiping account", "error");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  // Group listings by pending/approved/rejected
  const pendingProperties = allProperties.filter((p) => p.status === "pending");
  const approvedProperties = allProperties.filter(
    (p) => p.status === "approved",
  );

  const statsCards = [
    {
      label: "Total Users",
      val: stats?.totalUsers || users.length,
      icon: Users,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Listings",
      val: stats?.totalProperties || allProperties.length,
      icon: Building,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Bookings",
      val: stats?.totalBookings || bookings.length,
      icon: Calendar,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Approval Queue",
      val: stats?.pendingListings || pendingProperties.length,
      icon: Clock,
      bg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Title / Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Control Center</span>
            </span>
            <h1 className="text-3xl font-black text-slate-950 mt-1">
              Platform Analytics
            </h1>
          </div>
          <button
            onClick={loadAdminData}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-sm transition-all text-slate-700"
          >
            Refresh Logs
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    {card.label}
                  </p>
                  <p className="text-xl font-black text-slate-950 mt-0.5">
                    {card.val}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 flex overflow-x-auto bg-slate-50/50">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "pending"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Pending Approval ({pendingProperties.length})
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              All Approved Homes ({approvedProperties.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              User Accounts ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Global Leases ({bookings.length})
            </button>
          </div>

          <div className="p-6">
            {/* Tab 1: Pending Approvals */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingProperties.length === 0 ? (
                  <p className="text-center py-10 text-xs text-slate-400 font-medium">
                    No properties are currently awaiting administrative review.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {pendingProperties.map((p) => (
                      <div
                        key={p.id}
                        className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow transition-all"
                      >
                        <div className="relative aspect-[1.8] w-full bg-slate-50">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase">
                            Pending Approval
                          </span>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                              {p.propertyType} • {p.city}
                            </span>
                            <h4 className="text-xs font-bold text-slate-950 line-clamp-1 mt-0.5">
                              <Link
                                to={`/properties/${p.id}`}
                                className="hover:text-blue-600"
                              >
                                {p.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                              {p.description}
                            </p>
                            <p className="text-xs font-black text-blue-600 mt-2">
                              ${p.price.toLocaleString()}/mo
                            </p>
                          </div>

                          <div className="border-t border-slate-50 pt-3 flex gap-2.5">
                            <button
                              onClick={() =>
                                handlePropertyStatus(p.id, "approved")
                              }
                              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Listing</span>
                            </button>
                            <button
                              onClick={() =>
                                handlePropertyStatus(p.id, "rejected")
                              }
                              className="py-2 px-3 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer"
                              title="Reject listing"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Approved Homes */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {approvedProperties.length === 0 ? (
                  <p className="text-center py-10 text-xs text-slate-400 font-medium">
                    No listings have been approved yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-2">Property</th>
                          <th className="py-3 px-2">Host Name</th>
                          <th className="py-3 px-2">City</th>
                          <th className="py-3 px-2">Rent / mo</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {approvedProperties.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-2 font-bold text-slate-950">
                              <Link
                                to={`/properties/${p.id}`}
                                className="hover:text-blue-600 line-clamp-1 max-w-[250px]"
                              >
                                {p.title}
                              </Link>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {p.propertyType}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-slate-700">
                              {p.owner?.name || "Unknown"}
                            </td>
                            <td className="py-3 px-2 text-slate-600">
                              {p.city}
                            </td>
                            <td className="py-3 px-2 font-black text-blue-600">
                              ${p.price.toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Link
                                  to={`/properties/${p.id}`}
                                  className="p-1 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteProperty(p.id)}
                                  className="p-1 border border-slate-200 hover:border-rose-150 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg cursor-pointer"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: User Accounts */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-2">User details</th>
                        <th className="py-3 px-2">Account Role</th>
                        <th className="py-3 px-2">Phone Number</th>
                        <th className="py-3 px-2">Join Date</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-2 flex items-center gap-3">
                            <img
                              src={u.profileImage}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-extrabold text-slate-950">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {u.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                u.role === "admin"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-600">
                            {u.phone}
                          </td>
                          <td className="py-3.5 px-2 text-slate-500">
                            {new Date(u.createdDate).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 border border-slate-200 hover:border-rose-150 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                              title="Delete User"
                              disabled={u.id === user?.id}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Global Bookings */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-center py-10 text-xs text-slate-400 font-medium">
                    No leases have been requested yet across the platform.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-2">Property</th>
                          <th className="py-3 px-2">Tenant</th>
                          <th className="py-3 px-2">Host / Landlord</th>
                          <th className="py-3 px-2">Move-In</th>
                          <th className="py-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {bookings.map((b) => {
                          const bookingStatusBadges = {
                            pending:
                              "bg-amber-50 text-amber-700 border-amber-200",
                            approved:
                              "bg-emerald-50 text-emerald-700 border-emerald-200",
                            rejected:
                              "bg-rose-50 text-rose-700 border-rose-200",
                            cancelled:
                              "bg-slate-150 text-slate-500 border-slate-200",
                          };
                          return (
                            <tr key={b.id} className="hover:bg-slate-50/50">
                              <td className="py-3.5 px-2 font-bold text-slate-950">
                                <Link
                                  to={`/properties/${b.property?.id}`}
                                  className="hover:text-blue-600 line-clamp-1 max-w-[200px]"
                                >
                                  {b.property?.title}
                                </Link>
                                <span className="text-[10px] text-blue-600 font-extrabold">
                                  ${b.property?.price.toLocaleString()}/mo
                                </span>
                              </td>
                              <td className="py-3.5 px-2">
                                <p className="font-bold text-slate-950">
                                  {b.tenant?.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {b.tenant?.email}
                                </p>
                              </td>
                              <td className="py-3.5 px-2 text-slate-700">
                                {b.owner?.name}
                              </td>
                              <td className="py-3.5 px-2 text-slate-600">
                                {new Date(b.moveInDate).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase ${bookingStatusBadges[b.status]}`}
                                >
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
