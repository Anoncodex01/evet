import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

function DashboardHeader({ title, name }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Karibu, {name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;