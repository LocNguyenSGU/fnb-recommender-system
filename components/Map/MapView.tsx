'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import ShopMarker from './ShopMarker';
import CurrentLocationMarker from './CurrentLocationMarker';
import { Shop } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  shops: Shop[];
  selectedCategory?: number;
  onMapReady?: (map: any) => void;
  userLocation: [number, number];
}

// Component to handle map ready callback
function MapReadyHandler({ onMapReady }: { onMapReady?: (map: any) => void }) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

// Component to recenter map when location changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  
  return null;
}

export default function MapView({ shops, selectedCategory, onMapReady, userLocation }: MapViewProps) {

  // Filter shops by category
  const filteredShops = selectedCategory
    ? shops.filter((s) => s.categoryId === selectedCategory)
    : shops;

  return (
    <MapContainer
      center={userLocation}
      zoom={14}
      className="h-screen w-full"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Map ready handler */}
      <MapReadyHandler onMapReady={onMapReady} />
      
      {/* Recenter when location changes */}
      <MapRecenter center={userLocation} />

      {/* User's current location marker */}
      <CurrentLocationMarker position={userLocation} />

      {/* Shop markers with staggered animation */}
      {filteredShops.map((shop, index) => (
        <ShopMarker
          key={shop.id}
          shop={shop}
          animationDelay={index * 0.05}
        />
      ))}
    </MapContainer>
  );
}
