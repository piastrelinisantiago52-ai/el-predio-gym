/**
 * ============================================================
 * EL PREDIO GYM — CONFIGURACIÓN CENTRAL DE MARCA
 * ============================================================
 * Este archivo es el punto único desde donde los componentes
 * JS acceden a la identidad visual de la app.
 *
 * Los valores reales de color/tipografía/radios/sombras están
 * definidos como variables CSS en `src/styles/index.css`
 * (prefijo --brand-*). Acá solo se referencian con var(...) para
 * que TODO el proyecto lea de una única fuente de verdad.
 * ============================================================
 */

export const brand = {
  name: "El Predio Gym",
  shortName: "El Predio",
  tagline: "Entrená de manera inteligente.",
  // Logo oficial de El Predio Gym (colores originales respetados,
  // sin recolorear ni redibujar; solo se removió el fondo blanco
  // para que se integre a cualquier superficie de la app).
  logo: "/src/assets/logo/logo-predio.png",
};

export const colors = {
  primary: "var(--brand-primary)",
  primaryDark: "var(--brand-primary-dark)",
  primaryLight: "var(--brand-primary-light)",
  secondary: "var(--brand-secondary)",
  page: "var(--brand-page-bg)",
  surface: "var(--brand-surface)",
  surfaceAlt: "var(--brand-surface-alt)",
  border: "var(--brand-border)",
  ink: "var(--brand-ink)",
  inkSecondary: "var(--brand-ink-secondary)",
  inkMuted: "var(--brand-ink-muted)",
  success: "var(--brand-success)",
  danger: "var(--brand-danger)",
};

export const typography = {
  display: "var(--brand-font-display)",
  body: "var(--brand-font-body)",
};

export const radius = {
  sm: "var(--brand-radius-sm)",
  md: "var(--brand-radius-md)",
  lg: "var(--brand-radius-lg)",
  full: "var(--brand-radius-full)",
};

export const shadows = {
  card: "var(--brand-shadow-card)",
  cardHover: "var(--brand-shadow-card-hover)",
  glow: "var(--brand-shadow-glow)",
  elevated: "var(--brand-shadow-elevated)",
};

/**
 * Set de iconos centralizado. Cada clave apunta al nombre de un ícono
 * de src/components/common/Icon.jsx. Se usan siempre los mismos íconos
 * para el mismo tipo de dato en toda la app (tarjetas de ejercicio,
 * ficha de técnica, etc.) para mantener consistencia visual.
 */
export const icons = {
  persona: "person",
  musculo: "dumbbell",
  series: "repeat",
  repeticiones: "target",
  descanso: "clock",
  advertencia: "alertTriangle",
  info: "info",
  volver: "arrowLeft",
  siguiente: "arrowRight",
  reproducir: "play",
  expandir: "chevronDown",
};

/**
 * Variantes de botón centralizadas.
 * Los componentes (ej. <Button variant="primary" />) leen de acá,
 * así el estilo de todos los botones se controla desde un solo lugar.
 */
export const buttonVariants = {
  primary:
    "brand-gradient text-white font-bold shadow-[var(--brand-shadow-glow)] active:scale-[0.97] hover:brightness-105",
  secondary:
    "bg-white border-2 border-border text-ink active:scale-[0.97] hover:border-primary",
  ghost:
    "bg-surface-alt text-ink active:scale-[0.97] hover:bg-border",
};

const theme = { brand, colors, typography, radius, shadows, buttonVariants, icons };

export default theme;
