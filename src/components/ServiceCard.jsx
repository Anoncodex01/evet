import React from 'react';
import { useNavigate } from 'react-router-dom';

function ServiceCard({ title, description }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = title === 'Daktari' ? '/services/daktari/landing' :
                title === 'Duka La Bidhaa na Huduma Za Mifugo' ? '/services/duka/landing' :
                '/services/wauzaji/landing';
    navigate(path);
  };

  const getIcon = () => {
    switch (title) {
      case 'Daktari':
        return (
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'Duka La Bidhaa na Huduma Za Mifugo':
        return (
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Wauzaji Mifugo':
        return (
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <button 
          onClick={handleClick}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
        >
          Soma Zaidi
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;