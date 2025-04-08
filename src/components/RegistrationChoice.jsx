import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  UsersIcon,
  TruckIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const categories = [
  {
    id: 'daktari',
    title: 'Daktari',
    description: 'Jisajili kama daktari wa mifugo na anza kutoa huduma za kitaalam kwa wafugaji.',
    path: '/register/daktari',
    icon: UserIcon
  },
  {
    id: 'duka',
    title: 'Duka La Bidhaa na Huduma Za Mifugo',
    description: 'Sajili duka lako la bidhaa za mifugo na anza kuuza bidhaa na kutoa huduma kwa wafugaji.',
    path: '/register/duka',
    icon: ShoppingBagIcon
  },
  {
    id: 'wauzaji',
    title: 'Wauzaji Mifugo',
    description: 'Jisajili kama muuzaji wa mifugo na anza kuuza mifugo yako kwa urahisi.',
    path: '/register/wauzaji',
    icon: UsersIcon
  },
  {
    id: 'agregator',
    title: 'Agregator',
    description: 'Jisajili kama agregator na saidia kuunganisha wafugaji na masoko.',
    path: '/register/agregator',
    icon: UserGroupIcon
  },
  {
    id: 'transport',
    title: 'Usafirishaji',
    description: 'Toa huduma za usafirishaji wa mifugo na bidhaa za mifugo.',
    path: '/register/transport',
    icon: TruckIcon
  },
  {
    id: 'teacher',
    title: 'Mwalimu/Mtaalamu',
    description: 'Toa elimu na ushauri wa kitaalamu kuhusu ufugaji bora.',
    path: '/register/teacher',
    icon: AcademicCapIcon
  },
  {
    id: 'financial_advisor',
    title: 'Mshauri wa Kifedha',
    description: 'Toa ushauri wa kifedha na mikopo kwa wafugaji.',
    path: '/register/financial_advisor',
    icon: CurrencyDollarIcon
  },
  {
    id: 'other',
    title: 'Huduma Nyingine',
    description: 'Sajili huduma nyingine zinazohusiana na sekta ya mifugo.',
    path: '/register/other',
    icon: WrenchScrewdriverIcon
  }
];

function RegistrationChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-white shadow-sm py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Chagua Aina ya Usajili</h1>
          <p className="mt-2 text-lg text-gray-600">Chagua aina ya akaunti unayotaka kufungua</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <category.icon className="w-8 h-8 text-green-600" />
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