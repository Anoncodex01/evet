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
  LocationList,
  ServiceLanding
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
import Home from './components/Home';
import ServiceRegistration from './components/ServiceRegistration';
import ServiceRegistrationNav from './components/ServiceRegistrationNav';

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
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<ServiceRegistrationNav />} />
        <Route path="/register/:userType" element={<ServiceRegistration />} />
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
        <Route path="/services/:type/landing" element={<ServiceLanding />} />
        <Route path="/services/:type" element={<ServiceList />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="blog" element={<BlogPost />} />
          <Route path="blog/list" element={<BlogList />} />
        </Route>
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