import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserCircleIcon,
  NewspaperIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ userType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showBlogDropdown, setShowBlogDropdown] = React.useState(false);
  
  const menuItems = [
    { 
      name: 'Wasifu Wangu', 
      icon: UserCircleIcon, 
      path: '/dashboard/profile' 
    }
  ];

  const blogItems = [
    { name: 'Andika Makala', path: '/dashboard/blog' },
    { name: 'Makala Zangu', path: '/dashboard/blog/list' }
  ];

  const getUserTitle = () => {
    switch(userType) {
      case 'daktari':
        return 'Daktari';
      case 'duka':
        return 'Duka';
      case 'wauzaji':
        return 'Muuzaji';
      default:
        return '';
    }
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-600">{getUserTitle()}</p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            item.show !== false && (
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
            )
          ))}
          
          <li>
            <button
              onClick={() => setShowBlogDropdown(!showBlogDropdown)}
              className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
            >
              <NewspaperIcon className="w-5 h-5 mr-3" />
              <span>Makala</span>
              <ChevronDownIcon 
                className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                  showBlogDropdown ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {showBlogDropdown && (
              <div className="ml-6 space-y-1">
                {blogItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200
                      ${location.pathname === item.path ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          
          <li className="px-6 py-4 mt-auto">
            <button 
              onClick={async () => {
                try {
                  await signOut();
                  navigate('/login');
                } catch (error) {
                  console.error('Error signing out:', error);
                }
              }}
              className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Ondoka
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;