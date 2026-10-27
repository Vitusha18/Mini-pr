import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  CloudSun,
  Tractor,
  Wheat,
  Thermometer,
  Droplets,
  Wind,
  Gauge
} from 'lucide-react';
import api from '../services/api';

export const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/predictions');
        if (response.data && Array.isArray(response.data.data)) {
          setRecords(response.data.data);
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.error('Failed to fetch prediction history:', err);
        setError(err.response?.data?.message || 'Failed to load prediction history from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filtered = records.filter((rec) => {
    const risk = rec.riskLevel || 'Low';
    const matchRisk = filterRisk === 'All' || risk.toLowerCase() === filterRisk.toLowerCase();
    
    const cropName = rec.crop?.cropName || '';
    const pestName = rec.prediction || '';
    const farmName = rec.farm?.farmName || '';

    const matchSearch =
      cropName.toLowerCase().includes(search.toLowerCase()) ||
      pestName.toLowerCase().includes(search.toLowerCase()) ||
      farmName.toLowerCase().includes(search.toLowerCase());

    return matchRisk && matchSearch;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Moderate':
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const formatConfidence = (conf) => {
    if (conf === null || conf === undefined) return 'N/A';
    if (conf > 1) return `${Math.round(conf)}%`;
    return `${Math.round(conf * 100)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
          Prediction History
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Historical log of authenticated environmental risk assessments and pest advisories
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop, pest, or farm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-brand-secondary">Risk:</span>
          {['All', 'High', 'Moderate', 'Low'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterRisk === r
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-secondary flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            <span>Loading authenticated prediction history...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HistoryIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-brand-dark">No Prediction Records Found</h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              {search || filterRisk !== 'All'
                ? 'No predictions match your current search and filter criteria.'
                : 'You have not executed any pest outbreak predictions yet. Run an analysis from the Predictions page.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">Crop & Farm</th>
                  <th className="py-4 px-6">Possible Pest</th>
                  <th className="py-4 px-6">Risk Level</th>
                  <th className="py-4 px-6">Confidence</th>
                  <th className="py-4 px-6">Indicators Used</th>
                  <th className="py-4 px-6">Prediction Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const cropName = item.crop?.cropName || 'Crop';
                  const farmName = item.farm?.farmName || 'Farm';
                  const pestName = item.prediction || 'Pest Analysis';
                  const risk = item.riskLevel || 'Low';
                  const weather = item.weatherSnapshot || {};
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Recent';

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-brand-dark text-sm">{cropName}</div>
                        <div className="text-brand-secondary text-[11px]">{farmName}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {pestName}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadge(risk)}`}>
                          {risk} Risk
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-dark">
                        {formatConfidence(item.confidence)}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {weather.temperature !== undefined && weather.temperature !== null ? `${weather.temperature}°C` : '--'} •{' '}
                        {weather.humidity !== undefined && weather.humidity !== null ? `${weather.humidity}% Hum.` : '--'}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {dateStr}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-brand-green hover:bg-brand-lightgreen rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">
                  {selectedRecord.prediction || 'Pest Warning Details'}
                </h3>
                <p className="text-xs text-brand-secondary">
                  Target: {selectedRecord.crop?.cropName || 'Crop'} • Farm: {selectedRecord.farm?.farmName || 'Farm'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-brand-dark rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Risk Classification</span>
                <span className={`inline-flex items-center mt-1 px-3 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(selectedRecord.riskLevel)}`}>
                  {selectedRecord.riskLevel || 'Low'} Risk Outbreak
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Confidence</span>
                <span className="text-lg font-extrabold text-brand-dark">
                  {formatConfidence(selectedRecord.confidence)}
                </span>
              </div>
            </div>

            {selectedRecord.weatherSnapshot && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Environmental Indicators Snapshot
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 text-center">
                    <span className="text-[10px] text-slate-500 block">Temperature</span>
                    <span className="font-bold text-slate-800">{selectedRecord.weatherSnapshot.temperature}°C</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-center">
                    <span className="text-[10px] text-slate-500 block">Humidity</span>
                    <span className="font-bold text-slate-800">{selectedRecord.weatherSnapshot.humidity}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-center">
                    <span className="text-[10px] text-slate-500 block">Rainfall</span>
                    <span className="font-bold text-slate-800">{selectedRecord.weatherSnapshot.rainfall || 0} mm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-center">
                    <span className="text-[10px] text-slate-500 block">Wind Velocity</span>
                    <span className="font-bold text-slate-800">{selectedRecord.weatherSnapshot.windSpeed || 0} km/h</span>
                  </div>
                </div>
              </div>
            )}

            {selectedRecord.recommendation && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-brand-darkgreen block">Agronomic Recommendation:</span>
                <p>{selectedRecord.recommendation}</p>
              </div>
            )}

            <div className="text-[11px] text-slate-400 text-right">
              Recorded: {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
