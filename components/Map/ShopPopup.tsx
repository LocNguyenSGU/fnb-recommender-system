'use client';

import { Shop } from '@/lib/types';
import { Clock, MapPin, Star } from 'lucide-react';
import { isShopOpen } from '@/lib/utils';
import Image from 'next/image';

interface ShopPopupProps {
  shop: Shop;
}

export default function ShopPopup({ shop }: ShopPopupProps) {
  const isOpen = isShopOpen(shop.open_time, shop.close_time);

  return (
    <div className="p-2 min-w-[280px]">
      {/* Header Image */}
      {shop.images[0] && (
        <div className="relative w-full h-32 mb-3">
          <Image
            src={shop.images[0]}
            alt={shop.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 400px) 100vw, 400px"
          />
        </div>
      )}

      {/* Shop Info */}
      <h3 className="font-bold text-lg mb-2 text-gray-800">{shop.name}</h3>

      {/* Rating */}
      {shop.rating && (
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800">{shop.rating}</span>
          <span className="text-gray-500 text-sm">
            ({shop.review_count} đánh giá)
          </span>
        </div>
      )}

      {/* Category Badge */}
      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mb-2 font-medium">
        {shop.category_name}
      </span>

      {/* Address */}
      <div className="flex gap-2 text-sm text-gray-600 mb-2">
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{shop.address}</span>
      </div>

      {/* Opening Hours */}
      <div className="flex gap-2 text-sm mb-3">
        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
        <span className="text-gray-600">
          {shop.open_time} - {shop.close_time}
          <span
            className={`ml-2 font-semibold ${
              isOpen ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isOpen ? '• Đang mở cửa' : '• Đã đóng cửa'}
          </span>
        </span>
      </div>

      {/* Action Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium">
        Xem chi tiết
      </button>
    </div>
  );
}
