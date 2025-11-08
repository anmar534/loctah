"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

/**
 * Validates that a URL is a safe http(s) image URL
 * Prevents dangerous protocols like javascript:, data:, file:, etc.
 */
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url.trim());
    // Only allow http and https protocols
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    // Invalid URL format
    return false;
  }
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track blob URLs created by this component for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const images = Array.isArray(value) ? value : value ? [value] : [];

  // Cleanup: Revoke all blob URLs on unmount
  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      // Revoke all tracked blob URLs when component unmounts
      blobUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      blobUrls.clear();
    };
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const fileArray = Array.from(files);
    
    // Filter by type first
    const typeValidFiles = fileArray.filter((file) =>
      acceptedTypes.includes(file.type)
    );

    // Track files that fail validation for user feedback
    const oversizedFiles = typeValidFiles.filter((file) => file.size > MAX_FILE_SIZE);
    
    // Filter by size (only files that pass both type and size checks)
    const validFiles = typeValidFiles.filter((file) => file.size <= MAX_FILE_SIZE);

    // Show error messages for invalid files
    if (typeValidFiles.length === 0) {
      showToast({
        title: "خطأ",
        description: "يرجى اختيار صور بصيغة صحيحة (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (oversizedFiles.length > 0) {
      showToast({
        title: "خطأ",
        description: `الحد الأقصى 10MB لكل ملف. تم رفض ${oversizedFiles.length} ملف`,
        variant: "destructive",
      });
      if (validFiles.length === 0) return; // All files were oversized
    }

    if (multiple && images.length + validFiles.length > maxFiles) {
      showToast({
        title: "خطأ",
        description: `الحد الأقصى ${maxFiles} صور`,
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would upload these to a server/CDN
    // For now, we'll create local URLs and track them
    const urls = validFiles.map((file) => {
      const blobUrl = URL.createObjectURL(file);
      // Track this blob URL for cleanup
      blobUrlsRef.current.add(blobUrl);
      return blobUrl;
    });

    if (multiple) {
      onChange([...images, ...urls].slice(0, maxFiles));
    } else {
      onChange(urls[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (index: number) => {
    const urlToRemove = images[index];
    
    // Revoke blob URL if it's a blob URL created by this component
    if (urlToRemove && urlToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(urlToRemove);
      blobUrlsRef.current.delete(urlToRemove);
    }
    
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // No-op if disabled
    if (disabled) return;

    // Handle Enter or Space key
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent Space from scrolling
      handleBrowse();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {(!multiple || images.length < maxFiles) && (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled ? "true" : "false"}
          aria-label="منطقة رفع الصور"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowse}
          onKeyDown={handleKeyDown}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
            aria-label="اختيار ملف صورة"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            اسحب وأفلت الصورة هنا، أو انقر للتصفح
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP حتى 10MB
            {multiple && ` (الحد الأقصى ${maxFiles} صور)`}
          </p>
        </div>
      )}

      {/* Images Preview */}
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
          )}
        >
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
            >
              <img
                src={url}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  aria-label={`حذف صورة ${index + 1}`}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {multiple && images.length > 1 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                  {index === 0 ? "رئيسية" : index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alternative: URL Input */}
      {images.length === 0 && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="أو أدخل رابط الصورة"
            disabled={disabled}
            onChange={(e) => {
              const url = e.target.value.trim();
              if (url) {
                // Validate URL for security
                if (!isValidImageUrl(url)) {
                  showToast({
                    title: "خطأ",
                    description: "رابط غير صالح. يُسمح فقط بروابط HTTP أو HTTPS",
                    variant: "destructive",
                  });
                  e.target.value = "";
                  return;
                }

                if (multiple) {
                  onChange([...images, url]);
                } else {
                  onChange(url);
                }
                e.target.value = "";
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = e.currentTarget.value.trim();
                if (url) {
                  // Validate URL for security
                  if (!isValidImageUrl(url)) {
                    showToast({
                      title: "خطأ",
                      description: "رابط غير صالح. يُسمح فقط بروابط HTTP أو HTTPS",
                      variant: "destructive",
                    });
                    e.currentTarget.value = "";
                    return;
                  }

                  if (multiple) {
                    onChange([...images, url]);
                  } else {
                    onChange(url);
                  }
                  e.currentTarget.value = "";
                }
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
}
