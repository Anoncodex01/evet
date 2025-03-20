import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSidebar from './AdminSidebar';
import {
  UsersIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalShops: 0,
    totalSellers: 0,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctors, shops, sellers, posts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).eq('user_type', 'daktari'),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('user_type', 'duka'),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('user_type', 'wauzaji'),
        supabase.from('blog_posts').select('*', { count: 'exact' })
      ]);

      setStats({
        totalDoctors: doctors.count || 0,
        totalShops: shops.count || 0,
        totalSellers: sellers.count || 0,
        totalPosts: posts.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Imeshindikana kupata takwimu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Hitilafu: {error}</p>
      </div>
    );
  }

  const getStatCards = () => ([
    {
      title: 'Jumla ya Madaktari',
      value: stats.totalDoctors,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Jumla ya Maduka',
      value: stats.totalShops,
      icon: ShoppingBagIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Jumla ya Wauzaji',
      value: stats.totalSellers,
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Jumla ya Makala',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen pl-64">
        <AdminHeader />
        <main className="flex-1">
          {location.pathname === '/admin' || location.pathname === '/admin/dashboard' ? (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getStatCards().map((stat) => (
                  <div key={stat.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className={`rounded-full p-3 ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminDashboard;