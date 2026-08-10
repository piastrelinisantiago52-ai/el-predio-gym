import { useAppContext } from "../hooks/useAppContext";
import { useDelayedSelect } from "../hooks/useDelayedSelect";
import ScreenLayout from "../components/common/ScreenLayout";
import ProgressDots from "../components/common/ProgressDots";
import Icon from "../components/common/Icon";
import { icons } from "../config/theme";

const OPTIONS = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
];

export default function SelectGender() {
  const { setGender } = useAppContext();
  const { selected, select } = useDelayedSelect();

  const handleSelect = (value) => select(value, setGender, "/dias");

  return (
    <ScreenLayout className="justify-center">
      <ProgressDots step={1} />

      <h2 className="text-[28px] leading-tight text-ink font-bold text-center mb-1">
        Seleccioná tu rutina
      </h2>
      <p className="text-ink-secondary text-center mb-10">
        Elegí una opción para continuar.
      </p>

      <div className="flex flex-col gap-5">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                flex items-center gap-4
                rounded-lg border-2
                px-7 py-7
                text-left
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
                  transition-colors duration-200
                  ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"}
                `}
              >
                <Icon name={icons.persona} size={26} strokeWidth={1.8} />
              </span>
              <span className="text-xl font-semibold text-ink flex-1">
                {opt.label}
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
