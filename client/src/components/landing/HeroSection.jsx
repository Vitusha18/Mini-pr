import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  PlayCircle,
  BrainCircuit,
  ShieldCheck,
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Bug,
  MapPin,
  AlertTriangle,
  X
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const HeroSection = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Hero Badge */}
            <div className="inline-flex">
              <Badge variant="success" size="lg" icon={BrainCircuit} dot>
                AI Powered Early Pest Warning
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-brand-dark tracking-tight leading-[1.15]">
              Predict Pest<br />
              Outbreaks<br />
              Before<br />
              <span className="text-brand-green">They Damage Crops</span>
            </h1>

            {/* Hero Description */}
            <p className="text-base sm:text-lg text-brand-secondary leading-relaxed max-w-xl">
              Receive AI-powered early pest warnings using environmental indicators including temperature, humidity, rainfall, wind speed and other real-time weather conditions before outbreaks affect your crops.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg" 
                icon={PlayCircle} 
                iconPosition="left"
                onClick={() => setShowDemoModal(true)}
              >
                Watch Demo
              </Button>
            </div>

            {/* Indicator Highlights */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-brand-green">
                  <CloudSun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-dark">Live Weather</p>
                  <p className="text-[11px] text-brand-secondary">Open-Meteo API</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-brand-green">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-dark">Pest Forecast</p>
                  <p className="text-[11px] text-brand-secondary">Risk Analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-brand-green">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-dark">Prevention</p>
                  <p className="text-[11px] text-brand-secondary">Timely Advice</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual with Mockup Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* Visual Container */}
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-card border border-brand-border/80">
              <img 
                src="/hero-farm.svg" 
                alt="Agricultural field with environmental monitoring sensors"
                className="w-full h-full object-cover"
              />
              
              {/* Subtle gradient vignette to blend edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

              {/* FLOATING CARD 1: CURRENT WEATHER CARD (Visual Mockup) */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-card border border-brand-border max-w-[210px] sm:max-w-[240px]"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                    Current Weather
                  </span>
                  <span className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Mockup
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-dark tracking-tight">
                    28°C
                  </span>
                  <CloudSun className="w-5 h-5 text-amber-500" />
                </div>

                <div className="flex items-center gap-1 text-xs text-brand-secondary mt-0.5 mb-3">
                  <MapPin className="w-3 h-3 text-brand-green" />
                  <span>Pune, Maharashtra</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Droplets className="w-3 h-3 text-sky-500" /> Humidity
                    </span>
                    <span className="font-semibold text-brand-dark">84%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Wind className="w-3 h-3 text-slate-500" /> Wind
                    </span>
                    <span className="font-semibold text-brand-dark">8 km/h</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <CloudRain className="w-3 h-3 text-blue-500" /> Rainfall
                    </span>
                    <span className="font-semibold text-brand-dark">12 mm</span>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: PREDICTION CARD (Visual Mockup) */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-card border border-brand-border max-w-[240px] sm:max-w-[270px]"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="danger" size="sm" icon={AlertTriangle}>
                    High Risk
                  </Badge>
                  <span className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Design Mockup
                  </span>
                </div>

                <div className="mt-1">
                  <h3 className="text-base font-bold text-brand-dark flex items-center gap-1.5">
                    Pink Bollworm
                  </h3>
                  <p className="text-[11px] text-brand-secondary">
                    AI Prediction Result
                  </p>
                </div>

                <div className="mt-2.5 p-2 rounded-lg bg-red-50/70 border border-red-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-700 font-medium">Confidence (Mockup)</span>
                    <span className="text-red-800 font-bold">92%</span>
                  </div>
                  <div className="w-full bg-red-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="mt-2.5 text-[11px] text-slate-600 leading-snug">
                  <span className="font-semibold text-brand-dark block text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                    Recommendation
                  </span>
                  Deploy pheromone traps and apply organic neem spray before canopy closure.
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-brand-border">
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-brand-dark rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-lightgreen flex items-center justify-center text-brand-green">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark">PestGuard AI Walkthrough</h3>
                <p className="text-xs text-brand-secondary">Early Warning System Workflow</p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-600 py-2">
              <p>
                <strong>PestGuard AI</strong> is architected to predict agricultural pest outbreaks before physical damage occurs.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-brand-dark">The 6-Step Workflow:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Farmer registers & adds farm with geo-coordinates.</li>
                  <li>Crops are configured (variety, sowing date, stage).</li>
                  <li>Real-time weather data is fetched via Open-Meteo.</li>
                  <li>Environmental indicators are processed.</li>
                  <li>Pest risk and pest species likelihood are evaluated.</li>
                  <li>Timely preventive recommendations are issued.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="md" onClick={() => setShowDemoModal(false)}>
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
