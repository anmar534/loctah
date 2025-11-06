export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateRequired(value: unknown, message = 'This field is required'): ValidationResult {
  const isValid = typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
  return isValid ? { valid: true } : { valid: false, message };
}

export function validateEmail(value: string, message = 'Enter a valid email address'): ValidationResult {
  const trimmed = value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(trimmed) ? { valid: true } : { valid: false, message };
}

export function validatePassword(value: string, message = 'Password must be at least 8 characters'): ValidationResult {
  const isValid = typeof value === 'string' && value.length >= 8;
  return isValid ? { valid: true } : { valid: false, message };
}

export function validatePasswordStrength(value: string): ValidationResult {
  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  return pattern.test(value)
    ? { valid: true }
    : {
        valid: false,
        message: 'Use at least 8 characters including upper case, lower case, and a number',
      };
}

export function validatePhone(value: string, message = 'Enter a valid phone number'): ValidationResult {
  // Strip all non-digit characters (including '+') to count only digits
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 7 ? { valid: true } : { valid: false, message };
}

export function validatePrice(value: number | string, message = 'Price must be zero or greater'): ValidationResult {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? { valid: true } : { valid: false, message };
}

export function validateSlug(value: string, message = 'Use lowercase letters, numbers, or hyphens'): ValidationResult {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return pattern.test(value) ? { valid: true } : { valid: false, message };
}

export function combineValidations(results: ValidationResult[]): ValidationResult {
  const failed = results.find((result) => !result.valid);
  return failed ?? { valid: true };
}
