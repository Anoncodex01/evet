import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import LocationsSlider from './LocationsSlider';
import { BlogCard } from './';

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
    description: 'Pata ushauri wa kitaalam na huduma za matibabu kutoka kwa madaktari wetu bingwa wa mifugo.',
    type: 'daktari'
  },
  { 
    title: 'Duka La Bidhaa na Huduma Za Mifugo',
    description: 'Bidhaa bora za mifugo, dawa, chakula na vifaa muhimu kwa bei nafuu.',
    type: 'duka'
  },
  { 
    title: 'Wauzaji Mifugo',
    description: 'Pata mifugo bora kutoka kwa wafugaji waaminifu. Ng\'ombe, Mbuzi, Kondoo na aina zote za mifugo kwa bei nzuri.',
    type: 'wauzaji'
  }
];

function ServiceCard({ title, description, type }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={`/services/${type}`}
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          Tazama Zaidi
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function Home() {
  return (
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
          <h2 className="text-3xl font-semibold text-center mb-2">Makala Muhimu</h2>
          <p className="text-gray-600 text-center mb-8">
            Soma makala zetu mpya kuhusus ufugaji bora, afya ya mifugo na ushauri kutoka kwa wataalamu wetu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <BlogCard key={id} id={id} />
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
  );
}

export default Home; 