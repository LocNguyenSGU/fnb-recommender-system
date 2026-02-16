// Utility functions

// Kiểm tra quán có đang mở cửa không
export function isShopOpen(openTime: string, closeTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Parse open time
  const [openHour, openMin] = openTime.split(':').map(Number);
  const openTimeInMinutes = openHour * 60 + openMin;

  // Parse close time
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  let closeTimeInMinutes = closeHour * 60 + closeMin;

  // Handle overnight shops (e.g., 16:00 - 02:00)
  if (closeTimeInMinutes < openTimeInMinutes) {
    // If current time is after midnight but before close
    if (currentTimeInMinutes < closeTimeInMinutes) {
      return true;
    }
    // Adjust close time for comparison
    closeTimeInMinutes += 24 * 60;
  }

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
}

// Get category color by ID
export function getCategoryColor(categoryId: number): string {
  const colors: Record<number, string> = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#FFE66D',
    4: '#95E1D3',
  };
  return colors[categoryId] || '#999999';
}

// Get category icon by ID
export function getCategoryIcon(categoryId: number): string {
  const icons: Record<number, string> = {
    1: '🥖',
    2: '🍚',
    3: '🍺',
    4: '☕',
  };
  return icons[categoryId] || '📍';
}

// Get category name by ID
export function getCategoryName(categoryId: number): string {
  const names: Record<number, string> = {
    1: 'Quán ăn sáng',
    2: 'Quán cơm',
    3: 'Quán nhậu',
    4: 'Quán cafe',
  };
  return names[categoryId] || 'Khác';
}

// Generate random shops near a location (for demo)
export function generateNearbyShops(
  lat: number, 
  lng: number, 
  count: number = 8
): any[] {
  const shopNames = [
    'Phở Bò Tươi', 'Bún Chả Hà Nội', 'Bánh Mì Thịt', 'Cháo Lòng',
    'Cơm Tấm Sườn', 'Cơm Gà Xối Mỡ', 'Cơm Niêu', 'Cơm Rang Dưa Bò',
    'Bia Hơi Hà Nội', 'Quán Nhậu 3 Miền', 'Lẩu Nướng', 'Ốc Hương',
    'Cafe Sáng', 'Highlands Coffee', 'Cà Phê Apartment', 'The Coffee House'
  ];
  
  const addresses = [
    'Đường Láng', 'Nguyễn Thái Học', 'Tôn Đức Thắng', 'Trần Hưng Đạo',
    'Lê Duẩn', 'Hai Bà Trưng', 'Bà Triệu', 'Nguyễn Huệ',
    'Lý Thường Kiệt', 'Hoàng Diệu', 'Đinh Tiên Hoàng', 'Hàng Bài'
  ];

  const categories = [
    { id: 1, name: 'Quán ăn sáng', time: ['06:00', '14:00'] },
    { id: 2, name: 'Quán cơm', time: ['10:00', '21:00'] },
    { id: 3, name: 'Quán nhậu', time: ['16:00', '02:00'] },
    { id: 4, name: 'Quán cafe', time: ['07:00', '23:00'] },
  ];

  const shops = [];
  
  for (let i = 0; i < count; i++) {
    // Random offset trong bán kính ~0.01 degrees (~1.1km)
    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;
    
    const category = categories[i % categories.length];
    const shopName = shopNames[i % shopNames.length];
    const address = `${Math.floor(Math.random() * 500) + 1} ${addresses[i % addresses.length]}`;
    
    shops.push({
      id: 100 + i,
      name: `${shopName} - Gần Bạn`,
      category_id: category.id,
      category_name: category.name,
      address: address,
      latitude: lat + offsetLat,
      longitude: lng + offsetLng,
      open_time: category.time[0],
      close_time: category.time[1],
      status: 'approved',
      images: [`https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400`],
      rating: 3.5 + Math.random() * 1.5,
      review_count: Math.floor(Math.random() * 200) + 20,
    });
  }
  
  return shops;
}
