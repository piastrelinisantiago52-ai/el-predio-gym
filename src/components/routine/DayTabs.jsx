/**
 * Tabs horizontales para elegir el día de la rutina dentro de la
 * pantalla de resultado. Scrollable en X para que entren 5 días
 * cómodos en pantallas de celular chicas.
 */
export default function DayTabs({ dias, activo, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar">
      {dias.map((d) => {
        const isActive = d.dia === activo;
        return (
          <button
            key={d.dia}
            onClick={() => onSelect(d.dia)}
            aria-pressed={isActive}
            className={`
              shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold
              border-2 transition-all duration-150 ease-out
              ${
                isActive
                  ? "brand-gradient text-white border-primary shadow-[var(--brand-shadow-glow)]"
                  : "bg-surface text-ink-secondary border-border active:scale-[0.96]"
              }
            `}
          >
            Día {d.dia}
          </button>
        );
      })}
    </div>
  );
}
