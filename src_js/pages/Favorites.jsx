import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Favorites() {
  const { fetchWithAuth, showToast, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      showToast("Please login to view your saved listings.", "info");
      navigate("/login");
      return;
    }
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/favorites");
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favorites || []);
      } else {
        showToast(data.message || "Error fetching favorites.", "error");
      }
    } catch (err) {
      showToast("Connection error loading wishlist.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggleRemoved = (propertyId, isFav) => {
    // If removed from wishlist, filter it out from local view instantly to feel interactive
    if (!isFav) {
      setFavorites((prev) =>
        prev.filter((fav) => fav.propertyId !== propertyId),
      );
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Saved Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            You have saved {favorites.length} properties to your wishlist.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <Heart className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-950">
              Your Wishlist is Empty
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
              Browse listings on our platform and click the heart icon on any
              property card to save it here for fast access later.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {favorites.map((fav) => (
              <PropertyCard
                key={fav.id}
                property={fav.property}
                isFavoriteInitial={true}
                onFavoriteToggle={handleFavoriteToggleRemoved}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
