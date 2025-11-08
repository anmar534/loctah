/**
 * Text Formatter
 * 
 * Functions for formatting text strings.
 */

/**
 * Truncate text to specified length
 * 
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated text
 * 
 * @example
 * truncate("This is a long text", 10) // "This is a..."
 */
export function truncate(
  text: string,
  length: number,
  suffix: string = '...'
): string {
  if (text.length <= length) return text;

  return text.substring(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * capitalize("hello world") // "Hello world"
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize each word
 * 
 * @param text - Text to capitalize
 * @returns Title cased text
 * 
 * @example
 * titleCase("hello world") // "Hello World"
 */
export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to kebab-case
 * 
 * @param text - Text to convert
 * @returns Kebab-cased text
 * 
 * @example
 * toKebabCase("Hello World") // "hello-world"
 */
export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

/**
 * Convert to camelCase
 * 
 * @param text - Text to convert
 * @returns Camel-cased text
 * 
 * @example
 * toCamelCase("hello world") // "helloWorld"
 */
export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Remove extra whitespace
 * 
 * @param text - Text to clean
 * @returns Cleaned text
 * 
 * @example
 * removeExtraWhitespace("  hello   world  ") // "hello world"
 */
export function removeExtraWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Extract initials from name
 * 
 * @param name - Full name
 * @param maxLength - Maximum number of initials (default: 2)
 * @returns Initials
 * 
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John Michael Doe", 3) // "JMD"
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
}

/**
 * Pluralize word based on count
 * 
 * @param count - Count
 * @param singular - Singular form
 * @param plural - Plural form
 * @returns Pluralized string
 * 
 * @example
 * pluralize(1, "item", "items") // "1 item"
 * pluralize(5, "item", "items") // "5 items"
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

