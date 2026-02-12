import React from 'react';
// Changed BellPlus to Bell (valid Lucide icon)
import { UserPlus, Bell, AlertCircle } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, description }) => (
  <div className=" bg-[#E6EFFA]/50 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:bg-[#888c93]">
    {/* Icon Container - Smaller size */}
    <div className="bg-[#1e88e5] w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
      <Icon size={24} color="white" />
    </div>
    
    <div className="space-y-2">
      <h3 className="text-[#0a1d37] text-xl font-bold">
        {title}
      </h3>
      <p className="text-[#838383] text-sm leading-snug">
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
    <div className="max-w-7xl w-full mx-auto p-4 px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <InfoCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;