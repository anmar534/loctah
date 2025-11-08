"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export type Specification = {
  key: string;
  value: string;
};

interface DynamicSpecsProps {
  value: Specification[];
  onChange: (specs: Specification[]) => void;
  disabled?: boolean;
}

export default function DynamicSpecs({
  value,
  onChange,
  disabled = false,
}: DynamicSpecsProps) {
  const t = useTranslations("admin.products.specifications");

  const handleAdd = () => {
    onChange([...value, { key: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: "key" | "value", newValue: string) => {
    const updated = value.map((spec, i) =>
      i === index ? { ...spec, [field]: newValue } : spec
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{t("title")}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 me-2" />
          {t("add")}
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((spec, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`spec-key-${index}`} className="text-xs">
                    {t("key")}
                  </Label>
                  <Input
                    id={`spec-key-${index}`}
                    placeholder={t("keyPlaceholder")}
                    value={spec.key}
                    onChange={(e) => handleChange(index, "key", e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`spec-value-${index}`} className="text-xs">
                    {t("value")}
                  </Label>
                  <Input
                    id={`spec-value-${index}`}
                    placeholder={t("valuePlaceholder")}
                    value={spec.value}
                    onChange={(e) => handleChange(index, "value", e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                aria-label={spec.key ? `حذف مواصفة ${spec.key}` : `حذف المواصفة ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
