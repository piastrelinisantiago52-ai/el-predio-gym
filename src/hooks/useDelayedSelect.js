import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Lógica compartida por las pantallas de selección (sexo y días):
 * guarda la opción elegida, dispara el callback correspondiente
 * (setGender/setDays) y navega a la siguiente pantalla después de
 * una breve microanimación.
 *
 * Se extrajo acá porque SelectGender y SelectDays repetían exactamente
 * el mismo patrón. También limpia el timeout pendiente si el
 * componente se desmonta antes de que se dispare, para evitar una
 * navegación fantasma o una fuga de memoria.
 */
export function useDelayedSelect(delayMs = 220) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const select = (value, onSelect, to) => {
    if (selected) return;
    setSelected(value);
    onSelect(value);
    timeoutRef.current = setTimeout(() => navigate(to), delayMs);
  };

  return { selected, select };
}
