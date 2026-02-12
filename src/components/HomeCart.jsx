import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const HomeCart = ({ date, title, author, authorImage, image }) => {
  return (
    /* THE WRAPPER: 
       - aspect-[376/599] makes it TALL and SLIM like your image.
       - w-full allows it to fit 2 per row / 4 per row in your grid.
    */
    <div className="relative flex flex-col w-full bg-white border border-[#D0D0D2] rounded-[24px] p-3 lg:p-5 aspect-[376/599] shadow-2xl transition-all hover:border-[#2589F5] overflow-visible">
      
      {/* 1. DATE BADGE (Floating on Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#2589F5] text-white px-3 lg:px-5 py-1 lg:py-2 rounded-[8px] flex items-center gap-1 lg:gap-2 shadow-lg whitespace-nowrap">
        <Calendar size={14} className="text-white" />
        <span className="font-bold text-[10px] lg:text-sm tracking-wide">{date || "2.02.2022"}</span>
      </div>

      {/* 2. IMAGE CONTAINER (The Grey Background) */}
      <div className="flex-[2.5] bg-[#F2F2F2] rounded-[18px] lg:rounded-[22px] flex items-center justify-center overflow-hidden mb-3 lg:mb-5 mt-1">
        <img
          src={image}
          alt={title}
          className="w-[75%] h-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* 3. CONTENT SECTION */}
      <div className="flex flex-col flex-1 justify-between gap-1">
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

        {/* 4. ACTION BUTTON */}
        <button className="w-full border lg:border-2 border-[#2589F5] text-[#2589F5] py-2 lg:py-3 rounded-[12px] lg:rounded-[11px] font-bold text-[11px] lg:text-lg hover:bg-[#2589F5] hover:text-white transition-all active:scale-95">
          Kirish
        </button>
      </div>
    </div>
  );
};

export default HomeCart;