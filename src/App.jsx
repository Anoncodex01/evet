import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import LocationsSlider from './components/LocationsSlider';
import './styles/LocationsSlider.css';
import {
  LocationCard,
  ServiceCard,
  ServiceList,
  ListingCard,
  BlogCard,
  LocationList
} from './components';
import {
  PublicBlogList,
  PublicBlogPost
} from './components';
import {
  DashboardLayout,
  Profile,
  BlogPost,
  BlogList
} from './components/dashboard';
import {
  RegistrationChoice,
  DaktariRegistration,
  DukaRegistration,
  WauzajiRegistration,
  Login,
  OTPVerification,
  Footer
} from './components';
import {
  AdminLogin,
  AdminDashboard,
  DoctorsList,
  ShopsList,
  SellersList,
  BlogPostsList
} from './components/admin';

const locations = [
  { 
    name: 'Arusha', 
    image: 'https://www.exploretanzaniatours.com/wp-content/uploads/2022/01/Arusha-city-1024x708-1.jpg',
    listings: '5 Listings'
  },
  { 
    name: 'Dar es Salaam', 
    image: 'https://www.leopard-tours.com/wp-content/uploads/2015/08/dar.jpg',
    listings: '8 Listings'
  },
  { 
    name: 'Dodoma', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Street_in_Viwandani_ward%2C_Dodoma_City.jpg/800px-Street_in_Viwandani_ward%2C_Dodoma_City.jpg',
    listings: '3 Listings'
  },
  { 
    name: 'Mwanza', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mwanza_Tanzania_we_call_this_place_Rock_City%2C_Beautful_place_indeed.jpg',
    listings: '4 Listings'
  },
  { 
    name: 'Tanga', 
    image: 'https://livanholidays.co.tz/wp-content/uploads/2023/11/2021-10-28-1536x1230.jpg',
    listings: '3 Listings'
  },
  { 
    name: 'Morogoro', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Morogoro_panorama.jpg',
    listings: '4 Listings'
  },
  { 
    name: 'Pwani', 
    image: 'https://real-estate-tanzania.beforward.jp/wp-content/uploads/2024/04/IMG-20240414-WA0067.jpg',
    listings: '3 Listings'
  }
];

const services = [
  { 
    title: 'Daktari',
    description: 'Pata ushauri wa kitaalam na huduma za matibabu kutoka kwa madaktari wetu bingwa wa mifugo.'
  },
  { 
    title: 'Duka La Bidhaa na Huduma Za Mifugo',
    description: 'Bidhaa bora za mifugo, dawa, chakula na vifaa muhimu kwa bei nafuu.'
  },
  { 
    title: 'Wauzaji Mifugo',
    description: 'Pata mifugo bora kutoka kwa wafugaji waaminifu. Ng\'ombe, Mbuzi, Kondoo na aina zote za mifugo kwa bei nzuri.'
  }
];

const articles = [
  {
    title: "Jinsi ya Kujua Ng'ombe Wako Anapata Matunzo ya Afya",
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
    date: 'January 1, 2024',
    author: 'Dkt. Sarah',
    category: 'Afya ya Mifugo'
  },
  {
    title: "Jinsi ya Kuchagua Ng'ombe Bora wa Maziwa",
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
    date: 'January 5, 2024',
    author: 'John M.',
    category: 'Ufugaji'
  },
  {
    title: "Bidhaa Muhimu Unazopaswa Kuwa Nazo kwa Mifugo",
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
    date: 'January 10, 2024',
    author: 'Anna K.',
    category: 'Vifaa'
  }
];

function AppContent({ providers, posts }) {
  const location = useLocation();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('user_type', ['daktari', 'duka', 'wauzaji'])
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        const formattedListings = data.map(profile => ({
          title: profile.full_name,
          image: profile.profile_image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
          location: profile.location,
          type: profile.user_type === 'daktari' ? 'DAKTARI' :
                profile.user_type === 'duka' ? 'DUKA LA BIDHAA NA HUDUMA ZA MIFUGO' : 
                'WAUZAJI MIFUGO',
          description: profile.description?.slice(0, 150) + (profile.description?.length > 150 ? '...' : ''),
          rating: '4.5'
        }));

        setListings(formattedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  // Protect dashboard routes
  if (isDashboard && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen">
      {!isDashboard && !isAdmin && <Navbar />}
      <Routes>
        <Route path="/register" element={<RegistrationChoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dashboard/doctors" element={<DoctorsList />} />
          <Route path="dashboard/shops" element={<ShopsList />} />
          <Route path="dashboard/sellers" element={<SellersList />} />
          <Route path="dashboard/posts" element={<BlogPostsList />} />
        </Route>
        <Route path="/register/daktari" element={<DaktariRegistration />} />
        <Route path="/register/duka" element={<DukaRegistration />} />
        <Route path="/register/wauzaji" element={<WauzajiRegistration />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/location/:location" element={<LocationList />} />
        <Route path="/blog" element={<PublicBlogList />} />
        <Route path="/blog/:id" element={<PublicBlogPost />} />
        <Route path="/services/:type" element={<ServiceList />} />
        <Route path="/dashboard/*" element={<DashboardLayout userType="daktari" />}>
          <Route path="profile" element={<Profile />} />
          <Route path="blog" element={<BlogPost />} />
          <Route path="blog/list" element={<BlogList />} />
        </Route>
        <Route path="/" element={
          <>
            <div className="relative py-32 bg-green-800">
                <div className="relative max-w-7xl mx-auto text-center px-4">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    MIFUGO CONNECT
                  </h1>
                  <h2 className="text-2xl text-white mb-4">
                    Huduma Bora Za Mifugo Kiganjani Mwako
                  </h2>
                  <p className="text-xl text-white mb-8">
                    Karibu, Unatafuta Huduma Gani Leo?
                  </p>
                  <SearchBar />
                </div>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-center mb-2">Maeneo Pendwa</h2>
                <p className="text-gray-600 text-center mb-8">Tafuta Huduma Katika Eneo Lako Pendwa Kirahisi Sana.</p>
                <LocationsSlider locations={locations} />
              </section>

              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-center mb-2">Chagua Huduma Bora Zaidi</h2>
                <p className="text-gray-600 text-center mb-8">Tunakuletea huduma bora za mifugo mahali pamoja</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.title} {...service} />
                  ))}
                </div>
              </section>

             <section className="mb-16">
               <h2 className="text-3xl font-semibold text-center mb-2">Watoa Huduma Wapya</h2>
               <p className="text-gray-600 text-center mb-8">Watoa huduma waliojiunga hivi karibuni</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {providers.map((provider) => (
                   <div key={provider.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                     <div className="relative h-48">
                       {provider.profile_image_url ? (
                         <img
                           src={provider.profile_image_url}
                           alt={provider.full_name}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                           <span className="text-5xl font-bold text-green-600/50">{provider.full_name.charAt(0)}</span>
                         </div>
                       )}
                       <div className="absolute top-4 right-4">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                           {provider.user_type === 'daktari' ? 'Daktari' :
                            provider.user_type === 'duka' ? 'Duka' : 'Muuzaji'}
                         </span>
                       </div>
                     </div>
                     <div className="p-6">
                       <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.full_name}</h3>
                       <div className="flex items-center text-gray-500 mb-4">
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         {provider.location}
                       </div>
                       <p className="text-gray-600 mb-4 line-clamp-2">{provider.description}</p>
                       <button 
                         onClick={() => window.location.href = `tel:${provider.phone}`}
                         className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
                       >
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                         </svg>
                         Wasiliana
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </section>

              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-center mb-2">Makala Muhimu</h2>
                <p className="text-gray-600 text-center mb-8">
                  Soma makala zetu mpya kuhusus ufugaji bora, afya ya mifugo na ushauri kutoka kwa wataalamu wetu
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} id={post.id} />
                  ))}
                </div>
                <Link to="/blog" className="text-center mt-8 block">
                  <button className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-colors duration-300">
                    Soma Makala Zaidi
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </section>
            </main>
          </>
        } />
      </Routes>
      {!isDashboard && !isAdmin && <Footer />}
    </div>
  );
}

function App() {
  const [providers, setProviders] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const fetchNewProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('user_type', ['daktari', 'duka', 'wauzaji'])
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setProviders(data || []);
      } catch (error) {
        console.error('Error fetching new providers:', error);
      }
    };

    Promise.all([
      fetchNewProviders(),
      fetchLatestPosts()
    ]).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent providers={providers} posts={posts} />
      </AuthProvider>
    </Router>
  );
}

export default App;