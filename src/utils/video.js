const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

function getYouTubeId(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null;

  if (parsed.hostname === "youtu.be") {
    return parsed.pathname.slice(1) || null;
  }
  if (parsed.pathname.startsWith("/shorts/")) {
    return parsed.pathname.split("/")[2] || null;
  }
  if (parsed.pathname.startsWith("/embed/")) {
    return parsed.pathname.split("/")[2] || null;
  }
  if (parsed.pathname === "/watch") {
    return parsed.searchParams.get("v");
  }
  return null;
}

const VIDEO_FILE_EXTENSIONS = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

function getPathname(url) {
  try {
    return new URL(url).pathname;
  } catch {
    try {
      // URLs relativas (ej. "/media/videos/x.mp4") necesitan una base
      // para poder parsearse; solo se usa para leer el pathname.
      return new URL(url, "https://el-predio-gym.local").pathname;
    } catch {
      return url;
    }
  }
}

/**
 * Analiza la URL de video de un ejercicio y devuelve todo lo necesario
 * para reproducirlo embebido en la ficha de técnica, sin importar si
 * es un link de YouTube, de YouTube Shorts, o un archivo de video
 * directo (mp4, webm, etc). Gracias a esto, en el futuro alcanza con
 * reemplazar la URL en el JSON — nunca hace falta tocar el código.
 *
 * Si la URL no es de YouTube ni apunta a un archivo de video
 * reconocible (por ejemplo, la página de un artículo con un video
 * adentro), se devuelve como "external": en vez de forzar un
 * reproductor roto, la ficha muestra un botón para abrirla aparte.
 *
 * Devuelve null si no hay URL.
 */
export function getVideoEmbed(url) {
  if (!url) return null;

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`,
      // Los Shorts son verticales: se reproducen en un marco 9:16 en vez de 16:9.
      vertical: /\/shorts\//.test(url),
    };
  }

  if (VIDEO_FILE_EXTENSIONS.test(getPathname(url))) {
    return { type: "file", src: url };
  }

  return { type: "external", href: url };
}
