import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import LocationDropdown from './LocationDropdown';
import OTPVerification from './OTPVerification';

function AgregatorRegistration() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setDocumentName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    let profileImageUrl = null;

    try {
      // Phone number validation
      const phoneRegex = /^(\+255|0)[67]\d{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Tafadhali weka namba ya simu sahihi inayoanza na +255 au 0');
      }

      // Validate profile image if exists
      if (profileImage) {
        if (profileImage.size > 5 * 1024 * 1024) {
          throw new Error('Ukubwa wa picha usizidi 5MB');
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(profileImage.type)) {
          throw new Error('Aina ya picha inayokubalika ni JPEG, PNG au GIF');
        }
      }

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        throw signUpError;
      }

      if (!authData?.user?.id) {
        throw new Error('Usajili umeshindikana. Tafadhali jaribu tena.');
      }
      
      // Upload profile image if exists
      if (profileImage) {
        const timestamp = new Date().getTime();
        const fileExt = profileImage.name.split('.').pop();
        const filePath = `${authData.user.id}/${timestamp}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, profileImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        profileImageUrl = publicUrl;
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          user_type: 'agregator',
          full_name: fullName,
          email,
          phone: phoneNumber,
          location,
          description,
          profile_image_url: profileImageUrl
        }]);

      if (profileError) throw profileError;

      // Store user ID for OTP verification
      localStorage.setItem('pendingRegistration', JSON.stringify({
        userId: authData.user.id
      }));
      
      // Save profile data
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const profile = {
        id: authData.user.id,
        user_type: 'agregator',
        full_name: fullName,
        phone: phoneNumber,
        email,
        location,
        description,
        profile_image: profileImagePreview
      };
      
      profiles.push(profile);
      localStorage.setItem('profiles', JSON.stringify(profiles));

      // Save document if exists
      if (document) {
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        documents.push({
          id: Date.now().toString(),
          profile_id: authData.user.id,
          document_type: 'business_permit',
          document_name: documentName
        });
        localStorage.setItem('documents', JSON.stringify(documents));
      }

      setIsSubmitting(false);
      setShowOTP(true);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showOTP) {
    return (
      <OTPVerification 
        phoneNumber={phoneNumber}
        onVerificationComplete={({ success }) => {
          if (success) {
            navigate('/dashboard/profile');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <UserGroupIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Jisajili kama Agregator</h2>
          <p className="mt-2 text-gray-600">Saidia kuunganisha wafugaji na masoko</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-80">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Picha ya Profaili
              </label>
              <div className="flex items-center justify-center w-full relative">
                {profileImagePreview && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={profileImagePreview} 
                      alt="Profile preview" 
                      className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                )}
                <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 text-gray-400 group-hover:text-green-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">{profileImagePreview ? 'Badilisha picha' : 'Bofya kupakia picha'}</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                    required 
                  />
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Jina Kamili
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Barua Pepe
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Namba ya Simu
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+255 au 0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Neno la Siri
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Mahali
              </label>
              <LocationDropdown
                value={location}
                onChange={setLocation}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Maelezo ya Huduma Zako
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Eleza huduma zako kwa ufupi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leseni ya Biashara
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600 hover:text-green-500">
                        {documentName || 'Pakia leseni ya biashara'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (Max. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleDocumentChange}
                    required
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Inaendelea...' : 'Jisajili'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregatorRegistration; 