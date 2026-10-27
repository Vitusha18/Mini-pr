import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Sprout } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Permanent Left Sidebar on Desktop & Responsive Drawer on Mobile */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        
        {/* Mobile Top Navigation Bar */}
        <header className="sticky top-0 z-20 md:hidden bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-soft">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold text-brand-dark block leading-tight">
                PestGuard AI
              </span>
              <span className="text-[10px] font-medium text-brand-secondary">
                Early Pest Warning
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-brand-dark hover:bg-slate-100 focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
