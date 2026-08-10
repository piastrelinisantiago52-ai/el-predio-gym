import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenLayout from "../components/common/ScreenLayout";
import DayTabs from "../components/routine/DayTabs";
import ExerciseCard from "../components/routine/ExerciseCard";
import { useAppContext } from "../hooks/useAppContext";
import { useRoutine } from "../hooks/useRoutine";

export default function Routine() {
  const navigate = useNavigate();
  const { gender, days, reset } = useAppContext();
  const { routine, loading, error } = useRoutine(gender, days);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (!gender || !days) navigate("/genero", { replace: true });
  }, [gender, days, navigate]);

  useEffect(() => {
    setActiveDay(1);
  }, [routine]);

  const currentDay = useMemo(
    () => routine?.rutina.find((d) => d.dia === activeDay),
    [routine, activeDay]
  );

  const handleRestart = () => {
    reset();
    navigate("/");
  };

  if (!gender || !days) return null;

  if (loading) {
    return (
      <ScreenLayout className="items-center justify-center">
        <p className="text-ink-secondary">Cargando tu rutina…</p>
      </ScreenLayout>
    );
  }

  if (error || !routine) {
    return (
      <ScreenLayout className="items-center justify-center text-center gap-4">
        <p className="text-danger font-semibold">
          No pudimos cargar tu rutina.
        </p>
        <button onClick={handleRestart} className="text-primary font-semibold underline">
          Volver a empezar
        </button>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wide text-primary font-bold">
          {gender === "hombre" ? "Hombre" : "Mujer"} · {days} días
        </p>
        <h2 className="text-[26px] leading-tight text-ink font-bold">
          {routine.nombrePlan}
        </h2>
      </div>

      <DayTabs
        dias={routine.rutina}
        activo={activeDay}
        onSelect={setActiveDay}
      />

      <DayHeader titulo={currentDay?.titulo} />

      <div className="flex flex-col gap-4 flex-1">
        {currentDay?.ejercicios.map((ejercicio, i) => (
          <ExerciseCard key={ejercicio.id} ejercicio={ejercicio} index={i} />
        ))}
      </div>

      <button
        onClick={handleRestart}
        className="text-ink-secondary text-sm font-medium underline underline-offset-2 mt-8 self-center"
      >
        Empezar de nuevo
      </button>
    </ScreenLayout>
  );
}

/**
 * Cabecera moderna del día activo. El campo `titulo` en los JSON
 * mantiene el formato "Día X · Subtítulo" (no se tocó el dato);
 * acá solo se separa visualmente en dos líneas para una jerarquía
 * más fuerte, ej. "DÍA 1" arriba y "PECHO Y TRÍCEPS" debajo.
 */
function DayHeader({ titulo }) {
  if (!titulo) return null;
  const [dia, subtitulo] = titulo.split(" · ");

  return (
    <div className="mt-6 mb-4">
      <p className="text-xs uppercase tracking-widest text-primary font-bold">
        {dia}
      </p>
      <h3 className="text-2xl uppercase text-ink font-bold leading-tight mt-0.5">
        {subtitulo}
      </h3>
    </div>
  );
}
