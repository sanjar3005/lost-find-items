import React from 'react';
import { Calendar, MoreHorizontal, ChevronRight } from 'lucide-react';

const HomeCart = ({ date, title, author, authorImage, image }) => {
  return (
    <div className="w-full lg:max-w-[280px] bg-grey rounded-[20px] lg:rounded-[32px] p-3 lg:p-5 flex flex-col gap-2 lg:gap-4 shadow-2xl">
      {/* Rasm qismi */}
      <div className="relative">
        {/* Sana (Badge) - Mobil uchun kichikroq */}
        <div className="absolute -top-3 lg:-top-4 left-1/2 -translate-x-1/2 z-10 bg-[#2589F5] text-white px-2 lg:px-5 py-1 lg:py-2 rounded-lg lg:rounded-xl flex items-center gap-1 lg:gap-2 shadow-lg whitespace-nowrap">
          <Calendar size={12} className="lg:w-[18px] text-white" />
          <span className="font-bold text-[9px] lg:text-sm tracking-wide">{date}</span>
        </div>
        
        {/* Kitob rasmi foni */}
        <div className="bg-[#F2F2F2] rounded-[16px] lg:rounded-[28px] p-4 lg:p-8 aspect-square flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Ma'lumotlar qismi */}
      <div className="flex flex-col gap-2 lg:gap-4 mt-1">
        <div className="flex justify-between items-center">
          <h3 className="text-black text-sm lg:text-2xl font-bold truncate">{title}</h3>
          <MoreHorizontal className="text-gray-400 lg:text-[#1A3A5F]" size={16} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 lg:gap-3">
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-gray-500 overflow-hidden shrink-0">
              <img src={authorImage} alt={author} className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-300 lg:text-[#1A3A5F] font-semibold text-[10px] lg:text-sm truncate max-w-[50px] lg:max-w-none">
              {author}
            </span>
          </div>
          
          <button className="flex items-center text-[#2589F5] font-bold text-[10px] lg:text-lg">
            Xarita <ChevronRight size={14} className="lg:w-5" />
          </button>
        </div>

        {/* Kirish Tugmasi */}
        <button className="w-full border lg:border-2 border-[#2589F5] text-[#2589F5] py-1.5 lg:py-3 rounded-xl lg:rounded-2xl font-bold text-[11px] lg:text-lg hover:bg-[#2589F5] hover:text-white transition-all">
          Kirish
        </button>
      </div>
    </div>
  );
};

export default HomeCart;