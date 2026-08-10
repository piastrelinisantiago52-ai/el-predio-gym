/**
 * Contenedor base que usan todas las pantallas.
 * Centraliza el max-width, el padding y el centrado vertical
 * para que la app se vea consistente y ordenada en celulares
 * (el 100% de los usuarios entra desde un QR).
 */
export default function ScreenLayout({ children, className = "" }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div
        className={`
          flex-1 flex flex-col
          w-full max-w-md mx-auto
          px-6 py-8
          safe-bottom
          animate-fade-in
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
