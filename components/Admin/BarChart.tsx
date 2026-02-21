'use client';

import React from 'react';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const width = 300;
  const height = 200;
  const padding = 40;
  const barWidth = (width - 2 * padding) / data.length - 10;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex justify-center">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Grid lines */}
          <defs>
            <pattern id="grid-bars" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-bars)" />

          {/* Y-axis labels */}
          <text x="10" y={padding} className="text-xs fill-gray-600" textAnchor="middle">{maxValue}</text>
          <text x="10" y={height - padding} className="text-xs fill-gray-600" textAnchor="middle">0</text>

          {/* Bars */}
          {data.map((point, index) => {
            const x = padding + index * ((width - 2 * padding) / data.length);
            const barHeight = ((point.value / maxValue) * (height - 2 * padding));
            const y = height - padding - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={point.color || "#10b981"}
                  className="hover:opacity-80 transition-all"
                />
                {/* Value label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  className="text-xs fill-gray-700 font-semibold"
                  textAnchor="middle"
                >
                  {point.value}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = padding + index * ((width - 2 * padding) / data.length) + barWidth / 2;
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                className="text-xs fill-gray-600"
                textAnchor="middle"
                transform={`rotate(-45, ${x}, ${height - 10})`}
              >
                {point.name}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}