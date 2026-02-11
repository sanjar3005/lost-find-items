import React, { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Main Container */}
      <div className="max-w-340 mx-auto px-4 md:px-8 h-20 flex items-center justify-between font-sans">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="14" fill="#0F172A" />
              <path d="M8 26C8 26 15 32 32 14" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Logo</span>
        </div>

        {/* Desktop Navigation Links (Hidden on Mobile) */}
        <div className="hidden xl:flex items-center gap-6 text-[#0F172A] font-semibold text-sm">
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
            Batafsil ma’lumot <ChevronDown size={16} className="text-slate-400" strokeWidth={3} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
            Biz bilan bog'lanish <ChevronDown size={16} className="text-slate-400" strokeWidth={3} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
            Tilni o’zgartirish <ChevronDown size={16} className="text-slate-400" strokeWidth={3} />
          </div>
          {/* <div className="h-4 w-[1px] bg-slate-200 mx-2"></div> */}
          <a href="#" className="hover:text-blue-600 transition-colors">Profil</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Chat</a>
        </div>

        {/* Right Side: Search & Button */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Qidirish..."
              className="pl-11 pr-4 py-2.5 bg-[#EEF4FA] rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 text-slate-700 placeholder:text-slate-400 transition-all"
            />
          </div>
          <button className="bg-[#1E85FF] hover:bg-blue-600 text-white px-6 lg:px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
            E’lon berish
          </button>
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
           <a href="#" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Batafsil ma’lumot</a>
           <a href="#" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Biz bilan bog'lanish</a>
           <a href="#" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Profil</a>
           <a href="#" className="text-[#0F172A] font-semibold py-2 border-b border-slate-50">Chat</a>
           
           <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-11 pr-4 py-3 bg-[#EEF4FA] rounded-xl text-sm font-medium outline-none"
            />
          </div>
          <button className="w-full bg-[#1E85FF] text-white py-3 rounded-xl font-bold mt-2">
            E’lon berish
          </button>
        </div>
      )}
    </nav>
  );
}