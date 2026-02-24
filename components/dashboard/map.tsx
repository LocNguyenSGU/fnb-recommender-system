'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import MapView from '@/components/Map/MapView';
import { Shop } from '@/lib/types';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MapProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: number | undefined) => void;
  selectedCategory?: number;
  shops: Shop[];
  userLocation: [number, number];
  onMapReady?: (map: any) => void;
}

const CATEGORIES = [
  { id: 1, name: 'Italian', emoji: '🍝' },
  { id: 2, name: 'Japanese', emoji: '🍱' },
  { id: 3, name: 'American', emoji: '🍔' },
  { id: 4, name: 'Cafes', emoji: '☕' },
  { id: 5, name: 'Vegetarian', emoji: '🥗' },
  { id: 6, name: 'Chinese', emoji: '🍜' },
  { id: 7, name: 'Mexican', emoji: '🌮' },
  { id: 8, name: 'Desserts', emoji: '🍰' },
];

export default function Map({ onSearch, onCategorySelect, selectedCategory, shops, userLocation, onMapReady }: MapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll trigger for header - reveals gradually on scroll
    gsap.fromTo(
      headerRef.current,
      { opacity: 0.3, y: 20 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    if (onCategorySelect) {
      onCategorySelect(selectedCategory === categoryId ? undefined : categoryId);
    }
  };

  return (
    <div ref={contentRef} className="w-full bg-gray-50 px-6 py-8">
      {/* Header Section */}
      <div ref={headerRef} className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          DISCOVER YOUR NEXT MEAL
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Search through thousands of restaurants and find exactly what you're craving
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 items-center justify-between">
        {/* Left Sidebar - Search & Filter */}
        <div className="w-80 bg-white p-6 rounded-lg overflow-y-auto flex-shrink-0 ml-24">
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="font-bold text-gray-900 mb-4 text-base">Search Restaurants</h2>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cuisine, dish, or restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Search Now
            </button>
          </div>

          {/* Categories Section */}
          <div>
            <h2 className="font-bold text-gray-900 mb-4 text-base">Popular Categories</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`p-3 rounded-lg border-2 transition duration-200 flex flex-col items-center justify-center gap-1 font-medium ${
                    selectedCategory === category.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span className="text-xl">{category.emoji}</span>
                  <span className="text-xs">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Map Area */}
        <div className="flex-1 flex justify-center">
          <div className="w-[900px] h-[600px] rounded-2xl border-4 border-blue-500 overflow-hidden shadow-lg">
            <MapView
              shops={shops}
              selectedCategory={selectedCategory}
              onMapReady={onMapReady}
              userLocation={userLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
