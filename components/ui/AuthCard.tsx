import React from "react";
import styles from "./AuthCard.module.css";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}
export function AuthCard({
  children,
  title = "Iturri & Asociados",
  subtitle = "Sistema de Gestión Legal",
}: AuthCardProps) {
  const parts = title.split("&");
  const hasSplit = parts.length === 2;

  return (
    <main className={styles.root}>
      {/* Ornamentos decorativos de esquina */}
      <div className={`${styles.ornament} ${styles.ornamentTopLeft}`} />
      <div className={`${styles.ornament} ${styles.ornamentBottomRight}`} />

      <div className={styles.card}>
        {/* Acento dorado superior */}
        <div className={styles.cardAccent} />

        {/* Cabecera de marca */}
        <div className={styles.header}>
          <div className={styles.emblem}>I&A</div>
          <h1 className={styles.firmName}>
            {hasSplit ? (
              <>
                {parts[0].trim()}{" "}
                <span className={styles.firmNameAccent}>&</span>{" "}
                {parts[1].trim()}
              </>
            ) : (
              title
            )}
          </h1>
          <p className={styles.tagline}>{subtitle}</p>
        </div>

        {/* Divider decorativo */}
        <div className={styles.divider}>
          <span className={styles.dividerDot} />
        </div>

        {/* Contenido dinámico (formularios, etc.) */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        <p className={styles.footer}>
          Abogatech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
