'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RadioGroupContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export function RadioGroup({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const value = controlledValue ?? uncontrolledValue;

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        setValue: (next) => {
          setUncontrolledValue(next);
          onValueChange?.(next);
        },
      }}
    >
      <div className={cn('flex flex-col gap-2', className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, children }: { value: string; children: ReactNode }) {
  const context = useRadioGroup();

  return (
    <label className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
      <input
        checked={context.value === value}
        className="h-4 w-4 rounded-full border border-slate-300 text-slate-900 focus:ring-slate-400"
        name="radio-group"
        onChange={() => context.setValue(value)}
        type="radio"
        value={value}
      />
      {children}
    </label>
  );
}

function useRadioGroup() {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error('RadioGroup components must be used within <RadioGroup>.');
  }

  return context;
}
