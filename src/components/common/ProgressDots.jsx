/**
 * Indicador de progreso minimalista para el flujo de 2 pasos
 * (elegir sexo -> elegir días). Muestra "Paso X de 2" junto a
 * dos puntos: los pasos ya alcanzados (incluido el actual) se
 * muestran llenos, los que faltan quedan vacíos.
 */
export default function ProgressDots({ step, total = 2 }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
        Paso {step} de {total}
      </span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i + 1 <= step;
          return (
            <span
              key={i}
              className={`
                w-2 h-2 rounded-full transition-colors duration-[var(--brand-motion-base)]
                ${filled ? "bg-primary" : "bg-border"}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
