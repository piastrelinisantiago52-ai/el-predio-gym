import { getVideoEmbed } from "../../utils/video";
import Icon from "../common/Icon";
import { icons } from "../../config/theme";

/**
 * Reproductor de video embebido para la ficha de técnica.
 * Acepta cualquier URL compatible (YouTube, YouTube Shorts o un
 * archivo de video directo) — la detección es automática, así que
 * reemplazar la URL en el JSON en el futuro nunca requiere tocar
 * este componente. Si la URL no se puede incrustar (por ejemplo, la
 * página de un artículo con un video adentro), se muestra la imagen
 * del ejercicio con un botón para abrir el video aparte, en vez de
 * un reproductor roto.
 *
 * Pensado para clips cortos (10-20s) que muestran solo la ejecución
 * del movimiento: sin autoplay, sin sugeridos, sin nada que distraiga.
 * El alumno lo mira y vuelve directo a la rutina.
 */
export default function VideoPlayer({ url, posterSrc, posterAlt }) {
  const video = getVideoEmbed(url);
  if (!video) return null;

  if (video.type === "external") {
    return (
      <div className="relative w-full aspect-[4/3] bg-surface-alt overflow-hidden">
        <img
          src={posterSrc}
          alt={posterAlt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          loading="lazy"
        />
        <a
          href={video.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Ver técnica en video"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="w-16 h-16 rounded-full bg-page/90 backdrop-blur flex items-center justify-center shadow-card-hover text-primary active:scale-[0.94] transition-transform duration-150">
            <Icon name={icons.reproducir} size={26} className="ml-0.5" />
          </span>
        </a>
      </div>
    );
  }

  const aspectRatio = video.vertical ? "9 / 16" : "16 / 9";
  const containerClass = `relative w-full bg-black overflow-hidden ${
    video.vertical ? "max-h-[70vh] mx-auto" : ""
  }`;

  if (video.type === "youtube") {
    return (
      <div className={containerClass} style={{ aspectRatio }}>
        <iframe
          src={video.embedUrl}
          title="Video de técnica del ejercicio"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={containerClass} style={{ aspectRatio }}>
      <video
        src={video.src}
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain"
      >
        Tu navegador no puede reproducir este video.
      </video>
    </div>
  );
}
