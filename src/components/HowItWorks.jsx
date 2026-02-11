import React from 'react';
// Changed BellPlus to Bell (valid Lucide icon)
import { UserPlus, Bell, AlertCircle } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, description }) => (
  /* Fixed background color to match the grey in your images */
  <div className="bg-[#7c8087] rounded-2xl p-6 flex flex-col gap-4 transition-all hover:bg-[#888c93]">
    <div className="bg-[#1e88e5] w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
      <Icon size={24} color="white" />
    </div>
    
    <div className="space-y-2">
      <h3 className="text-[#0a1d37] text-xl font-bold">
        {title}
      </h3>
      <p className="text-[#d1d5db] text-sm leading-snug">
        {description}
      </p>
    </div>
  </div>
);

const HowItWorks = () => {
  const data = [
    {
      icon: UserPlus,
      title: "Royxatdan o’tish",
      description: "Royxatdan o’tish tugmasi bosiladi va shaxsiy malumotlar to’ldiriladi.",
    },
    {
      icon: Bell, // Fixed from BellPlus
      title: "Elon berish",
      description: "Biror bir narsangizni yo’qotgan bo’lsangiz Elon berish tugmasi bosiladi.",
    },
    {
      icon: AlertCircle,
      title: "Xabar berish",
      description: "Biror bir narsani topib olsangiz elon berish tugmasi bosiladi.",
    }
  ];

  return (
    <div className="w-full bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <InfoCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;