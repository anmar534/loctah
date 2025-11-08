export const SAUDI_CITIES = [
  { value: "riyadh", labelAr: "الرياض", labelEn: "Riyadh" },
  { value: "jeddah", labelAr: "جدة", labelEn: "Jeddah" },
  { value: "mecca", labelAr: "مكة المكرمة", labelEn: "Mecca" },
  { value: "medina", labelAr: "المدينة المنورة", labelEn: "Medina" },
  { value: "dammam", labelAr: "الدمام", labelEn: "Dammam" },
  { value: "khobar", labelAr: "الخبر", labelEn: "Khobar" },
  { value: "taif", labelAr: "الطائف", labelEn: "Taif" },
  { value: "tabuk", labelAr: "تبوك", labelEn: "Tabuk" },
  { value: "buraidah", labelAr: "بريدة", labelEn: "Buraidah" },
  { value: "khamis", labelAr: "خميس مشيط", labelEn: "Khamis Mushait" },
  { value: "hail", labelAr: "حائل", labelEn: "Hail" },
  { value: "najran", labelAr: "نجران", labelEn: "Najran" },
  { value: "jazan", labelAr: "جازان", labelEn: "Jazan" },
  { value: "abha", labelAr: "أبها", labelEn: "Abha" },
  { value: "qatif", labelAr: "القطيف", labelEn: "Qatif" },
] as const;

export const getCityLabel = (value: string, locale: "ar" | "en" = "ar") => {
  const city = SAUDI_CITIES.find((c) => c.value === value);
  return city ? (locale === "ar" ? city.labelAr : city.labelEn) : value;
};
