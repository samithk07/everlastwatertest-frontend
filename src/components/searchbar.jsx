import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search by name, mobile, place, TDS, or iron PPM..."
          className="w-full px-6 py-4 pl-14 pr-14 text-lg bg-white border-2 border-[#EEEEEE] rounded-xl 
                     focus:border-[#00ADB5] focus:outline-none focus:ring-4 focus:ring-[#00ADB5] focus:ring-opacity-20
                     transition-all duration-300"
        />
        <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#00ADB5] text-xl" />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 
                       text-[#393E46] hover:text-[#222831] transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="absolute right-16 top-1/2 transform -translate-y-1/2 
                   bg-[#00ADB5] text-white px-4 py-2 rounded-lg text-sm font-semibold
                   hover:bg-[#00969e] transition-colors md:block hidden"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;