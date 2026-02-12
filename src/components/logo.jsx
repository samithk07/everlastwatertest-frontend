import React from 'react';
import { MdOutlineWaterDrop } from "react-icons/md";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-[#00ADB5] rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <MdOutlineWaterDrop className="text-white text-2xl" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#222831] rounded-full border-2 border-[#00ADB5]"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#222831] leading-tight">
          Everlast
        </span>
        <span className="text-sm font-medium text-[#00ADB5] tracking-wider">
          Water Solution
        </span>
      </div>
    </div>
  );
};

export default Logo;