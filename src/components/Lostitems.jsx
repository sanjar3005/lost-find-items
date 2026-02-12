import React from 'react';

const lostitems = ({ images, userName, location, avatar }) => {
  return (
    <div className="bg-[#E9E9E9] rounded-[24px] p-4 w-full max-w-[320px] flex flex-col gap-4">
      {/* Image Gallery Area */}
      <div className="flex gap-2 h-48">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="flex-1 rounded-xl overflow-hidden shadow-sm"
          >
            <img 
              src={img} 
              alt="Post content" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Footer / User Info */}
      <div className="flex items-center gap-3 px-1">
        <img 
          src={avatar} 
          alt={userName} 
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <h3 className="text-[#0D2444] font-bold text-base leading-tight">
            {userName}
          </h3>
          <p className="text-[#8E97A4] text-sm">
            {location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default lostitems;