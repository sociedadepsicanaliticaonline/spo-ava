"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({ label, description, error, required, htmlFor, children, className }: FieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && <p className="body-sm text-text-light">{description}</p>}
      {error && (
        <p className="body-sm text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ label, description, error, required, id, className, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <FieldWrapper label={label} description={description} error={error} required={required} htmlFor={inputId}>
      <Input ref={ref} id={inputId} error={!!error} required={required} className={className} {...props} />
    </FieldWrapper>
  );
});
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ label, description, error, required, id, className, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <FieldWrapper label={label} description={description} error={error} required={required} htmlFor={inputId}>
      <Textarea ref={ref} id={inputId} error={!!error} required={required} className={className} {...props} />
    </FieldWrapper>
  );
});
FormTextarea.displayName = "FormTextarea";

interface FormSelectProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export function FormSelect({ label, description, error, required, value, onValueChange, options, placeholder, id, disabled }: FormSelectProps) {
  return (
    <FieldWrapper label={label} description={description} error={error} required={required} htmlFor={id}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} error={!!error}>
          <SelectValue placeholder={placeholder ?? "Selecione..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

interface FormSwitchProps {
  label?: string;
  description?: string;
  required?: boolean;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

export function FormSwitch({ label, description, required, checked, onCheckedChange, disabled }: FormSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-white p-4">
      <div className="space-y-1">
        <Label className="text-text">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </Label>
        {description && <p className="body-sm text-text-light">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, description, error, required, children, className }: FormFieldProps) {
  return (
    <FieldWrapper label={label} description={description} error={error} required={required} className={className}>
      {children}
    </FieldWrapper>
  );
}
