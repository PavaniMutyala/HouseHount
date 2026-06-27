import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from "lucide-react";

export default function ImageGallery({ images = [], title = "" }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Set standard fallback image if array is empty or corrupt
  const fallbackImage = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80";
  const displayImages = images && images.length > 0 ? images : [fallbackImage];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index) => {
    setActiveIdx(index);
    setIsOpen(true);
  };

  const imageCount = displayImages.length;

  return (
    <div className="w-full select-none mb-8">
      {/* CSS Grid Gallery Layout based on image count */}
      {imageCount === 1 ? (
        // 1 Image - Symmetrical Hero Row
        <div className="relative group overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-slate-100 aspect-[21/9]">
          <img
            src={displayImages[0]}
            alt={`${title} - Main View`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors duration-300" />
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 text-slate-800 font-semibold text-xs tracking-wide shadow-lg border border-slate-200 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Maximize</span>
          </button>
        </div>
      ) : imageCount === 2 ? (
        // 2 Images - Symmetrical Double Column
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-slate-100 aspect-[4/3]"
            >
              <img
                src={img}
                alt={`${title} - View ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors duration-300" />
              <button
                onClick={() => openLightbox(idx)}
                className="absolute bottom-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg bg-white/95 text-slate-800 shadow border border-slate-200 hover:bg-white hover:scale-105 transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Asymmetric Premium Bento Grid (3+ images)
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 aspect-auto md:aspect-[21/9]">
          {/* Main Large Slot (Spans 2 columns & full rows on desktop) */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-slate-100 min-h-[260px] md:min-h-full">
            <img
              src={displayImages[0]}
              alt={`${title} - Featured View`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors duration-300" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/90 text-white text-[11px] font-bold tracking-wider uppercase shadow backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Featured Listing</span>
            </div>
            <button
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 font-semibold text-xs shadow hover:bg-white hover:scale-105 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>View Fullscreen</span>
            </button>
          </div>

          {/* Second Image Column */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-slate-100 min-h-[180px] md:min-h-full">
            <img
              src={displayImages[1]}
              alt={`${title} - Detail 2`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors duration-300" />
            <button
              onClick={() => openLightbox(1)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30"
            >
              <span className="p-2.5 rounded-full bg-white/95 text-slate-800 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* Third Column / View All Trigger Card */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-slate-100 min-h-[180px] md:min-h-full">
            <img
              src={displayImages[2]}
              alt={`${title} - Detail 3`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            {/* Elegant transparent frosted overlay with image count */}
            <div 
              onClick={() => openLightbox(2)}
              className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/50 transition-all flex flex-col items-center justify-center text-white cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-white/10 border border-white/20 mb-2 backdrop-blur-xs group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white drop-shadow-xs">
                {imageCount > 3 ? `+${imageCount - 2} More Photos` : "View Gallery"}
              </span>
              <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase mt-1">
                {imageCount} Images Total
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Slide Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-8 bg-slate-950/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          {/* Header Action Bar */}
          <div className="w-full flex justify-between items-center text-white select-none">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono tracking-widest uppercase">
                IMG {activeIdx + 1} / {imageCount}
              </span>
              <span className="text-sm font-semibold truncate max-w-xs md:max-w-md text-slate-300">
                {title}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Image Viewer */}
          <div className="flex-1 flex items-center justify-center relative my-4 max-h-[70vh]">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 md:left-4 z-10 p-3 rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Full Image */}
            <div 
              className="max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center bg-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayImages[activeIdx]}
                alt={`${title} - Gallery Detail ${activeIdx + 1}`}
                className="max-w-full max-h-[65vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 md:right-4 z-10 p-3 rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Navigation Bar */}
          <div 
            className="w-full py-4 overflow-x-auto flex justify-center gap-3.5 scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative shrink-0 rounded-lg overflow-hidden border-2 w-14 h-14 md:w-18 md:h-18 transition-all ${
                  activeIdx === idx
                    ? "border-blue-500 scale-105 shadow-md shadow-blue-500/25 opacity-100"
                    : "border-transparent opacity-40 hover:opacity-100"
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
      )}
    </div>
  );
}
