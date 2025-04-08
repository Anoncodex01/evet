import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import LocationCard from './LocationCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LocationsSlider({ locations }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={24}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          // Mobile first - single slide
          320: {
            slidesPerView: 1,
            spaceBetween: 16
          },
          // Tablet - 2 slides
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          // Desktop - 4 slides
          1024: {
            slidesPerView: 4,
            spaceBetween: 24
          }
        }}
        className="locations-slider py-8"
      >
        {locations.map((location) => (
          <SwiperSlide key={location.name}>
            <LocationCard {...location} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
