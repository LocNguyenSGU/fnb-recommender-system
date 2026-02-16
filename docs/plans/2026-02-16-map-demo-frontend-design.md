# Map Demo Frontend Design

**Ngày:** 2026-02-16  
**Tác giả:** Frontend Design  
**Trạng thái:** Validated

## Mục Tiêu

Xây dựng demo frontend đầu tiên cho hệ thống web địa phương với interactive map, custom markers đẹp mắt, và UX mượt mà. Focus vào UI/UX impressive cho demo presentation.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Map Library:** React Leaflet + Leaflet
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Design Principles

### 1. Visual First
- Custom circular markers với emoji thay vì pins truyền thống
- Smooth animations cho mọi interactions
- Color coding theo categories
- Professional popups với images, ratings

### 2. User Experience
- Auto-detect user location và center map
- One-click recenter về vị trí hiện tại
- Category filtering dễ access
- Staggered marker animations (không overwhelming)

### 3. Performance
- Dynamic import Leaflet (tránh SSR issues)
- Loading states đẹp mắt
- Optimized bundle với tree-shaking

## Component Architecture

```
app/
├── page.tsx                 # Main page with map
├── layout.tsx               # Root layout
└── globals.css              # Tailwind + custom styles

components/
├── Map/
│   ├── MapView.tsx         # Container với Leaflet MapContainer
│   ├── ShopMarker.tsx      # Custom marker với popup
│   └── ShopPopup.tsx       # Popup content (shop details)
└── ui/
    ├── CategoryFilter.tsx  # Floating category filter
    └── LocationButton.tsx  # Recenter button

lib/
├── types.ts                # TypeScript interfaces
└── mockData.ts             # Mock shops + categories

public/
└── images/                 # Mock shop images
```

## Core Features

### 1. Interactive Map

**MapView Component:**
- Leaflet map với OpenStreetMap tiles (free)
- Auto-detect user location via Geolocation API
- Dynamic marker rendering based on filtered data
- Custom zoom controls positioning

**Key Props:**
```typescript
interface MapViewProps {
  shops: Shop[];
  selectedCategory?: number;
  onMapReady: (map: any) => void;
}
```

**Implementation Highlights:**
- `dynamic()` import to avoid SSR
- Loading spinner during initialization
- `flyTo()` animation for smooth transitions

### 2. Custom Markers

**Design:**
```
┌─────────────┐
│   Circular  │
│   bg-color  │  ← Category color
│   + emoji   │  ← Category icon
└──────┬──────┘
       │         ← Tail pointing down
       ▼
```

**Features:**
- CSS `divIcon` cho full customization
- Hover scale effect (110%)
- Drop shadow cho depth
- Staggered pop-in animation
- Click → open popup

**Animation:**
```css
@keyframes markerPop {
  0%: scale(0) + translateY(-20px)
  50%: scale(1.2)
  100%: scale(1)
}
```

### 3. Shop Popup

**Content Layout:**
```
┌──────────────────────────┐
│  [Cover Image]           │
├──────────────────────────┤
│  Shop Name               │
│  ★ 4.5 (128 đánh giá)   │
│  [Category Badge]        │
│  📍 Address              │
│  🕐 6:00-22:00 • Mở cửa │
│  [Xem chi tiết button]  │
└──────────────────────────┘
```

**Features:**
- Image preview (fallback if none)
- Star rating visualization
- Open/Closed status (real-time check)
- Clean, card-like design

### 4. Category Filter

**Position:** Top-left floating
**Design:** Vertical button list
**Features:**
- "Tất cả" button (clear filter)
- Each category with emoji + name
- Active state với category color
- Smooth hover animations (Framer Motion)

### 5. Location Button

**Position:** Bottom-right floating
**Icon:** Crosshair (target symbol)
**Action:** Recenter map to user location with smooth flyTo animation

## Data Model

### Shop Interface

```typescript
interface Shop {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_time: string;    // "HH:MM"
  close_time: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  rating?: number;
  review_count?: number;
}
```

### Category Interface

```typescript
interface Category {
  id: number;
  name: string;
  icon: string;         // Emoji
  color: string;        // Hex color for markers
}
```

### Mock Data Strategy

**Categories:**
- Quán ăn sáng (🥖, #FF6B6B)
- Quán cơm (🍚, #4ECDC4)
- Quán nhậu (🍺, #FFE66D)
- Quán cafe (☕, #95E1D3)

**Shops:**
- 10-15 mock shops
- Real coordinates trong khu vực TP.HCM (10.7-10.8 lat, 106.6-106.7 lng)
- Diverse categories
- Realistic names, addresses, hours

## Styling Approach

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'marker-pop': 'markerPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  }
}
```

### Custom CSS

**Leaflet Overrides:**
- Rounded popup corners (12px)
- Hide default popup tip (custom tail in marker)
- Mobile-responsive popup width

**Animations:**
- Marker pop-in với bounce effect
- Smooth hover transitions
- Category filter button scale effects

### Responsive Design

**Desktop (>1024px):**
- Full-screen map
- Floating filters left (4rem from edge)
- Stats badge top-right

**Mobile (<640px):**
- Full-screen map (100vh)
- Popup max-width 90vw
- Touch-friendly button sizes (min 44px)

## User Flows

### Flow 1: Initial Load

1. User lands on homepage
2. Show loading spinner
3. Request geolocation permission
4. Map loads centered on user location
5. Markers pop in with staggered animation
6. UI elements fade in

### Flow 2: Filter by Category

1. User clicks category button
2. Button highlights with category color
3. Map markers filter instantly
4. Non-matching markers fade out
5. Stats badge updates count

### Flow 3: View Shop Details

1. User clicks marker
2. Popup opens with smooth animation
3. Image loads (or shows placeholder)
4. Rating, hours, address display
5. "Xem chi tiết" button (future: navigate to detail page)

### Flow 4: Recenter Map

1. User clicks location button
2. Button pulses briefly
3. Map smoothly flies to user location (1.5s duration)
4. Zoom adjusts to 15

## Technical Considerations

### Leaflet SSR Issues

**Problem:** Leaflet uses `window` object → breaks Next.js SSR

**Solution:**
```tsx
const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### Geolocation Fallback

**Default:** TP.HCM center (10.7769, 106.7009)
**User location:** Override if permission granted
**Error handling:** Silently fall back to default

### Performance Optimization

1. **Marker clustering** (future): If >50 shops, cluster nearby markers
2. **Lazy image loading:** Popup images load on-demand
3. **Memoization:** Memoize filtered shops computation
4. **CSS animations:** Prefer CSS over JS for smoothness

## File Structure

```
web_kbang/
├── app/
│   ├── layout.tsx           
│   ├── page.tsx             
│   ├── globals.css          
│   └── favicon.ico
├── components/
│   ├── Map/
│   │   ├── MapView.tsx
│   │   ├── ShopMarker.tsx
│   │   ├── ShopPopup.tsx
│   │   └── CurrentLocationMarker.tsx
│   └── ui/
│       ├── CategoryFilter.tsx
│       ├── LocationButton.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── types.ts
│   ├── mockData.ts
│   └── utils.ts             # Helper functions (isOpen, etc.)
├── public/
│   └── images/
│       └── shops/           # Mock shop images
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.321.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/leaflet": "^1.9.8",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

## Future Enhancements

### Phase 2 (Not in MVP)
- Search bar với autocomplete
- Menu preview trong popup
- Review preview (latest review)
- "Chỉ đường" button → Google Maps integration

### Phase 3
- Marker clustering cho performance
- Heatmap layer (popular areas)
- Filter by distance radius
- "Nearby me" quick filter

### Phase 4
- Real-time data từ backend
- User authentication
- Save favorites (bookmark icon in popup)
- Share location link

## Testing Strategy

### Manual Testing Checklist

**Map Functionality:**
- [ ] Map loads without errors
- [ ] User location detected correctly
- [ ] Markers render at correct positions
- [ ] Panning and zooming work smoothly

**Interactions:**
- [ ] Click marker → popup opens
- [ ] Click category → filters work
- [ ] Location button → recenters map
- [ ] Hover states work correctly

**Responsive:**
- [ ] Desktop: UI elements positioned correctly
- [ ] Mobile: Popups readable, buttons touchable
- [ ] Tablet: Hybrid layout works

**Edge Cases:**
- [ ] Geolocation denied → falls back to default
- [ ] No shops in category → shows empty state
- [ ] Image 404 → shows placeholder
- [ ] Slow network → loading states show

## Performance Targets

- **Initial Load:** <2s on 3G
- **Time to Interactive:** <3s
- **Marker Animation:** 60fps
- **Bundle Size:** <300KB (gzipped)

## Accessibility

- Semantic HTML in popups
- ARIA labels cho buttons
- Keyboard navigation support (future)
- Alt text cho images
- Color contrast WCAG AA compliant

## Conclusion

Design này tạo ra một demo frontend impressive với:

✅ **Visual Impact:** Custom markers đẹp, animations mượt  
✅ **User Experience:** Intuitive, responsive, smooth  
✅ **Performance:** Fast load, optimized rendering  
✅ **Scalability:** Structure sẵn sàng cho real backend integration  

**Next Steps:**
1. Setup Next.js project
2. Install dependencies
3. Implement components theo design
4. Test UI/UX flow
5. Polish animations và styling
