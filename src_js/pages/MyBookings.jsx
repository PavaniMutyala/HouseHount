import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  Clock,
  Home,
  ArrowUpRight,
  DollarSign,
  Trash2,
  MapPin,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyBookings() {
  const { fetchWithAuth, showToast, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leases");

  const [bookingsMade, setBookingsMade] = useState([]);
  const [bookingsReceived, setBookingsReceived] = useState([]);
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load bookings made (as a tenant)
      const madeRes = await fetchWithAuth("/api/bookings");
      const madeData = await madeRes.json();
      if (madeRes.ok) {
        setBookingsMade(madeData.bookings || []);
      }

      // Load bookings received (as a host)
      const recRes = await fetchWithAuth("/api/bookings/received");
      const recData = await recRes.json();
      if (recRes.ok) {
        setBookingsReceived(recData.bookings || []);
      }

      // Load owned property listings
      const propRes = await fetchWithAuth("/api/properties/my-properties");
      const propData = await propRes.json();
      if (propRes.ok) {
        setMyProperties(propData.properties || []);
      }
    } catch (err) {
      showToast("Error syncing dashboard metrics.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const res = await fetchWithAuth(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || `Booking successfully ${action}!`, "success");
        loadDashboardData();
      } else {
        showToast(data.message || "Error processing action.", "error");
      }
    } catch (err) {
      showToast("Network error processing booking status.", "error");
    }
  };

  const handleDeletePropertyListing = async (propertyId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this property listing? This will cancel all associated bookings!",
      )
    ) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Property listing deleted successfully.", "success");
        loadDashboardData();
      } else {
        const data = await res.json();
        showToast(data.message || "Error deleting property", "error");
      }
    } catch (err) {
      showToast("Network error deleting listing", "error");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  // Dynamic status indicators
  const bookingStatusBadges = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  };

  // Stats Calculations
  const activeLeasesCount = bookingsMade.filter(
    (b) => b.status === "approved",
  ).length;
  const pendingRequestsCount = bookingsReceived.filter(
    (b) => b.status === "pending",
  ).length;
  const totalRentalsEarned = bookingsReceived
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + (b.property?.price || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Card banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={user?.profileImage}
              alt={user?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
              referrerPolicy="no-referrer"
            />

            <div>
              <p className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                Welcome Back
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5">
                {user?.name}
              </h1>
              <p className="text-xs text-slate-500">
                {user?.email} • {user?.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/list-property"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer"
            >
              List Property
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                My Active Leases
              </p>
              <p className="text-lg font-black text-slate-950 mt-0.5">
                {activeLeasesCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Pending Requests
              </p>
              <p className="text-lg font-black text-slate-950 mt-0.5">
                {pendingRequestsCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Host Income Flow
              </p>
              <p className="text-lg font-black text-slate-950 mt-0.5">
                ₹{totalRentalsEarned.toLocaleString()} / mo
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Listed Properties
              </p>
              <p className="text-lg font-black text-slate-950 mt-0.5">
                {myProperties.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs System Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 flex overflow-x-auto bg-slate-50/50">
            <button
              onClick={() => setActiveTab("leases")}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "leases"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              My Lease Bookings ({bookingsMade.length})
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "received"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Inbound Rental Enquiries ({bookingsReceived.length})
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === "properties"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              My Listed Properties ({myProperties.length})
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: My Leases */}
            {activeTab === "leases" && (
              <div className="space-y-4">
                {bookingsMade.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    You have not submitted any lease bookings yet.{" "}
                    <Link
                      to="/"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Browse Houses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingsMade.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 rounded-xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between"
                      >
                        <div className="flex gap-3">
                          <img
                            src={booking.property?.images[0]}
                            alt={booking.property?.title}
                            className="w-20 h-16 rounded-lg object-cover shrink-0 bg-slate-50 border"
                            referrerPolicy="no-referrer"
                          />

                          <div className="leading-tight">
                            <h4 className="text-xs font-bold text-slate-950 line-clamp-1">
                              <Link
                                to={`/properties/${booking.property?.id}`}
                                className="hover:text-blue-600"
                              >
                                {booking.property?.title}
                              </Link>
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{booking.property?.city}</span>
                            </p>
                            <p className="text-xs font-extrabold text-blue-600 mt-1">
                              ₹{booking.property?.price.toLocaleString()}/mo
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-slate-50 pt-2.5 flex flex-wrap justify-between items-center gap-2">
                          <div className="text-[10px] leading-tight">
                            <p className="text-slate-400">Scheduled Move-in:</p>
                            <p className="font-bold text-slate-700">
                              {new Date(
                                booking.moveInDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase ${bookingStatusBadges[booking.status]}`}
                            >
                              {booking.status}
                            </span>

                            {booking.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleBookingAction(booking.id, "cancelled")
                                }
                                className="px-2 py-1 text-[10px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer border border-rose-100"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Inbound Requests */}
            {activeTab === "received" && (
              <div className="space-y-4">
                {bookingsReceived.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    No active booking requests have been received on your listed
                    properties yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-2">Property</th>
                          <th className="py-3 px-2">Applicant</th>
                          <th className="py-3 px-2">Move-In Date</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {bookingsReceived.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-2">
                              <Link
                                to={`/properties/${b.property?.id}`}
                                className="font-bold text-slate-950 hover:text-blue-600 line-clamp-1 max-w-[200px]"
                              >
                                {b.property?.title}
                              </Link>
                              <span className="text-[10px] text-blue-600 font-extrabold">
                                ₹{b.property?.price.toLocaleString()}/mo
                              </span>
                            </td>
                            <td className="py-3.5 px-2">
                              <p className="font-bold text-slate-950">
                                {b.tenant?.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {b.tenant?.email} • {b.tenant?.phone}
                              </p>
                            </td>
                            <td className="py-3.5 px-2 font-semibold text-slate-700">
                              {new Date(b.moveInDate).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase ${bookingStatusBadges[b.status]}`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              {b.status === "pending" ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() =>
                                      handleBookingAction(b.id, "approved")
                                    }
                                    className="px-2 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleBookingAction(b.id, "rejected")
                                    }
                                    className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">
                                  No actions
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: My Properties */}
            {activeTab === "properties" && (
              <div className="space-y-4">
                {myProperties.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    You have not hosted any properties on HouseHunt yet.{" "}
                    <Link
                      to="/list-property"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Host a Home
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProperties.map((p) => {
                      const statusColors = {
                        pending: "bg-amber-50 text-amber-700 border-amber-200",
                        approved:
                          "bg-emerald-50 text-emerald-700 border-emerald-200",
                        rejected: "bg-rose-50 text-rose-700 border-rose-200",
                      };
                      return (
                        <div
                          key={p.id}
                          className="border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow bg-white flex flex-col justify-between"
                        >
                          <div className="relative aspect-[1.8] w-full bg-slate-50">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span
                              className={`absolute top-3 left-3 border text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg shadow-sm ${statusColors[p.status]}`}
                            >
                              {p.status}
                            </span>
                            <span className="absolute bottom-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              {p.propertyType}
                            </span>
                          </div>

                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-950 line-clamp-1">
                                <Link
                                  to={`/properties/${p.id}`}
                                  className="hover:text-blue-600"
                                >
                                  {p.title}
                                </Link>
                              </h4>
                              <p className="text-[10px] text-blue-600 font-bold mt-1">
                                ₹{p.price.toLocaleString()}/mo
                              </p>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                                {p.location}, {p.city}
                              </p>
                            </div>

                            <div className="border-t border-slate-50 pt-2.5 flex justify-between items-center">
                              <span
                                className={`text-[10px] font-bold ${p.availability ? "text-emerald-600" : "text-rose-500"}`}
                              >
                                {p.availability
                                  ? "● Available"
                                  : "● Leased Out"}
                              </span>

                              <div className="flex gap-2">
                                <Link
                                  to={`/properties/${p.id}`}
                                  className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-blue-600"
                                  title="View Details"
                                >
                                  <ArrowUpRight className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDeletePropertyListing(p.id)
                                  }
                                  className="p-1.5 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
