"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { FormProvider, useForm, useFormContext, type FieldValues, type UseFormProps } from "react-hook-form";
import type { ZodType } from "zod";

interface RhfFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: UseFormProps<T>["defaultValues"];
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function RhfForm<T extends FieldValues>({ schema, defaultValues, onSubmit, children, className }: RhfFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
    mode: "onBlur",
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit as any)} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}

export function FieldError({ name }: { name: string }) {
  const { formState } = useFormContext() as any;
  const error = formState.errors?.[name];
  if (!error) return null;
  return (
    <p className="body-sm text-accent" role="alert">
      {error.message as string}
    </p>
  );
}
