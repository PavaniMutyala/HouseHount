import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Trash2,
  Home,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Building,
  Key,
} from "lucide-react";

const PROPERTY_TYPES = [
  "Villa",
  "Apartment",
  "Penthouse",
  "Bungalow",
  "Townhouse",
  "Condo",
];

const AMENITY_OPTIONS = [
  "Pool",
  "Gym",
  "WiFi",
  "Air Conditioning",
  "Rooftop Terrace",
  "Hot Tub",
  "Garden",
  "City View",
  "Ocean View",
  "Waterfront View",
  "Private Security",
  "Doorman",
  "Elevator",
  "Hardwood Floors",
  "Laundry In Unit",
  "Smart Home",
  "Garage",
  "Balcony",
  "Dishwasher",
  "Fireplace",
  "Pet Friendly",
];

export default function ListProperty() {
  const { fetchWithAuth, showToast, user } = useAuth();
  const navigate = useNavigate();

  // Basic Details States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [kitchen, setKitchen] = useState(true);
  const [parking, setParking] = useState(false);

  // Amenities list state
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Multiple Image URLs list state
  const [imageUrls, setImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);

  // Authenticate user check
  React.useEffect(() => {
    if (!user) {
      showToast("Please register or sign in to list a property.", "info");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const handleAddImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleImageUrlChange = (index, val) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleRemoveImageUrlField = (index) => {
    if (imageUrls.length === 1) {
      setImageUrls([""]);
    } else {
      setImageUrls(imageUrls.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !location ||
      !city ||
      !state ||
      !country ||
      !price ||
      !area
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const cleanImages = imageUrls.filter((url) => url.trim() !== "");
    if (cleanImages.length === 0) {
      showToast(
        "Please provide at least one valid property image URL.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/properties", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          location,
          city,
          state,
          country,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          kitchen,
          parking,
          area: Number(area),
          propertyType,
          amenities: selectedAmenities,
          images: cleanImages,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Property posted successfully!", "success");
        navigate("/bookings"); // Redirect user to check their listed listings in MyBookings dashboard
      } else {
        showToast(data.message || "Listing creation failed.", "error");
      }
    } catch (err) {
      showToast("Network error listing property.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl space-y-8">
        <div className="text-center space-y-2 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm shadow-blue-100 mb-2">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Host Your Property
          </h1>
          <p className="text-sm text-slate-500">
            Provide property coordinates, images, and pricing metrics to list
            your home.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span>1. Basic Information</span>
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Property Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Modern Oceanfront Loft with Heated Infinity Pool"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Description / Writeup *
              </label>
              <textarea
                placeholder="Brief writeup highlighting property perks, scenic balcony layouts, neighborhood cafes, and nearby transportation hubs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>2. Location Coordinates</span>
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 742 Evergreen Terrace"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  City Hub *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 cursor-pointer text-slate-700 font-semibold"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi NCR</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  State / Province *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Telangana"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Country *
                </label>
                <input
                  type="text"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing and Structure Specs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>3. Structural Specs & Pricing</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 cursor-pointer text-slate-700"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Bedrooms Count
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 cursor-pointer text-slate-700 font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Bed
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Bathrooms Count
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 cursor-pointer text-slate-700 font-semibold"
                >
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Bath
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Area Square Feet *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-800"
                  required
                />
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kitchen}
                    onChange={(e) => setKitchen(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />

                  <span>Has Fitted Kitchen</span>
                </label>
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parking}
                    onChange={(e) => setParking(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />

                  <span>Has Allocated Parking</span>
                </label>
              </div>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>4. Perks & Amenities</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-2 rounded-xl border text-xs text-left font-semibold transition-all select-none flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-600" : "bg-transparent border border-slate-300"}`}
                    />
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multiple image url inputs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>5. Property Images *</span>
              </h3>
              <button
                type="button"
                onClick={handleAddImageUrlField}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add Image URL</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2.5 items-center">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs bg-slate-50 text-slate-800"
                    required={index === 0}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrlField(index)}
                    className="p-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove image URL"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Visual Image Preview Panel */}
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {imageUrls
                .filter((url) => url.trim() !== "")
                .map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-20 shrink-0 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-100"
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=150&q=80";
                      }}
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      Photo {idx + 1}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Submit Property Listing</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
