import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  slug: z
    .string()
    .min(2, "المعرف مطلوب")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "المعرف يجب أن يحتوي أحرف صغيرة وأرقام وشرطات منفردة فقط (بدون شرطات في البداية أو النهاية أو متتالية)"
    ),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
