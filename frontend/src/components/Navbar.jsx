import React, { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import Dropdown from './DropDown';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'
// Destructure the user and logoutUser function from the AuthContext

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth()
  const BACKEND_URL = "http://127.0.0.1:8000";
  const avatarLabel = (
    <div className="flex items-center gap-2">

      <span className="hidden sm:inline-block font-bold">
        {user?.first_name || 'Profil'}
      </span>

      {user?.avatar ? (
        // If they have an uploaded avatar, show it
        <img
          // THE FIX: Check if the string already has 'http' before gluing the backend URL!
          src={
            user.avatar
              ? (user.avatar.startsWith('http') ? user.avatar : `${BACKEND_URL}${user.avatar}`)
              : '/default-avatar.png' // Optional fallback if they have no picture
          }
          alt="Profil"
          className="w-8 h-8 rounded-full object-cover border border-slate-200"
        />
      ) : (
        // If they don't have an avatar, show a default gray circle
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
          <User className="w-4 h-4 text-slate-500" />
        </div>
      )}
      {/* Optional: Show their first name next to the picture on larger screens */}

    </div>
  );

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Main Container */}
      <div className="max-w-85/100 mx-auto h-20 flex items-center justify-between font-sans">

        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="14" fill="#0F172A" />
              <path d="M8 26C8 26 15 32 32 14" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Logo</span>
        </Link>

        {/* Desktop Navigation Links (Hidden on Mobile) */}
        <div className="hidden xl:flex items-center gap-6 text-[#0F172A] font-semibold text-sm">
          <Link to="/" className="hover:text-blue-600 transition-colors">Bosh sahifa</Link>
          <Link to="/items" className="hover:text-blue-600 transition-colors">Qidiruv</Link>
          {user && <Link to="/profile" className="hover:text-blue-600 transition-colors">Profil</Link>}
        </div>

        {/* Right Side: Search & Button */}
        <div className="hidden md:flex items-center gap-4">
          <form className="relative" onSubmit={(e) => {
            e.preventDefault();
            const searchVal = e.target.search.value;
            navigate(`/items?search=${encodeURIComponent(searchVal)}`);
          }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="search"
              type="text"
              placeholder="Qidirish..."
              className="pl-11 pr-4 py-2.5 bg-[#EEF4FA] rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 text-slate-700 placeholder:text-slate-400 transition-all"
            />
          </form>
          <Link to="/create-item">
            <button className="bg-[#1E85FF] hover:bg-blue-600 text-white px-6 lg:px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
              E’lon berish
            </button>
          </Link>



          {user ? (
            <Dropdown
              label={avatarLabel}
              items={[
                { label: `${user?.first_name || "Foydalanuvchi"} ${user?.last_name || ""}`, href: "/profile" },
                { label: "E’lonlarim", href: "/profile" },
                { label: "Sozlamalar", href: "/settings" },
                { type: "divider" },
                {
                  type: "button",
                  label: "Chiqish",
                  danger: true,
                  onClick: logoutUser,
                },
              ]}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Kirish</Link>
              <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900">Ro'yxatdan o'tish</Link>
            </div>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-4 flex flex-col gap-4">
          <Link to="/" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Bosh sahifa</Link>
          <Link to="/items" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Qidiruv</Link>
          {user && <Link to="/profile" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Profil</Link>}

          <form className="relative mt-2" onSubmit={(e) => {
            e.preventDefault();
            const searchVal = e.target.search.value;
            navigate(`/items?search=${encodeURIComponent(searchVal)}`);
            setIsMobileMenuOpen(false);
          }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="search"
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-11 pr-4 py-3 bg-[#EEF4FA] rounded-xl text-sm font-medium outline-none"
            />
          </form>
          <Link to="/create-item">
            <button className="w-full bg-[#1E85FF] text-white py-3 rounded-xl font-bold mt-2">
              E’lon berish
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}