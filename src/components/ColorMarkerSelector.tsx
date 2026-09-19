import React from 'react';
import { MarkerColor } from '../types';
import { Check } from 'lucide-react';

interface ColorMarkerSelectorProps {
  markers: MarkerColor[];
  selectedMarker: MarkerColor;
  onMarkerSelected: (marker: MarkerColor) => void;
  className?: string;
}

export const ColorMarkerSelector: React.FC<ColorMarkerSelectorProps> = ({
  markers,
  selectedMarker,
  onMarkerSelected,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 px-2 py-1 ${className}`}>
      {markers.map((marker, index) => {
        const isSelected = marker.id === selectedMarker.id;
        const shortName = marker.name.split(' ')[0]; // e.g. "Bubblegum", "Sunshine", "Mint"

        return (
          <button
            key={marker.id}
            id={`marker_button_${index}`}
            type="button"
            onClick={() => onMarkerSelected(marker)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all duration-200 cursor-pointer border ${
              isSelected
                ? 'bg-white shadow-md scale-105'
                : 'bg-[#F8FAFC] hover:bg-white text-[#546E7A] border-[#E2E8F0] shadow-xs'
            }`}
            style={{
              borderColor: isSelected ? marker.primaryColor : '#E2E8F0',
              borderWidth: isSelected ? '2.5px' : '1.5px',
              boxShadow: isSelected ? `0 6px 16px ${marker.primaryColor}30` : undefined,
            }}
          >
            {/* Color Swatch Circle */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs transition-transform"
              style={{ backgroundColor: marker.primaryColor }}
            >
              {isSelected && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
            </div>

            <span
              className="text-xs font-bold tracking-tight"
              style={{
                color: isSelected ? marker.primaryColor : '#546E7A',
              }}
            >
              {shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
};
