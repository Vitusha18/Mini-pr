import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Plus,
  Calendar,
  Layers,
  Camera,
  Tractor,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import CropImageUploader from '../components/crops/CropImageUploader';
import api from '../services/api';

const defaultCrops = [
  {
    id: 'c-1',
    _id: 'c-1',
    name: 'Rice',
    variety: 'Basmati 370',
    farm: 'Green Valley Farm',
    farmId: 'f-1',
    stage: 'Panicle Initiation',
    sowingDate: '2026-06-15',
    status: 'Monitoring Active',
    riskLevel: 'High Risk',
    cropPhoto: null,
  },
  {
    id: 'c-2',
    _id: 'c-2',
    name: 'Wheat',
    variety: 'HD-2967',
    farm: 'Sunrise Farm',
    farmId: 'f-2',
    stage: 'Tillering',
    sowingDate: '2026-11-10',
    status: 'Healthy',
    riskLevel: 'Low Risk',
    cropPhoto: null,
  },
  {
    id: 'c-3',
    _id: 'c-3',
    name: 'Cotton',
    variety: 'BG-II Hybrid',
    farm: 'Golden Fields',
    farmId: 'f-3',
    stage: 'Square Formation',
    sowingDate: '2026-05-20',
    status: 'Alert Issued',
    riskLevel: 'Moderate',
    cropPhoto: null,
  },
  {
    id: 'c-4',
    _id: 'c-4',
    name: 'Tomato',
    variety: 'Pusa Ruby',
    farm: 'Green Valley Farm',
    farmId: 'f-1',
    stage: 'Flowering & Fruiting',
    sowingDate: '2026-07-05',
    status: 'Healthy',
    riskLevel: 'Low Risk',
    cropPhoto: null,
  },
];

const defaultFarms = [
  { id: 'f-1', _id: 'f-1', name: 'Green Valley Farm' },
  { id: 'f-2', _id: 'f-2', name: 'Sunrise Farm' },
  { id: 'f-3', _id: 'f-3', name: 'Golden Fields' },
];

export const Crops = () => {
  const [crops, setCrops] = useState(defaultCrops);
  const [availableFarms, setAvailableFarms] = useState(defaultFarms);
  const [showModal, setShowModal] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form State
  const [cropForm, setCropForm] = useState({
    name: '',
    variety: '',
    farmId: 'f-1',
    farmName: 'Green Valley Farm',
    stage: 'Vegetative Growth',
    sowingDate: '',
  });

  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [removePhoto, setRemovePhoto] = useState(false);

  // Helper to format full image URL if relative
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Fetch crops and farms from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch farms first to populate dropdown
        const farmRes = await api.get('/farms');
        if (farmRes.data && Array.isArray(farmRes.data.data)) {
          const mappedFarms = farmRes.data.data.map((f) => ({
            id: f._id || f.id,
            _id: f._id,
            name: f.farmName,
          }));
          setAvailableFarms(mappedFarms);
        }

        // Fetch crops
        const cropRes = await api.get('/crops');
        if (cropRes.data && Array.isArray(cropRes.data.data)) {
          const mappedCrops = cropRes.data.data.map((c) => ({
            id: c._id || c.id,
            _id: c._id,
            name: c.cropName,
            variety: c.variety || 'Standard Hybrid',
            farm: c.farm?.farmName || 'Assigned Farm',
            farmId: c.farm?._id || c.farm,
            stage: c.growthStage,
            sowingDate: c.plantingDate ? c.plantingDate.split('T')[0] : '',
            status: c.isActive ? 'Active' : 'Inactive',
            riskLevel: 'Low Risk',
            cropPhoto: c.cropPhoto || null,
          }));
          setCrops(mappedCrops);
        }
      } catch (err) {
        console.warn('Could not fetch data from backend, continuing with local state:', err.message);
      }
    };

    fetchData();
  }, []);

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop entry?')) return;
    try {
      const token = localStorage.getItem('token');
      if (token && !cropId.startsWith('c-')) {
        await api.delete(`/crops/${cropId}`);
      }
      setCrops((prev) => prev.filter((c) => (c._id || c.id) !== cropId));
    } catch (err) {
      console.error('Error deleting crop:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete crop');
    }
  };

  // Open modal for new crop
  const handleOpenAdd = () => {
    setEditingCropId(null);
    setCropForm({
      name: '',
      variety: '',
      farmId: availableFarms[0]?.id || availableFarms[0]?._id || 'f-1',
      farmName: availableFarms[0]?.name || 'Green Valley Farm',
      stage: 'Vegetative Growth',
      sowingDate: new Date().toISOString().split('T')[0],
    });
    setSelectedImageFile(null);
    setExistingImageUrl('');
    setRemovePhoto(false);
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Open modal for editing crop
  const handleOpenEdit = (crop) => {
    setEditingCropId(crop.id || crop._id);
    setCropForm({
      name: crop.name,
      variety: crop.variety || '',
      farmId: crop.farmId || availableFarms[0]?.id || 'f-1',
      farmName: crop.farm,
      stage: crop.stage,
      sowingDate: crop.sowingDate || '',
    });
    setSelectedImageFile(null);
    setExistingImageUrl(crop.cropPhoto || '');
    setRemovePhoto(false);
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Handle form submission with FormData
  const handleSubmitCrop = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!cropForm.name.trim()) {
      setFormError('Please provide a crop name');
      return;
    }

    setLoading(true);

    // Build multipart FormData
    const formData = new FormData();
    formData.append('cropName', cropForm.name.trim());
    formData.append('variety', cropForm.variety ? cropForm.variety.trim() : '');
    formData.append('growthStage', cropForm.stage.trim());
    formData.append('farm', cropForm.farmId);
    if (cropForm.sowingDate) {
      formData.append('plantingDate', cropForm.sowingDate);
    }

    if (selectedImageFile) {
      formData.append('cropPhoto', selectedImageFile);
    } else if (removePhoto) {
      formData.append('cropPhoto', '');
    }

    try {
      const token = localStorage.getItem('token');
      let savedPhotoUrl = existingImageUrl;

      if (token && (!editingCropId || !editingCropId.startsWith('c-')) && cropForm.farmId && !cropForm.farmId.startsWith('f-')) {
        // Authenticated backend flow
        if (editingCropId) {
          const res = await api.put(`/crops/${editingCropId}`, formData);
          savedPhotoUrl = res.data?.data?.cropPhoto || (removePhoto ? null : savedPhotoUrl);
        } else {
          const res = await api.post('/crops', formData);
          savedPhotoUrl = res.data?.data?.cropPhoto || null;
        }
      } else {
        // Demo / fallback flow
        if (selectedImageFile) {
          savedPhotoUrl = URL.createObjectURL(selectedImageFile);
        } else if (removePhoto) {
          savedPhotoUrl = null;
        }
      }

      const selectedFarmObj = availableFarms.find(
        (f) => (f.id || f._id) === cropForm.farmId
      );
      const farmDisplayName = selectedFarmObj ? selectedFarmObj.name : cropForm.farmName;

      if (editingCropId) {
        setCrops((prev) =>
          prev.map((c) => {
            if ((c.id || c._id) === editingCropId) {
              return {
                ...c,
                name: cropForm.name,
                variety: cropForm.variety || 'Standard Hybrid',
                farm: farmDisplayName,
                farmId: cropForm.farmId,
                stage: cropForm.stage,
                sowingDate: cropForm.sowingDate,
                cropPhoto: savedPhotoUrl,
              };
            }
            return c;
          })
        );
        setFormSuccess('Crop updated successfully!');
      } else {
        const added = {
          id: `c-${Date.now()}`,
          _id: `c-${Date.now()}`,
          name: cropForm.name,
          variety: cropForm.variety || 'Standard Hybrid',
          farm: farmDisplayName,
          farmId: cropForm.farmId,
          stage: cropForm.stage,
          sowingDate: cropForm.sowingDate || new Date().toISOString().split('T')[0],
          status: 'Active',
          riskLevel: 'Low Risk',
          cropPhoto: savedPhotoUrl,
        };
        setCrops((prev) => [added, ...prev]);
        setFormSuccess('Crop registered successfully!');
      }

      setTimeout(() => {
        setShowModal(false);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error saving crop:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save crop');
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    if (level === 'High Risk') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (level === 'Moderate') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            My Crops
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Track crop varieties, growth stages, photos, and seasonal sowing timelines
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          iconPosition="left"
          onClick={handleOpenAdd}
        >
          Add Crop
        </Button>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => {
          const cropId = crop.id || crop._id;
          const photoUrl = getFullImageUrl(crop.cropPhoto);

          return (
            <div
              key={cropId}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Crop thumbnail or fallback icon */}
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 overflow-hidden flex-shrink-0 border border-emerald-100/60">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={crop.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Wheat className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-dark leading-tight">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-brand-secondary mt-0.5">
                        {crop.variety}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadge(crop.riskLevel)}`}>
                      {crop.riskLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(crop)}
                      className="p-1.5 text-slate-400 hover:text-brand-green rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Crop & Photo"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCrop(crop._id || crop.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Crop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Tractor className="w-3.5 h-3.5 text-slate-400" /> Associated Farm
                    </span>
                    <span className="font-medium text-brand-dark">{crop.farm}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Growth Stage
                    </span>
                    <span className="font-semibold text-brand-green">{crop.stage}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-brand-secondary">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Sowing Date
                    </span>
                    <span className="font-mono text-brand-dark">{crop.sowingDate}</span>
                  </div>
                </div>
              </div>

              {/* Supporting Photo Indicator & Action */}
              <div className="mt-5 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  Supporting Photo:
                  {photoUrl ? (
                    <span className="font-semibold text-brand-green flex items-center gap-1">
                      <Check className="w-3 h-3" /> Attached
                    </span>
                  ) : (
                    <span className="font-medium text-slate-500">None</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(crop)}
                  className="inline-flex items-center gap-1 text-xs text-brand-green hover:underline font-medium"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {photoUrl ? 'Manage Photo' : 'Attach Photo'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Crop Modal */}
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
              {editingCropId ? 'Edit Crop Details' : 'Register Crop'}
            </h3>
            <p className="text-xs text-brand-secondary mb-5">
              Link a crop and upload an optional specimen photo for AI vision analysis
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

            <form onSubmit={handleSubmitCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Crop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton, Rice, Wheat, Tomato"
                  value={cropForm.name}
                  onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Sharbati, Basmati 370, Pusa Ruby"
                  value={cropForm.variety}
                  onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Associated Farm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cropForm.farmId}
                    onChange={(e) => {
                      const selected = availableFarms.find(
                        (f) => (f.id || f._id) === e.target.value
                      );
                      setCropForm({
                        ...cropForm,
                        farmId: e.target.value,
                        farmName: selected ? selected.name : cropForm.farmName,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm bg-white"
                  >
                    {availableFarms.map((f) => (
                      <option key={f.id || f._id} value={f.id || f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Growth Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cropForm.stage}
                    onChange={(e) => setCropForm({ ...cropForm, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm bg-white"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative Growth">Vegetative Growth</option>
                    <option value="Tillering">Tillering</option>
                    <option value="Panicle Initiation">Panicle Initiation</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Flowering & Fruiting">Flowering & Fruiting</option>
                    <option value="Maturity">Maturity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Sowing Date</label>
                <input
                  type="date"
                  value={cropForm.sowingDate}
                  onChange={(e) => setCropForm({ ...cropForm, sowingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark text-sm"
                />
              </div>

              {/* Crop Image Uploader */}
              <div className="pt-2 border-t border-slate-100">
                <CropImageUploader
                  imageFile={selectedImageFile}
                  existingImageUrl={existingImageUrl}
                  onImageChange={(file) => {
                    setSelectedImageFile(file);
                    setRemovePhoto(false);
                  }}
                  onImageRemove={() => {
                    setSelectedImageFile(null);
                    setExistingImageUrl('');
                    setRemovePhoto(true);
                  }}
                />
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
                  {loading ? 'Saving...' : editingCropId ? 'Update Crop' : 'Save Crop'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crops;
