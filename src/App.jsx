import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Welcome from "./pages/Welcome";
import SelectGender from "./pages/SelectGender";
import SelectDays from "./pages/SelectDays";
import Routine from "./pages/Routine";

/**
 * Se usa HashRouter (en vez de BrowserRouter) a propósito: la app se
 * sirve desde un link fijo de QR y así evitamos cualquier problema de
 * configuración de rutas en el hosting estático (404 en /genero, /dias, etc.).
 */
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/genero" element={<SelectGender />} />
          <Route path="/dias" element={<SelectDays />} />
          <Route path="/rutina" element={<Routine />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
