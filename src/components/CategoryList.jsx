import React from 'react';
import { Smartphone, Wallet, IdCard, Shirt, ToyBrick, User } from 'lucide-react';

const CategoryList = () => {
  const categories = [
    { icon: Smartphone, title: "Mobil telfonlar" },
    { icon: Wallet, title: "Maishiy tehnika" },
    { icon: IdCard, title: "Vizitkalar" },
    { icon: Shirt, title: "Kiyim bosh" },
    { icon: ToyBrick, title: "O’yinchoqlar" },
    { icon: User, title: "Shahshiy narsa" },
  ];

  return (
    /* This wrapper must be identical to HowItWorks */
    <div className="max-w-85/100 mx-auto py-8"> 
      <div className='flex justify-between my-8'>
        <h1 className='text-3xl font-bold'>Turkum bo'yicha o'rganing</h1>
        <p className='hover:text-[#1e88e5] cursor-pointer underline underline-offset-10 decoration-blue-600 pt-2'>Ko'proq</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className="bg-[#e6effa]/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#888c93] cursor-pointer"
          >
            <div className="text-[#1e88e5]">
              <cat.icon size={32} strokeWidth={2} />
            </div>
            <span className="text-[#838383] text-sm font-semibold text-center">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;