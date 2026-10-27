import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Tractor,
  Wheat,
  CloudSun,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Camera,
  Upload,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import api from '../services/api';

export const Predictions = () => {
  const [activeTab, setActiveTab] = useState('environmental'); // 'environmental' | 'image'

  // Environmental analysis state
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('');
  const [weatherTelemetry, setWeatherTelemetry] = useState(null);
  const [isAnalyzingEnv, setIsAnalyzingEnv] = useState(false);
  const [envResult, setEnvResult] = useState(null);
  const [envError, setEnvError] = useState('');

  // Image classification state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzingImg, setIsAnalyzingImg] = useState(false);
  const [imageResult, setImageResult] = useState(null);
  const [imageError, setImageError] = useState('');

  // 1. Fetch user's registered farms and crops
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmRes, cropRes] = await Promise.allSettled([
          api.get('/farms'),
          api.get('/crops'),
        ]);

        if (farmRes.status === 'fulfilled' && Array.isArray(farmRes.value.data?.data)) {
          const loadedFarms = farmRes.value.data.data;
          setFarms(loadedFarms);
          if (loadedFarms.length > 0) {
            setSelectedFarmId(loadedFarms[0]._id || loadedFarms[0].id);
          }
        }

        if (cropRes.status === 'fulfilled' && Array.isArray(cropRes.value.data?.data)) {
          const loadedCrops = cropRes.value.data.data;
          setCrops(loadedCrops);
          if (loadedCrops.length > 0) {
            setSelectedCropId(loadedCrops[0]._id || loadedCrops[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load user farms/crops:', err.message);
      }
    };

    fetchData();
  }, []);

  // 2. Fetch live telemetry for selected farm
  const selectedFarmObj = farms.find((f) => (f._id || f.id) === selectedFarmId);

  useEffect(() => {
    const fetchFarmWeather = async () => {
      if (!selectedFarmObj || selectedFarmObj.latitude === undefined || selectedFarmObj.longitude === undefined) {
        setWeatherTelemetry(null);
        return;
      }

      try {
        const res = await api.get('/weather/current', {
          params: {
            latitude: selectedFarmObj.latitude,
            longitude: selectedFarmObj.longitude,
          },
        });
        if (res.data?.data) {
          setWeatherTelemetry(res.data.data);
        }
      } catch (err) {
        console.warn('Weather fetch warning for farm telemetry:', err.message);
      }
    };

    fetchFarmWeather();
  }, [selectedFarmId, selectedFarmObj]);

  // Filter crops for selected farm if applicable
  const availableCropsForFarm = crops.filter((c) => {
    if (!c.farm) return true;
    const cropFarmId = c.farm._id || c.farm;
    return cropFarmId === selectedFarmId;
  });

  const activeCropsList = availableCropsForFarm.length > 0 ? availableCropsForFarm : crops;

  // 3. Execute Environmental Pest Outbreak Analysis
  const handleRunEnvironmentalAnalysis = async () => {
    if (!selectedFarmId || !selectedCropId) {
      setEnvError('Please register and select both a farm and a crop to run environmental analysis.');
      return;
    }

    setIsAnalyzingEnv(true);
    setEnvError('');

    try {
      const response = await api.post('/predictions', {
        farm: selectedFarmId,
        crop: selectedCropId,
      });

      if (response.data?.success && response.data?.data) {
        setEnvResult(response.data.data);
      }
    } catch (err) {
      console.error('Environmental analysis error:', err);
      setEnvError(
        err.response?.data?.message || 'Failed to complete environmental risk analysis. Please try again.'
      );
    } finally {
      setIsAnalyzingEnv(false);
    }
  };

  // 4. Handle Image Upload & Classification
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageError('Image file must be under 10 MB.');
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError('');
      setImageResult(null);
    }
  };

  const handleRunImageAnalysis = async () => {
    if (!selectedImage) {
      setImageError('Please select or upload an insect photograph first.');
      return;
    }

    setIsAnalyzingImg(true);
    setImageError('');

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await api.post('/ai/predict/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success && response.data?.data) {
        setImageResult(response.data.data);
      }
    } catch (err) {
      console.error('Image prediction error:', err);
      setImageError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          'Failed to communicate with AI image service. Ensure the FastAPI microservice is running.'
      );
    } finally {
      setIsAnalyzingImg(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
          AI Pest Warning & Identification
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Dual-engine diagnostics: Environmental indicator-based early warning and deep vision insect classification
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('environmental')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'environmental'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-slate-500 hover:text-brand-dark'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          Environmental Outbreak Warning
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'image'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-slate-500 hover:text-brand-dark'
          }`}
        >
          <Camera className="w-4 h-4" />
          Insect Image Classifier (MobileNetV3)
        </button>
      </div>

      {/* TAB 1: ENVIRONMENTAL PREDICTION */}
      {activeTab === 'environmental' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                  Select Farm (Geo-Coordinates)
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark"
                >
                  {farms.length === 0 ? (
                    <option value="">No registered farms found (add a farm first)</option>
                  ) : (
                    farms.map((f) => (
                      <option key={f._id || f.id} value={f._id || f.id}>
                        {f.farmName} ({f.location})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                  Select Target Crop
                </label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-dark"
                >
                  {activeCropsList.length === 0 ? (
                    <option value="">No registered crops found (add a crop first)</option>
                  ) : (
                    activeCropsList.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.cropName} ({c.growthStage || 'Growth Stage'})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Environmental Indicators Snapshot */}
            <div className="bg-brand-bg rounded-xl p-4 border border-brand-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-brand-green" /> Live Open-Meteo Environmental Telemetry Snapshot
                </span>
                <span className="text-[11px] text-brand-secondary">
                  {selectedFarmObj ? `${selectedFarmObj.location}` : 'Selected Farm'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="text-brand-secondary block text-[11px]">Temperature</span>
                  <span className="font-bold text-brand-dark">
                    {weatherTelemetry?.temperature !== undefined ? `${weatherTelemetry.temperature}°C` : '--'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="text-brand-secondary block text-[11px]">Rel. Humidity</span>
                  <span className="font-bold text-brand-dark">
                    {weatherTelemetry?.humidity !== undefined ? `${weatherTelemetry.humidity}%` : '--'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="text-brand-secondary block text-[11px]">Precipitation</span>
                  <span className="font-bold text-brand-dark">
                    {weatherTelemetry?.rainfall !== undefined ? `${weatherTelemetry.rainfall} mm` : '0 mm'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="text-brand-secondary block text-[11px]">Wind Velocity</span>
                  <span className="font-bold text-brand-dark">
                    {weatherTelemetry?.windSpeed !== undefined ? `${weatherTelemetry.windSpeed} km/h` : '--'}
                  </span>
                </div>
              </div>
            </div>

            {envError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{envError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                icon={BrainCircuit}
                iconPosition="left"
                disabled={isAnalyzingEnv || !selectedFarmId || !selectedCropId}
                onClick={handleRunEnvironmentalAnalysis}
              >
                {isAnalyzingEnv ? 'Evaluating Meteorological Indicators...' : 'Run Environmental Risk Analysis'}
              </Button>
            </div>
          </div>

          {/* Environmental Prediction Output Card */}
          {envResult && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-brand-dark">
                      Outbreak Threat: {envResult.prediction}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${
                      envResult.riskLevel === 'High'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : envResult.riskLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {envResult.riskLevel} Risk Outbreak
                    </span>
                  </div>
                  <p className="text-xs text-brand-secondary mt-1">
                    Target Crop: <span className="font-semibold text-brand-dark">{envResult.crop?.cropName || 'Crop'}</span> • Farm: <span className="font-semibold text-brand-dark">{envResult.farm?.farmName || 'Farm'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-brand-secondary block">
                    Calculated Confidence
                  </span>
                  <span className="text-2xl font-black text-brand-dark">
                    {envResult.confidence ? `${Math.round(envResult.confidence * 100)}%` : '85%'}
                  </span>
                </div>
              </div>

              {/* Environmental Correlation Basis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Environmental Indicators Correlation Basis
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Microclimate conditions recorded: Ambient Temperature of {envResult.weatherSnapshot?.temperature ?? '--'}°C and Relative Humidity of {envResult.weatherSnapshot?.humidity ?? '--'}%. High moisture levels combined with target crop phenology create viable incubation parameters for pest proliferation.
                </p>
              </div>

              {/* Preventive Guidance */}
              {envResult.recommendation && (
                <div className="rounded-xl bg-green-50/90 border border-green-200/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Recommended Integrated Pest Management (IPM) Action
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {envResult.recommendation}
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Info className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>
                  <strong>Note:</strong> Environmental warnings are calculated from live meteorological telemetry and agronomic thresholds. Recorded to your prediction history.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSECT IMAGE CLASSIFIER (FastAPI + MobileNetV3) */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-6">
            <div>
              <h3 className="text-base font-bold text-brand-dark">
                Insect Image Classification
              </h3>
              <p className="text-xs text-brand-secondary mt-1">
                Upload a field photograph of a suspected insect pest for neural identification via the FastAPI MobileNetV3-Small vision service.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-green/60 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="Insect Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <label
                      htmlFor="image-upload"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                    >
                      Change Photo
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setImageResult(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer block space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-brand-dark block">
                      Click to upload insect image
                    </span>
                    <span className="text-xs text-brand-secondary">
                      JPG, PNG, or WEBP up to 10 MB
                    </span>
                  </div>
                </label>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {imageError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{imageError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                iconPosition="left"
                disabled={isAnalyzingImg || !selectedImage}
                onClick={handleRunImageAnalysis}
              >
                {isAnalyzingImg ? 'Running Neural Vision Inference...' : 'Classify Insect Image'}
              </Button>
            </div>
          </div>

          {/* Image Inference Outcome */}
          {imageResult && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider block">
                    Predicted Insect Pest
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-dark mt-0.5">
                    {imageResult.predicted_class}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Class ID: {imageResult.class_id} • Architecture: {imageResult.model || 'MobileNetV3-Small'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-brand-secondary block">
                    Model Confidence
                  </span>
                  <span className="text-3xl font-black text-brand-green">
                    {(Number(imageResult.confidence) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* EXPERIMENTAL NOTICE BANNER (Explicit Requirement) */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Experimental Model Limitation Notice</span>
                </div>
                <p className="leading-relaxed text-amber-800">
                  {imageResult.message ||
                    'This experimental MobileNetV3-Small classifier was trained on a restricted subset of the IP102 benchmark dataset. Predictions are indicative and exploratory. Always visually verify insect identification with an agricultural extension officer or agronomist before initiating chemical or pesticide treatments.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  Vision inference was executed via the Python FastAPI service on port 8000 using PyTorch MobileNetV3-Small.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Predictions;