import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function LocationList() {
  const { location } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [location, selectedType]);

  const fetchProviders = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('location', decodeURIComponent(location));

      if (selectedType) {
        query = query.eq('user_type', selectedType);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Imeshindikana kupata watoa huduma. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const providerTypes = [
    { value: '', label: 'Wote' },
    { value: 'daktari', label: 'Madaktari' },
    { value: 'duka', label: 'Maduka' },
    { value: 'wauzaji', label: 'Wauzaji' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Watoa Huduma - {decodeURIComponent(location)}
          </h1>
          <div className="flex items-center space-x-4">
            {providerTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-full ${
                  selectedType === type.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
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
              <div key={provider.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  {provider.profile_image_url ? (
                    <img
                      src={provider.profile_image_url}
                      alt={provider.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <span className="text-5xl font-bold text-green-600/50">
                        {provider.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {provider.user_type === 'daktari' ? 'Daktari' :
                       provider.user_type === 'duka' ? 'Duka' : 'Muuzaji'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.full_name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{provider.description}</p>
                  <button
                    onClick={() => window.location.href = `tel:${provider.phone}`}
                    className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Wasiliana
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationList;