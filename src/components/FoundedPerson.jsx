import React from 'react';

const FoundedPerson = () => {
  const people = [
    { name: "Dilshodxon", city: "Farg'ona", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Jahongir", city: "Toshkent", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Alisher", city: "Toshkent", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Jamshid", city: "Farg'ona", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Abdulloh", city: "Andijon", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Shaxriyor", city: "Namangan", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Diyora", city: "Farg'ona", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    { name: "Otabek", city: "Toshkent", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header section remains aligned with other components */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[#0a1d37] text-xl md:text-4xl font-bold leading-tight">
            Yo'qolgan buyumni topganlar
          </h2>
          <p className="text-gray-500 mt-1 text-xs md:text-base font-medium">
            Bu yerda siz topilgan narsalarni ko'rishingiz mumkin
          </p>
        </div>
        <button className="text-[#1e88e5] text-sm md:text-base font-bold border-b-2 border-[#1e88e5] pb-0.5 whitespace-nowrap mb-5">
          Ko'proq
        </button>
      </div>

      {/* Grid: 3 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-10">
        {people.map((person, i) => (
          <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
            {/* Optimized image size for 3-column mobile view */}
            <img 
              src={person.img} 
              alt={person.name} 
              className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-3xl object-cover shadow-sm transition-transform group-hover:scale-105" 
            />
            <div className="mt-2 space-y-0.5">
              <h4 className="text-[#0a1d37] font-bold text-[10px] sm:text-sm md:text-xl leading-tight">
                {person.name}
              </h4>
              <p className="text-gray-400 text-[9px] sm:text-xs md:text-base font-medium">
                {person.city}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundedPerson;