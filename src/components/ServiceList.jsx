import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PhoneIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';

function ServiceList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const { type } = useParams();
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProviders();
  }, [type, selectedLocation, currentPage, searchQuery]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      // Count total matching records
      let countQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('user_type', type);

      if (selectedLocation) {
        countQuery = countQuery.eq('location', selectedLocation);
      }

      if (searchQuery) {
        countQuery = countQuery.or(`full_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));

      // Fetch paginated data
      let dataQuery = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', type)
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      if (selectedLocation) {
        dataQuery = dataQuery.eq('location', selectedLocation);
      }

      if (searchQuery) {
        dataQuery = dataQuery.or(`full_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error: fetchError } = await dataQuery;

      if (fetchError) throw fetchError;
      setProviders(data || []);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Imeshindikana kupata orodha. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'daktari':
        return 'Madaktari wa Mifugo';
      case 'duka':
        return 'Maduka ya Bidhaa na Huduma za Mifugo';
      case 'wauzaji':
        return 'Wauzaji wa Mifugo';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Tafuta..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-auto"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Mahali Pote</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Arusha">Arusha</option>
              <option value="Mwanza">Mwanza</option>
              <option value="Dodoma">Dodoma</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hakuna watoa huduma kwa sasa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="relative h-56 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setSelectedProvider(provider);
                    setShowModal(true);
                  }}
                >
                  {provider.profile_image_url ? (
                    <img
                      src={provider.profile_image_url}
                      alt={provider.full_name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <span className="text-5xl font-bold text-green-600/50">{provider.full_name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="relative -mt-16 mx-4">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.full_name}</h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPinIcon className="w-4 h-4 mr-2 text-green-600" />
                      <p className="text-sm">{provider.location}</p>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{provider.description}</p>
                    <button 
                      onClick={() => window.location.href = `tel:${provider.phone}`}
                      className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Wasiliana
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Provider Details Modal */}
        {showModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Taarifa za Mtoa Huduma</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProvider(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  {selectedProvider.profile_image_url ? (
                    <img
                      src={selectedProvider.profile_image_url}
                      alt={selectedProvider.full_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">{selectedProvider.full_name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold">{selectedProvider.full_name}</h3>
                    <p className="text-gray-600">{selectedProvider.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{selectedProvider.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{selectedProvider.location}</span>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-semibold mb-2">Maelezo ya Huduma:</h4>
                    <p className="text-gray-600">{selectedProvider.description}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => window.location.href = `tel:${selectedProvider.phone}`}
                    className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Piga Simu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {providers.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iliyopita
            </button>
            <span className="text-gray-600">
              Ukurasa {currentPage} kati ya {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inayofuata
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;