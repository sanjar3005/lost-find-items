import React, { useState } from 'react';
import { Search, Menu, X, User, LogOut, Settings, FileText } from 'lucide-react';
import Dropdown from './DropDown';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const BACKEND_URL = "http://127.0.0.1:8000";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const avatarLabel = (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline-block font-bold text-sm">
        {user?.first_name || 'Profil'}
      </span>
      {user?.avatar ? (
        <img
          src={user.avatar.startsWith('http') ? user.avatar : `${BACKEND_URL}${user.avatar}`}
          alt="Profil"
          className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
          <User className="w-4 h-4 text-slate-500" />
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between font-sans gap-3">

        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="14" fill="#0F172A" />
              <path d="M8 26C8 26 15 32 32 14" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">Logo</span>
        </Link>

        {/* Desktop Nav Links — visible from lg+ */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-[#0F172A] font-semibold text-sm flex-1 justify-center">
          <Link to="/" className="hover:text-blue-600 transition-colors whitespace-nowrap">Bosh sahifa</Link>
          <Link to="/items" className="hover:text-blue-600 transition-colors whitespace-nowrap">Qidiruv</Link>
          {user && <Link to="/profile" className="hover:text-blue-600 transition-colors whitespace-nowrap">Profil</Link>}
        </div>

        {/* Right Side — visible from md+ */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Search */}
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const searchVal = e.target.search.value;
              navigate(`/items?search=${encodeURIComponent(searchVal)}`);
            }}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              name="search"
              type="text"
              placeholder="Qidirish..."
              className="pl-10 pr-4 py-2 bg-[#EEF4FA] rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 w-40 lg:w-52 xl:w-64 text-slate-700 placeholder:text-slate-400 transition-all"
            />
          </form>

          {/* Post button */}
          <Link to="/create-item">
            <button className="bg-[#1E85FF] hover:bg-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
              E'lon berish
            </button>
          </Link>

          {/* User dropdown */}
          {user ? (
            <Dropdown
              label={avatarLabel}
              items={[
                { label: `${user?.first_name || 'Foydalanuvchi'} ${user?.last_name || ''}`, href: '/profile' },
                { label: "E'lonlarim", href: '/profile' },
                { label: 'Sozlamalar', href: '/settings' },
                { type: 'divider' },
                { type: 'button', label: 'Chiqish', danger: true, onClick: logoutUser },
              ]}
            />
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap">Kirish</Link>
              <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 whitespace-nowrap">Ro'yxatdan o'tish</Link>
            </div>
          )}
        </div>

        {/* Hamburger — visible below lg */}
        <button
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menyu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu Dropdown ─────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">

            {/* Search */}
            <form
              className="relative mb-2"
              onSubmit={(e) => {
                e.preventDefault();
                const searchVal = e.target.search.value;
                navigate(`/items?search=${encodeURIComponent(searchVal)}`);
                closeMobileMenu();
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                name="search"
                type="text"
                placeholder="Qidirish..."
                className="w-full pl-11 pr-4 py-3 bg-[#EEF4FA] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
            </form>

            {/* Nav links */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Bosh sahifa
            </Link>
            <Link
              to="/items"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Qidiruv
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar.startsWith('http') ? user.avatar : `${BACKEND_URL}${user.avatar}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={14} className="text-slate-500" />
                    )}
                  </div>
                  {user?.first_name || 'Profil'} {user?.last_name || ''}
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <FileText size={16} className="text-slate-400" />
                  E'lonlarim
                </Link>
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Settings size={16} className="text-slate-400" />
                  Sozlamalar
                </Link>

                <div className="border-t border-slate-100 mt-1 pt-2">
                  <Link to="/create-item" onClick={closeMobileMenu}>
                    <button className="w-full bg-[#1E85FF] text-white py-3 rounded-xl font-bold mb-2 hover:bg-blue-600 transition-colors">
                      E'lon berish
                    </button>
                  </Link>
                  <button
                    onClick={() => { logoutUser(); closeMobileMenu(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Chiqish
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 mt-1 pt-3 flex flex-col gap-2">
                <Link to="/create-item" onClick={closeMobileMenu}>
                  <button className="w-full bg-[#1E85FF] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                    E'lon berish
                  </button>
                </Link>
                <div className="flex gap-2">
                  <Link to="/login" onClick={closeMobileMenu} className="flex-1">
                    <button className="w-full py-3 rounded-xl font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                      Kirish
                    </button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu} className="flex-1">
                    <button className="w-full py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors">
                      Ro'yxatdan o'tish
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
