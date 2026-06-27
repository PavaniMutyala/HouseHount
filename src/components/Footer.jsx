import React from "react";
import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center">
                {/* Glowing halo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 blur-sm opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
                {/* Core container */}
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  <Home className="w-4.5 h-4.5 text-white" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse border border-blue-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1 leading-none">
                  <span>House</span>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-indigo-400 group-hover:to-blue-400 transition-all duration-300">
                    Hunt
                  </span>
                </span>
                <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase leading-none mt-1">
                  Smart Rentals
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find, book, and list premium rental homes across the country.
              Experience seamless digital real-estate hunting today.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-white hover:underline transition-all"
                >
                  Browse Homes
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-white hover:underline transition-all"
                >
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/list-property"
                  className="hover:text-white hover:underline transition-all"
                >
                  Host Your Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cities Column */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Popular Hubs
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Los Angeles, California</li>
              <li>New York City, New York</li>
              <li>San Francisco, California</li>
              <li>Miami, Florida</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@househunt.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) HUNT-555</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>San Francisco, CA, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} HouseHunt Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Crafted with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for
            modern living.
          </p>
        </div>
      </div>
    </footer>
  );
}
