# 🗺️ Web Kbang - Map Demo Frontend

Demo frontend với interactive map, custom markers đẹp mắt, và smooth UX cho hệ thống web địa phương.

![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

- 🗺️ **Interactive Map** với Leaflet + OpenStreetMap
- 📍 **Custom Markers** - Emoji markers với màu sắc theo category
- 🎯 **Auto Location Detection** - Tự động center map vào vị trí người dùng
- 🔍 **Category Filter** - Lọc địa điểm theo loại hình
- 💫 **Smooth Animations** - Framer Motion cho mọi interactions
- 📱 **Responsive Design** - Hoạt động tốt trên mọi thiết bị
- ⚡ **Performance Optimized** - Dynamic imports, lazy loading

## 🎬 Demo Features

### Map Components
- ✅ Hiển thị vị trí hiện tại của user (blue pulsing marker)
- ✅ Custom markers cho 4 categories (Quán ăn sáng, Cơm, Nhậu, Cafe)
- ✅ Popup với đầy đủ thông tin: ảnh, rating, giờ mở cửa, địa chỉ
- ✅ Staggered animation khi markers xuất hiện
- ✅ Hover effects trên markers

### UI Components
- ✅ **Category Filter** - Floating panel với buttons động
- ✅ **Location Button** - Recenter map về vị trí hiện tại
- ✅ **Stats Badge** - Hiển thị số lượng địa điểm
- ✅ **Loading Spinner** - Beautiful loading state

### Mock Data
- 12 quán ăn với coordinates thật ở TP.HCM
- 4 categories với màu sắc riêng
- Images từ Unsplash
- Thông tin đầy đủ: giờ mở cửa, rating, reviews

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm hoặc yarn

### Installation

```bash
# Clone hoặc navigate to project
cd web_kbang

# Install dependencies
npm install

# Run development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem demo.

## 📁 Project Structure

```
web_kbang/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage với map
│   └── globals.css          # Global styles + animations
├── components/
│   ├── Map/
│   │   ├── MapView.tsx      # Main map container
│   │   ├── ShopMarker.tsx   # Custom marker component
│   │   ├── ShopPopup.tsx    # Popup khi click marker
│   │   └── CurrentLocationMarker.tsx
│   └── ui/
│       ├── CategoryFilter.tsx
│       ├── LocationButton.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── mockData.ts          # Mock shops + categories
│   └── utils.ts             # Helper functions
└── docs/
    └── plans/
        └── 2026-02-16-map-demo-frontend-design.md
```

## 🎨 Design Highlights

### Custom Markers

Markers được thiết kế với:
- Circular background màu theo category
- Emoji icon ở giữa
- Tail nhọn ở dưới (pointing to location)
- Drop shadow cho depth
- Hover scale effect (110%)
- Pop-in animation khi load

### Color Scheme

| Category | Icon | Color |
|----------|------|-------|
| Quán ăn sáng | 🥖 | #FF6B6B (Red) |
| Quán cơm | 🍚 | #4ECDC4 (Teal) |
| Quán nhậu | 🍺 | #FFE66D (Yellow) |
| Quán cafe | ☕ | #95E1D3 (Mint) |

### Animations

- **Marker Pop-in**: Cubic bezier với bounce effect
- **User Location**: Pulsing blue dot
- **Hover States**: Scale transforms
- **Category Buttons**: Framer Motion whileHover/whileTap
- **Map Transitions**: Smooth flyTo() animations

## 🛠️ Tech Details

### Dependencies

```json
{
  "react-leaflet": "^4.2.1",     // React wrapper cho Leaflet
  "leaflet": "^1.9.4",           // Map library
  "framer-motion": "^11.0.0",    // Animations
  "lucide-react": "^0.321.0"     // Icons
}
```

### Key Files

- **MapView.tsx**: Main map với Leaflet integration
- **ShopMarker.tsx**: Custom divIcon với SVG-like HTML
- **mockData.ts**: 12 shops với real TP.HCM coordinates
- **globals.css**: Custom Leaflet overrides + animations

## 📱 Responsive Behavior

- **Desktop**: Full-screen map, floating filters top-left
- **Mobile**: Popups max-width 90vw, touch-friendly buttons
- **Tablet**: Adaptive layout

## ⚡ Performance

- **Dynamic Import**: Leaflet loaded client-side only (no SSR)
- **Lazy Images**: Next.js Image optimization
- **CSS Animations**: Hardware-accelerated transforms
- **Bundle Size**: ~127KB First Load JS

## 🎯 Next Steps (Not in MVP)

- [ ] Search bar với autocomplete
- [ ] Menu preview trong popup  
- [ ] Real-time data từ backend
- [ ] User authentication
- [ ] Marker clustering (khi >50 shops)
- [ ] Directions integration
- [ ] Reviews preview

## 🐛 Known Issues

- `.eslintrc.json` có thể cần update rules
- Geolocation permission cần HTTPS trong production
- OpenStreetMap tiles có rate limiting (consider Mapbox cho production)

## 📝 Development Notes

### Running Commands

```bash
# Development
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Environment Variables

Không cần env vars cho demo này. Nếu migrate sang Google Maps hoặc Mapbox:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_token
```

## 🤝 Contributing

Project này là demo MVP. Để extend:

1. Add real API integration trong lib/
2. Replace mock data với API calls
3. Add authentication layer
4. Implement remaining features từ design doc

## 📄 License

Private project - Web Kbang Demo

## 👤 Author

Design & Implementation: 2026-02-16

---

**🎉 Demo ready!** Open http://localhost:3000 và khám phá map interactive!
