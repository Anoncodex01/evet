import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';

function DashboardLayout() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getUserTitle = () => {
    if (!profile) return '';
    
    switch(profile.user_type) {
      case 'daktari':
        return 'Daktari';
      case 'duka':
        return 'Mmiliki wa Duka';
      case 'wauzaji':
        return 'Muuzaji wa Mifugo';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Sidebar userType={profile?.user_type} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DashboardHeader title={getUserTitle()} name={profile?.full_name} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

export default DashboardLayout;