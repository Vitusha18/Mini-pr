import React, { useState, useEffect } from 'react';
import {
  Tractor,
  MapPin,
  Plus,
  Compass,
  Layers,
  Droplets,
  Calendar,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  Check
} from 'lucide-react';
import Button from '../components/common/Button';
import FarmMapPicker from '../components/farms/FarmMapPicker';
import api from '../services/api';

const defaultFarms = [
  {
    id: 'f-1',
    _id: 'f-1',
    farmName: 'Green Valley Farm',
    location: 'Palghar, Maharashtra',
    latitude: 19.6967,
    longitude: 72.7699,
    crop: 'Rice',
    farmArea: 12,
    areaUnit: 'Acre',
    soilType: 'Loamy Soil',
    irrigationType: 'Drip & Canal',
    status: 'Active',
  },
  {
    id: 'f-2',
    _id: 'f-2',
    farmName: 'Sunrise Farm',
    location: 'Nashik, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    crop: 'Wheat',
    farmArea: 8.5,
    areaUnit: 'Acre',
    soilType: 'Black Soil',
    irrigationType: 'Sprinkler',
    status: 'Active',
  },
  {
    id: 'f-3',
    _id: 'f-3',
    farmName: 'Golden Fields',
    location: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    crop: 'Cotton',
    farmArea: 15,
    areaUnit: 'Acre',
    soilType: 'Clay Loam',
    irrigationType: 'Rainfed & Drip',
    status: 'Active',
  },
];

const emptyFarmForm = {
  farmName: '',
  location: '',
  latitude: 19.6967,
  longitude: 72.7699,
  crop: 'Rice',
  farmArea: 5,
  areaUnit: 'Acre',
  soilType: 'Loamy Soil',
  irrigationType: 'Drip System',
};

export const Farms = () => {
  const [farms, setFarms] = useState(defaultFarms);
  const [showModal, setShowModal] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [formData, setFormData] = useState(emptyFarmForm);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Fetch farms from backend on mount if token is present
  useEffect(() => {
    const fetchFarms = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await api.get('/farms');
        if (response.data && Array.isArray(response.data.data)) {
          const mapped = response.data.data.map((f) => ({
            id: f._id || f.id,
            _id: f._id,
            farmName: f.farmName,
            location: f.location,
            latitude: f.latitude,
            longitude: f.longitude,
            crop: f.crop || 'Rice',
            farmArea: f.farmArea,
            areaUnit: f.areaUnit || 'Acre',
            soilType: f.soilType || 'Loamy Soil',
            irrigationType: f.irrigationType || 'Drip System',
            status: 'Active',
          }));
          setFarms(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch farms from backend, using current state:', err.message);
      }
    };

    fetchFarms();
  }, []);

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Are you sure you want to delete this farm? Associated records will be affected.')) return;
    try {
      await api.delete(`/farms/${farmId}`);
      setFarms((prev) => prev.filter((f) => (f._id || f.id) !== farmId));
    } catch (err) {
      console.error('Error deleting farm:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete farm');
    }
  };

  // Open modal for new farm
  const handleOpenAdd = () => {
    setEditingFarmId(null);
    setFormData(emptyFarmForm);
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Open modal for editing an existing farm
  const handleOpenEdit = (farm) => {
    setEditingFarmId(farm.id || farm._id);
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      latitude: Number(farm.latitude) || 19.6967,
      longitude: Number(farm.longitude) || 72.7699,
      crop: farm.crop || 'Rice',
      farmArea: farm.farmArea || 5,
      areaUnit: farm.areaUnit || 'Acre',
      soilType: farm.soilType || 'Loamy Soil',
      irrigationType: farm.irrigationType || 'Drip System',
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Handle location update from FarmMapPicker
  const handleCoordinatesChange = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  // Submit Add or Edit Farm
  const handleSubmitFarm = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.farmName.trim() || !formData.location.trim()) {
      setFormError('Please provide both farm name and location');
      return;
    }

    if (formData.latitude === undefined || formData.longitude === undefined) {
      setFormError('Please select coordinates on the map');
      return;
    }

    if (Number(formData.farmArea) <= 0) {
      setFormError('Farm area must be greater than 0');
      return;
    }

    setLoading(true);

    const payload = {
      farmName: formData.farmName.trim(),
      location: formData.location.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      farmArea: Number(formData.farmArea),
      areaUnit: formData.areaUnit,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
    };

    try {
      const token = localStorage.getItem('token');

      if (editingFarmId) {
        // Edit flow
        let updatedRecord = null;
        if (token && !editingFarmId.startsWith('f-')) {
          const res = await api.put(`/api/v1/farms/${editingFarmId}`, payload);
          updatedRecord = res.data?.data;
        }

        setFarms((prev) =>
          prev.map((f) => {
            if ((f.id || f._id) === editingFarmId) {
              return {
                ...f,
                ...payload,
                crop: formData.crop,
                id: editingFarmId,
                _id: updatedRecord?._id || f._id,
              };
            }
            return f;
          })
        );
        setFormSuccess('Farm updated successfully!');
      } else {
        // Add flow
        let newRecord = null;
        if (token) {
          try {
            const res = await api.post('/api/v1/farms', payload);
            newRecord = res.data?.data;
          } catch (apiErr) {
            console.warn('Backend API save skipped/failed, keeping local entry:', apiErr.message);
          }
        }

        const added = {
          id: newRecord?._id || `f-${Date.now()}`,
          _id: newRecord?._id,
          ...payload,
          crop: formData.crop,
          status: 'Active',
        };

        setFarms((prev) => [added, ...prev]);
        setFormSuccess('Farm added successfully!');
      }

      setTimeout(() => {
        setShowModal(false);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error saving farm:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save farm');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            My Farms
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Manage your registered agricultural land holdings, GPS geo-coordinates, and boundary details
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          iconPosition="left"
          onClick={handleOpenAdd}
        >
          Add Farm
        </Button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const farmId = farm.id || farm._id;
          const latText = typeof farm.latitude === 'number' ? farm.latitude.toFixed(4) : farm.latitude;
          const lonText = typeof farm.longitude === 'number' ? farm.longitude.toFixed(4) : farm.longitude;

          return (
            <div
              key={farmId}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-brand-green">
                      <Tractor className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-dark leading-tight">
                        {farm.farmName}
                      </h3>
                      <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-green" />
                        {farm.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-lightgreen text-brand-darkgreen">
                      {farm.status || 'Active'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(farm)}
                      className="p-1.5 text-slate-400 hover:text-brand-green rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Farm Location & Details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFarm(farm._id || farm.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Farm Details */}
                <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Compass className="w-3.5 h-3.5 text-slate-400" /> Coordinates
                    </span>
                    <span className="font-mono font-medium text-brand-dark">
                      {latText}° N, {lonText}° E
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Area & Soil
                    </span>
                    <span className="font-medium text-brand-dark">
                      {farm.farmArea} {farm.areaUnit || 'Acre'} • {farm.soilType || 'Loamy'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Droplets className="w-3.5 h-3.5 text-slate-400" /> Irrigation
                    </span>
                    <span className="font-medium text-brand-dark">
                      {farm.irrigationType || 'Drip'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Crop Tag & Telemetry Ready */}
              <div className="mt-5 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                  Primary: {farm.crop || 'Rice'}
                </span>
                <span className="text-[11px] text-brand-green font-medium">
                  Open-Meteo Linked
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Farm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 my-8">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-brand-dark rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-brand-dark mb-1">
              {editingFarmId ? 'Edit Farm Location & Details' : 'Add New Farm'}
            </h3>
            <p className="text-xs text-brand-secondary mb-5">
              Select your farm position on the interactive map for accurate Open-Meteo weather telemetry
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Farm Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riverside Acreage"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Location / District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palghar, Maharashtra"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                />
              </div>

              {/* Interactive Farm Map Picker */}
              <div className="pt-1">
                <FarmMapPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={handleCoordinatesChange}
                  defaultCenter={[formData.latitude || 19.6967, formData.longitude || 72.7699]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Total Farm Area</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 10"
                    value={formData.farmArea}
                    onChange={(e) => setFormData({ ...formData, farmArea: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Area Unit</label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm bg-white"
                  >
                    <option value="Acre">Acre</option>
                    <option value="Hectare">Hectare</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm bg-white"
                  >
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Irrigation System</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm bg-white"
                  >
                    <option value="Drip System">Drip System</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Drip & Canal">Drip & Canal</option>
                    <option value="Flood Irrigation">Flood Irrigation</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingFarmId ? 'Update Farm' : 'Save Farm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;
