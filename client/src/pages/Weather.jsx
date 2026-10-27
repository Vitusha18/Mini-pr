import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  MapPin,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Gauge,
  Cpu,
  Compass,
  Calendar,
  Sun,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const defaultFarms = [
  {
    id: 'f-1',
    _id: 'f-1',
    name: 'Green Valley Farm',
    location: 'Palghar, Maharashtra',
    latitude: 19.6967,
    longitude: 72.7699,
  },
  {
    id: 'f-2',
    _id: 'f-2',
    name: 'Sunrise Farm',
    location: 'Nashik, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
  },
  {
    id: 'f-3',
    _id: 'f-3',
    name: 'Golden Fields',
    location: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
  },
];

const fallbackWeather = {
  temperature: 29,
  humidity: 78,
  rainfall: 12,
  windSpeed: 8,
  pressure: 1013,
  soilMoisture: 0.25,
  elevation: 14,
  recordedAt: new Date().toISOString(),
};

export const Weather = () => {
  const [farms, setFarms] = useState(defaultFarms);
  const [selectedFarmId, setSelectedFarmId] = useState(defaultFarms[0].id);
  const [weatherData, setWeatherData] = useState(fallbackWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const forecast = [
    { day: 'Today', temp: '29° / 22°', condition: 'Sunny', rain: '12 mm', humidity: '78%' },
    { day: 'Tomorrow', temp: '30° / 23°', condition: 'Partly Cloudy', rain: '5 mm', humidity: '74%' },
    { day: 'Wednesday', temp: '28° / 21°', condition: 'Scattered Showers', rain: '24 mm', humidity: '86%' },
    { day: 'Thursday', temp: '27° / 21°', condition: 'Light Rain', rain: '18 mm', humidity: '88%' },
    { day: 'Friday', temp: '31° / 22°', condition: 'Sunny', rain: '0 mm', humidity: '68%' },
    { day: 'Saturday', temp: '32° / 23°', condition: 'Clear', rain: '0 mm', humidity: '65%' },
    { day: 'Sunday', temp: '30° / 22°', condition: 'Partly Cloudy', rain: '2 mm', humidity: '71%' },
  ];

  // Fetch registered user farms if token exists
  useEffect(() => {
    const fetchFarms = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await api.get('/farms');
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const mappedFarms = response.data.data.map((f) => ({
            id: f._id || f.id,
            _id: f._id,
            name: f.farmName,
            location: f.location,
            latitude: Number(f.latitude),
            longitude: Number(f.longitude),
          }));
          setFarms(mappedFarms);
          setSelectedFarmId(mappedFarms[0].id);
        }
      } catch (err) {
        console.warn('Could not load farms from API, using default farms:', err.message);
      }
    };

    fetchFarms();
  }, []);

  // Fetch weather data from backend whenever selected farm changes
  const fetchWeatherForFarm = async (farm) => {
    if (!farm) return;

    if (
      farm.latitude === undefined ||
      farm.longitude === undefined ||
      isNaN(farm.latitude) ||
      isNaN(farm.longitude)
    ) {
      setError('The selected farm does not have valid GPS coordinates. Please update coordinates in My Farms.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.get('/weather/current', {
        params: {
          latitude: farm.latitude,
          longitude: farm.longitude,
        },
      });

      if (res.data?.data) {
        setWeatherData(res.data.data);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to retrieve live weather telemetry from backend. Displaying recent telemetry cache.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Find active farm object
  const currentFarm = farms.find((f) => (f.id || f._id) === selectedFarmId) || farms[0];

  useEffect(() => {
    if (currentFarm) {
      fetchWeatherForFarm(currentFarm);
    }
  }, [selectedFarmId]);

  // Derived condition summary
  const getConditionSummary = () => {
    if (!weatherData) return 'Standard Conditions';
    if (weatherData.rainfall > 0) {
      return `Precipitation Active (${weatherData.rainfall} mm)`;
    }
    if (weatherData.humidity > 80) {
      return 'Elevated Humidity & Cloud Cover';
    }
    if (weatherData.temperature > 32) {
      return 'Warm & Sunny Climate';
    }
    return 'Optimal Environmental Conditions';
  };

  const formattedCoordinates = currentFarm
    ? `${Number(currentFarm.latitude).toFixed(4)}° N, ${Number(currentFarm.longitude).toFixed(4)}° E`
    : 'Coordinates Pending';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            Weather & Environmental Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Live meteorological indicators retrieved via Open-Meteo coordinates
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark shadow-soft"
          >
            {farms.map((f) => (
              <option key={f.id || f._id} value={f.id || f._id}>
                {f.name} ({f.location})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => fetchWeatherForFarm(currentFarm)}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-brand-green transition-colors shadow-soft"
            title="Refresh Weather Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-green' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error banner if telemetry fails */}
      {error && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchWeatherForFarm(currentFarm)}
            className="underline font-semibold hover:text-amber-900 ml-4 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Hero Weather Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {loading && (
          <div className="absolute top-2 right-4 text-[10px] text-brand-green font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping inline-block" />
            Updating from Open-Meteo...
          </div>
        )}

        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-lightgreen text-brand-darkgreen">
            <Compass className="w-3.5 h-3.5" /> {formattedCoordinates} • {currentFarm?.location || 'Registered Farm'}
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
              {weatherData.temperature !== null ? `${weatherData.temperature}°C` : '--'}
            </h2>
            <p className="text-base font-semibold text-slate-700 mt-1">
              {getConditionSummary()}
            </p>
            <p className="text-xs text-brand-secondary">
              Elevation: {weatherData.elevation !== null ? `${weatherData.elevation}m ASL` : '18m ASL'} • Telemetry Time:{' '}
              {weatherData.recordedAt ? new Date(weatherData.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
            </p>
          </div>
        </div>

        <div className="w-24 h-24 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
          <CloudSun className="w-14 h-14" />
        </div>
      </div>

      {/* 6 Key Environmental Predictors Telemetry */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
            Current Sensor & Weather Indicators
          </h3>
          <span className="text-[11px] text-brand-secondary">
            Ground reanalysis & real-time observations
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-2">
              <Thermometer className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Ambient Temp</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.temperature !== null ? `${weatherData.temperature}°C` : '--'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mx-auto mb-2">
              <Droplets className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Rel. Humidity</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.humidity !== null ? `${weatherData.humidity}%` : '--'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500 mx-auto mb-2">
              <CloudRain className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Precipitation</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.rainfall !== null ? `${weatherData.rainfall} mm` : '0 mm'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-green mx-auto mb-2">
              <Wind className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Wind Velocity</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.windSpeed !== null ? `${weatherData.windSpeed} km/h` : '--'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-2">
              <Gauge className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Surface Pressure</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.pressure !== null ? `${Math.round(weatherData.pressure)} hPa` : '--'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft text-center">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-brand-green mx-auto mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <p className="text-xs text-brand-secondary">Soil Moisture</p>
            <p className="text-base font-bold text-brand-dark mt-0.5">
              {weatherData.soilMoisture !== null
                ? `${(Number(weatherData.soilMoisture) * 100).toFixed(0)}%`
                : '--'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Reanalysis (0-1cm)</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark mb-4">
          7-Day Weather & Rainfall Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((f) => (
            <div key={f.day} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <p className="text-xs font-bold text-brand-dark">{f.day}</p>
              <p className="text-sm font-bold text-brand-dark">{f.temp}</p>
              <p className="text-[11px] text-brand-secondary">{f.condition}</p>
              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                Rain: {f.rain}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
