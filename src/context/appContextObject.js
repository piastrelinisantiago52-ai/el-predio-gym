import { createContext } from "react";

/**
 * Objeto de contexto en su propio archivo (sin JSX) para que
 * AppContext.jsx solo exporte el componente AppProvider y
 * src/hooks/useAppContext.js solo exporte el hook. Mantener cada
 * archivo con una única responsabilidad es lo que permite que el
 * Fast Refresh de React funcione correctamente en desarrollo.
 */
export const AppContext = createContext(null);
