"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";
import { createStore } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CITIES = [
  "الرياض",
  "جدة",
  "الدمام",
  "مكة المكرمة",
  "المدينة المنورة",
  "الخبر",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "حائل",
];

const storeSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  slug: z.string().min(2, "المعرف مطلوب"),
  address: z.string().min(5, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  phone: z.string().optional(),
  email: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  website: z.string().url("رابط غير صحيح").optional().or(z.literal("")),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["pending", "verified", "suspended"]).default("pending"),
});

type StoreFormData = z.infer<typeof storeSchema>;

export default function NewStorePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema) as any,
    defaultValues: {
      status: "pending",
    },
  });

  const selectedCity = watch("city");

  const onSubmit = handleSubmit(async (data: StoreFormData) => {
    setIsSubmitting(true);
    try {
      await createStore({
        ...data,
        logoUrl: logoUrl || undefined,
      });

      showToast({
        title: "نجح",
        description: "تم إضافة المتجر بنجاح",
      });

      router.push(`/${locale}/admin/stores`);
    } catch (error) {
      console.error("Failed to create store:", error);
      showToast({
        title: "خطأ",
        description: "فشل إضافة المتجر. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("slug", slug);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/stores`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("stores.addNew")}</h1>
          <p className="text-muted-foreground">إضافة متجر شريك جديد للمنصة</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">المعلومات الأساسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    الاسم <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    onChange={(e) => {
                      register("name").onChange(e);
                      handleNameChange(e);
                    }}
                    placeholder="اسم المتجر"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    المعرف (Slug) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="store-name"
                    dir="ltr"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">معلومات الاتصال</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="store@example.com"
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register("website")}
                    placeholder="https://example.com"
                    dir="ltr"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold mb-4">الموقع</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    المدينة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedCity}
                    onValueChange={(value) => setValue("city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    العنوان <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="العنوان الكامل للمتجر"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div>
              <h2 className="text-lg font-semibold mb-4">الشعار</h2>
              <ImageUpload
                value={logoUrl}
                onChange={(value) => {
                  const url = Array.isArray(value) ? value[0] : value;
                  setLogoUrl(url);
                }}
                multiple={false}
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-4">الوصف</h2>
              <Textarea
                {...register("description")}
                placeholder="وصف المتجر (اختياري)"
                rows={4}
              />
            </div>

            {/* Status */}
            <div>
              <h2 className="text-lg font-semibold mb-4">الحالة</h2>
              <Select
                value={watch("status")}
                onValueChange={(value: "pending" | "verified" | "suspended") => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="verified">موثق</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ المتجر"}
            </Button>
            <Link href="/admin/stores">
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
