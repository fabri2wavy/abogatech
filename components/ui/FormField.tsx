import React from "react";
import styles from "./FormField.module.css";

/* ── Types ──────────────────────────────────────────────────── */
type FormFieldBaseProps = {
  label: string;
  id: string;
  error?: string;
  variant?: "dark" | "light";
};

type InputFieldProps = FormFieldBaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaFieldProps = FormFieldBaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type FormFieldProps = InputFieldProps | TextareaFieldProps;

/* ── Component ─────────────────────────────────────────────── */
export function FormField(props: FormFieldProps) {
  const { label, id, error, variant = "dark", className } = props;

  const fieldClasses = [
    styles.input,
    styles[variant],
    error ? styles.inputError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  /* Render textarea variant */
  if (props.as === "textarea") {
    const { as: _, label: _l, id: _id, error: _e, variant: _v, className: _c, ...textareaProps } = props;
    return (
      <div className={styles.group}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <textarea id={id} className={fieldClasses} {...textareaProps} />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }

  /* Default: render input */
  const { as: _, label: _l, id: _id, error: _e, variant: _v, className: _c, ...inputProps } = props;
  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input id={id} className={fieldClasses} {...inputProps} />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
