import React from "react";
import styles from "./FormField.module.css";

/* ── Types ──────────────────────────────────────────────────── */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  variant?: "dark" | "light";
}

/* ── Component ─────────────────────────────────────────────── */
export function SelectField({
  label,
  id,
  options,
  placeholder,
  error,
  variant = "dark",
  className,
  ...selectProps
}: SelectFieldProps) {
  const selectClasses = [
    styles.input,
    styles[variant],
    error ? styles.inputError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select id={id} className={selectClasses} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
