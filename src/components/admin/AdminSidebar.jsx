import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: HomeIcon, 
      path: '/admin/dashboard'
    },
    { 
      name: 'Madaktari', 
      icon: UserGroupIcon, 
      path: '/admin/dashboard/doctors'
    },
    { 
      name: 'Maduka', 
      icon: ShoppingBagIcon, 
      path: '/admin/dashboard/shops'
    },
    { 
      name: 'Wauzaji', 
      icon: UserGroupIcon, 
      path: '/admin/dashboard/sellers'
    },
    { 
      name: 'Makala', 
      icon: DocumentTextIcon, 
      path: '/admin/dashboard/posts'
    }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">E-VET</h2>
        <p className="text-sm text-gray-600">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200
                  ${location.pathname === item.path ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar