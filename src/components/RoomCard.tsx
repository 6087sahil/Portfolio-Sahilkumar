import React, { useState } from 'react';

interface RoomCardProps {
  image?: string;
  price?: number | string;
  location?: string;
  roomType?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  image = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  price = '15,000',
  location = 'Gurgaon',
  roomType = 'Private room',
  isFavorite = false,
  onFavoriteToggle,
  onClick
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onFavoriteToggle) onFavoriteToggle();
  };

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col gap-4 w-full max-w-sm rounded-[24px] bg-[#0d0d10] p-3 border border-white/5 cursor-pointer hover:border-white/10 transition-colors duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-[#1a1a1a]">
        <img 
          src={image} 
          alt={`${roomType} in ${location}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-[36px] h-[36px] bg-white/90 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 active:scale-95 z-10"
          aria-label="Toggle favorite"
        >
          <svg 
            width="18" 
            height="16" 
            viewBox="0 0 18 16" 
            fill={favorite ? "#DB1E51" : "none"} 
            stroke={favorite ? "#DB1E51" : "#000000"} 
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-colors duration-300"
          >
            <path d="M9 15.35L7.911 14.35C3.9 10.77 1.2 8.39 1.2 5.45C1.2 3.07 3.04 1.25 5.45 1.25C6.74 1.25 7.98 1.86 8.7 2.85H9.3C10.02 1.86 11.26 1.25 12.55 1.25C14.96 1.25 16.8 3.07 16.8 5.45C16.8 8.39 14.1 10.77 10.089 14.35L9 15.35Z" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Info Container */}
      <div className="px-2 pb-2 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-[#DB1E51] text-[20px] font-semibold font-sans tracking-tight">
              ₹{price}
            </span>
            <span className="text-[#727272] text-[15px] font-medium font-sans">
              /monthly
            </span>
          </div>
          
          {/* Location & Room Type */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[#DB1E51] text-[15px] font-medium font-sans">
              {location},
            </span>
            <span className="text-[#727272] text-[14px] font-sans">
              {roomType}
            </span>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="w-[42px] h-[42px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(219,30,81,0.15)] group-hover:shadow-[0_0_20px_rgba(219,30,81,0.25)] transition-all duration-300 flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 13L13 1M13 1H4M13 1V10" stroke="#DB1E51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
