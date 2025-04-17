// src/components/LocationInfoMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { getCoordinatesFromGMaps } from '../utils/getCoordinatesFromGMaps';
import L from 'leaflet';

// Import ikon default Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Import CSS Marker Cluster jika menggunakan
// import 'react-leaflet-markercluster/dist/styles.min.css';

// Import CSS khusus jika ada
// import './LocationInfoMap.css';

// Konfigurasi ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationInfoMap = ({ destination }) => {
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch coordinates ketika komponen mount atau destination berubah
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const { lat, lng } = await getCoordinatesFromGMaps(destination.g_maps);
        setCoordinates({ lat, lng });
      } catch (err) {
        console.error('Error fetching coordinates:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (destination.g_maps) {
      fetchCoordinates();
    } else {
      setLoading(false);
    }
  }, [destination.g_maps]);

  const { lat, lng } = coordinates;

  // Memoisasi TileLayer untuk optimasi
  const tileLayers = useMemo(
    () => (
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Streets">
          <TileLayer
            attribution="&copy; Stadia Maps, OpenMapTiles, OpenStreetMap contributors"
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark Mode">
          <TileLayer
            attribution="&copy; Stadia Maps, OpenMapTiles, OpenStreetMap contributors"
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    ),
    []
  );

  return (
    <div className="p-6 bg-white relative z-0">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Lokasi</h1>

      {/* Main Content - Ubah flex-col menjadi default untuk mobile */}
      <div className="flex flex-col gap-8">
        {/* Map Section - Tambahkan min-height untuk mobile */}
        <div className="w-full min-h-[300px] h-[400px] rounded-lg overflow-hidden shadow-inner">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading map"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : error || !(lat && lng) ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-700">Lokasi peta tidak tersedia.</p>
            </div>
          ) : (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-full"
              aria-label="Map showing destination location"
            >
              {tileLayers}
              <Marker position={[lat, lng]}>
                <Popup>{destination.title}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

LocationInfoMap.propTypes = {
  destination: PropTypes.shape({
    location: PropTypes.string,
    g_maps: PropTypes.string,
    title: PropTypes.string.isRequired,
    open_hours: PropTypes.string,
    close_hours: PropTypes.string,
  }).isRequired,
};

export default React.memo(LocationInfoMap);
