'use client';

import { useState } from 'react';
import StoreMarker from './StoreMarker';

const mockCoordinates = [
  { id: '1', lat: 25.276987, lng: 55.296249 },
  { id: '2', lat: 25.204849, lng: 55.270783 },
  { id: '3', lat: 25.197197, lng: 55.274376 },
];

export default function StoresMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <div className="absolute inset-0">
        <img
          alt="Map placeholder"
          className="h-full w-full object-cover"
          src="/images/hero-bg.jpg"
        />
      </div>
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {mockCoordinates.map((coordinate) => (
          <StoreMarker
            key={coordinate.id}
            active={activeId === coordinate.id}
            storeId={coordinate.id}
            onSelect={() => setActiveId(coordinate.id)}
          />
        ))}
      </div>
    </div>
  );
}
