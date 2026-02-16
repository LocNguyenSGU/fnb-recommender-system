'use client';

import { CATEGORIES } from '@/lib/mockData';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  selectedCategory?: number;
  onSelectCategory: (categoryId?: number) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-3 max-w-[200px]">
      <h4 className="text-sm font-semibold mb-2 text-gray-700">Danh mục</h4>

      <div className="flex flex-col gap-2">
        {/* All categories button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(undefined)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Tất cả
        </motion.button>

        {/* Category buttons */}
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={
              selectedCategory === cat.id
                ? { backgroundColor: cat.color }
                : {}
            }
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="flex-1 text-left">{cat.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
