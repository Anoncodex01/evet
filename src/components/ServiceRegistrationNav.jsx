import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  UsersIcon,
  UserGroupIcon,
  TruckIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Original services
const mainServices = [
  {
    type: 'daktari',
    title: 'Daktari',
    description: 'Jisajili kama daktari wa mifugo na anza kutoa huduma za kitaalam kwa wafugaji.',
    icon: UserIcon,
  },
  {
    type: 'duka',
    title: 'Duka La Bidhaa na Huduma Za Mifugo',
    description: 'Sajili duka lako la bidhaa za mifugo na anza kuuza bidhaa na kutoa huduma kwa wafugaji.',
    icon: ShoppingBagIcon,
  },
  {
    type: 'wauzaji',
    title: 'Wauzaji Mifugo',
    description: 'Jisajili kama muuzaji wa mifugo na anza kuuza mifugo yako kwa urahisi.',
    icon: UsersIcon,
  }
];

// Additional services
const additionalServices = [
  {
    type: 'agregator',
    title: 'Agregator',
    description: 'Saidia kuunganisha wafugaji na masoko',
    icon: UserGroupIcon,
  },
  {
    type: 'transport',
    title: 'Msafirishaji',
    description: 'Toa huduma za usafirishaji wa mifugo',
    icon: TruckIcon,
  },
  {
    type: 'teacher',
    title: 'Mwalimu',
    description: 'Toa elimu na mafunzo ya ufugaji',
    icon: AcademicCapIcon,
  },
  {
    type: 'financial',
    title: 'Mshauri wa Fedha',
    description: 'Toa ushauri wa kifedha kwa wafugaji',
    icon: CurrencyDollarIcon,
  },
  {
    type: 'other',
    title: 'Huduma Nyingine',
    description: 'Toa huduma zako kwa wafugaji',
    icon: CogIcon,
  }
];

function ServiceCard({ type, title, description, icon: Icon }) {
  return (
    <Link
      to={`/register/${type}`}
      className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-green-50 rounded-xl transition-opacity group-hover:opacity-100 opacity-0" />
      <div className="relative">
        <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
          {title}
        </h3>
        <p className="mt-2 text-gray-500 text-center text-sm">
          {description}
        </p>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
            Jisajili Sasa
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function ServiceRegistrationNav() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Services Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Huduma Kuu</h2>
          <p className="mt-4 text-lg text-gray-600">Chagua aina ya huduma unayotaka kutoa</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {mainServices.map((service) => (
            <ServiceCard key={service.type} {...service} />
          ))}
        </div>

        {/* Additional Services Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Huduma Za Ziada</h2>
          <p className="mt-4 text-lg text-gray-600">Huduma nyingine unazoweza kutoa</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {additionalServices.map((service) => (
            <ServiceCard key={service.type} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceRegistrationNav; 