'use client';

import { Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationButtonProps {
  onClick: () => void;
}

export default function LocationButton({ onClick }: LocationButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute bottom-24 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      title="Về vị trí của tôi"
    >
      <Crosshair className="w-6 h-6 text-blue-600" />
    </motion.button>
  );
}
