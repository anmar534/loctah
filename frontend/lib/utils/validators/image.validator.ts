/**
 * Image Validator
 * 
 * Validation functions for image files.
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate image file size
 * 
 * @param file - Image file to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns Validation result
 */
export function validateImageSize(
  file: File,
  maxSizeMB: number = 5
): ImageValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `حجم الصورة يجب أن يكون أقل من ${maxSizeMB} ميجابايت`,
    };
  }

  return { isValid: true };
}

/**
 * Validate image file format
 * 
 * @param file - Image file to validate
 * @param allowedFormats - Allowed MIME types
 * @returns Validation result
 */
export function validateImageFormat(
  file: File,
  allowedFormats: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
): ImageValidationResult {
  if (!allowedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: 'صيغة الصورة غير مدعومة. الصيغ المسموحة: JPEG, PNG, WebP',
    };
  }

  return { isValid: true };
}

/**
 * Validate image dimensions
 * 
 * @param file - Image file to validate
 * @param minWidth - Minimum width in pixels
 * @param minHeight - Minimum height in pixels
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @returns Promise<ImageValidationResult>
 */
export async function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (minWidth && img.width < minWidth) {
        resolve({
          isValid: false,
          error: `عرض الصورة يجب أن يكون على الأقل ${minWidth} بكسل`,
        });
        return;
      }

      if (minHeight && img.height < minHeight) {
        resolve({
          isValid: false,
          error: `ارتفاع الصورة يجب أن يكون على الأقل ${minHeight} بكسل`,
        });
        return;
      }

      if (maxWidth && img.width > maxWidth) {
        resolve({
          isValid: false,
          error: `عرض الصورة يجب أن لا يتجاوز ${maxWidth} بكسل`,
        });
        return;
      }

      if (maxHeight && img.height > maxHeight) {
        resolve({
          isValid: false,
          error: `ارتفاع الصورة يجب أن لا يتجاوز ${maxHeight} بكسل`,
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'فشل تحميل الصورة',
      });
    };

    img.src = url;
  });
}

/**
 * Validate image aspect ratio
 * 
 * @param file - Image file to validate
 * @param expectedRatio - Expected aspect ratio (e.g., 16/9)
 * @param tolerance - Tolerance for ratio matching (default: 0.1)
 * @returns Promise<ImageValidationResult>
 */
export async function validateImageAspectRatio(
  file: File,
  expectedRatio: number,
  tolerance: number = 0.1
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const actualRatio = img.width / img.height;
      const diff = Math.abs(actualRatio - expectedRatio);

      if (diff > tolerance) {
        resolve({
          isValid: false,
          error: `نسبة أبعاد الصورة غير صحيحة. المطلوب: ${expectedRatio.toFixed(2)}`,
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'فشل تحميل الصورة',
      });
    };

    img.src = url;
  });
}

/**
 * Validate all image constraints
 * 
 * @param file - Image file to validate
 * @param options - Validation options
 * @returns Promise<ImageValidationResult>
 */
export async function validateImage(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedFormats?: string[];
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<ImageValidationResult> {
  // Validate format
  const formatResult = validateImageFormat(file, options.allowedFormats);
  if (!formatResult.isValid) return formatResult;

  // Validate size
  const sizeResult = validateImageSize(file, options.maxSizeMB);
  if (!sizeResult.isValid) return sizeResult;

  // Validate dimensions if specified
  if (
    options.minWidth ||
    options.minHeight ||
    options.maxWidth ||
    options.maxHeight
  ) {
    const dimensionsResult = await validateImageDimensions(
      file,
      options.minWidth,
      options.minHeight,
      options.maxWidth,
      options.maxHeight
    );
    if (!dimensionsResult.isValid) return dimensionsResult;
  }

  return { isValid: true };
}

