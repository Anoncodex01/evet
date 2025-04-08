import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(true);

    try {
      let searchQuery = supabase
        .from('profiles')
        .select('*')
        .in('user_type', ['daktari', 'duka', 'wauzaji']);

      if (query) {
        searchQuery = searchQuery.or(`full_name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (location) {
        searchQuery = searchQuery.eq('location', location);
      }

      const { data, error } = await searchQuery;

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserType = (type) => {
    switch (type) {
      case 'daktari':
        return 'Daktari';
      case 'duka':
        return 'Duka';
      case 'wauzaji':
        return 'Muuzaji';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSearch} className="relative">
        <div className="bg-white rounded-2xl sm:rounded-full shadow-2xl p-3 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
          <div className="flex-1 flex items-center px-3 py-2 sm:py-0 rounded-xl sm:rounded-none bg-gray-50 sm:bg-transparent">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tafuta huduma, duka au mtoa huduma..."
              className="w-full ml-3 bg-transparent focus:outline-none text-base sm:text-lg"
            />
          </div>
          
          <div className="flex-none px-3 py-2 sm:py-0 sm:px-4 rounded-xl sm:rounded-none bg-gray-50 sm:bg-transparent sm:border-l sm:border-gray-200">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full sm:w-auto bg-transparent focus:outline-none text-gray-600 text-base sm:text-lg"
            >
              <option value="">Maeneo Yote</option>
              <option value="Arusha">Arusha</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Dodoma">Dodoma</option>
              <option value="Mwanza">Mwanza</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-full hover:bg-green-700 transition-colors duration-300 text-base sm:text-lg font-medium"
          >
            {loading ? 'Inatafuta...' : 'Tafuta'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {showResults && (
        <div className="absolute w-full mt-4 bg-white rounded-xl shadow-xl overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-8 w-8 mx-auto border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Hakuna matokeo yaliyopatikana
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((result) => (
                <div 
                  key={result.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    setShowResults(false);
                    navigate(`/services/${result.user_type}`);
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      {result.profile_image_url ? (
                        <img 
                          src={result.profile_image_url} 
                          alt={result.full_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-green-600">
                          {result.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {result.full_name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-gray-500 truncate">
                          {getUserType(result.user_type)}
                        </span>
                        <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
                        <span className="text-gray-500 truncate">
                          {result.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;