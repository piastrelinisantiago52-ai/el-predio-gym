import { useEffect, useState } from "react";

/**
 * Mapa explícito hacia los JSON de /data.
 * Se usa import() dinámico para no cargar las 6 rutinas de una,
 * solo la que corresponde a la elección del usuario.
 */
const ROUTINE_LOADERS = {
  hombre: {
    3: () => import("../data/hombres_3dias.json"),
    4: () => import("../data/hombres_4dias.json"),
    5: () => import("../data/hombres_5dias.json"),
  },
  mujer: {
    3: () => import("../data/mujeres_3dias.json"),
    4: () => import("../data/mujeres_4dias.json"),
    5: () => import("../data/mujeres_5dias.json"),
  },
};

/**
 * Carga la rutina correspondiente a `gender` ("hombre" | "mujer")
 * y `days` (3 | 4 | 5). Devuelve { routine, loading, error }.
 */
export function useRoutine(gender, days) {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!gender || !days) {
      setRoutine(null);
      setLoading(false);
      return;
    }

    const loader = ROUTINE_LOADERS[gender]?.[days];

    if (!loader) {
      setError(`No existe rutina para gender="${gender}" days="${days}"`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    loader()
      .then((mod) => {
        if (!cancelled) {
          setRoutine(mod.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Error al cargar la rutina");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [gender, days]);

  return { routine, loading, error };
}
