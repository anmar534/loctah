'use client';

import { useState, useRef, useEffect } from 'react';
import StoreMarker from './StoreMarker';

const mockCoordinates = [
  { id: '1', lat: 25.276987, lng: 55.296249 },
  { id: '2', lat: 25.204849, lng: 55.270783 },
  { id: '3', lat: 25.197197, lng: 55.274376 },
];

// Marker dimensions (48px total, so half is 24px for centering)
const MARKER_HALF_SIZE = 24;

// Minimum coordinate range to prevent division by zero
const MIN_COORDINATE_RANGE = 0.0001;

// Default container dimensions (fallback before measurement)
const DEFAULT_CONTAINER_WIDTH = 800;
const DEFAULT_CONTAINER_HEIGHT = 420;

// Simple lat/lng to pixel conversion for mock coordinates
// Maps the coordinate bounds to the container dimensions
function latLngToPixel(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  markerHalfSize: number = MARKER_HALF_SIZE
) {
  // Calculate coordinate ranges with fallback for degenerate bounds
  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;
  
  // Use safe denominators (prevent division by zero)
  const safeLngRange = lngRange > MIN_COORDINATE_RANGE ? lngRange : MIN_COORDINATE_RANGE;
  const safeLatRange = latRange > MIN_COORDINATE_RANGE ? latRange : MIN_COORDINATE_RANGE;
  
  // Normalize coordinates to 0-1 range
  const x = (lng - bounds.minLng) / safeLngRange;
  const y = 1 - (lat - bounds.minLat) / safeLatRange; // Invert Y axis (north is up)
  
  // Add padding (10%) and center offset for marker size
  const padding = 0.1;
  const left = padding * width + x * (width * (1 - 2 * padding)) - markerHalfSize;
  const top = padding * height + y * (height * (1 - 2 * padding)) - markerHalfSize;
  
  return { left, top };
}

export default function StoresMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);
  const [containerHeight, setContainerHeight] = useState(DEFAULT_CONTAINER_HEIGHT);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container dimensions and subscribe to resize events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial measurement
    const updateDimensions = () => {
      setContainerWidth(container.clientWidth);
      setContainerHeight(container.clientHeight);
    };

    // Measure immediately
    updateDimensions();

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.contentRect.width);
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate bounds from mock coordinates
  const lats = mockCoordinates.map((c) => c.lat);
  const lngs = mockCoordinates.map((c) => c.lng);
  const bounds = {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
    >
      <div className="absolute inset-0">
        <img
          alt="Map placeholder"
          className="h-full w-full object-cover"
          src="/images/hero-bg.jpg"
        />
      </div>
      <div className="relative z-10 h-full w-full">
        {mockCoordinates.map((coordinate) => {
          const { left, top } = latLngToPixel(
            coordinate.lat,
            coordinate.lng,
            bounds,
            containerWidth,
            containerHeight
          );
          return (
            <div
              key={coordinate.id}
              className="absolute"
              style={{ left: `${left}px`, top: `${top}px`, pointerEvents: 'auto' }}
            >
              <StoreMarker
                active={activeId === coordinate.id}
                storeId={coordinate.id}
                onSelect={() => setActiveId(coordinate.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
