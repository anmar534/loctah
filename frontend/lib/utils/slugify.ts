export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Generate a unique SKU (Stock Keeping Unit) identifier
 * 
 * Uses crypto.randomUUID() for strong randomness to minimize collision risk.
 * Format: PREFIX-TIMESTAMP-RANDOMID
 * 
 * Example: PRD-1730901234-A3F9B2C4D8E1
 * 
 * IMPORTANT: This function generates a statistically unique SKU, but callers
 * MUST perform an application-level uniqueness check against the database
 * and regenerate if a collision occurs (though extremely unlikely).
 * 
 * @param prefix - SKU prefix (default: "PRD")
 * @returns A unique SKU string
 * 
 * @example
 * ```typescript
 * const sku = generateSKU("PRD"); // PRD-1730901234-A3F9B2C4D8E1
 * 
 * // With uniqueness check
 * let sku = generateSKU("PRD");
 * while (await skuExists(sku)) {
 *   sku = generateSKU("PRD");
 * }
 * ```
 */
export function generateSKU(prefix: string = "PRD"): string {
  // Use timestamp for sortability and rough chronological ordering
  const timestamp = Date.now().toString(36).toUpperCase();
  
  // Use crypto.randomUUID() for cryptographically strong randomness
  // Remove dashes and take first 12 characters for compact representation
  const uuid = crypto.randomUUID().replace(/-/g, "").substring(0, 12).toUpperCase();
  
  return `${prefix}-${timestamp}-${uuid}`;
}

/**
 * Generate a guaranteed unique SKU by checking against existing SKUs
 * 
 * This function will retry generation if a collision is detected.
 * 
 * @param prefix - SKU prefix (default: "PRD")
 * @param checkExists - Async function to check if SKU exists in database
 * @param maxRetries - Maximum number of retries (default: 5)
 * @returns A guaranteed unique SKU string
 * @throws Error if max retries exceeded
 * 
 * @example
 * ```typescript
 * import { checkSKUExists } from '@/lib/api/products';
 * 
 * const sku = await generateUniqueSKU("PRD", checkSKUExists);
 * ```
 */
export async function generateUniqueSKU(
  prefix: string = "PRD",
  checkExists: (sku: string) => Promise<boolean>,
  maxRetries: number = 5
): Promise<string> {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    const sku = generateSKU(prefix);
    const exists = await checkExists(sku);
    
    if (!exists) {
      return sku;
    }
    
    attempts++;
    
    // Log collision (extremely rare with crypto.randomUUID)
    console.warn(`SKU collision detected: ${sku} (attempt ${attempts}/${maxRetries})`);
  }
  
  throw new Error(
    `Failed to generate unique SKU after ${maxRetries} attempts. ` +
    `This should be extremely rare - check your SKU generation implementation.`
  );
}
