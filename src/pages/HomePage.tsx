import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import CategoryGrid from '../components/Home/CategoryGrid';
const HomePage = () => {
  return <div className="w-full">
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
    </div>;
};
export default HomePage;