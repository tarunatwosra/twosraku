"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, Button, Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2;
  helperText?: string;
  error?: string;
}

interface FormPageTemplateProps {
  // Page info
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];

  // Form
  sections: FormSection[];
  onSubmit: (data: Record<string, string>) => void;
  isSubmitting?: boolean;

  // Actions
  submitLabel?: string;
  cancelHref?: string;
  onCancel?: () => void;

  // Additional footer content
  footerContent?: React.ReactNode;

  // Class name
  className?: string;
}

export function FormPageTemplate({
  title,
  description,
  breadcrumbs,
  sections,
  onSubmit,
  isSubmitting,
  submitLabel = "Simpan",
  cancelHref,
  onCancel,
  footerContent,
  className,
}: FormPageTemplateProps) {
  // Simple form state (in real app, use react-hook-form)
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={cn("flex flex-col gap-[24px] max-w-4xl", className)}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-[24px]">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} padding="lg">
              {/* Section Header */}
              <div className="mb-[24px]">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-[13px] text-[var(--text-muted)] mt-1">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Section Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.colSpan === 2 ? "md:col-span-2" : ""}
                  >
                    {field.type === "select" ? (
                      <Select
                        label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        options={field.options || []}
                        required={field.required}
                        disabled={field.disabled}
                        error={field.error}
                        helperText={field.helperText}
                      />
                    ) : field.type === "textarea" ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-medium text-[var(--text-primary)]">
                          {field.label}
                          {field.required && (
                            <span className="text-[var(--danger)] ml-0.5">*</span>
                          )}
                        </label>
                        <textarea
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          required={field.required}
                          disabled={field.disabled}
                          className={cn(
                            "w-full min-h-[120px] px-4 py-3",
                            "bg-[var(--surface-primary)]",
                            "border border-[var(--border-default)]",
                            "rounded-[18px]",
                            "text-[15px] text-[var(--text-primary)]",
                            "placeholder:text-[var(--text-muted)]",
                            "focus:outline-none focus:border-[var(--border-focus)]",
                            "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                            "resize-y",
                            field.error && "border-[var(--danger)]",
                            field.disabled && "opacity-50 cursor-not-allowed bg-[var(--surface-secondary)]"
                          )}
                        />
                        {field.error && (
                          <p className="text-[13px] text-[var(--danger)]">{field.error}</p>
                        )}
                        {field.helperText && !field.error && (
                          <p className="text-[13px] text-[var(--text-muted)]">{field.helperText}</p>
                        )}
                      </div>
                    ) : (
                      <Input
                        type={field.type === "phone" ? "tel" : field.type}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        disabled={field.disabled}
                        error={field.error}
                        helperText={field.helperText}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Form Actions */}
        <div className="mt-[24px] flex items-center justify-between gap-[16px]">
          <div>{footerContent}</div>
          <div className="flex items-center gap-[12px]">
            {cancelHref ? (
              <a
                href={cancelHref}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "h-[44px] px-[22px]",
                  "text-[15px] font-medium",
                  "rounded-[18px]",
                  "text-[var(--text-secondary)]",
                  "hover:bg-[var(--surface-hover)]",
                  "transition-colors"
                )}
              >
                Batal
              </a>
            ) : onCancel ? (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Batal
              </Button>
            ) : null}
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
