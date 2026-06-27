import React from "react";
import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-md shadow-blue-100 mb-6">
        <Compass className="w-8 h-8 animate-spin" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-2">
        404 - Page Lost
      </h1>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        We searched high and low, but the rental, document, or listing
        coordinates you specified could not be found.
      </p>
      <Link
        to="/"
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Back to HouseHunt Home</span>
      </Link>
    </div>
  );
}
