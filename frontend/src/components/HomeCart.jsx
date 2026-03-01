import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

// 1. onDetails propini qo'shdik
const HomeCart = ({ date, title, author, authorImage, image, onDetails }) => {
  return (
    <div className="w-full border border-[#D0D0D2] bg-white rounded-2xl p-3 lg:p-5 flex flex-col gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
      {/* Rasm qismi */}
      <div className="relative">
        {/* Sana (Badge) */}
        <div className="absolute -top-3 lg:-top-4 left-1/2 -translate-x-1/2 z-10 bg-[#2589F5] text-white px-2 lg:px-5 py-1 lg:py-2 rounded-[8px] lg:rounded-[11] flex items-center gap-1 lg:gap-2 shadow-lg whitespace-nowrap mt-1">
          <Calendar size={12} className="lg:w-[18px] text-white" />
          <span className="font-bold text-[9px] lg:text-sm tracking-wide">{date}</span>
        </div>
        
        {/* Kitob rasmi foni */}
        <div className="bg-[#F2F2F2] rounded-[14px] lg:rounded-[16px] aspect-square flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1 lg:space-y-2">
          {/* Title */}
          <h3 className="text-[#0a1d37] text-sm lg:text-2xl font-bold truncate">
            {title || "Kitob"}
          </h3>

          {/* Author and Link Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 lg:gap-3 overflow-hidden">
              <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                <img src={authorImage} alt={author} className="w-full h-full object-cover" />
              </div>
              <span className="text-gray-500 font-semibold text-[10px] lg:text-sm truncate">
                {author || "Asilbek"}
              </span>
            </div>
            
            <button className="flex items-center text-[#2589F5] font-bold text-[10px] lg:text-lg hover:underline whitespace-nowrap">
              Xarita <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* 2. ACTION BUTTON - onClick hodisasi qo'shildi */}
        <button 
          onClick={onDetails} // Bosilganda FoundItems dagi navigate ishlaydi
          className="w-full border lg:border-2 border-[#2589F5] text-[#2589F5] py-2 lg:py-2 rounded-[12px] lg:rounded-[11px] font-bold text-[11px] lg:text-lg hover:bg-[#2589F5] hover:text-white transition-all active:scale-95"
        >
          Kirish
        </button>
      </div>
    </div>
  );
};

export default HomeCart;