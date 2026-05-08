"use client";

import { ReactNode } from "react";

import { cn } from "./studio-ui";

type BaseFieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  className?: string;
};

export function FormField({
  label,
  hint,
  error,
  required,
  className,
  children,
}: BaseFieldProps & { children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-semibold text-[color:var(--foreground)]">
        {label}
        {required ? <span className="ml-1 text-[color:var(--accent)]">*</span> : null}
      </span>
      {children}
      {hint ? (
        <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm leading-5 text-rose-700">{error}</p>
      ) : null}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
  },
) {
  const { className, invalid, ...rest } = props;
  return (
    <input
      {...rest}
      className={cn(
        "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--foreground)]",
        invalid
          ? "border-rose-300 bg-rose-50/60"
          : "border-[color:var(--border)]",
        className,
      )}
    />
  );
}

export function TextareaInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    invalid?: boolean;
  },
) {
  const { className, invalid, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={cn(
        "mt-2 min-h-28 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--foreground)]",
        invalid
          ? "border-rose-300 bg-rose-50/60"
          : "border-[color:var(--border)]",
        className,
      )}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    invalid?: boolean;
    children: ReactNode;
  },
) {
  const { className, invalid, children, ...rest } = props;
  return (
    <select
      {...rest}
      className={cn(
        "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--foreground)]",
        invalid
          ? "border-rose-300 bg-rose-50/60"
          : "border-[color:var(--border)]",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-[color:var(--border)]"
      />
      {label}
    </label>
  );
}

export function FormMessage({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      )}
    >
      {children}
    </div>
  );
}
