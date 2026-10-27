import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sliders,
  Shield,
  Save,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';

export const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ramesh Patil',
    email: 'ramesh.patil@example.com',
    phone: '+91 98765 43210',
    region: 'Maharashtra (Western Agro-Climatic Zone)',
  });

  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    dailyWeatherSummary: true,
    rainWarnings: true,
    weeklyReport: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Manage your farmer account preferences, notification channels, and farm telemetry
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-green" />
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-brand-green" />
            <h3 className="text-base font-bold text-brand-dark">
              Farmer Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-dark mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-dark mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-dark mb-1">Mobile Number (SMS Alerts)</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-dark mb-1">Agro-Climatic Region</label>
              <input
                type="text"
                value={profile.region}
                onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-brand-green" />
            <h3 className="text-base font-bold text-brand-dark">
              Alert Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-semibold text-brand-dark">High Pest Risk Outbreak Warnings</p>
                <p className="text-brand-secondary">Receive urgent alerts when environmental thresholds indicate pest surge</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.highRiskAlerts}
                onChange={(e) => setNotifications({ ...notifications, highRiskAlerts: e.target.checked })}
                className="w-4 h-4 text-brand-green border-slate-300 rounded focus:ring-brand-green"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-semibold text-brand-dark">Precipitation & Rain Warnings</p>
                <p className="text-brand-secondary">Get advance notification when rain probability exceeds 70%</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.rainWarnings}
                onChange={(e) => setNotifications({ ...notifications, rainWarnings: e.target.checked })}
                className="w-4 h-4 text-brand-green border-slate-300 rounded focus:ring-brand-green"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-semibold text-brand-dark">Daily Weather Summary</p>
                <p className="text-brand-secondary">Daily morning overview of Open-Meteo readings for your farms</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailyWeatherSummary}
                onChange={(e) => setNotifications({ ...notifications, dailyWeatherSummary: e.target.checked })}
                className="w-4 h-4 text-brand-green border-slate-300 rounded focus:ring-brand-green"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={Save} iconPosition="left">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
