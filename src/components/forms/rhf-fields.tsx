"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

function FieldShell({ name, label, description, required, error, children, className }: BaseProps & { error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
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

export const RHFInput = React.forwardRef<HTMLInputElement, BaseProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ name, label, description, required, className, ...inputProps }, ref) => {
    const { register, formState } = useFormContext() as any;
    const error = formState.errors?.[name]?.message as string | undefined;
    return (
      <FieldShell name={name} label={label} description={description} required={required} error={error} className={className}>
        <Input id={name} error={!!error} {...register(name)} ref={(el) => { register(name).ref(el); if (typeof ref === "function") ref(el); else if (ref) (ref as any).current = el; }} {...inputProps} />
      </FieldShell>
    );
  }
);
RHFInput.displayName = "RHFInput";

export const RHFTextarea = React.forwardRef<HTMLTextAreaElement, BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ name, label, description, required, className, ...props }, ref) => {
    const { register, formState } = useFormContext() as any;
    const error = formState.errors?.[name]?.message as string | undefined;
    return (
      <FieldShell name={name} label={label} description={description} required={required} error={error} className={className}>
        <Textarea id={name} error={!!error} {...register(name)} ref={(el) => { register(name).ref(el); if (typeof ref === "function") ref(el); else if (ref) (ref as any).current = el; }} {...props} />
      </FieldShell>
    );
  }
);
RHFTextarea.displayName = "RHFTextarea";

interface RHFSelectProps extends BaseProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function RHFSelect({ name, label, description, required, options, placeholder, disabled, className }: RHFSelectProps) {
  const { register, setValue, watch, formState } = useFormContext() as any;
  const value = watch(name);
  const error = formState.errors?.[name]?.message as string | undefined;
  return (
    <FieldShell name={name} label={label} description={description} required={required} error={error} className={className}>
      <input type="hidden" {...register(name)} />
      <Select
        value={value}
        onValueChange={(v) => setValue(name, v, { shouldValidate: true })}
        disabled={disabled}
      >
        <SelectTrigger id={name} error={!!error}>
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
    </FieldShell>
  );
}

interface RHFSwitchProps extends BaseProps {
  description?: string;
}

export function RHFSwitch({ name, label, description, className }: RHFSwitchProps) {
  const { register, setValue, watch, formState } = useFormContext() as any;
  const checked = !!watch(name);
  const error = formState.errors?.[name]?.message as string | undefined;
  return (
    <div className={cn("flex items-start justify-between gap-4 rounded-lg border border-border bg-white p-4", className)}>
      <div className="space-y-1">
        <Label className="text-text">{label}</Label>
        {description && <p className="body-sm text-text-light">{description}</p>}
        {error && <p className="body-sm text-accent" role="alert">{error}</p>}
      </div>
      <input type="hidden" {...register(name)} value={checked ? "true" : "false"} />
      <Switch checked={checked} onCheckedChange={(v) => setValue(name, v, { shouldValidate: true, shouldDirty: true })} />
    </div>
  );
}
