import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building,
  Sparkles,
  Filter,
  Compass,
  CheckCircle2,
  RefreshCw,
  Activity,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { fetchWithAuth, showToast } = useAuth();
  const navigate = useNavigate();

  // Search filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [sortOrder, setSortOrder] = useState("newest");

  // Properties data
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dynamic Keyword Rotator State
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const keywords = [
    "dream room",
    "co-living studio",
    "luxury penthouse",
    "perfect apartment",
    "student PG",
  ];

  // Amenities Filter Tags State
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Room Matchmaker Quiz States
  const [quizStep, setQuizStep] = useState(1); // 1: City, 2: Budget, 3: Amenity, 4: Results
  const [quizCity, setQuizCity] = useState("");
  const [quizBudget, setQuizBudget] = useState(""); // 'budget', 'mid', 'premium'
  const [quizAmenity, setQuizAmenity] = useState("");
  const [quizResults, setQuizResults] = useState([]);

  // Live Activity Stream States
  const [activityIndex, setActivityIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(true);

  const activities = [
    {
      user: "Alex Rivera",
      action: "recently booked a room in",
      place: "Gachibowli, Hyderabad",
      time: "2 mins ago",
    },
    {
      user: "Emily Watson",
      action: "approved a new lease in",
      place: "Jubilee Hills, Hyderabad",
      time: "1 hour ago",
    },
    {
      user: "Pavani Mutyala",
      action: "favorited a gorgeous garden flat in",
      place: "Kondapur, Hyderabad",
      time: "Just now",
    },
    {
      user: "Sarah Jenkins",
      action: "verified a premium BHK in",
      place: "Banjara Hills, Hyderabad",
      time: "Yesterday",
    },
    {
      user: "Corporate Guest",
      action: "requested a co-living flat in",
      place: "Madhapur, Hyderabad",
      time: "10 mins ago",
    },
    {
      user: "Kunal Sen",
      action: "posted reviews for a flat in",
      place: "Carter Road, Mumbai",
      time: "30 mins ago",
    },
  ];

  // Rotate hero keywords
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % keywords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Rotate activity toasts
  useEffect(() => {
    const timer = setInterval(() => {
      setShowActivity(false);
      setTimeout(() => {
        setActivityIndex((prev) => (prev + 1) % activities.length);
        setShowActivity(true);
      }, 500);
    }, 8500);
    return () => clearInterval(timer);
  }, []);

  // Load properties and favorites
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Construct query params
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (cityFilter !== "all") params.append("city", cityFilter);
        if (typeFilter !== "all") params.append("propertyType", typeFilter);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (bedsFilter !== "any") params.append("bedrooms", bedsFilter);
        params.append("sort", sortOrder);

        const propRes = await fetch(`/api/properties?${params.toString()}`);
        const propData = await propRes.json();

        if (propRes.ok) {
          setProperties(propData.properties || []);
        }

        // Load user favorites if logged in
        const token = localStorage.getItem("hh_token");
        if (token) {
          const favRes = await fetchWithAuth("/api/favorites");
          const favData = await favRes.json();
          if (favRes.ok && favData.favorites) {
            setFavorites(favData.favorites.map((f) => f.propertyId));
          }
        }
      } catch (err) {
        showToast("Failed to load listings.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [
    searchQuery,
    cityFilter,
    typeFilter,
    minPrice,
    maxPrice,
    bedsFilter,
    sortOrder,
  ]);

  const handleCityQuickClick = (city) => {
    setCityFilter(city);
    const element = document.getElementById("listings-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCityFilter("all");
    setTypeFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setBedsFilter("any");
    setSortOrder("newest");
    setSelectedAmenities([]);
  };

  // Run Local Matchmaker Algorithm
  const runQuizMatch = (city, budget, amenity) => {
    let matches = [...properties];
    // 1. Filter by city
    if (city) {
      matches = matches.filter(
        (p) => p.city.toLowerCase() === city.toLowerCase(),
      );
    }
    // 2. Filter by budget range
    if (budget === "budget") {
      matches = matches.filter((p) => p.price <= 15000);
    } else if (budget === "mid") {
      matches = matches.filter((p) => p.price > 15000 && p.price <= 35000);
    } else if (budget === "premium") {
      matches = matches.filter((p) => p.price > 35000);
    }

    // 3. Filter by amenity
    if (amenity) {
      matches = matches.filter((p) => p.amenities.includes(amenity));
    }

    // Fallback logic if no matches are found
    if (matches.length === 0) {
      matches = properties.filter(
        (p) =>
          p.city.toLowerCase() === city.toLowerCase() ||
          p.price <= (budget === "budget" ? 15000 : 35000),
      );
    }

    setQuizResults(matches.slice(0, 3));
    setQuizStep(4);
  };

  const resetQuiz = () => {
    setQuizStep(1);
    setQuizCity("");
    setQuizBudget("");
    setQuizAmenity("");
    setQuizResults([]);
  };

  // Local filtering based on active amenity tags selection (Real-time layout animation)
  const filteredProperties = properties.filter((prop) => {
    if (selectedAmenities.length === 0) return true;
    return selectedAmenities.every((amenity) =>
      prop.amenities.includes(amenity),
    );
  });

  // Computed real-time dynamic stats based on properties in state
  const totalVerifiedRooms = properties.filter(
    (p) => p.status === "approved",
  ).length;
  const uniqueCities =
    new Set(
      properties.filter((p) => p.status === "approved").map((p) => p.city),
    ).size || 4;
  const startingPrice =
    properties.length > 0 ? Math.min(...properties.map((p) => p.price)) : 11000;
  const averagePrice =
    properties.length > 0
      ? Math.round(
          properties.reduce((acc, p) => acc + p.price, 0) / properties.length,
        )
      : 25000;

  // FAQ states
  const [faqOpen, setFaqOpen] = useState({
    0: true,
    1: false,
    2: false,
  });

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden text-white py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated Orbs/Spotlights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start gap-6 lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles
              className="w-3.5 h-3.5 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            Discover Your Next Chapter
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[7rem]">
            The easiest way to find <br className="hidden sm:inline" />
            <span className="text-blue-400 inline-block">your </span>
            <span className="relative inline-block ml-2 overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block text-white border-b-4 border-blue-500 pb-1 font-black"
                >
                  {keywords[rotatingIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            Browse through thousands of verified, premium rental rooms and
            apartments in Hyderabad, Bangalore, Mumbai, and Delhi NCR. Instant
            booking, secure processes, and reliable local hosts.
          </p>

          {/* Quick Search Bar Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-5 mt-4 border border-slate-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Query search */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50">
                <Search className="w-4 h-4 text-blue-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Area, title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-800"
                />
              </div>

              {/* City select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none text-slate-700 cursor-pointer"
                >
                  <option value="all">Any City</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi NCR</option>
                </select>
              </div>

              {/* Property Type Select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50">
                <Building className="w-4 h-4 text-blue-500 shrink-0" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none text-slate-700 cursor-pointer"
                >
                  <option value="all">Any Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              {/* Filter toggler / Clear buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-bold w-full transition-all cursor-pointer ${
                    showAdvanced
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced filters</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Expandable Container */}
            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50"
                    />

                    <span className="text-slate-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    Min Bedrooms
                  </label>
                  <select
                    value={bedsFilter}
                    onChange={(e) => setBedsFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 cursor-pointer text-slate-700 font-semibold"
                  >
                    <option value="any">Any Bedrooms</option>
                    <option value="1">1+ Bedrooms</option>
                    <option value="2">2+ Bedrooms</option>
                    <option value="3">3+ Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    Sort Listings By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 cursor-pointer text-slate-700 font-semibold"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full text-center py-2.5 text-xs text-rose-500 hover:text-white border border-rose-100 hover:bg-rose-500 hover:border-rose-500 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Dynamic Platform Live Ticker Banner */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-400 font-semibold bg-slate-950/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Stats:
            </span>
            <span>
              🏠 <strong className="text-white">{totalVerifiedRooms}</strong>{" "}
              Premium Spaces
            </span>
            <span>
              📍 <strong className="text-white">{uniqueCities}</strong> Urban
              Hubs
            </span>
            <span>
              💸 Rent from{" "}
              <strong className="text-white">
                ₹{startingPrice.toLocaleString()}/mo
              </strong>
            </span>
            <span>
              📈 Avg. Rent{" "}
              <strong className="text-white">
                ₹{averagePrice.toLocaleString()}/mo
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* Bento Layout Section: Destination Hubs & Interactive Room Matchmaker Quiz */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Destination Quick Filters (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Explore Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select one of India's premier hubs to load verified local rooms
              instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {[
              {
                name: "Hyderabad",
                count: "Premium Rooms & Penthouses",
                img: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Bangalore",
                count: "Tech Hub PGs & Lofts",
                img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Mumbai",
                count: "Bandra Coastal Flats",
                img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Delhi",
                count: "Modern Gated Societies",
                img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleCityQuickClick(item.name)}
                className="group relative h-44 rounded-2xl overflow-hidden focus:outline-none text-left cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:-translate-y-1"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-base leading-tight tracking-tight flex items-center gap-1.5">
                    {item.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
                    {item.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room Matchmaker Quiz Widget (5/12 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Decorative glowing abstract shapes */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/5">
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> Room
                Matchmaker Quiz
              </span>
              {quizStep > 1 && (
                <button
                  onClick={resetQuiz}
                  className="text-xs text-blue-100 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Restart
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {quizStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      Where are you heading?
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-1">
                      Select your preferred city hub in India
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {["Hyderabad", "Bangalore", "Mumbai", "Delhi"].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setQuizCity(c);
                          setQuizStep(2);
                        }}
                        className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/15 hover:border-white font-bold text-sm text-left transition-all cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      What is your monthly budget?
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-1">
                      We'll find rooms matching your range
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    {[
                      {
                        key: "budget",
                        label: "Budget-Friendly (Under ₹15,000)",
                        desc: "Perfect for interns and students",
                      },
                      {
                        key: "mid",
                        label: "Mid-Range (₹15,000 - ₹35,000)",
                        desc: "Spacious flats and amenities",
                      },
                      {
                        key: "premium",
                        label: "Premium & Luxury (₹35,000+)",
                        desc: "Stunning penthouses and luxury villas",
                      },
                    ].map((b) => (
                      <button
                        key={b.key}
                        onClick={() => {
                          setQuizBudget(b.key);
                          setQuizStep(3);
                        }}
                        className="w-full text-left p-3.5 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/15 hover:border-white transition-all cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-sm">{b.label}</span>
                        <span className="text-[10px] opacity-75">{b.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      Select your must-have amenity
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-1">
                      What can you absolutely not live without?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      "WiFi",
                      "Air Conditioning",
                      "Power Backup",
                      "Gated Security",
                      "Gym Access",
                      "Rooftop Terrace",
                    ].map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setQuizAmenity(a);
                          runQuizMatch(quizCity, quizBudget, a);
                        }}
                        className="p-3 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/15 hover:border-white font-bold text-xs text-left transition-all cursor-pointer"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />{" "}
                      Perfect Matches Found!
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-1">
                      Here are your custom recommended spaces in {quizCity}:
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 max-h-[200px] overflow-y-auto pr-1">
                    {quizResults.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:bg-white/20 transition-all cursor-pointer"
                        onClick={() => navigate(`/properties/${p.id}`)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate text-white">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-blue-100/80 truncate">
                              {p.location}, {p.city}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-white">
                            ₹{p.price.toLocaleString()}
                          </p>
                          <span className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
                            View
                          </span>
                        </div>
                      </div>
                    ))}
                    {quizResults.length === 0 && (
                      <p className="text-xs text-center py-6 text-blue-100">
                        No matches found in {quizCity} for this filter. Check
                        all listings below!
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        // Apply corresponding filters to listing view as well
                        if (quizCity) setCityFilter(quizCity);
                        if (quizBudget === "budget") {
                          setMaxPrice("15000");
                          setMinPrice("");
                        } else if (quizBudget === "mid") {
                          setMinPrice("15000");
                          setMaxPrice("35000");
                        } else if (quizBudget === "premium") {
                          setMinPrice("35000");
                          setMaxPrice("");
                        }
                        const el = document.getElementById("listings-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      Apply Filters Below
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="px-3.5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between text-[11px] text-blue-100/70 z-10 font-semibold">
            <span>Powered by HouseHunt SmartEngine</span>
            <span>100% Verified Landlords</span>
          </div>
        </div>
      </section>

      {/* Featured Properties Listing Grid */}
      <section
        id="listings-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Featured Listings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredProperties.length} verified premium rentals{" "}
              {cityFilter !== "all" && `in ${cityFilter}`}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Amenity Filter Tags */}
        <div className="mb-8 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Real-time Amenities Filter:
            </span>
            {[
              { id: "WiFi", label: "WiFi" },
              { id: "Air Conditioning", label: "A/C" },
              { id: "Power Backup", label: "Power Backup" },
              { id: "Rooftop Terrace", label: "Rooftop Garden" },
              { id: "Modular Kitchen", label: "Modular Kitchen" },
              { id: "Gated Security", label: "Gated Security" },
              { id: "Gym Access", label: "Gym" },
              { id: "Balcony", label: "Balcony" },
              { id: "Workspace", label: "Work Desk" },
            ].map((tag) => {
              const isSelected = selectedAmenities.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedAmenities((prev) =>
                      isSelected
                        ? prev.filter((a) => a !== tag.id)
                        : [...prev, tag.id],
                    );
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{tag.label}</span>
                  {isSelected && <X className="w-3 h-3 text-white" />}
                </button>
              );
            })}
            {selectedAmenities.length > 0 && (
              <button
                onClick={() => setSelectedAmenities([])}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline px-2 cursor-pointer flex items-center gap-1"
              >
                Clear tags ({selectedAmenities.length})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-950">
              No Listings Match Your Filters
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
              Try adjusting your search criteria, widening the price budget, or
              clicking "Reset Filters" to start browsing.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Reset All Filters & Tags
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  layout
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyCard
                    property={property}
                    isFavoriteInitial={favorites.includes(property.id)}
                    onFavoriteToggle={(id, isFav) => {
                      setFavorites((prev) =>
                        isFav
                          ? [...prev, id]
                          : prev.filter((fid) => fid !== id),
                      );
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* How it Works section */}
      <section className="bg-white border-t border-b border-slate-100 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Simplify your property rental experience in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold shadow-sm shadow-blue-100">
                1
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Search & Filter
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Apply advanced filter sliders like bedroom count, city hubs, or
                pricing boundaries to find your ideal home matches.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold shadow-sm shadow-blue-100">
                2
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Send Booking Request
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Schedule a move-in date on our visual interactive details
                calendar and submit booking requests instantly.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold shadow-sm shadow-blue-100">
                3
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Approve & Move In
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Hosts will review and approve your submission, locking down the
                listing securely. Move in stress-free!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Loved by Tenants and Hosts
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Hear directly from some of our valued members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote:
                "Listing my luxury penthouses on HouseHunt was incredibly simple. The layout is beautiful, and being able to screen booking requests easily saved me so much administrative work.",
              author: "Emily Watson",
              role: "Property Owner in Hyderabad",
              img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            },
            {
              quote:
                "I found an absolute gem of a room in Gachibowli within minutes. Booking took two clicks, and the host was extremely helpful. The interface is stunning and very clean.",
              author: "Alex Rivera",
              role: "Software Engineer, Tenant in Bangalore",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-950">
                    {t.author}
                  </h4>
                  <span className="text-xs text-slate-500">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white border-t border-slate-100 py-16 w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need to know about navigating HouseHunt.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Are the property listings verified?",
                a: "Yes. Every single property posted on HouseHunt goes through an administrative review pipeline. Property listings are kept pending and will only appear on the public browse grid once verified and approved by our system admins.",
              },
              {
                q: "How do I request a booking?",
                a: "Once signed in, browse to any property detail page, specify a move-in date on the booking schedule sidebar, and submit. The property host will receive a real-time listing in their dashboard, allowing them to approve or decline the lease request.",
              },
              {
                q: "Can I list my own property?",
                a: 'Absolutely! Create an account or sign in, navigate to "List Property" via the top navigation, specify the listing information, type, amenities, and image links, and submit. Your listing will go to the admin review feed.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-5 py-4 font-bold text-sm text-slate-950 flex justify-between items-center bg-white hover:bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-blue-600 font-normal text-lg">
                    {faqOpen[idx] ? "−" : "+"}
                  </span>
                </button>
                {faqOpen[idx] && (
                  <div className="px-5 py-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-slideDown">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Dynamic Live Activity Status Ticker Widget */}
      <AnimatePresence>
        {showActivity && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3.5 shadow-2xl flex items-center gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner relative">
              <Activity className="w-5 h-5 animate-pulse text-blue-600" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Platform Activity
                </span>
                <button
                  onClick={() => setShowActivity(false)}
                  className="text-slate-300 hover:text-slate-500 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium leading-tight">
                <strong className="font-extrabold text-slate-900">
                  {activities[activityIndex].user}
                </strong>{" "}
                {activities[activityIndex].action}{" "}
                <strong className="text-blue-600">
                  {activities[activityIndex].place}
                </strong>
              </p>
              <span className="text-[9px] text-slate-400 mt-1 block font-semibold">
                {activities[activityIndex].time}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
