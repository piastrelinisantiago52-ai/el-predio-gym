import { icons } from "../../config/theme";
import Icon from "../common/Icon";
import VideoPlayer from "./VideoPlayer";

// Consejos generales de entrenamiento (no son datos del JSON del
// ejercicio: aplican a cualquier ejercicio de la rutina).
const CONSEJOS_GENERALES = [
  "Calentá la zona muscular antes de encarar la primera serie con peso.",
  "Priorizá la técnica correcta antes de aumentar el peso.",
  "Controlá la respiración: exhalá en el esfuerzo, inhalá en el regreso.",
];

const DIFICULTAD_STYLES = {
  Principiante: "bg-success/10 text-success",
  Intermedio: "bg-primary/10 text-primary",
  Avanzado: "bg-danger/10 text-danger",
};

/**
 * Ficha profesional del ejercicio, a pantalla completa: video corto
 * de técnica (si existe) o imagen, datos clave y la información
 * organizada en tarjetas bien diferenciadas (Técnica / Errores
 * comunes / Consejos). Se cierra con el botón "volver", sin cambiar
 * de ruta.
 */
export default function TechniqueSheet({ ejercicio, onClose }) {
  const dificultadClass =
    DIFICULTAD_STYLES[ejercicio.dificultad] || "bg-surface-alt text-ink-secondary";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ejercicio.nombre}
      className="fixed inset-0 z-50 bg-page overflow-y-auto animate-sheet-in"
    >
      <div className="w-full max-w-md mx-auto pb-10 safe-bottom">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Volver"
            className="w-10 h-10 shrink-0 rounded-full bg-surface-alt flex items-center justify-center text-ink active:scale-[0.94] transition-transform duration-150"
          >
            <Icon name={icons.volver} size={18} strokeWidth={2.2} />
          </button>
          <span className="text-sm font-semibold text-ink-secondary">
            Técnica del ejercicio
          </span>
        </div>

        {ejercicio.video ? (
          <VideoPlayer
            url={ejercicio.video}
            posterSrc={ejercicio.imagen}
            posterAlt={ejercicio.nombre}
          />
        ) : (
          <div className="relative w-full aspect-[4/3] bg-surface-alt overflow-hidden">
            <img
              src={ejercicio.imagen}
              alt={ejercicio.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              loading="lazy"
            />
          </div>
        )}

        <div className="px-5">
          <div className="pt-5">
            <h1 className="text-2xl text-ink font-bold leading-tight">
              {ejercicio.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-alt text-ink-secondary text-xs font-semibold">
                <Icon name={icons.musculo} size={13} strokeWidth={2.2} />
                {ejercicio.musculoPrincipal}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${dificultadClass}`}
              >
                {ejercicio.dificultad}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-8">
            <SheetCard title="Técnica">
              <p className="text-ink-secondary leading-relaxed">{ejercicio.tecnica}</p>
            </SheetCard>

            <SheetCard title="Errores comunes">
              <ul className="space-y-3">
                {ejercicio.erroresComunes.map((error, i) => (
                  <li key={i} className="flex gap-2.5 text-ink-secondary leading-relaxed">
                    <Icon
                      name={icons.advertencia}
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-danger mt-0.5"
                    />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </SheetCard>

            <SheetCard title="Consejos">
              <ul className="space-y-3">
                {CONSEJOS_GENERALES.map((consejo, i) => (
                  <li key={i} className="flex gap-2.5 text-ink-secondary leading-relaxed">
                    <Icon
                      name={icons.info}
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-primary mt-0.5"
                    />
                    <span>{consejo}</span>
                  </li>
                ))}
              </ul>
            </SheetCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tarjeta base para cada sección de la ficha (Técnica / Errores / Consejos). */
function SheetCard({ title, children }) {
  return (
    <div
      className="rounded-lg bg-surface shadow-card border p-5"
      style={{ borderColor: "var(--brand-card-border)" }}
    >
      <p className="text-[11px] uppercase tracking-wide text-ink-muted font-bold mb-3.5">
        {title}
      </p>
      {children}
    </div>
  );
}
