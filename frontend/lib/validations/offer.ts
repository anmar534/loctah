import * as z from "zod";

/**
 * Helper: Check if end date is after or equal to start date
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}

/**
 * Offer validation schema
 * 
 * Features:
 * - Strict ISO 8601 date-time format validation for startDate and endDate
 *   (Uses Zod's built-in datetime validator which enforces RFC 3339 format)
 * - Cross-field validation ensuring endDate >= startDate
 * - Discount percentage range (0-100)
 * - Required title and description
 * 
 * Valid date formats:
 * - "2025-11-07T12:00:00.000Z"
 * - "2025-11-07T12:00:00Z"
 * - "2025-11-07T12:00:00+03:00"
 * 
 * Rejected formats:
 * - "2025-11-07" (missing time)
 * - "11/07/2025T00:00:00" (invalid date format)
 * - "2025-11-07 T 12:00" (invalid spacing)
 * - "invalid-date"
 */
export const offerSchema = z
  .object({
    title: z.string().min(2, "العنوان مطلوب"),
    description: z.string().min(10, "الوصف مطلوب"),
    productId: z.string().optional(),
    storeId: z.string().optional(),
    discount: z.number().min(0).max(100, "نسبة الخصم يجب أن تكون بين 0 و 100"),
    originalPrice: z.number().positive().optional(),
    discountedPrice: z.number().positive().optional(),
    currency: z.string().optional(),
    startDate: z.string().datetime({
      message: "تاريخ غير صحيح. يجب أن يكون بصيغة ISO 8601 (مثال: 2025-11-07T12:00:00.000Z)",
    }),
    endDate: z.string().datetime({
      message: "تاريخ غير صحيح. يجب أن يكون بصيغة ISO 8601 (مثال: 2025-11-07T12:00:00.000Z)",
    }),
    link: z.string().url().optional().or(z.literal("")),
    affiliateUrl: z.string().url().optional().or(z.literal("")),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Cross-field validation: endDate must be after or equal to startDate
      return isValidDateRange(data.startDate, data.endDate);
    },
    {
      message: "تاريخ الانتهاء يجب أن يكون بعد أو يساوي تاريخ البداية",
      path: ["endDate"], // Error will be attached to endDate field
    }
  );

export type OfferFormData = z.infer<typeof offerSchema>;
