/**
 * Set de íconos vectoriales, minimalista y consistente (estilo trazo,
 * 24x24), pensado para reemplazar los emoji en toda la app: los emoji
 * traen colores propios (tonos de piel, amarillo, rojo) que chocan con
 * la paleta oficial de la marca (celeste / blanco / negro). Al usar
 * `currentColor`, cada ícono hereda el color de texto de su contexto.
 * No agrega dependencias nuevas al proyecto.
 */
const PATHS = {
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  dumbbell: (
    <>
      <rect x="1.5" y="9" width="3" height="6" rx="1" />
      <rect x="19.5" y="9" width="3" height="6" rx="1" />
      <line x1="4.5" y1="12" x2="19.5" y2="12" />
      <rect x="6" y="7" width="2.2" height="10" rx="1" />
      <rect x="15.8" y="7" width="2.2" height="10" rx="1" />
    </>
  ),
  repeat: (
    <>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  alertTriangle: (
    <>
      <path d="M12 3.5l9.5 16.5H2.5L12 3.5z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="17.2" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  play: <path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" />,
  arrowLeft: (
    <>
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 6 4 12 10 18" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </>
  ),
  chevronDown: <polyline points="6 9 12 15 18 9" />,
};

export default function Icon({ name, size = 20, strokeWidth = 2, className = "" }) {
  const content = PATHS[name];
  if (!content) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
