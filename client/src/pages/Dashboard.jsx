import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Wheat,
  AlertTriangle,
  BrainCircuit,
  CloudSun,
  MapPin,
  Droplets,
  CloudRain,
  Wind,
  Gauge,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Cpu,
  RefreshCw,
  Plus
} from 'lucide-react';
import api from '../services/api';

const environmentalPredictors = [
  { label: 'Ambient Temperature', icon: Thermometer, unit: '°C' },
  { label: 'Relative Humidity', icon: Droplets, unit: '%' },
  { label: 'Rainfall & Wetness', icon: CloudSun, unit: 'mm' },
  { label: 'Wind Velocity', icon: Wind, unit: 'km/h' },
  { label: 'Atmospheric Pressure', icon: Gauge, unit: 'hPa' },
  { label: 'Soil Temperature & Moisture', icon: Cpu, unit: '°C / %' },
];

export const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalFarms: 0,
    activeCrops: 0,
    highAlerts: 0,
    totalPredictions: 0,
  });
  const [primaryFarm, setPrimaryFarm] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [farmsRes, cropsRes, predRes] = await Promise.allSettled([
          api.get('/farms'),
          api.get('/crops'),
          api.get('/predictions'),
        ]);

        const farms = farmsRes.status === 'fulfilled' && Array.isArray(farmsRes.value.data?.data)
          ? farmsRes.value.data.data
          : [];
        const crops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value.data?.data)
          ? cropsRes.value.data.data
          : [];
        const predictions = predRes.status === 'fulfilled' && Array.isArray(predRes.value.data?.data)
          ? predRes.value.data.data
          : [];

        const activeCropsCount = crops.filter((c) => c.isActive !== false).length;
        const highAlertsCount = predictions.filter((p) => p.riskLevel === 'High').length;

        setCounts({
          totalFarms: farms.length,
          activeCrops: activeCropsCount,
          highAlerts: highAlertsCount,
          totalPredictions: predictions.length,
        });

        if (predictions.length > 0) {
          setLatestPrediction(predictions[0]);
        }

        if (farms.length > 0) {
          const farm = farms[0];
          setPrimaryFarm(farm);

          if (farm.latitude !== undefined && farm.longitude !== undefined) {
            try {
              const wRes = await api.get('/weather/current', {
                params: {
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                },
              });
              if (wRes.data?.data) {
                setWeatherData(wRes.data.data);
              }
            } catch (wErr) {
              console.warn('Weather fetch warning:', wErr.message);
            }
          }
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Farms',
      value: counts.totalFarms,
      icon: Tractor,
      iconBg: 'bg-green-100',
      iconColor: 'text-brand-green',
    },
    {
      title: 'Active Crops',
      value: counts.activeCrops,
      icon: Wheat,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'High Alerts',
      value: counts.highAlerts,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Predictions',
      value: counts.totalPredictions,
      icon: BrainCircuit,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            Farmer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Real-time agro-climatic telemetry and pest vulnerability overview
          </p>
        </div>
      </div>

      {/* 4 Overview / Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold text-brand-dark mt-1.5">
                  {loading ? '...' : item.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Current Weather & Latest Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CURRENT WEATHER CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
          <div>
            {/* Weather Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">
                  Live Farm Weather
                </h2>
                <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  {primaryFarm
                    ? `${primaryFarm.farmName} (${primaryFarm.location})`
                    : 'No farms registered yet'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <CloudSun className="w-7 h-7" />
              </div>
            </div>

            {/* Main Temperature Display */}
            <div className="my-6 text-center">
              <span className="text-5xl font-extrabold text-brand-dark tracking-tight">
                {weatherData && weatherData.temperature !== null
                  ? `${weatherData.temperature}°C`
                  : '--'}
              </span>
              <p className="text-sm font-medium text-brand-secondary mt-1">
                {weatherData && weatherData.rainfall > 0 ? 'Precipitation Active' : 'Open-Meteo Telemetry Feed'}
              </p>
            </div>
          </div>

          {/* Environmental Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-brand-secondary">Humidity</p>
                <h4 className="text-sm font-bold text-brand-dark">
                  {weatherData?.humidity !== undefined && weatherData?.humidity !== null ? `${weatherData.humidity}%` : '--'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-brand-secondary">Rainfall</p>
                <h4 className="text-sm font-bold text-brand-dark">
                  {weatherData?.rainfall !== undefined && weatherData?.rainfall !== null ? `${weatherData.rainfall} mm` : '0 mm'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-green">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-brand-secondary">Wind Speed</p>
                <h4 className="text-sm font-bold text-brand-dark">
                  {weatherData?.windSpeed !== undefined && weatherData?.windSpeed !== null ? `${weatherData.windSpeed} km/h` : '--'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-brand-secondary">Pressure</p>
                <h4 className="text-sm font-bold text-brand-dark">
                  {weatherData?.pressure !== undefined && weatherData?.pressure !== null ? `${Math.round(weatherData.pressure)} hPa` : '--'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* LATEST PREDICTION CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
          {latestPrediction ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-brand-dark">
                    Latest Prediction
                  </h2>
                  <p className="text-xs text-brand-secondary mt-0.5">
                    Recent Outbreak Advisory
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <ShieldAlert className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div>
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider block">
                    Target Crop & Pest
                  </span>
                  <h3 className="text-2xl font-bold text-brand-dark mt-0.5">
                    {latestPrediction.crop?.cropName || 'Crop'} — {latestPrediction.prediction || 'Pest'}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider block mb-1">
                      Risk Level
                    </span>
                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold border ${
                      latestPrediction.riskLevel === 'High'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : latestPrediction.riskLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {latestPrediction.riskLevel || 'Low'} Risk
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider block mb-1">
                      Recorded Date
                    </span>
                    <span className="text-sm font-bold text-brand-dark">
                      {latestPrediction.createdAt ? new Date(latestPrediction.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                {latestPrediction.recommendation && (
                  <div className="rounded-xl bg-green-50/80 border border-green-200/70 p-4">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {latestPrediction.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="my-auto py-8 text-center space-y-3">
              <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-brand-dark">No Predictions Recorded Yet</h3>
              <p className="text-xs text-brand-secondary max-w-xs mx-auto">
                Generate an early warning by analyzing your crops against live Open-Meteo environmental indicators or classifying an insect photo.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Link
              to="/predictions"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-darkgreen text-white font-medium text-sm transition-colors shadow-sm"
            >
              <span>{latestPrediction ? 'View All Predictions' : 'Run New Prediction'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* KEY ENVIRONMENTAL PREDICTORS UTILIZED */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft">
        <div className="text-center mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
            KEY ENVIRONMENTAL PREDICTORS UTILIZED
          </h2>
          <p className="text-xs text-brand-secondary mt-1">
            Direct telemetry from Open-Meteo processed into pest-habitat viability indicators
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {environmentalPredictors.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-xl p-4 border border-slate-200/70 text-center flex flex-col items-center justify-center shadow-soft hover:border-brand-green/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-brand-green mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-brand-dark leading-tight">
                  {item.label}
                </span>
                <span className="text-xs text-brand-secondary mt-1">
                  ({item.unit})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
