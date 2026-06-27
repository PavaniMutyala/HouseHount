import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  BedDouble,
  Bath,
  Square,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PropertyCard({
  property,
  isFavoriteInitial = false,
  onFavoriteToggle,
  showStatus = false,
}) {
  const { user, fetchWithAuth, showToast } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Please sign in to add properties to your favorites.", "info");
      return;
    }

    setFavLoading(true);
    try {
      const res = await fetchWithAuth("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsFavorite(data.isFavorite);
        showToast(data.message, "success");
        if (onFavoriteToggle) {
          onFavoriteToggle(property.id, data.isFavorite);
        }
      } else {
        showToast(data.message || "Error toggling favorite", "error");
      }
    } catch (err) {
      showToast("Connection error toggling favorite", "error");
    } finally {
      setFavLoading(false);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length,
      );
    }
  };

  const statusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-sm">
      {/* Property Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img
          src={
            property.images[currentImageIndex] ||
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
          }
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Gray overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Carousel buttons */}
        {property.images.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            <button
              onClick={prevImage}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow hover:bg-white transition-all transform hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow hover:bg-white transition-all transform hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Favorite Overlay Button */}
        {property.status === "approved" && (
          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              isFavorite
                ? "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 scale-105 shadow-md shadow-rose-200"
                : "bg-white/90 backdrop-blur-sm border-slate-100 text-slate-600 hover:text-rose-500 hover:scale-105 shadow"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Property Type Badge */}
        <span className="absolute bottom-3 left-3 bg-blue-600/95 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg">
          {property.propertyType}
        </span>

        {/* Admin/User Listing Status Badge */}
        {showStatus && (
          <span
            className={`absolute top-3 left-3 border text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm ${statusColors[property.status]}`}
          >
            {property.status}
          </span>
        )}
      </div>

      {/* Property Details Column */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2.5">
          <p className="text-xl font-bold text-slate-900 tracking-tight">
            ₹{property.price.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 lowercase">
              {" "}
              / month
            </span>
          </p>
        </div>

        <h3 className="text-sm font-semibold text-slate-950 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="line-clamp-1">
            {property.location}, {property.city}
          </span>
        </div>

        {/* Structural properties bar */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 text-xs text-slate-600 font-medium mb-5">
          <div className="flex items-center gap-1.5 justify-center">
            <BedDouble className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Bath className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="w-full text-center py-2.5 rounded-xl border border-blue-100 text-blue-600 font-semibold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow shadow-blue-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
