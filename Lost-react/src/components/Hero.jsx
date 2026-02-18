import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA]">
      <div className="max-w-85/100  mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-20">
        
        {/* Left Side: Content */}
        <div className="lg:w-1/2 z-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6 lg:mb-12">
            Har qanday <br className="hidden lg:block"/>
            yo'qolgan <span className="text-[#1E85FF]">narsangizni</span> <br className="hidden lg:block"/>
            topishingiz mumkin!
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Find the most attractive and latest items to be your collection. Tezkor qidiruv va ishonchli natijalar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="flex items-center gap-2 bg-[#1E85FF] hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 w-full sm:w-auto justify-center">
              <Plus size={20} strokeWidth={3} /> 
              E'lon berish
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#1E85FF] hover:text-[#1E85FF] text-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all w-full sm:w-auto justify-center">
              <Search size={20} strokeWidth={3} />
              Qidirish
            </button>
          </div>
        </div>

        {/* Right Side: Image Grid */}
        <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end mt-16 lg:mt-0">
           {/* Responsive Note: 
              - 'hidden md:grid': We hide the grid on mobile (screens < 768px) because 9 rotated images 
                look too small/cluttered on a phone. It appears on tablets and up.
           */}
           <div className="hidden md:grid grid-cols-3 gap-3 md:gap-4 rotate-[-15deg] scale-90 md:scale-100 opacity-90 origin-center">
              {[
                "/img/image1.png", // Col 1 Top
                "/img/image2.png", // Col 2 Top
                "/img/image3.png", // Col 3 Top
                "/img/image4.png", // Col 1 Mid
                "/img/image5.png", // Col 2 Mid
                "/img/image6.png", // Col 3 Mid
                "/img/image7.png", // Col 1 Bot
                "/img/image8.png", // Col 2 Bot
                "/img/image9.png", // Col 3 Bot
              ].map((src, i) => {
                // Determine column index (0, 1, or 2)
                const colIndex = i % 3;
                // Middle column (1) goes down, sides (0, 2) go up
                const translateClass = colIndex === 1 ? 'translate-y-8 md:translate-y-12' : '-translate-y-8 md:-translate-y-12';
                
                return (
                  <div key={i} className={`rounded-2xl overflow-hidden shadow-lg border-4 border-white h-32 lg:h-48 w-24 lg:w-40 ${translateClass}`}>
                    <img src={src} alt="grid-item" className="w-full h-full object-cover" />
                  </div>
                );
              })}
           </div>
        </div>

      </div>
    </section>
  );
}