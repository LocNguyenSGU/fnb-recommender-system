'use client';

import React from 'react';

interface DataPoint {
  name: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 300;
  const height = 200;
  const padding = 40;

  const points = data.map((point, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex justify-center">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          <text x="10" y={padding} className="text-xs fill-gray-600" textAnchor="middle">{maxValue}</text>
          <text x="10" y={height - padding} className="text-xs fill-gray-600" textAnchor="middle">{minValue}</text>

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                className="text-xs fill-gray-600"
                textAnchor="middle"
              >
                {point.name}
              </text>
            );
          })}

          {/* Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
            const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}