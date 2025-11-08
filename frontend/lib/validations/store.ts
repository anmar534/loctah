import * as z from "zod";

export const storeSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب ويجب أن يكون حرفين على الأقل"),
  slug: z
    .string()
    .min(2, "المعرف مطلوب")
    .regex(/^[a-z0-9-]+$/, "المعرف يجب أن يحتوي أحرف صغيرة وأرقام وشرطات فقط"),
  address: z.string().min(5, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  phone: z.string().optional(),
  email: z.union([z.string().email("بريد إلكتروني غير صحيح"), z.literal("")]).optional(),
  website: z.union([z.string().url("رابط غير صحيح"), z.literal("")]).optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["pending", "verified", "suspended"]).optional().default("pending"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
