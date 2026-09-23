import React from "react";
import styles from "./Alert.module.css";

type AlertVariant = "success" | "error" | "info";

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  visible?: boolean;
}
export function Alert({ variant, children, visible = true }: AlertProps) {
  if (!visible) return null;

  const classes = [styles.alert, styles[variant]].join(" ");

  return <div className={classes}>{children}</div>;
}
