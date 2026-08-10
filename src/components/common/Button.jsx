import { buttonVariants } from "../../config/theme";

/**
 * Botón base de la app.
 * El estilo visual de cada variante se define en src/config/theme.js,
 * así que cambiar el look de TODOS los botones "primary" (por ejemplo)
 * es editar una sola línea en ese archivo.
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  fullWidth = true,
  icon = null,
  disabled = false,
  className = "",
}) {
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        flex items-center justify-center gap-2
        px-7 py-4.5
        rounded-full
        text-[17px]
        font-body font-semibold
        transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        active:duration-100
        disabled:opacity-40 disabled:pointer-events-none
        ${variantClasses}
        ${className}
      `}
    >
      {icon && <span className="text-xl leading-none">{icon}</span>}
      {children}
    </button>
  );
}
