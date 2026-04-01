import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] py-10 sm:py-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

        {/* Left Side: Content */}
        <div className="lg:w-1/2 z-10 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4 sm:mb-6 lg:mb-10">
            Har qanday{' '}
            <br className="hidden sm:block" />
            yo'qolgan{' '}
            <span className="text-[#1E85FF]">narsangizni</span>
            <br className="hidden sm:block" />
            {' '}topishingiz mumkin!
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Tezkor qidiruv va ishonchli natijalar bilan yo'qolgan buyumingizni toping yoki topganingizni e'lon qiling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <Link to="/create-item" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-[#1E85FF] hover:bg-blue-600 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95">
                <Plus size={20} strokeWidth={3} />
                E'lon berish
              </button>
            </Link>
            <Link to="/items" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#1E85FF] hover:text-[#1E85FF] text-slate-700 px-6 sm:px-8 py-3.5 rounded-xl font-bold transition-all">
                <Search size={20} strokeWidth={3} />
                Qidirish
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Image Grid — hidden on mobile to avoid clutter */}
        <div className="lg:w-1/2 relative w-full hidden md:flex justify-center lg:justify-end">
          <div className="grid grid-cols-3 gap-3 md:gap-4 rotate-[-12deg] scale-90 md:scale-100 opacity-90 origin-center">
            {[
              "/img/image1.png",
              "/img/image2.png",
              "/img/image3.png",
              "/img/image4.png",
              "/img/image5.png",
              "/img/image6.png",
              "/img/image7.png",
              "/img/image8.png",
              "/img/image9.png",
            ].map((src, i) => {
              const colIndex = i % 3;
              const translateClass = colIndex === 1
                ? 'translate-y-10 md:translate-y-14'
                : '-translate-y-10 md:-translate-y-14';

              return (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-lg border-4 border-white h-28 lg:h-44 w-20 lg:w-36 ${translateClass}`}
                >
                  <img src={src} alt={`item-${i + 1}`} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
