import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import {
  FaTimes,
  FaSearchLocation,
  FaCar,
  FaWalking,
  FaMotorcycle,
  FaTrain,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { MdToll, MdTurnRight, MdTurnLeft, MdOutlineStraight } from 'react-icons/md';
import { getCoordinatesFromGMaps } from '../utils/getCoordinatesFromGMaps';

function RouteMap({ destination, setShowRouteModal }) {
  console.log('RouteMap rendered', { destination });
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const [useToll, setUseToll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  // Get destination coordinates from Google Maps URL
  useEffect(() => {
    const fetchDestinationCoords = async () => {
      try {
        const coords = await getCoordinatesFromGMaps(destination.g_maps);
        setDestinationCoords([coords.lat, coords.lng]);
      } catch (error) {
        console.error('Error getting destination coordinates:', error);
      }
    };
    fetchDestinationCoords();
  }, [destination.g_maps]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fungsi untuk memformat durasi dengan faktor kecepatan
  const formatDuration = (seconds) => {
    let adjustedSeconds = seconds;
    // Sesuaikan durasi berdasarkan mode transportasi
    switch (selectedMode) {
      case 'driving':
        // Mobil tetap menggunakan waktu default dari API
        break;
      case 'walking':
        // Kecepatan jalan kaki rata-rata 5km/h
        adjustedSeconds = (routeInfo.distance / 1000 / 5) * 3600;
        break;
      case 'motorcycle':
        // Motor biasanya 1.2x lebih cepat dari mobil dalam kota
        adjustedSeconds = seconds * 0.8;
        break;
      default:
        break;
    }

    const hours = Math.floor(adjustedSeconds / 3600);
    const minutes = Math.floor((adjustedSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  };

  // Fungsi untuk memformat jarak
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Calculate route when both locations are available
  useEffect(() => {
    if (userLocation && destinationCoords) {
      const fetchRoute = async () => {
        setIsLoading(true);
        try {
          // Modifikasi parameter untuk menghindari jalan tol
          const excludeParam =
            selectedMode === 'driving' && !useToll
              ? '&exclude=motorway,motorway_link,trunk,trunk_link'
              : '';
          // Tambahkan parameter preferences untuk rute
          const preferences =
            selectedMode === 'driving'
              ? `&annotations=true&overview=full&alternatives=true${excludeParam}`
              : '&annotations=true&overview=full';

          const response = await fetch(
            `https://router.project-osrm.org/route/v1/${
              selectedMode === 'motorcycle' ? 'driving' : selectedMode
            }/${userLocation[1]},${userLocation[0]};${destinationCoords[1]},${destinationCoords[0]}?geometries=geojson&steps=true${preferences}`
          );

          const data = await response.json();
          if (data.routes && data.routes[0]) {
            // Pilih rute yang sesuai dengan preferensi tol
            let selectedRoute = data.routes[0];
            if (selectedMode === 'driving' && !useToll && data.routes.length > 1) {
              // Cari rute alternatif yang menghindari jalan tol
              selectedRoute =
                data.routes.find(
                  (route) =>
                    !route.legs[0].steps.some(
                      (step) => step.maneuver.type === 'motorway' || step.maneuver.type === 'trunk'
                    )
                ) || data.routes[0];
            }

            setRouteCoordinates(
              selectedRoute.geometry.coordinates.map((coord) => [coord[1], coord[0]])
            );
            setRouteInfo({
              distance: selectedRoute.distance,
              duration: selectedRoute.duration,
              steps: selectedRoute.legs[0].steps,
            });
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRoute();
    }
  }, [userLocation, destinationCoords, selectedMode, useToll]);

  // Fungsi untuk melihat semua titik
  const handleFitBounds = () => {
    if (mapRef.current && userLocation && destinationCoords) {
      const bounds = L.latLngBounds([userLocation, destinationCoords]);
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50], // Padding dari tepi
        maxZoom: 15, // Maksimal zoom level
        animate: true, // Animasi saat zoom
        duration: 1, // Durasi animasi dalam detik
      });
    }
  };

  // Fungsi untuk mendapatkan icon berdasarkan instruksi
  const getStepIcon = (instruction) => {
    if (!instruction) return <MdOutlineStraight className="text-emerald-600" />;

    const text = instruction.toLowerCase();
    if (text.includes('kanan') || text.includes('right')) {
      return <MdTurnRight className="text-emerald-600" />;
    }
    if (text.includes('kiri') || text.includes('left')) {
      return <MdTurnLeft className="text-emerald-600" />;
    }
    return <MdOutlineStraight className="text-emerald-600" />;
  };

  // Fungsi untuk format instruksi yang lebih baik
  const formatInstruction = (instruction) => {
    if (!instruction) return 'Lanjut jalan';

    return instruction
      .replace(/Head/gi, 'Lurus')
      .replace(/Turn right/gi, 'Belok kanan')
      .replace(/Turn left/gi, 'Belok kiri')
      .replace(/Continue/gi, 'Lanjutkan')
      .replace(/onto/gi, 'ke')
      .replace(/Arrive at/gi, 'Tiba di')
      .replace(/destination/gi, 'tujuan');
  };

  if (!destinationCoords) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Memuat peta...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={() => setShowRouteModal(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        {/* Sidebar dengan animasi */}
        <motion.div
          className="w-96 bg-gray-50 relative"
          initial={{ x: 0 }}
          animate={{ x: isSidebarHidden ? -384 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
            className={`absolute -right-3 top-6 bg-white shadow-md rounded-full p-1.5 z-10 hover:bg-gray-50 transition-colors ${
              isSidebarHidden ? 'translate-x-3' : ''
            }`}
          >
            {isSidebarHidden ? (
              <FaChevronRight className="w-3 h-3 text-gray-600" />
            ) : (
              <FaChevronLeft className="w-3 h-3 text-gray-600" />
            )}
          </button>

          {/* Sidebar Content */}
          <div className="h-full overflow-auto p-6">
            {/* Header dengan tombol close */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Petunjuk Rute</h2>
              <button
                onClick={() => setIsSidebarHidden(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 group"
              >
                <FaTimes className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Mode Transportasi dengan desain yang lebih baik */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  selectedMode === 'driving'
                    ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMode('driving')}
              >
                <FaCar className="text-2xl" />
                <span className="text-sm font-medium">Mobil</span>
              </button>
              <button
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  selectedMode === 'motorcycle'
                    ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMode('motorcycle')}
              >
                <FaMotorcycle className="text-2xl" />
                <span className="text-sm font-medium">Motor</span>
              </button>
              <button
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  selectedMode === 'walking'
                    ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMode('walking')}
              >
                <FaWalking className="text-2xl" />
                <span className="text-sm font-medium">Jalan Kaki</span>
              </button>
              <button
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  selectedMode === 'train'
                    ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMode('train')}
              >
                <FaTrain className="text-2xl" />
                <span className="text-sm font-medium">Kereta</span>
              </button>
            </div>

            {/* Opsi Tol dengan desain yang lebih baik */}
            {selectedMode === 'driving' && (
              <div className="mb-6">
                <button
                  className={`w-full p-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                    useToll ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setUseToll(!useToll)}
                >
                  <MdToll className="text-2xl" />
                  <span className="font-medium">
                    {useToll ? 'Gunakan Jalan Tol' : 'Hindari Jalan Tol'}
                  </span>
                </button>
              </div>
            )}

            {/* Route Summary dengan desain yang lebih baik */}
            {routeInfo && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Jarak</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDistance(routeInfo.distance)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Estimasi Waktu</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDuration(routeInfo.duration)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Perkiraan waktu dapat berubah sesuai kondisi lalu lintas
                  </div>
                </div>
              </div>
            )}

            {/* Steps dengan desain yang lebih baik */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {routeInfo?.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getStepIcon(step?.maneuver?.instruction)}</div>
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">
                          {formatInstruction(step?.maneuver?.instruction)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>{formatDistance(step?.distance || 0)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{formatDuration(step?.duration || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Map Container dengan transisi lebar */}
        <div
          className="flex-1 relative transition-all duration-300"
          style={{ marginLeft: isSidebarHidden ? '-384px' : '0' }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full"
            onClick={() => setShowRouteModal(false)}
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Fit Bounds Button */}
          {userLocation && destinationCoords && (
            <button
              className="absolute top-4 left-4 z-10 bg-white shadow-md hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
              onClick={handleFitBounds}
            >
              <FaSearchLocation className="text-emerald-600" />
              <span className="text-sm font-medium">Lihat Semua Titik</span>
            </button>
          )}

          <MapContainer center={destinationCoords} zoom={13} className="w-full h-full" ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Destination Marker */}
            <Marker position={destinationCoords}>
              <Popup>
                <div className="font-medium">{destination.title}</div>
                <div className="text-sm text-gray-600">Tujuan Anda</div>
              </Popup>
            </Marker>

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="font-medium">Lokasi Anda</div>
                  <div className="text-sm text-gray-600">Titik Awal</div>
                </Popup>
              </Marker>
            )}

            {/* Route Line */}
            {routeCoordinates.length > 0 && (
              <Polyline positions={routeCoordinates} color="#10b981" weight={4} opacity={0.7} />
            )}
          </MapContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}

RouteMap.propTypes = {
  destination: PropTypes.shape({
    title: PropTypes.string.isRequired,
    g_maps: PropTypes.string.isRequired,
  }).isRequired,
  setShowRouteModal: PropTypes.func.isRequired,
};

export default RouteMap;
