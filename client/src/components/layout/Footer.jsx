import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-brand-dark block leading-tight">
                  PestGuard AI
                </span>
                <span className="text-xs font-medium text-brand-secondary">
                  Early Pest Warning System
                </span>
              </div>
            </div>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Empowering farmers with early pest outbreak warnings through predictive environmental indicators and real-time agricultural intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-green font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Dedicated to Sustainable Crop Protection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-brand-secondary">
              <li><a href="#home" className="hover:text-brand-green transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-brand-green transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-green transition-colors">How It Works</a></li>
              <li><a href="#prediction" className="hover:text-brand-green transition-colors">Prediction Architecture</a></li>
              <li><a href="#about" className="hover:text-brand-green transition-colors">About the Project</a></li>
            </ul>
          </div>

          {/* Environmental Indicators */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Key Indicators
            </h4>
            <ul className="space-y-2 text-xs text-brand-secondary">
              <li>• Ambient Temperature & Diurnal Variance</li>
              <li>• Relative Humidity & Dew Point</li>
              <li>• Precipitation & Canopy Wetness</li>
              <li>• Wind Speed & Gust Velocity</li>
              <li>• Atmospheric Surface Pressure</li>
              <li>• Soil Moisture & Root Zone Temp</li>
            </ul>
          </div>

          {/* Platform Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Farmer Access
            </h4>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Sign in to manage your farms, monitor live weather, and receive timely outbreak risk alerts.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login" className="text-xs font-medium text-brand-green hover:underline">
                Farmer Login →
              </Link>
              <Link to="/register" className="text-xs font-medium text-brand-green hover:underline">
                Create Free Account →
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PestGuard AI. Early Pest Warning System. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">Academic & Research Initiative for Precision Agriculture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
