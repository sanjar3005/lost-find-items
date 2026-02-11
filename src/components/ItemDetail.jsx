import React, { useState, useRef } from 'react';
import { Clock, Eye, Heart, MapPin, ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';

export default function ItemDetail() {
  const [activeImage, setActiveImage] = useState(0);
  const thumbnailScrollRef = useRef(null);

  // Mock Data
  const item = {
    title: "iPhone 13 pro",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800", // Gold iPhone back
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", // Angled
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=800", // Generic phone
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800", // Hand holding
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800", // Duplicate for scroll demo
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", // Gold iPhone back
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", // Angled
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=800", // Generic phone
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800", // Hand holding
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800", // Duplicate for scroll demo
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", 
    ],
    stats: {
      time: "02:16:27",
      views: 550,
      likes: 150
    },
    description: "Hammaga salom ushbu telefon Toshkent shahar Mirzo Ulug'bek bog'idan topib olindi, telefon egasi +99899999999 raqamiga qo'ng'iroq qilsin.",
    owner: {
      name: "Jamshid",
      location: "Toshkent",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"
    }
  };

  // --- Logic to handle image switching and scrolling ---
  const scrollThumbnail = (index) => {
    if (thumbnailScrollRef.current) {
      const thumbnailWidth = 80; // approximate width of one thumbnail + gap
      const scrollAmount = index * thumbnailWidth - (thumbnailScrollRef.current.clientWidth / 2) + (thumbnailWidth / 2);
      thumbnailScrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (activeImage + 1) % item.images.length;
    setActiveImage(nextIndex);
    scrollThumbnail(nextIndex);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (activeImage - 1 + item.images.length) % item.images.length;
    setActiveImage(prevIndex);
    scrollThumbnail(prevIndex);
  };

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
    scrollThumbnail(index);
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-8 max-w-[1360px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* --- LEFT COLUMN: Carousel Gallery --- */}
          <div className="space-y-4 select-none">
            {/* Main Image Stage */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
              <img 
                src={item.images[activeImage]} 
                alt="Main Item" 
                className="w-full h-full object-contain mix-blend-multiply" 
              />
              
              {/* Left Arrow */}
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Arrow */}
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Scrollable Thumbnails Strip */}
            <div 
              ref={thumbnailScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
            >
              {item.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === index 
                      ? 'border-[#3B82F6] ring-2 ring-blue-100 opacity-100' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: Details --- */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 font-sans">
              {item.title}
            </h1>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <Clock size={16} /> {item.stats.time}
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <Eye size={16} /> {item.stats.views}
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <Heart size={16} fill="currentColor" /> {item.stats.likes}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Izoh</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                {item.description}
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-8 border border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4">Topib olgan shaxsning pro'fili</h3>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={item.owner.avatar} 
                  alt={item.owner.name} 
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-[#0F172A] text-lg">{item.owner.name}</h4>
                  <p className="text-slate-400 text-sm">{item.owner.location}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                  <Phone size={18} /> Qo'ng'iroq
                </button>
                <button className="flex-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Xabar
                </button>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">Topib olgan manzil</h3>
              <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 group cursor-pointer">
                 <img 
                   src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" 
                   alt="Location Map" 
                   className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                 />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                    <MapPin size={40} className="text-red-500 fill-red-500 animate-bounce" />
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}