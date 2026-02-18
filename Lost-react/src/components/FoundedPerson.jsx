import React from 'react';

const FoundedPerson = () => {
  const people = [
    { name: "Dilshodxon", city: "Farg'ona", img: "https://img.freepik.com/free-photo/smiling-businessman-sitting-by-table-cafe-with-laptop-computer-smartphone-while-looking-away_171337-5558.jpg?semt=ais_user_personalization&w=740&q=80" },
    { name: "Jahongir", city: "Toshkent", img: "https://t3.ftcdn.net/jpg/02/72/90/28/360_F_272902867_xASWPZ0a6EdFm5FmSD1gqMBCgKhKlcPZ.jpg" },
    { name: "Alisher", city: "Toshkent", img: "https://media.gettyimages.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.jpg?s=612x612&w=gi&k=20&c=BFc13n-vhT4GMd0ohRt0PFD3IzJ_Onf6nKDAObgh1CA=" },
    { name: "Jamshid", city: "Farg'ona", img: "https://media.gettyimages.com/id/175440771/photo/handsome-young-man-gesturing-thumbs-up-isolated.jpg?s=612x612&w=gi&k=20&c=rNDrj73bXAla605kVUdLvr2OkDNYhx8ITsk585iaeyI=" },
    { name: "Abdulloh", city: "Andijon", img: "https://img3.stockfresh.com/files/n/nyul/m/97/623482_stock-photo-portrait-of-happy-older-man.jpg" },
    { name: "Shaxriyor", city: "Namangan", img: "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=" },
    { name: "Diyora", city: "Farg'ona", img: "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg" },
    { name: "Otabek", city: "Toshkent", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDZSw2UU2Up9dYROkO5nSSFrJ6uwbsmxQGw&s" },
    
  ];

  return (
    <div className="max-w-85/100 w-full mx-auto py-12">
      {/* Header section remains aligned with other components */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[#0a1d37] text-2xl md:text-4xl font-bold ">
            Yo'qolgan buyumni topganlar
          </h2>
          <p className="text-gray-500 mt-1 text-xs md:text-base font-medium">
            Bu yerda siz topilgan narsalarni ko'rishingiz mumkin
          </p>
        </div>
        <button className="hover:text-[#1e88e5] underline underline-offset-10 decoration-blue-600 text-sm md:text-base border-b-2 border-[#1e88e5] pb-13 lg:pb-3 whitespace-nowrap cursor-pointer md:mb-5">
          Ko'proq
        </button>
      </div>

      {/* Grid: 3 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-6 lg:gap-x-30 lg:gap-y-10 py-5">
        {people.map((person, i) => (
          <div key={i} className="flex flex-row gap-1 lg:gap-5 items-center text-center group cursor-pointer">
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