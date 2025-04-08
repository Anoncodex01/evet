import React from 'react';

const tanzaniaCities = [
  { name: 'Arusha', region: 'Arusha' },
  { name: 'Dar es Salaam', region: 'Dar es Salaam' },
  { name: 'Dodoma', region: 'Dodoma' },
  { name: 'Mwanza', region: 'Mwanza' },
  { name: 'Tanga', region: 'Tanga' },
  { name: 'Mbeya', region: 'Mbeya' },
  { name: 'Morogoro', region: 'Morogoro' },
  { name: 'Zanzibar', region: 'Zanzibar' },
  { name: 'Kigoma', region: 'Kigoma' },
  { name: 'Moshi', region: 'Kilimanjaro' },
  { name: 'Tabora', region: 'Tabora' },
  { name: 'Singida', region: 'Singida' },
  { name: 'Bukoba', region: 'Kagera' },
  { name: 'Musoma', region: 'Mara' },
  { name: 'Sumbawanga', region: 'Rukwa' },
  { name: 'Shinyanga', region: 'Shinyanga' },
  { name: 'Iringa', region: 'Iringa' },
  { name: 'Songea', region: 'Ruvuma' },
  { name: 'Lindi', region: 'Lindi' },
  { name: 'Mtwara', region: 'Mtwara' },
  { name: 'Pwani', region: 'Pwani' }
].sort((a, b) => a.name.localeCompare(b.name));

function LocationDropdown({ value, onChange, required = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
    >
      <option value="">Chagua Mkoa/Jiji...</option>
      {tanzaniaCities.map((city) => (
        <option key={city.name} value={city.name}>
          {city.name} ({city.region})
        </option>
      ))}
    </select>
  );
}

export default LocationDropdown;