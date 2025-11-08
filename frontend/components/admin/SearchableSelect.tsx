"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface SearchableSelectOption {
  value: string;
  label: string;
  secondaryLabel?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  emptyText?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "اختر عنصر...",
  searchPlaceholder = "ابحث...",
  disabled = false,
  className,
  emptyText = "لا توجد نتائج",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`searchable-select-${Math.random().toString(36).substr(2, 9)}`).current;

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(search.toLowerCase())
  );

  // Focus search input when popover opens, clear search when it closes
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      // Reset focused index when opening
      setFocusedIndex(-1);
    } else if (!open) {
      setSearch("");
      setFocusedIndex(-1);
    }
  }, [open]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listboxRef.current) {
      const optionElement = listboxRef.current.querySelector(
        `[data-index="${focusedIndex}"]`
      ) as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [focusedIndex]);

  // Keyboard navigation handler for trigger
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setOpen(!open);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  // Keyboard navigation handler for search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value);
          setOpen(false);
          setSearch("");
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const focusedOptionId =
    focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          disabled={disabled}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-controls={listboxId}
            aria-activedescendant={focusedOptionId}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={placeholder}
          className="max-h-[300px] overflow-y-auto p-1"
        >
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              if (!option || !option.value) return null;
              
              return (
                <button
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={value === option.value}
                  data-index={index}
                  tabIndex={-1}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent",
                    focusedIndex === index && "bg-accent/50"
                  )}
                >
                  <Check
                    className={cn(
                      "me-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col items-start">
                    <span>{option.label || ''}</span>
                    {option.secondaryLabel && (
                      <span className="text-xs text-muted-foreground">
                        {option.secondaryLabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
