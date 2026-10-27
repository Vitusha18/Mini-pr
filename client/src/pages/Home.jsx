import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import Footer from '../components/layout/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
