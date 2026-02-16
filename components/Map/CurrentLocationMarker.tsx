'use client';

import { Marker } from 'react-leaflet';
import L from 'leaflet';

interface CurrentLocationMarkerProps {
  position: [number, number];
}

// Custom icon for user's current location
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="relative">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
        <div class="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export default function CurrentLocationMarker({ position }: CurrentLocationMarkerProps) {
  return (
    <Marker
      position={position}
      icon={createUserLocationIcon()}
    />
  );
}
