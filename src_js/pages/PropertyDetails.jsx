import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Calendar,
  Star,
  Phone,
  Mail,
  Check,
  MessageSquare,
  ArrowLeft,
  Utensils,
  Car,
  Trash2,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import PropertyCard from "../components/PropertyCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user, fetchWithAuth, showToast } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Gallery active view
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking states
  const [moveInDate, setMoveInDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Contact modal state
  const [showContact, setShowContact] = useState(false);

  // Load property details
  useEffect(() => {
    async function loadPropertyDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProperty(data.property);
          setReviews(data.reviews || []);
          setRelatedProperties(data.relatedProperties || []);
          setActiveImageIndex(0);

          // Check if favorited
          const token = localStorage.getItem("hh_token");
          if (token) {
            const favRes = await fetchWithAuth("/api/favorites");
            const favData = await favRes.json();
            if (favRes.ok && favData.favorites) {
              const isFav = favData.favorites.some((f) => f.propertyId === id);
              setIsFavorite(isFav);
            }
          }
        } else {
          showToast(data.message || "Error loading property details.", "error");
          navigate("/");
        }
      } catch (err) {
        showToast("Connection error loading details.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    loadPropertyDetails();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      showToast("Please login to save favorites.", "info");
      return;
    }
    if (!property) return;

    try {
      const res = await fetchWithAuth("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorite(data.isFavorite);
        showToast(data.message, "success");
      } else {
        showToast(data.message || "Error updating favorites", "error");
      }
    } catch (e) {
      showToast("Network error updating favorites.", "error");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to book this property.", "info");
      navigate("/login", {
        state: { from: { pathname: `/properties/${id}` } },
      });
      return;
    }

    if (!moveInDate) {
      showToast("Please select a move-in date.", "error");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetchWithAuth("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          propertyId: property?.id,
          moveInDate,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(
          data.message || "Booking request sent successfully!",
          "success",
        );
        navigate("/bookings");
      } else {
        showToast(data.message || "Booking submission failed.", "error");
      }
    } catch (err) {
      showToast("Network error submitting booking.", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to write a review.", "info");
      return;
    }

    if (!commentInput.trim()) {
      showToast("Review comment cannot be empty.", "error");
      return;
    }

    setReviewLoading(true);
    try {
      const res = await fetchWithAuth("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          propertyId: property?.id,
          rating: ratingInput,
          comment: commentInput,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => [data.review, ...prev]);
        setCommentInput("");
        setRatingInput(5);
        showToast("Review submitted successfully!", "success");
      } else {
        showToast(data.message || "Error submitting review.", "error");
      }
    } catch (err) {
      showToast("Network error adding review.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetchWithAuth(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        showToast("Review deleted successfully.", "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Error deleting review", "error");
      }
    } catch (err) {
      showToast("Network error deleting review", "error");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!property) return null;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </Link>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={
                property.images[activeImageIndex] ||
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
              }
              alt={property.title}
              className="w-full h-full object-cover transition-all"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[350px] scrollbar-thin">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden shrink-0 w-28 md:w-full border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-blue-600 shadow"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details and Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {/* Header Title Block */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                    {property.propertyType}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>
                      {property.location}, {property.city}, {property.state},{" "}
                      {property.country}
                    </span>
                  </div>
                </div>

                {/* Rating & Favorite Actions */}
                <div className="flex items-center gap-3">
                  {averageRating && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>
                        {averageRating} ({reviews.length})
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                      isFavorite
                        ? "bg-rose-50 border-rose-200 text-rose-600 shadow shadow-rose-100"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    <span>{isFavorite ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Layout Features / Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="space-y-1 py-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Bedrooms</span>
                </p>
                <p className="text-base font-extrabold text-slate-950">
                  {property.bedrooms}
                </p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center">
                  <Bath className="w-3.5 h-3.5" />
                  <span>Bathrooms</span>
                </p>
                <p className="text-base font-extrabold text-slate-950">
                  {property.bathrooms}
                </p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Kitchen</span>
                </p>
                <p className="text-base font-extrabold text-slate-950">
                  {property.kitchen ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center">
                  <Car className="w-3.5 h-3.5" />
                  <span>Parking</span>
                </p>
                <p className="text-base font-extrabold text-slate-950">
                  {property.parking ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Property description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-950">
                Property Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-950">
                Amenities Included
              </h3>
              {property.amenities.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No special amenities listed.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-white shadow-sm text-xs text-slate-700 font-semibold"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Host Details Block */}
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    property.owner?.profileImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  }
                  alt={property.owner?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />

                <div className="leading-tight">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">
                    Property Host
                  </span>
                  <p className="text-base font-extrabold text-slate-950 mt-0.5">
                    {property.owner?.name || "Owner"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Joined HouseHunt in{" "}
                    {property.owner?.createdDate
                      ? new Date(property.owner.createdDate).getFullYear()
                      : "2026"}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                {showContact ? (
                  <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs text-slate-700 font-medium space-y-1.5 shadow-sm">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{property.owner?.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{property.owner?.email}</span>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-100 transition-colors cursor-pointer text-center"
                  >
                    Contact Owner
                  </button>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Property Reviews ({reviews.length})</span>
                </h3>
              </div>

              {/* Add review form */}
              {user ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <p className="text-xs font-bold text-slate-800">
                    Write a Review
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-medium">
                      Your Rating:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="p-0.5 focus:outline-none focus:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${star <= ratingInput ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <textarea
                      placeholder="Share your experience staying here (location, clean state, amenities quality...)"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full min-h-[75px] max-h-[150px] px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-slate-800 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 font-medium">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Login here
                  </Link>{" "}
                  to post a review for this property.
                </div>
              )}

              {/* Reviews Feed */}
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No reviews have been posted for this property yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-2 relative group/rev"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              r.user?.profileImage ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                            }
                            alt={r.user?.name}
                            className="w-8 h-8 rounded-full object-cover border"
                            referrerPolicy="no-referrer"
                          />

                          <div>
                            <p className="text-xs font-bold text-slate-950">
                              {r.user?.name}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(r.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{r.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                        {r.comment}
                      </p>

                      {/* Delete review action */}
                      {user &&
                        (user.id === r.userId || user.role === "admin") && (
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="absolute bottom-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover/rev:opacity-100 transition-opacity focus:opacity-100"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking / Pricing Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-6">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                <div>
                  <p className="text-2xl font-black text-slate-950">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <span className="text-xs text-slate-500 lowercase">
                    Monthly rental fee
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${
                    property.availability
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}
                >
                  {property.availability ? "Available" : "Rented Out"}
                </span>
              </div>

              {/* Price calculations details */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Standard Rent (1 Month)</span>
                  <span className="font-semibold">
                    ₹{property.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Utilities & Service Fee</span>
                  <span className="font-semibold">
                    ₹{(property.price * 0.08).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Damage Deposit</span>
                  <span className="font-semibold">
                    ₹{(property.price * 0.5).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
                  <span>Estimated Total</span>
                  <span>
                    ₹
                    {(
                      property.price +
                      property.price * 0.08 +
                      property.price * 0.5
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Booking Scheduler form */}
              {property.ownerId === user?.id ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center text-xs text-amber-800 font-semibold">
                  You own this property listing. Management controls are
                  available inside your dashboard.
                </div>
              ) : !property.availability ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center text-xs text-rose-800 font-semibold">
                  This property is currently rented out or booked. Please browse
                  other open listings!
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Scheduled Move-in Date
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-blue-500 transition-all">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="date"
                        value={moveInDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {bookingLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Request Booking</span>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400">
                    You won't be charged yet. The host will review and contact
                    you to complete details.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related properties section */}
        {relatedProperties.length > 0 && (
          <div className="border-t border-slate-100 mt-16 pt-12 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Related Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
