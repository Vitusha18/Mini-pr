import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Info } from 'lucide-react';

// Fix Leaflet default icon asset paths in Vite / React bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Controller to programmatically pan/zoom when coordinates change or when map initializes
 */
const MapViewController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || map.getZoom());
      // Invalidate size in case of modal transition animation
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [center, zoom, map]);

  return null;
};

/**
 * Map events listener to capture clicks anywhere on the map
 */
const LocationClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6))
      );
    },
  });

  return null;
};

/**
 * Interactive Farm Location Map Picker
 * - Displays OpenStreetMap tiles
 * - Allows clicking to pick location
 * - Supports dragging marker to fine-tune coordinates
 * - Synchronizes latitude and longitude with form
 */
export const FarmMapPicker = ({
  latitude,
  longitude,
  onChange,
  defaultCenter = [19.6967, 72.7699], // Default: Palghar agricultural region
  zoom = 12,
}) => {
  const markerRef = useRef(null);

  const hasCoordinates =
    typeof latitude === 'number' &&
    !isNaN(latitude) &&
    typeof longitude === 'number' &&
    !isNaN(longitude);

  const activePosition = hasCoordinates
    ? [latitude, longitude]
    : defaultCenter;

  const handleLocationUpdate = (lat, lng) => {
    if (onChange) {
      onChange({
        latitude: parseFloat(Number(lat).toFixed(6)),
        longitude: parseFloat(Number(lng).toFixed(6)),
      });
    }
  };

  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const pos = marker.getLatLng();
          handleLocationUpdate(pos.lat, pos.lng);
        }
      },
    }),
    [onChange]
  );

  const handleUseCurrentLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationUpdate(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation access failed or denied:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-brand-dark flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-green" />
          Farm Location on Map <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center gap-1 text-[11px] text-brand-green hover:text-brand-darkgreen font-semibold transition-colors focus:outline-none"
          title="Use my current GPS position"
        >
          <Crosshair className="w-3.5 h-3.5" />
          Locate Me
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
        <MapContainer
          center={activePosition}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewController center={activePosition} zoom={zoom} />
          <LocationClickHandler onLocationSelect={handleLocationUpdate} />

          {hasCoordinates && (
            <Marker
              position={activePosition}
              draggable={true}
              eventHandlers={markerEventHandlers}
              ref={markerRef}
            >
              <Popup>
                <div className="text-xs font-sans p-1">
                  <p className="font-bold text-slate-800">Farm Coordinate</p>
                  <p className="text-slate-600 font-mono mt-0.5">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-1">
                    Drag pin to fine-tune
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Selected Coordinates Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-brand-secondary flex-shrink-0" />
          <span className="text-slate-600 text-[11px]">
            Click map or drag the pin to set farm coordinates for Open-Meteo telemetry.
          </span>
        </div>
        <div className="font-mono text-[11px] font-semibold text-brand-dark bg-white px-2 py-1 rounded border border-slate-200 text-right whitespace-nowrap">
          {hasCoordinates ? (
            <span>
              Lat: <strong className="text-brand-green">{latitude.toFixed(5)}</strong>, Lon:{' '}
              <strong className="text-brand-green">{longitude.toFixed(5)}</strong>
            </span>
          ) : (
            <span className="text-amber-600 font-sans">No location selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmMapPicker;
