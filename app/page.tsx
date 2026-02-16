'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_SHOPS } from '@/lib/mockData';
import { generateNearbyShops } from '@/lib/utils';
import CategoryFilter from '@/components/ui/CategoryFilter';
import LocationButton from '@/components/ui/LocationButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamic import for Leaflet (avoid SSR issues)
const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [mapRef, setMapRef] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([
    21.0285, 105.8542, // Default: Hà Nội
  ]);
  const [locationDetected, setLocationDetected] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLocationDetected(true);
        },
        (error) => {
          console.log('Location access denied, using default location (Hà Nội)');
          setLocationDetected(true);
        }
      );
    } else {
      setLocationDetected(true);
    }
  }, []);

  // Generate nearby shops based on user location
  const nearbyShops = useMemo(() => {
    if (!locationDetected) return [];
    return generateNearbyShops(userLocation[0], userLocation[1], 10);
  }, [userLocation, locationDetected]);

  // Combine original shops with nearby ones
  const allShops = useMemo(() => {
    return [...nearbyShops, ...MOCK_SHOPS];
  }, [nearbyShops]);

  const handleRecenter = () => {
    if (mapRef) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(newLocation);
        mapRef.flyTo(newLocation, 15, {
          duration: 1.5,
        });
      });
    }
  };

  // Filter shops for stats
  const filteredShops = selectedCategory
    ? allShops.filter((s) => s.category_id === selectedCategory)
    : allShops;

  if (!locationDetected) {
    return <LoadingSpinner />;
  }

  return (
    <main className="relative">
      {/* Map */}
      <MapView
        shops={allShops}
        selectedCategory={selectedCategory}
        onMapReady={setMapRef}
        userLocation={userLocation}
      />

      {/* Floating UI */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <LocationButton onClick={handleRecenter} />

      {/* Stats Badge (Top right) */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-600 uppercase tracking-wide">
          Địa điểm
        </p>
        <p className="text-3xl font-bold text-blue-600">
          {filteredShops.length}
        </p>
      </div>
    </main>
  );
}
