import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserCircleIcon } from '@heroicons/react/24/outline';

function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    type: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    profileImage: '',
    document: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          user_type,
          full_name,
          email,
          phone,
          location,
          description,
          profile_image_url
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setUserProfile({
          type: profile.user_type,
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          description: profile.description,
          profileImage: profile.profile_image_url
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Imeshindikana kupata taarifa zako. Tafadhali jaribu tena.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveMessage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          location: userProfile.location,
          description: userProfile.description
        })
        .eq('id', user.id);

      if (error) throw error;
      setSaveMessage('Taarifa zimehifadhiwa kikamilifu');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Imeshindikana kuhifadhi taarifa. Tafadhali jaribu tena.');
    } finally {
      setIsSaving(false);
    }
  };

  const getProfileTitle = (type) => {
    switch(type) {
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
        <div className="p-6">
          <div className="flex items-center">
            <div className="relative">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-400" />
              )}
              <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full hover:bg-green-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-green-600 font-medium">{getProfileTitle(userProfile.type)}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Taarifa Binafsi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jina Kamili</label>
                  <input
                    id="name"
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Barua Pepe</label>
                  <input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Namba ya Simu</label>
                  <input
                    id="phone"
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mahali</label>
                  <input
                    id="location"
                    type="text"
                    value={userProfile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Maelezo ya Huduma</h3>
              <textarea
                id="description"
                value={userProfile.description}
                rows="4"
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            {userProfile.document && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nyaraka</h3>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">{userProfile.document}</span>
                  <button className="ml-auto text-green-600 hover:text-green-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inahifadhi...
                  </>
                ) : (
                  'Hifadhi Mabadiliko'
                )}
              </button>
            </div>
            {saveMessage && (
              <div className={`mt-4 text-center ${saveMessage.includes('Imeshindikana') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>)}
      </div>
    </div>
  );
}

export default Profile;