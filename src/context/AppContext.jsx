import { useState, useCallback, useMemo } from "react";
import { AppContext } from "./appContextObject";

/**
 * Guarda las dos únicas decisiones del usuario (sexo y días) durante
 * la sesión. No hay login ni base de datos: esto vive solo en memoria
 * del navegador mientras dura la visita (con respaldo en
 * sessionStorage para que un refresh accidental no lo tire todo).
 *
 * El hook para consumir este contexto vive en src/hooks/useAppContext.js.
 */
const STORAGE_KEY = "el-predio-gym:seleccion";

function readInitialState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // sessionStorage no disponible o dato corrupto: se ignora.
  }
  return { gender: null, days: null };
}

export function AppProvider({ children }) {
  const [selection, setSelection] = useState(readInitialState);

  const persist = useCallback((next) => {
    setSelection(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Si falla el guardado no es crítico: la app sigue funcionando.
    }
  }, []);

  const setGender = useCallback(
    (gender) => persist({ ...selection, gender }),
    [selection, persist]
  );

  const setDays = useCallback(
    (days) => persist({ ...selection, days }),
    [selection, persist]
  );

  const reset = useCallback(() => persist({ gender: null, days: null }), [persist]);

  const value = useMemo(
    () => ({
      gender: selection.gender,
      days: selection.days,
      setGender,
      setDays,
      reset,
    }),
    [selection, setGender, setDays, reset]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
