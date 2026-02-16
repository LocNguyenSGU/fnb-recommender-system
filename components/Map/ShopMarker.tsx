'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Shop } from '@/lib/types';
import ShopPopup from './ShopPopup';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';

interface ShopMarkerProps {
  shop: Shop;
  animationDelay?: number;
}

// Create custom icon based on category
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
             style="background-color: ${color}">
          <span class="text-2xl">${emoji}</span>
        </div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
             style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color};"></div>
      </div>
    `,
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -56],
  });
};

export default function ShopMarker({ shop, animationDelay = 0 }: ShopMarkerProps) {
  const color = getCategoryColor(shop.category_id);
  const icon = getCategoryIcon(shop.category_id);

  return (
    <Marker
      position={[shop.latitude, shop.longitude]}
      icon={createCustomIcon(color, icon)}
    >
      <Popup minWidth={300} maxWidth={400}>
        <ShopPopup shop={shop} />
      </Popup>
    </Marker>
  );
}
