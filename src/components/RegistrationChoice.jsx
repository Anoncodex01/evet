import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    id: 'daktari',
    title: 'Daktari',
    description: 'Jisajili kama daktari wa mifugo na anza kutoa huduma za kitaalam kwa wafugaji.',
    path: '/register/daktari'
  },
  {
    id: 'duka',
    title: 'Duka La Bidhaa na Huduma Za Mifugo',
    description: 'Sajili duka lako la bidhaa za mifugo na anza kuuza bidhaa na kutoa huduma kwa wafugaji.',
    path: '/register/duka'
  },
  {
    id: 'wauzaji',
    title: 'Wauzaji Mifugo',
    description: 'Jisajili kama muuzaji wa mifugo na anza kuuza mifugo yako kwa urahisi.',
    path: '/register/wauzaji'
  }
];

function RegistrationChoice() {
  const navigate = useNavigate();

  const getIcon = (id) => {
    switch (id) {
      case 'daktari':
        return <UserIcon className="w-8 h-8" />;
      case 'duka':
        return <ShoppingBagIcon className="w-8 h-8" />;
      case 'wauzaji':
        return <UsersIcon className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-white shadow-sm py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Chagua Aina ya Usajili</h1>
          <p className="mt-2 text-lg text-gray-600">Chagua aina ya akaunti unayotaka kufungua</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600">{getIcon(category.id)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegistrationChoice;