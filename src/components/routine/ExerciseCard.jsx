import { useState } from "react";
import { icons } from "../../config/theme";
import Icon from "../common/Icon";
import TechniqueSheet from "./TechniqueSheet";

/**
 * Tarjeta de un ejercicio dentro de un día de rutina.
 * Muestra siempre nombre, grupo muscular, series, repeticiones y
 * descanso, cada uno con su ícono consistente. El botón "VER TÉCNICA"
 * despliega la ficha profesional (TechniqueSheet) a pantalla completa,
 * sin salir de la pantalla ni cambiar de ruta.
 */
export default function ExerciseCard({ ejercicio, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        rounded-lg bg-surface overflow-hidden border
        shadow-card transition-shadow duration-200
        animate-fade-in
        ${open ? "shadow-card-hover" : ""}
      `}
      style={{
        borderColor: "var(--brand-card-border)",
        animationDelay: `${Math.min(index, 6) * 40}ms`,
      }}
    >
      <div className="flex gap-3.5 p-4">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-alt">
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

        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-primary font-bold">
            Ejercicio {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-ink font-semibold leading-snug truncate mt-0.5">
            {ejercicio.nombre}
          </h3>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2.5 text-[13px] text-ink-secondary">
            <DataPoint icon={icons.musculo} value={ejercicio.musculoPrincipal} />
            <DataPoint icon={icons.series} value={`${ejercicio.series} series`} />
            <DataPoint icon={icons.repeticiones} value={`${ejercicio.repeticiones} reps`} />
            <DataPoint icon={icons.descanso} value={ejercicio.descanso} />
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-3.5 text-sm font-bold tracking-wide text-primary border-t active:bg-surface-alt transition-colors duration-150"
        style={{ borderColor: "var(--brand-card-border)" }}
      >
        <span>{open ? "OCULTAR TÉCNICA" : "VER TÉCNICA"}</span>
        <Icon
          name={icons.expandir}
          size={16}
          strokeWidth={2.4}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <TechniqueSheet ejercicio={ejercicio} onClose={() => setOpen(false)} />}
    </div>
  );
}

function DataPoint({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 truncate text-ink-muted">
      <Icon name={icon} size={14} strokeWidth={2} className="shrink-0" />
      <span className="truncate text-ink-secondary">{value}</span>
    </div>
  );
}
