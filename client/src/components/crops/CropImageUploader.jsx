import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const CropImageUploader = ({
  imageFile,
  existingImageUrl,
  onImageChange,
  onImageRemove,
}) => {
  const [localPreview, setLocalPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Derive preview URL: local blob URL if newly selected, or existing image URL from backend
  useEffect(() => {
    if (imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLocalPreview(null);
    }
  }, [imageFile]);

  // Construct absolute URL for existing image if relative
  const getDisplayUrl = () => {
    if (localPreview) return localPreview;
    if (!existingImageUrl) return null;
    if (existingImageUrl.startsWith('http://') || existingImageUrl.startsWith('https://')) {
      return existingImageUrl;
    }
    const backendBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${backendBase}${existingImageUrl.startsWith('/') ? '' : '/'}${existingImageUrl}`;
  };

  const activePreviewUrl = getDisplayUrl();

  const validateAndProcessFile = (file) => {
    setErrorMessage('');

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`File is too large (${sizeMb} MB). Maximum allowed file size is 5 MB.`);
      return;
    }

    if (onImageChange) {
      onImageChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
    // Reset file input so re-selecting same filename works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-brand-dark flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-brand-green" />
          Crop Specimen Photo <span className="text-slate-400 font-normal">(Optional, for AI Vision)</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          JPG, PNG, WEBP • Max 5MB
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Dropzone or Preview Card */}
      {activePreviewUrl ? (
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 shadow-xs">
              <img
                src={activePreviewUrl}
                alt="Crop preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-xs font-bold text-brand-dark truncate">
                  {imageFile ? imageFile.name : 'Attached Crop Photo'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Ready for AI image analysis'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-brand-green hover:border-brand-green transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
            isDragging
              ? 'border-brand-green bg-green-50/50'
              : 'border-slate-200 hover:border-brand-green/60 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-brand-green">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-dark">
                Click to upload crop image <span className="font-normal text-slate-500">or drag and drop</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clear plant leaf or specimen photos improve future vision model accuracy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CropImageUploader;
