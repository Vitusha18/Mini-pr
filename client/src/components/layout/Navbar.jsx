import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', href: isHomePage ? '#home' : '/#home' },
    { name: 'Features', href: isHomePage ? '#features' : '/#features' },
    { name: 'How It Works', href: isHomePage ? '#how-it-works' : '/#how-it-works' },
    { name: 'Prediction', href: isHomePage ? '#prediction' : '/#prediction' },
    { name: 'About', href: isHomePage ? '#about' : '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-brand-border/60 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-brand-dark leading-tight">
                PestGuard AI
              </span>
              <span className="text-xs font-medium text-brand-secondary tracking-wide">
                Early Pest Warning System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-brand-green transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-dark hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="secondary" size="md" className="w-full justify-center">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full justify-center" icon={ArrowRight}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
