import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CloudSun,
  ShieldCheck,
  CheckCheck,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Button from '../components/common/Button';

const initialNotifications = [
  {
    id: 'n-1',
    title: 'High Risk Pest Alert: Yellow Stem Borer',
    message: 'Environmental humidity exceeding 78% in Palghar indicates heightened larval activity for Rice. Immediate field monitoring recommended.',
    type: 'warning',
    farm: 'Green Valley Farm',
    crop: 'Rice',
    date: '10 minutes ago',
    unread: true,
  },
  {
    id: 'n-2',
    title: 'Heavy Rainfall Warning Expected Wednesday',
    message: 'Open-Meteo forecasts 24 mm precipitation. Ensure proper drainage in low-lying plots to avoid waterlogging and root rot.',
    type: 'weather',
    farm: 'Green Valley Farm',
    crop: 'Rice & Tomato',
    date: '2 hours ago',
    unread: true,
  },
  {
    id: 'n-3',
    title: 'Moderate Alert: Pink Bollworm Scouting',
    message: 'Temperature spikes above 30°C in Nashik warrant deployment of pheromone traps on Cotton squares.',
    type: 'warning',
    farm: 'Golden Fields',
    crop: 'Cotton',
    date: 'Yesterday',
    unread: false,
  },
  {
    id: 'n-4',
    title: 'System Telemetry Synchronization Complete',
    message: 'All 3 farms successfully synchronized with Open-Meteo weather data points.',
    type: 'system',
    farm: 'All Farms',
    crop: 'All Crops',
    date: '2 days ago',
    unread: false,
  },
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'weather':
        return <CloudSun className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-brand-green" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Real-time pest risk alerts, weather advisories, and farm notifications
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={CheckCheck}
          iconPosition="left"
          onClick={markAllAsRead}
        >
          Mark All Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-5 shadow-soft transition-all flex items-start gap-4 ${
              item.unread
                ? 'border-brand-green/30 bg-emerald-50/20'
                : 'border-slate-200/80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              {getTypeIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-brand-dark truncate">
                  {item.title}
                </h3>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  {item.date}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.message}
              </p>
              <div className="pt-2 flex items-center gap-3 text-[11px] text-brand-secondary font-medium">
                <span>Farm: <strong className="text-brand-dark">{item.farm}</strong></span>
                <span>•</span>
                <span>Crop: <strong className="text-brand-dark">{item.crop}</strong></span>
              </div>
            </div>

            {item.unread && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green flex-shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
