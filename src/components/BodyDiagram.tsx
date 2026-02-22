import { useState } from 'react';

interface MeasurementPoint {
  id: string;
  x: number;
  y: number;
  value: number;
  label: string;
  note: string;
}

interface BodyDiagramProps {
  gender: 'Male' | 'Female';
  measurementPoints: MeasurementPoint[];
}

export function BodyDiagram({ gender, measurementPoints }: BodyDiagramProps) {
  const [hoveredPoint, setHoveredPoint] = useState<MeasurementPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (point: MeasurementPoint, event: React.MouseEvent) => {
    setHoveredPoint(point);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const getColorForValue = (value: number) => {
    if (value < 24) return '#ef4444'; // Red - Low threshold (more sensitive)
    if (value < 28) return '#f59e0b'; // Orange - Moderate
    if (value < 32) return '#10b981'; // Green - Good
    return '#3b82f6'; // Blue - Excellent
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 120"
        className="w-full h-auto"
        style={{ maxHeight: '300px' }}
      >
        {/* Head outline */}
        {gender === 'Male' ? (
          <>
            {/* Male face shape - more angular */}
            <ellipse cx="50" cy="25" rx="18" ry="22" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="0.5" />
            {/* Neck */}
            <rect x="45" y="42" width="10" height="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="0.5" />
            {/* Shoulders */}
            <path d="M 30 50 Q 40 48 45 50 L 45 55 L 30 58 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
            <path d="M 70 50 Q 60 48 55 50 L 55 55 L 70 58 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
            {/* Facial features */}
            <circle cx="43" cy="22" r="1.5" fill="#6b7280" />
            <circle cx="57" cy="22" r="1.5" fill="#6b7280" />
            <path d="M 45 30 Q 50 32 55 30" fill="none" stroke="#9ca3af" strokeWidth="0.5" />
          </>
        ) : (
          <>
            {/* Female face shape - more rounded */}
            <ellipse cx="50" cy="25" rx="17" ry="21" fill="#fef3f2" stroke="#f8b4b4" strokeWidth="0.5" />
            {/* Neck */}
            <rect x="46" y="42" width="8" height="8" fill="#fef3f2" stroke="#f8b4b4" strokeWidth="0.5" />
            {/* Shoulders */}
            <path d="M 30 50 Q 40 48 46 50 L 46 55 L 30 58 Z" fill="#fce7e6" stroke="#f8b4b4" strokeWidth="0.5" />
            <path d="M 70 50 Q 60 48 54 50 L 54 55 L 70 58 Z" fill="#fce7e6" stroke="#f8b4b4" strokeWidth="0.5" />
            {/* Facial features */}
            <circle cx="43" cy="22" r="1.5" fill="#8b5a5a" />
            <circle cx="57" cy="22" r="1.5" fill="#8b5a5a" />
            <path d="M 45 30 Q 50 32 55 30" fill="none" stroke="#f8b4b4" strokeWidth="0.5" />
            {/* Hair indication */}
            <path d="M 32 15 Q 32 8 40 6 Q 50 5 60 6 Q 68 8 68 15" fill="#6b5b5b" opacity="0.3" />
          </>
        )}

        {/* Measurement points */}
        {measurementPoints.map((point) => (
          <g key={point.id}>
            {/* Glow effect for hovered point */}
            {hoveredPoint?.id === point.id && (
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={getColorForValue(point.value)}
                opacity="0.3"
              />
            )}
            
            {/* Main point */}
            <circle
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill={getColorForValue(point.value)}
              stroke="white"
              strokeWidth="0.5"
              className="cursor-pointer transition-all"
              onMouseEnter={(e) => handleMouseEnter(point, e)}
              onMouseLeave={handleMouseLeave}
              style={{
                filter: hoveredPoint?.id === point.id ? 'drop-shadow(0 0 3px rgba(0,0,0,0.5))' : 'none',
                transform: hoveredPoint?.id === point.id ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: `${point.x}px ${point.y}px`
              }}
            />

            {/* Point label */}
            <text
              x={point.x}
              y={point.y - 4}
              textAnchor="middle"
              className="text-[3px] fill-gray-600 pointer-events-none"
            >
              {point.value}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-gray-700">&lt;24 (Low)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-gray-700">24-28</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-gray-700">28-32</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
          <span className="text-gray-700">&gt;32 (High)</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
          }}
        >
          <div className="space-y-1">
            <p className="font-semibold">{hoveredPoint.label}</p>
            <p className="text-blue-300">Reading: {hoveredPoint.value} N/cm²</p>
            <p className="text-gray-300 text-xs mt-2 border-t border-gray-700 pt-2">
              Doctor's Note: {hoveredPoint.note}
            </p>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
