'use client';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TabsProps = {
  tabs: { id: string; label: string; content: ReactNode }[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  // Validate defaultTab exists in tabs array, otherwise fall back to first tab
  const getInitialTab = () => {
    if (tabs.length === 0) return '';
    if (defaultTab && tabs.some((tab) => tab.id === defaultTab)) {
      return defaultTab;
    }
    return tabs[0].id;
  };

  const [activeId, setActiveId] = useState(getInitialTab());
  const activeTab = tabs.find((tab) => tab.id === activeId);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (shouldFocusRef.current) {
      const activeButton = tabRefs.current.get(activeId);
      if (activeButton) {
        activeButton.focus();
      }
      shouldFocusRef.current = false;
    }
  }, [activeId]);

  // Early return if no tabs to prevent invalid ARIA IDs
  if (tabs.length === 0) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex + 1 >= tabs.length ? 0 : currentIndex + 1;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    shouldFocusRef.current = true;
    setActiveId(tabs[newIndex].id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(tab.id, el);
              } else {
                tabRefs.current.delete(tab.id);
              }
            }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeId === tab.id ? 'true' : 'false'}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              activeId === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        role="tabpanel"
        id={`tabpanel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
      >
        {activeTab?.content}
      </div>
    </div>
  );
}
