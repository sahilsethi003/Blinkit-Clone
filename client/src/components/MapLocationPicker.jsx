import React, { useEffect, useRef, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import { IoSearchOutline, IoLocationSharp } from 'react-icons/io5';

const MapLocationPicker = ({ onLocationSelect, initialLat = null, initialLng = null }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi

  // 1. Dynamic Asset Loading (CSS & JS CDN)
  useEffect(() => {
    // Inject Custom Keyframe styles for premium animations
    const styleId = 'map-picker-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes pinFloating {
          0% { transform: translate(-50%, -100%); }
          100% { transform: translate(-50%, -115%); }
        }
        @keyframes shadowPulsing {
          0% { transform: translate(-50%, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(-50%, 0) scale(0.6); opacity: 0.15; }
        }
        .animate-pin-float {
          animation: pinFloating 0.5s infinite alternate ease-in-out;
        }
        .animate-shadow-pulse {
          animation: shadowPulsing 0.5s infinite alternate ease-in-out;
        }
        .animate-pulse-ring {
          box-shadow: 0 0 0 0 rgba(0, 176, 80, 0.4);
          animation: pulseRing 1.5s infinite cubic-bezier(0.66, 0, 0, 1);
        }
        @keyframes pulseRing {
          to {
            box-shadow: 0 0 0 8px rgba(0, 176, 80, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Inject Leaflet CSS
    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const jsId = 'leaflet-cdn-js';
    let script = document.getElementById(jsId);
    if (!script) {
      script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', () => setLeafletLoaded(true));
    }
  }, []);

  // 2. Set initial coordinates
  useEffect(() => {
    if (initialLat && initialLng) {
      setCurrentCoords({
        lat: parseFloat(initialLat),
        lng: parseFloat(initialLng),
      });
    }
  }, [initialLat, initialLng]);

  // 3. Initialize Leaflet Map (Using Floating Center Pin Concept)
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;

    if (!mapInstanceRef.current) {
      // Create map
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 16,
        zoomControl: false, // Turn off default zoom control to make UI cleaner
      });

      // Add modern clean map tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      // Map move/drag start events to trigger center pin floating bounce
      mapInstanceRef.current.on('movestart', () => {
        setIsDragging(true);
      });

      // Map move/drag end events to resolve center point address
      mapInstanceRef.current.on('moveend', async () => {
        setIsDragging(false);
        const center = mapInstanceRef.current.getCenter();
        const lat = center.lat;
        const lng = center.lng;
        setCurrentCoords({ lat, lng });
        await reverseGeocode(lat, lng);
      });
    } else {
      mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 16);
    }
  }, [leafletLoaded]);

  // Cleanup map container
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 4. Reverse Geocoding via Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      if (data && data.address) {
        const parsedAddress = parseNominatimAddress(data.address, data.display_name);
        onLocationSelect({
          ...parsedAddress,
          latitude: lat,
          longitude: lng
        });
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const parseNominatimAddress = (address, displayName = "") => {
    const road = address.road || address.suburb || address.neighbourhood || address.pedestrian || "";
    const houseNumber = address.house_number || "";
    
    let addressLine = "";
    if (houseNumber && road) {
      addressLine = `${houseNumber}, ${road}`;
    } else if (road) {
      addressLine = road;
    } else {
      addressLine = displayName.split(',').slice(0, 2).join(',').trim() || displayName;
    }

    const city = address.city || address.town || address.village || address.county || "Unknown City";
    const state = address.state || "Unknown State";
    const country = address.country || "India";
    const pincode = address.postcode || "";

    return {
      address_line: addressLine,
      city,
      state,
      country,
      pincode
    };
  };

  // 5. Autocomplete / Search Locations handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=in&limit=5`
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  // 6. Handle autocomplete selection
  const handleSelectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    
    setCurrentCoords({ lat, lng });
    setSearchQuery(place.display_name);
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
    }

    const parsedAddress = parseNominatimAddress(place.address, place.display_name);
    onLocationSelect({
      ...parsedAddress,
      latitude: lat,
      longitude: lng
    });
  };

  // 7. Locate Me using Geolocation API
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCurrentCoords({ lat, lng });
        setLoadingLocation(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
        }

        await reverseGeocode(lat, lng);
      },
      (error) => {
        setLoadingLocation(false);
        console.error("Geolocation error: ", error);
        alert("Failed to retrieve location. Check browser settings.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col gap-3.5 my-2 w-full relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative shadow-sm rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-primary-200/20 bg-blue-50">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search delivery location..."
              className="w-full pl-9 pr-10 py-2.5 outline-none bg-transparent text-sm font-medium text-gray-700 placeholder-gray-400"
            />
            <IoSearchOutline className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          {/* Autocomplete Results Dropdown with premium styling */}
          {searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 backdrop-blur-md bg-white/95 border border-slate-200/80 shadow-2xl rounded-xl z-[9999] max-h-64 overflow-y-auto divide-y divide-gray-100/60 p-1.5 transition-all">
              {searchResults.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelectPlace(place)}
                  className="flex gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer text-gray-700 transition-all duration-200 hover:pl-4 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-200/10 text-secondary-200 flex-shrink-0 group-hover:bg-secondary-200 group-hover:text-white transition-colors duration-200">
                    <IoLocationSharp size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-gray-800 truncate">
                      {place.display_name.split(',')[0]}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {place.display_name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {searching && (
            <div className="absolute right-3 top-3 text-[10px] text-gray-400 font-medium animate-pulse">
              Searching...
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={loadingLocation}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-secondary-200 hover:bg-secondary-200/90 text-white rounded-lg font-bold text-xs disabled:bg-gray-300 transition-all flex-shrink-0 shadow-sm hover:shadow-md animate-pulse-ring"
        >
          <BiCurrentLocation size={16} className={loadingLocation ? "animate-spin" : ""} />
          {loadingLocation ? "Locating..." : "Locate Me"}
        </button>
      </div>

      {/* Map Container Area with Floating Pin Overlay */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200 group/map transition-all duration-300 hover:shadow-xl">
        {!leafletLoaded && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
            <span className="animate-pulse">Loading Free Map API...</span>
          </div>
        )}
        
        {/* Leaflet target container */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-64"
          style={{ minHeight: '256px', zIndex: 1 }}
        />

        {/* Dynamic Map Guide Banner Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur-md bg-white/90 border border-slate-200/50 shadow-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-gray-700 flex items-center gap-1.5 pointer-events-none select-none transition-transform duration-300">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-200 animate-ping"></span>
          📍 Drag map to adjust exact spot
        </div>

        {/* Floating Custom Pin exactly in Center */}
        {leafletLoaded && (
          <div 
            className="absolute top-1/2 left-1/2 pointer-events-none z-[1000]"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {/* Custom delivery pin design */}
            <div className="relative">
              {/* Pin Icon */}
              <div 
                className={`absolute left-0 bottom-0 transition-transform duration-200 origin-bottom ${isDragging ? 'animate-pin-float scale-110' : ''}`}
                style={{ transform: 'translate(-50%, -100%)' }}
              >
                {/* Visual droplets or pin circle */}
                <div className="bg-secondary-200 text-white p-2.5 rounded-full shadow-xl border-2 border-white flex items-center justify-center">
                  <IoLocationSharp size={20} className="text-white" />
                </div>
                {/* Triangle Tail */}
                <div className="w-3.5 h-3.5 bg-secondary-200 rotate-45 -mt-2 mx-auto border-r-2 border-b-2 border-white"></div>
              </div>

              {/* Pin Shadow under pin */}
              <div 
                className={`absolute left-0 top-0 rounded-full bg-black/20 blur-[1.5px] transition-all duration-200 ${isDragging ? 'animate-shadow-pulse' : ''}`}
                style={{
                  transform: 'translate(-50%, 0)',
                  width: '16px',
                  height: '4px',
                  marginTop: '1px'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {currentCoords && (
        <div className="text-[9px] text-gray-400 font-mono text-right mr-1 select-none">
          GPS Coordinates: {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
