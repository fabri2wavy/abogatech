import React, { useEffect, useState, useCallback } from "react";
import styles from "./Toast.module.css";

/* ══════════════════════════════════════════════════════════════
   Toast — Lightweight auto-dismiss notification system
   ══════════════════════════════════════════════════════════════ */

type ToastVariant = "success" | "error";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  text: string;
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
  duration: number;
}

function ToastItem({ toast, onRemove, duration }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const autoClose = setTimeout(() => {
      setExiting(true);
    }, duration);

    return () => clearTimeout(autoClose);
  }, [duration]);

  useEffect(() => {
    if (!exiting) return;
    const cleanup = setTimeout(() => onRemove(toast.id), 300);
    return () => clearTimeout(cleanup);
  }, [exiting, onRemove, toast.id]);

  const iconPath =
    toast.variant === "success"
      ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      : "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div
      className={`${styles.toast} ${styles[toast.variant]} ${exiting ? styles.exiting : ""}`}
      role="alert"
    >
      <svg
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={iconPath} />
      </svg>
      {toast.text}
    </div>
  );
}

/* ── Container que renderiza la pila de toasts ─────────────── */

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
  duration?: number;
}

export function ToastContainer({
  toasts,
  onRemove,
  duration = 3500,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} duration={duration} />
      ))}
    </div>
  );
}

/* ── Hook para usar el sistema de toasts ───────────────────── */

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((variant: ToastVariant, text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, variant, text }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
