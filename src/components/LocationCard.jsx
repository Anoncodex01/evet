import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LocationCard({ image, name }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    daktari: 0,
    duka: 0,
    wauzaji: 0
  });

  useEffect(() => {
    fetchCounts();
  }, [name]);

  const fetchCounts = async () => {
    try {
      const [doctors, shops, sellers] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('location', name).eq('user_type', 'daktari'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('location', name).eq('user_type', 'duka'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('location', name).eq('user_type', 'wauzaji')
      ]);

      setCounts({
        daktari: doctors.count || 0,
        duka: shops.count || 0,
        wauzaji: sellers.count || 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleClick = () => {
    navigate(`/location/${encodeURIComponent(name)}`);
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer transform transition-transform duration-300 hover:scale-105" 
      onClick={handleClick}
    >
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-6">
        <div className="text-white">
          <h3 className="text-2xl font-semibold mb-1">{name}</h3>
          <div className="flex space-x-4 text-sm text-gray-200">
            <span>{counts.daktari} Madaktari</span>
            <span>{counts.duka} Maduka</span>
            <span>{counts.wauzaji} Wauzaji</span>
          </div>
        </div>
      </div>
    </div>
  );
}