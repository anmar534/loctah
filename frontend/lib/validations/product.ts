import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  slug: z
    .string()
    .min(2, "المعرف مطلوب")
    .regex(/^[a-z0-9-]+$/, "المعرف يجب أن يحتوي أحرف صغيرة وأرقام وشرطات فقط"),
  description: z.string().min(10, "الوصف مطلوب"),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "الفئة مطلوبة"),
  storeId: z.string().min(1, "المتجر مطلوب"),
  images: z.array(z.string()).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر").optional(),
  stock: z.number().int().min(0).default(0),
  currency: z.string().default("SAR"),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Specification field type
export type Specification = {
  key: string;
  value: string;
};
