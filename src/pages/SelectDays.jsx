import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScreenLayout from "../components/common/ScreenLayout";
import ProgressDots from "../components/common/ProgressDots";
import { useAppContext } from "../hooks/useAppContext";
import { useDelayedSelect } from "../hooks/useDelayedSelect";

const OPTIONS = [3, 4, 5];

export default function SelectDays() {
  const navigate = useNavigate();
  const { gender, setDays } = useAppContext();
  const { selected, select } = useDelayedSelect();

  // Si todavía no eligió sexo, lo mandamos de nuevo al paso anterior.
  useEffect(() => {
    if (!gender) navigate("/genero", { replace: true });
  }, [gender, navigate]);

  const handleSelect = (value) => select(value, setDays, "/rutina");

  if (!gender) return null;

  return (
    <ScreenLayout className="justify-center">
      <ProgressDots step={2} />

      <h2 className="text-[28px] leading-tight text-ink font-bold text-center mb-1">
        ¿Cuántos días entrenás?
      </h2>
      <p className="text-ink-secondary text-center mb-10">
        Elegí la frecuencia semanal de tu rutina.
      </p>

      <div className="flex flex-col gap-5">
        {OPTIONS.map((days) => {
          const isSelected = selected === days;
          return (
            <button
              key={days}
              onClick={() => handleSelect(days)}
              className={`
                flex items-center gap-4
                rounded-lg border-2
                px-7 py-7
                transition-all duration-200 ease-out
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-elevated -translate-y-1"
                    : "border-[color:var(--brand-card-border)] bg-surface shadow-card active:scale-[0.98] hover:border-primary/40 hover:shadow-card-hover"
                }
              `}
            >
              <span
                className={`
                  w-14 h-14 shrink-0 rounded-full flex items-center justify-center
                  text-xl font-display font-bold
                  transition-colors duration-200
                  ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"}
                `}
              >
                {days}
              </span>
              <span className="text-xl font-semibold text-ink flex-1">
                {days} días
              </span>
              <span
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                  transition-all duration-200
                  ${isSelected ? "border-primary bg-primary" : "border-border"}
                `}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
