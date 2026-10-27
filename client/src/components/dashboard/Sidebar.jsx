
import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  Wheat,
  BrainCircuit,
  CloudSun,
  Bell,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navMenuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Farms", path: "/farms", icon: Tractor },
  { name: "My Crops", path: "/crops", icon: Wheat },
  { name: "Predictions", path: "/predictions", icon: BrainCircuit },
  { name: "Weather", path: "/weather", icon: CloudSun },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "History", path: "/history", icon: History },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const closeMobile = () => {
    setMobileOpen?.(false);
  };

  const handleLogout = async () => {
    closeMobile();

    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-700">
      {/* BRAND HEADER */}
      <div
        className={`flex h-[90px] shrink-0 items-center border-b border-slate-200 ${
          collapsed && !isMobile
            ? "justify-center px-2"
            : "justify-between px-5"
        }`}
      >
        <Link
          to="/dashboard"
          onClick={closeMobile}
          title={collapsed && !isMobile ? "PestGuard AI" : undefined}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Sprout size={25} />
          </div>

          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <h2 className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-900">
                PestGuard AI
              </h2>
              <p className="whitespace-nowrap text-xs text-slate-500">
                Early Pest Warning
              </p>
            </div>
          )}
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              title={collapsed && !isMobile ? item.name : undefined}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-xl py-3 text-sm font-medium transition-colors ${
                  collapsed && !isMobile
                    ? "justify-center px-2"
                    : "gap-4 px-3"
                } ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.9} className="shrink-0" />

              {(!collapsed || isMobile) && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* USER PROFILE AND LOGOUT */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div
          className={`mb-3 flex min-h-11 items-center rounded-xl bg-slate-50 ${
            collapsed && !isMobile
              ? "justify-center px-1"
              : "gap-3 px-3"
          }`}
          title={
            collapsed && !isMobile
              ? user?.name || user?.email || "Account"
              : undefined
          }
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-700">
            {(user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name || "Farmer"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed && !isMobile ? "Logout" : undefined}
          className={`flex min-h-11 w-full items-center rounded-xl py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${
            collapsed && !isMobile
              ? "justify-center px-2"
              : "gap-4 px-3"
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 ease-in-out md:block ${
          collapsed ? "w-[76px]" : "w-72"
        }`}
      >
        {renderSidebarContent()}

        {/* COLLAPSE ARROW — TOP-RIGHT OF THE SIDEBAR */}
        <button
          type="button"
          onClick={() => setCollapsed((previous) => !previous)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute right-0 top-[45px] z-50 flex h-7 w-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobile}
            className="absolute inset-0 bg-slate-950/50"
          />

          <aside className="relative z-10 h-full w-[min(288px,85vw)] shadow-2xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
