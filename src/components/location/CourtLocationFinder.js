// src/components/location/CourtLocationFinder.js
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';

// Mock court service - replace with actual API in production
const CourtService = {
  getCourtLocations: async (province, courtType) => {
    // Mock data for New Brunswick courts
    if (province === 'New Brunswick') {
      return [
        {
          id: 'nb-sj-family',
          name: 'Saint John Family Division',
          address: '110 Charlotte Street, Saint John, NB E2L 2J4',
          phone: '(506) 658-2400',
          latitude: 45.274,
          longitude: -66.059,
          courtType: 'Family'
        },
        {
          id: 'nb-fred-family',
          name: 'Fredericton Family Division',
          address: '427 Queen Street, Fredericton, NB E3B 1B6',
          phone: '(506) 453-2015',
          latitude: 45.964,
          longitude: -66.643,
          courtType: 'Family'
        },
        {
          id: 'nb-monc-family',
          name: 'Moncton Family Division',
          address: '145 Assumption Blvd, Moncton, NB E1C 0R2',
          phone: '(506) 856-2304',
          latitude: 46.089,
          longitude: -64.776,
          courtType: 'Family'
        }
      ].filter(court => !courtType || court.courtType === courtType);
    }
    
    // Return empty array for other provinces (for now)
    return [];
  }
};

export const CourtLocationFinder = ({ 
  province, 
  courtType,
  onSelectCourt
}) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        setError(null);
        const courtLocations = await CourtService.getCourtLocations(province, courtType);
        setCourts(courtLocations);
      } catch (err) {
        console.error('Error fetching court locations:', err);
        setError('Failed to load court locations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (province) {
      fetchCourts();
    }
  }, [province, courtType]);
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not access your location. Please grant permission or select a court manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };
  
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return null;
    
    // Haversine formula to calculate distance between two points
    const toRad = value => value * Math.PI / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const nearestCourt = courts.reduce((nearest, court) => {
    if (!userLocation) return nearest;
    
    const courtLocation = { lat: court.latitude, lng: court.longitude };
    const distance = calculateDistance(userLocation, courtLocation);
    
    if (!nearest || (distance && distance < nearest.distance)) {
      return { ...court, distance };
    }
    
    return nearest;
  }, null);
  
  const handleSelectCourt = (court) => {
    setSelectedCourt(court);
    if (onSelectCourt) {
      onSelectCourt(court);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-40">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (courts.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle className="w-5 h-5" />
            <p>No courts found for the selected criteria.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="court-location-finder p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Court Locations</h3>
      
      {/* User location */}
      <div className="mb-4">
        <button
          onClick={getUserLocation}
          disabled={loadingLocation}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" />
          {loadingLocation ? 'Finding your location...' : 'Find nearest court'}
        </button>
        
        {nearestCourt && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="font-medium">Nearest Court:</div>
            <div className="text-blue-700">{nearestCourt.name}</div>
            <div className="text-sm text-blue-600">
              {nearestCourt.distance.toFixed(1)} km away
            </div>
          </div>
        )}
      </div>
      
      {/* Court list */}
      <div className="space-y-3">
        {courts.map(court => {
          const isSelected = selectedCourt?.id === court.id;
          const distance = userLocation 
            ? calculateDistance(
                userLocation, 
                { lat: court.latitude, lng: court.longitude }
              )
            : null;
            
          return (
            <div 
              key={court.id} 
              className={`
                p-3 rounded-lg border cursor-pointer transition-colors
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'}
              `}
              onClick={() => handleSelectCourt(court)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{court.name}</div>
                  <div className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{court.address}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone className="w-4 h-4" />
                    <span>{court.phone}</span>
                  </div>
                </div>
                
                {distance && (
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {distance.toFixed(1)} km
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${court.latitude},${court.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </a>
                <a
                  href={`tel:${court.phone.replace(/[^0-9]/g, '')}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourtLocationFinder;