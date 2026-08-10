// Script auxiliar (no forma parte del bundle de la app) para generar
// los 6 archivos JSON de /src/data a partir de una biblioteca única de
// ejercicios. Se ejecuta una sola vez con: node scripts/build-data.mjs
//
// ARQUITECTURA: la biblioteca de ejercicios (EX) es la única fuente de
// verdad para nombre/técnica/errores comunes/dificultad/imagen/video de
// cada ejercicio. Las rutinas (más abajo) solo la REFERENCIAN por clave
// y agregan series/repeticiones específicas de ese día — nunca duplican
// la información del ejercicio a mano.
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");
mkdirSync(DATA_DIR, { recursive: true });

// Media servida desde /public/media, fuera de src, para poder
// reemplazar los archivos reales sin tocar nunca el código. Se usa
// como imagen de respaldo únicamente para ejercicios que YA tenían
// esta convención de antes y no recibieron una miniatura de YouTube.
const img = (slug) => `/media/imagenes/${slug}.webp`;

// Descanso: el documento oficial indica un único valor para todas las
// rutinas ("Los descansos entre series son de 1 minuto 30 segundos"),
// por eso es una constante y no un dato por ejercicio.
const DESCANSO_GLOBAL = "1 minuto 30 segundos";

// ============================================================
// VIDEOS — biblioteca oficial provista por el cliente (YouTube
// normal y YouTube Shorts). NO se inventan enlaces: todo lo que no
// esté acá queda con video: "".
// ============================================================
const VIDEO_URLS = {
  // Pecho
  "press-banca": "https://www.youtube.com/shorts/KDlKvAkB_7k",
  "press-inclinado-barra": "https://www.youtube.com/watch?v=swMjJqFzxCQ",
  "press-inclinado-mancuerna": "https://www.youtube.com/shorts/a64mtMHyPfY",
  "press-declinado-maquina": "https://www.youtube.com/shorts/zPufjan9v9k",
  "abertura-pecho": "https://www.youtube.com/shorts/SMlwt5R327I",
  "cruce-poleas": "https://www.youtube.com/shorts/_QwO5I3dHU8",
  "press-pec-deck": "https://www.youtube.com/shorts/VpgeMU8jOu0",
  "press-banca-mancuernas": "https://www.youtube.com/shorts/_2YYO-BdoKI",
  "press-inclinado-maquina": "https://www.youtube.com/shorts/KL68W0jP9N4",
  "fondos-maquina-asistida": "https://www.youtube.com/shorts/UBLnczRzsIs",

  // Espalda
  "jalon-pecho": "https://www.youtube.com/shorts/UwnFFf2fV8w",
  "dorsalera-toma-cerrada": "https://www.youtube.com/shorts/2pL86tVDVUs",
  "remo-bajo": "https://www.youtube.com/shorts/D_UXjlrZIBw",
  "remo-alto-serrucho": "https://www.youtube.com/shorts/0qQfyZ-ueIU",
  "remo-mancuerna": "https://www.youtube.com/shorts/6PjXUP3tlF0",
  "pull-over-polea": "https://www.youtube.com/shorts/MTk0YhGKozU",
  "remo-barra": "https://www.youtube.com/shorts/xyh5wKA5jBs",
  "remo-maquina": "https://www.youtube.com/shorts/rcS3dvtBXDY",

  // Hombros
  "deltoides-maquina": "https://www.youtube.com/shorts/_CfVg1LPy8Y",
  "press-hombros-maquina": "https://www.youtube.com/shorts/_CfVg1LPy8Y",
  "press-militar": "https://www.youtube.com/shorts/aWAZKSUFBdQ",
  "press-militar-mancuernas": "https://www.youtube.com/shorts/Hbt2fEa2cTU",
  "elevaciones-laterales": "https://www.youtube.com/shorts/8ZtOYet5RuI",
  "voladas-laterales": "https://www.youtube.com/shorts/8ZtOYet5RuI",
  "elevaciones-laterales-polea": "https://www.youtube.com/shorts/2FFErVTJb3c",
  "voladas-posteriores-maquina": "https://www.youtube.com/shorts/714DWH5o4Gg",
  "elevaciones-frontales-disco": "https://www.youtube.com/watch?v=MXJOvBh-Shw",
  "voladas-frontales": "https://www.youtube.com/watch?v=MXJOvBh-Shw",
  "elevaciones-frontales-barra": "https://www.youtube.com/shorts/SdLRWTcjDNE",
  "remo-menton-barra": "https://www.youtube.com/watch?v=7vGo3Pl9pZ8",

  // Bíceps
  "curl-barra-recta": "https://www.youtube.com/shorts/MqYBweUzDT4",
  "curl-alternado-mancuernas": "https://www.youtube.com/shorts/c3Pl0072T7Q",
  "curl-banco-scott": "https://www.youtube.com/shorts/uXaz4wPNaxs",
  "curl-polea-baja": "https://www.youtube.com/shorts/ifU_iEAhOfA",
  "curl-martillo": "https://www.youtube.com/shorts/KsVklsSOuKo",
  "curl-biceps": "https://www.youtube.com/shorts/6Ue53hldjBI",
  "curl-concentrado": "https://www.youtube.com/shorts/eSpHxZideNY",

  // Tríceps
  "press-frances-barra": "https://www.youtube.com/shorts/RfgcuBmtBR4",
  "triceps-polea": "https://www.youtube.com/shorts/soUN4QLcagQ",
  "extension-triceps-cuerda": "https://www.youtube.com/shorts/soUN4QLcagQ",
  "fondos-triceps": "https://www.youtube.com/shorts/cI6HMipOva4",
  "patada-triceps-mancuerna": "https://www.youtube.com/shorts/_r8lVisvg5E",
  "extension-triceps-unilateral": "https://www.youtube.com/shorts/ndX75koPRVc",

  // Cuádriceps
  "sentadilla-maquina": "https://www.youtube.com/shorts/rQw8GUzpj1I",
  "sentadilla-smith": "https://www.youtube.com/shorts/I6dbd_SSIvc",
  "extension-cuadriceps": "https://www.youtube.com/watch?v=PVAwJf2liSY",
  "sentadilla": "https://www.youtube.com/shorts/5c6mAD-7G8A",
  "prensa-45": "https://www.youtube.com/shorts/IcIroo9VzF4",
  "sentadilla-bulgara": "https://www.youtube.com/shorts/5jJ_wPLUikk",
  "zancadas": "https://www.youtube.com/shorts/e51HQZS92eQ",
  "estocadas": "https://www.youtube.com/watch?v=avosZcjX2Ww",
  "zancadas-caminando": "https://www.youtube.com/watch?v=avosZcjX2Ww",
  "sentadilla-sumo-mancuerna": "https://www.youtube.com/shorts/TSrhPvAemzA",
  "step-up-mancuernas": "https://www.youtube.com/shorts/ccGuQHSNiFA",

  // Isquiotibiales
  "curl-femoral": "https://www.youtube.com/watch?v=CtuaKwybBb8",
  "curl-femoral-sentado": "https://www.youtube.com/shorts/POgzKaM92X4",
  "peso-muerto-rumano": "https://www.youtube.com/shorts/liKcRnQ3kNI",
  "peso-muerto-rumano-mancuernas": "https://www.youtube.com/shorts/SAdzug-v7D0",

  // Glúteos
  "hip-thrust": "https://www.youtube.com/shorts/7B4pSZhzkYY",
  "patada-gluteo-polea": "https://www.youtube.com/shorts/JvTbK5773hc",

  // Abdomen
  "crunch-abdominal": "https://www.youtube.com/watch?v=C3aOKQMNuKk",
  "crunch-maquina": "https://www.youtube.com/watch?v=DLU0RKjZV2g",
  "crunch-polea-alta": "https://www.youtube.com/shorts/MBGe6ncD2KI",
  "abdomen-bicicleta": "https://www.youtube.com/watch?v=dYxamPVcKvk",
  "abdomen-tocando-talones": "https://www.youtube.com/watch?v=PmD8OjgsdrY",
  "abdomen-bajo": "https://www.youtube.com/watch?v=36beUJcZ3K8",
  "abdomen-pelota-piernas-extendidas": "https://www.youtube.com/watch?v=ukK-eamMI_0",
  "plancha": "https://www.youtube.com/shorts/ysX1CpHKGCo",
  "plancha-combinada": "https://www.youtube.com/watch?v=DWqII4NR_vs",
  "plancha-lateral": "https://www.youtube.com/watch?v=3iTX7S0kONg",
  "plancha-dinamica": "https://www.youtube.com/watch?v=P9PtfvqEsUc",
  "elevacion-piernas-banco": "https://www.youtube.com/watch?v=oxJj5FoBycQ",
  "elevacion-piernas-colgado": "https://www.youtube.com/shorts/98oNxE56i3g",
  "abdomen-lenador": "https://www.youtube.com/watch?v=2itLaQIzijo",
  "puente-abdominal-estatico": "https://www.youtube.com/watch?v=SPTBzZdINlg",

  // Espinales
  "nado-pecho": "https://www.youtube.com/watch?v=9jfklcRme4c",
  "espinales-baston": "https://www.youtube.com/watch?v=4sCNC7hkYrM",
  "superman-colchoneta": "https://www.youtube.com/watch?v=6IojLNZWVP8",
  "hiperextension": "https://www.youtube.com/shorts/bLPebovecmg",

  // Piernas / Glúteos (sección final de la lista del cliente)
  // NOTA: este video fue marcado por el cliente como posiblemente
  // incorrecto (parece un step-up, no un ejercicio de aductores).
  // Se deja igual, sin reemplazarlo ni inventar uno nuevo, marcado
  // como pendiente de revisión (ver PENDIENTES_REVISION más abajo).
  "aductores-step": "https://www.youtube.com/shorts/9XWxpd_kVko",
  "aductores-maquina": "https://www.youtube.com/watch?v=dycKfaquQWo",
  "puente-gluteo": "https://www.youtube.com/watch?v=oDXM-a-gBt8",
  "elevacion-caderas-maquina": "https://www.youtube.com/shorts/HCuDBzeh0F8",
  "gemelos-en-prensa": "https://www.youtube.com/watch?v=EptZC_AY6fE",
  "gemelos-unilateral-mancuerna": "https://www.youtube.com/watch?v=tU54YpeT6Nk",

  // Videos que YA existían de una entrega anterior y NO fueron
  // reemplazados por esta nueva lista (el ejercicio no aparece en
  // ella), tal como pide el cliente ("mantener videos existentes").
  "dominadas": "https://support.runna.com/es/articles/6364644-tutorial-de-ejercicios-de-dominadas",
  "press-hombro-mancuerna": "https://support.runna.com/es/articles/6364010-tutorial-del-ejercicio-de-press-de-hombros-con-doble-brazo-de-pie",
  "peso-muerto-sumo": "https://support.runna.com/es/articles/6364667-tutorial-del-ejercicio-de-peso-muerto-sumo",
  "peso-muerto-pierna-rigida": "https://support.runna.com/es/articles/6364013-tutorial-del-ejercicio-de-peso-muerto-con-piernas-rectas",
  "gemelos-de-pie": "https://www.youtube.com/watch?v=Y09LG23eVZU",

  // Corrección puntual pedida por el cliente (última actualización de contenido).
  "gemelos-sentado-maquina": "https://www.youtube.com/watch?v=Hq7ZnmkuZWM",
  "abduccion-cadera": "https://www.youtube.com/watch?v=2vCRMi-lgJ4",
};

// Ejercicios cuyo video quedó marcado por el cliente como pendiente
// de revisión (se usa igual, no se inventa ni se reemplaza).
const PENDIENTES_REVISION = new Set(["aductores-step"]);

// Extrae el ID de video de YouTube de una URL, tanto si es un video
// normal (/watch?v=) como un Short (/shorts/), para poder generar la
// miniatura automáticamente. Devuelve null para links que no son de
// YouTube (por ejemplo, los de support.runna.com que se conservan de
// una entrega anterior): esos no reciben miniatura automática.
function extractYouTubeId(url) {
  const shorts = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (shorts) return shorts[1];
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watch) return watch[1];
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (short) return short[1];
  return null;
}

function thumbnailFor(slug) {
  const url = VIDEO_URLS[slug];
  if (!url) return null;
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// ============================================================
// BIBLIOTECA DE EJERCICIOS
// ============================================================
// Los primeros 28 son los que ya existían en la app (id 1-28): se
// mantienen con su técnica, errores comunes y dificultad EXACTAMENTE
// iguales a como estaban. Solo cambia su "video" si el cliente indicó
// explícitamente un reemplazo en la nueva lista.
const EX = {
  sentadilla: {
    id: 1,
    slug: "sentadilla",
    nombre: "Sentadilla con barra",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica:
      "Barra apoyada sobre el trapecio, pies al ancho de hombros. Bajar controlando la cadera hacia atrás y abajo hasta que el muslo quede paralelo al piso, manteniendo el pecho arriba y las rodillas alineadas con los pies.",
    erroresComunes: [
      "Rodillas colapsando hacia adentro",
      "Talones que se levantan",
      "Espalda baja redondeada al bajar",
    ],
    dificultad: "Intermedio",
  },
  pesoMuertoRumano: {
    id: 2,
    slug: "peso-muerto-rumano",
    nombre: "Peso muerto rumano",
    musculoPrincipal: "Isquiotibiales / Glúteos",
    tecnica:
      "Barra pegada al cuerpo, piernas semi extendidas. Bajar empujando la cadera hacia atrás sin redondear la espalda, hasta sentir el estiramiento en isquiotibiales, y volver extendiendo cadera.",
    erroresComunes: [
      "Redondear la espalda baja",
      "Doblar demasiado las rodillas convirtiéndolo en sentadilla",
      "Alejar la barra del cuerpo",
    ],
    dificultad: "Intermedio",
  },
  pressBanca: {
    id: 3,
    slug: "press-banca",
    nombre: "Press de banca con barra",
    musculoPrincipal: "Pectoral",
    tecnica:
      "Acostado en banco plano, agarre un poco más ancho que los hombros. Bajar la barra controlada hasta rozar el pecho y empujar en línea recta hacia arriba sin bloquear de golpe los codos.",
    erroresComunes: [
      "Rebotar la barra en el pecho",
      "Despegar los glúteos del banco",
      "Codos completamente abiertos a 90°",
    ],
    dificultad: "Intermedio",
  },
  remoBarra: {
    id: 4,
    slug: "remo-barra",
    nombre: "Remo con barra",
    musculoPrincipal: "Espalda (dorsal ancho)",
    tecnica:
      "Torso inclinado unos 45°, espalda recta. Tirar de la barra hacia el abdomen llevando los codos hacia atrás, apretando los omóplatos, y bajar controlado.",
    erroresComunes: [
      "Usar impulso de la lumbar (balanceo)",
      "No completar el recorrido",
      "Encoger los hombros en vez de llevar los codos atrás",
    ],
    dificultad: "Intermedio",
  },
  pressMilitar: {
    id: 5,
    slug: "press-militar",
    nombre: "Press militar de pie",
    musculoPrincipal: "Hombros (deltoides)",
    tecnica:
      "De pie, barra a la altura de clavícula. Empujar hacia arriba en línea recta, sin arquear excesivamente la lumbar, hasta extender completamente los brazos.",
    erroresComunes: [
      "Arquear demasiado la espalda baja",
      "Empujar la barra hacia adelante en vez de hacia arriba",
      "No estabilizar el core",
    ],
    dificultad: "Intermedio",
  },
  dominadas: {
    id: 6,
    slug: "dominadas",
    nombre: "Dominadas (jalón asistido si hace falta)",
    musculoPrincipal: "Espalda / Bíceps",
    tecnica:
      "Agarre prono un poco más ancho que los hombros. Subir hasta que el mentón supere la barra, llevando los codos hacia abajo y atrás, bajar controlado hasta extensión completa.",
    erroresComunes: [
      "Usar balanceo o impulso de piernas",
      "No bajar en rango completo",
      "Encoger los hombros hacia las orejas",
    ],
    dificultad: "Avanzado",
  },
  hipThrust: {
    id: 7,
    slug: "hip-thrust",
    nombre: "Hip thrust con barra",
    musculoPrincipal: "Glúteos",
    tecnica:
      "Espalda apoyada en banco, barra sobre la cadera. Empujar la cadera hacia arriba apretando fuerte el glúteo en la parte alta, sin hiperextender la lumbar, y bajar controlado.",
    erroresComunes: [
      "Arquear la zona lumbar en vez de extender la cadera",
      "Apoyar mal la barra generando molestia",
      "Subir con impulso de piernas",
    ],
    dificultad: "Principiante",
  },
  zancadas: {
    id: 8,
    slug: "zancadas",
    nombre: "Zancadas con mancuernas",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica:
      "Dar un paso largo al frente, bajar hasta que ambas rodillas formen 90°, sin que la rodilla delantera sobrepase mucho la punta del pie, y volver a la posición inicial.",
    erroresComunes: [
      "Paso demasiado corto",
      "Inclinar el torso hacia adelante",
      "Rodilla trasera golpeando el piso con fuerza",
    ],
    dificultad: "Principiante",
  },
  pressInclinadoMancuerna: {
    id: 9,
    slug: "press-inclinado-mancuerna",
    nombre: "Press inclinado con mancuernas",
    musculoPrincipal: "Pectoral superior",
    tecnica:
      "Banco inclinado 30-45°. Bajar las mancuernas controlado a los lados del pecho y empujar hacia arriba juntando ligeramente al final sin chocar las mancuernas.",
    erroresComunes: [
      "Inclinación del banco demasiado alta (pasa a trabajar hombro)",
      "Bajar muy rápido",
      "Arquear excesivamente la espalda",
    ],
    dificultad: "Principiante",
  },
  jalonPecho: {
    id: 10,
    slug: "jalon-pecho",
    nombre: "Jalón al pecho en polea",
    musculoPrincipal: "Espalda (dorsal ancho)",
    tecnica:
      "Agarre ancho, torso ligeramente inclinado atrás. Tirar la barra hacia la parte alta del pecho llevando codos hacia abajo, y subir controlado sin soltar la tensión.",
    erroresComunes: [
      "Tirar la barra detrás de la nuca",
      "Usar impulso echando todo el cuerpo hacia atrás",
      "Agarre demasiado cerrado",
    ],
    dificultad: "Principiante",
  },
  elevacionesLaterales: {
    id: 11,
    slug: "elevaciones-laterales",
    nombre: "Elevaciones laterales con mancuernas",
    musculoPrincipal: "Hombro (deltoides lateral)",
    tecnica:
      "De pie, mancuernas a los costados. Elevar los brazos hacia los lados hasta la altura del hombro, con un ligero quiebre en el codo, y bajar controlado.",
    erroresComunes: [
      "Usar impulso balanceando el torso",
      "Subir por encima de la línea de hombro",
      "Encoger el trapecio en vez de abrir el hombro",
    ],
    dificultad: "Principiante",
  },
  curlBiceps: {
    id: 12,
    slug: "curl-biceps",
    nombre: "Curl de bíceps con barra Z",
    musculoPrincipal: "Bíceps",
    tecnica:
      "De pie, agarre supino en la barra Z. Flexionar el codo llevando la barra hacia el hombro sin mover el torso, y bajar controlado hasta extensión completa.",
    erroresComunes: [
      "Balancear el cuerpo para impulsar el peso",
      "No extender completo el codo abajo",
      "Codos que se despegan del torso",
    ],
    dificultad: "Principiante",
  },
  fondosTriceps: {
    id: 13,
    slug: "fondos-triceps",
    nombre: "Fondos en banco (tríceps)",
    musculoPrincipal: "Tríceps",
    tecnica:
      "Manos apoyadas en el borde del banco, piernas extendidas. Bajar flexionando los codos hacia atrás hasta 90° y empujar hacia arriba extendiendo los brazos.",
    erroresComunes: [
      "Bajar demasiado forzando el hombro",
      "Abrir mucho los codos hacia los costados",
      "Apoyar mal las muñecas",
    ],
    dificultad: "Intermedio",
  },
  extensionCuadriceps: {
    id: 14,
    slug: "extension-cuadriceps",
    nombre: "Extensión de cuádriceps en máquina",
    musculoPrincipal: "Cuádriceps",
    tecnica:
      "Sentado, respaldo ajustado, tobillo bajo el rodillo. Extender la pierna hasta casi bloquear la rodilla, apretar arriba y bajar controlado sin soltar el peso de golpe.",
    erroresComunes: [
      "Soltar el peso en la bajada",
      "Despegar la espalda del respaldo",
      "Usar impulso con el torso",
    ],
    dificultad: "Principiante",
  },
  curlFemoral: {
    id: 15,
    slug: "curl-femoral",
    nombre: "Curl femoral en máquina",
    musculoPrincipal: "Isquiotibiales",
    tecnica:
      "Acostado o sentado según la máquina, rodillo apoyado en el tobillo. Flexionar la rodilla llevando el talón hacia el glúteo y volver controlado sin extender de golpe.",
    erroresComunes: [
      "Levantar la cadera de la camilla",
      "Usar impulso",
      "No completar el rango de movimiento",
    ],
    dificultad: "Principiante",
  },
  gemelosDePie: {
    id: 16,
    slug: "gemelos-de-pie",
    nombre: "Elevación de talones de pie",
    musculoPrincipal: "Gemelos",
    tecnica:
      "De pie sobre una base elevada, talones fuera del apoyo. Subir lo más alto posible sobre la punta de los pies, apretar arriba y bajar hasta sentir el estiramiento.",
    erroresComunes: [
      "Rango de movimiento muy corto",
      "Rebotar en vez de controlar",
      "No bajar por debajo de la línea del apoyo",
    ],
    dificultad: "Principiante",
  },
  plancha: {
    id: 17,
    slug: "plancha",
    nombre: "Plancha abdominal",
    musculoPrincipal: "Core",
    tecnica:
      "Apoyo en antebrazos y puntas de pie, cuerpo en línea recta de cabeza a talones. Mantener la posición contrayendo abdomen y glúteos sin dejar caer la cadera.",
    erroresComunes: [
      "Cadera elevada en forma de techo",
      "Cadera caída hundiendo la lumbar",
      "Aguantar la respiración",
    ],
    dificultad: "Principiante",
  },
  pressFrances: {
    id: 18,
    slug: "press-frances",
    nombre: "Press francés con mancuerna",
    musculoPrincipal: "Tríceps",
    tecnica:
      "Acostado o sentado, mancuerna sostenida con ambas manos detrás de la cabeza. Extender los codos hacia arriba sin moverlos de posición y bajar controlado.",
    erroresComunes: [
      "Abrir los codos hacia los costados",
      "Usar impulso del hombro",
      "Rango de movimiento incompleto",
    ],
    dificultad: "Principiante",
  },
  aberturaPecho: {
    id: 19,
    slug: "abertura-pecho",
    nombre: "Aperturas con mancuernas",
    musculoPrincipal: "Pectoral",
    tecnica:
      "Acostado en banco plano, mancuernas arriba con leve flexión de codo. Bajar los brazos hacia los lados en arco controlado hasta sentir estiramiento en el pecho y volver.",
    erroresComunes: [
      "Flexionar demasiado el codo (se convierte en press)",
      "Bajar más de lo que permite el hombro",
      "Usar peso excesivo",
    ],
    dificultad: "Principiante",
  },
  pesoMuertoConvencional: {
    id: 20,
    slug: "peso-muerto-convencional",
    nombre: "Peso muerto convencional",
    musculoPrincipal: "Cadena posterior (espalda baja, glúteo, isquios)",
    tecnica:
      "Barra pegada a las espinillas, espalda neutra. Levantar empujando el piso con las piernas y extendiendo cadera y rodilla al mismo tiempo, barra siempre cerca del cuerpo.",
    erroresComunes: [
      "Redondear la espalda baja",
      "Alejar la barra del cuerpo",
      "Extender la cadera antes que las rodillas",
    ],
    dificultad: "Avanzado",
  },
  pressPecho: {
    id: 21,
    slug: "press-pecho-maquina",
    nombre: "Press de pecho en máquina",
    musculoPrincipal: "Pectoral",
    tecnica:
      "Sentado, espalda apoyada, agarres a la altura del pecho. Empujar al frente extendiendo los brazos sin bloquear de golpe los codos y volver controlado.",
    erroresComunes: [
      "Despegar la espalda del respaldo",
      "Bajar demasiado rápido",
      "No controlar la fase excéntrica",
    ],
    dificultad: "Principiante",
  },
  remoMancuerna: {
    id: 22,
    slug: "remo-mancuerna",
    nombre: "Remo con mancuerna a una mano",
    musculoPrincipal: "Espalda",
    tecnica:
      "Apoyo de una mano y rodilla en el banco, torso paralelo al piso. Tirar la mancuerna hacia la cadera llevando el codo hacia atrás, apretando el omóplato.",
    erroresComunes: [
      "Rotar el torso para ayudar con impulso",
      "No completar el recorrido",
      "Tirar hacia el hombro en vez de hacia la cadera",
    ],
    dificultad: "Principiante",
  },
  hiperextension: {
    id: 23,
    slug: "hiperextension",
    nombre: "Hiperextensión lumbar",
    musculoPrincipal: "Espalda baja / Glúteos",
    tecnica:
      "Cadera apoyada en el banco romano, torso hacia abajo. Subir extendiendo la espalda hasta alinear el cuerpo, apretando glúteo, sin hiperextender de más arriba.",
    erroresComunes: [
      "Subir de más arqueando en exceso",
      "Usar impulso brusco",
      "No controlar la bajada",
    ],
    dificultad: "Principiante",
  },
  pesoMuertoSumo: {
    id: 24,
    slug: "peso-muerto-sumo",
    nombre: "Peso muerto sumo",
    musculoPrincipal: "Glúteos / Aductores",
    tecnica:
      "Piernas bien abiertas, puntas de pie hacia afuera, agarre entre las piernas. Bajar manteniendo el pecho arriba y levantar empujando el piso, extendiendo cadera y rodilla juntas.",
    erroresComunes: [
      "Rodillas colapsando hacia adentro",
      "Espalda redondeada",
      "No abrir lo suficiente las caderas al bajar",
    ],
    dificultad: "Avanzado",
  },
  abduccionCadera: {
    id: 25,
    slug: "abduccion-cadera",
    nombre: "Abducción de cadera en máquina",
    musculoPrincipal: "Glúteo medio",
    tecnica:
      "Sentado en la máquina, respaldo recto. Abrir las piernas contra la resistencia apretando el glúteo, y volver controlado sin dejar caer el peso de golpe.",
    erroresComunes: [
      "Usar impulso del torso",
      "Rango de movimiento muy corto",
      "Soltar el peso en la vuelta",
    ],
    dificultad: "Principiante",
  },
  pressHombroMancuerna: {
    id: 26,
    slug: "press-hombro-mancuerna",
    nombre: "Press de hombro con mancuernas sentado",
    musculoPrincipal: "Hombros",
    tecnica:
      "Sentado con respaldo, mancuernas a la altura del hombro. Empujar hacia arriba hasta casi extender el codo, sin arquear la espalda baja, y bajar controlado.",
    erroresComunes: [
      "Arquear la lumbar despegándose del respaldo",
      "Chocar las mancuernas con impulso arriba",
      "Bajar muy rápido",
    ],
    dificultad: "Principiante",
  },
  crunchAbdominal: {
    id: 27,
    slug: "crunch-abdominal",
    nombre: "Crunch abdominal",
    musculoPrincipal: "Abdomen (recto anterior)",
    tecnica:
      "Acostado, rodillas flexionadas, manos apoyadas cerca de la cabeza sin tirar del cuello. Subir el torso contrayendo el abdomen y bajar controlado sin apoyar del todo.",
    erroresComunes: [
      "Tirar del cuello con las manos",
      "Usar impulso de las piernas",
      "Subir demasiado como si fuera un abdominal completo",
    ],
    dificultad: "Principiante",
  },
  pesoMuertoPiernaRigida: {
    id: 28,
    slug: "peso-muerto-pierna-rigida",
    nombre: "Peso muerto piernas rígidas con mancuernas",
    musculoPrincipal: "Isquiotibiales",
    tecnica:
      "Mancuernas al frente del cuerpo, piernas casi extendidas. Bajar empujando cadera atrás manteniendo la espalda neutra hasta sentir el estiramiento, y subir controlado.",
    erroresComunes: [
      "Redondear la espalda",
      "Flexionar demasiado las rodillas",
      "Bajar más de lo que permite la flexibilidad",
    ],
    dificultad: "Intermedio",
  },
};

// ============================================================
// EJERCICIOS NUEVOS (no existían en la biblioteca antes de esta
// entrega). Se agregan al mismo catálogo EX con Object.assign para
// no reabrir el objeto de arriba. Técnica/errores/dificultad son
// contenido redactado para esta entrega (no vienen del documento,
// que solo trae nombre + series x repeticiones); los videos SÍ son
// exactamente los provistos por el cliente, o "" si no proveyó uno.
Object.assign(EX, {
  pressInclinadoBarra: {
    id: 29, slug: "press-inclinado-barra", nombre: "Press de banca inclinado",
    musculoPrincipal: "Pectoral superior",
    tecnica: "Banco inclinado 30-45°, barra a la altura del pecho superior. Bajar controlada hasta rozar la clavícula y empujar en línea recta hacia arriba.",
    erroresComunes: ["Bajar la barra demasiado abajo, hacia el abdomen", "Inclinación del banco excesiva (pasa a trabajar hombro)"],
    dificultad: "Intermedio",
  },
  pressDeclinadoMaquina: {
    id: 30, slug: "press-declinado-maquina", nombre: "Press declinado en máquina",
    musculoPrincipal: "Pectoral inferior",
    tecnica: "Sentado con inclinación negativa, agarres a la altura del pecho bajo. Empujar al frente extendiendo los brazos sin bloquear de golpe los codos.",
    erroresComunes: ["Despegar la espalda del respaldo", "Bajar el peso sin control"],
    dificultad: "Principiante",
  },
  crucePoleas: {
    id: 31, slug: "cruce-poleas", nombre: "Cruce de poleas",
    musculoPrincipal: "Pectoral",
    tecnica: "De pie entre dos poleas altas, un pie adelantado. Llevar ambas manos hacia el centro y abajo en arco, apretando el pecho al final.",
    erroresComunes: ["Usar solo los brazos en vez del pecho", "Peso excesivo que acorta el recorrido"],
    dificultad: "Principiante",
  },
  pressPecDeck: {
    id: 32, slug: "press-pec-deck", nombre: "Press en máquina (pec deck)",
    musculoPrincipal: "Pectoral",
    tecnica: "Sentado, antebrazos apoyados en las almohadillas. Juntar los brazos al frente apretando el pecho, y volver controlado sin abrir de más.",
    erroresComunes: ["Usar impulso con el torso", "Abrir el rango más allá de lo cómodo para el hombro"],
    dificultad: "Principiante",
  },
  pressBancaMancuernas: {
    id: 33, slug: "press-banca-mancuernas", nombre: "Press de banca plano con mancuernas",
    musculoPrincipal: "Pectoral",
    tecnica: "Acostado en banco plano, mancuernas a la altura del pecho. Empujar hacia arriba hasta casi juntar las mancuernas, y bajar controlado.",
    erroresComunes: ["Bajar demasiado rápido", "Codos completamente abiertos a 90°"],
    dificultad: "Intermedio",
  },
  pressInclinadoMaquina: {
    id: 34, slug: "press-inclinado-maquina", nombre: "Press inclinado en máquina",
    musculoPrincipal: "Pectoral superior",
    tecnica: "Sentado en el banco inclinado de la máquina, agarres a la altura del pecho. Empujar hacia arriba y adelante sin bloquear de golpe los codos.",
    erroresComunes: ["Despegar la espalda del respaldo", "No controlar la fase de bajada"],
    dificultad: "Principiante",
  },
  fondosMaquinaAsistida: {
    id: 35, slug: "fondos-maquina-asistida", nombre: "Fondos en máquina asistida",
    musculoPrincipal: "Pectoral / Tríceps",
    tecnica: "De pie sobre la plataforma con el contrapeso elegido, manos en los soportes. Bajar flexionando los codos y empujar hacia arriba extendiendo los brazos.",
    erroresComunes: ["Bajar demasiado forzando el hombro", "Elegir una asistencia insuficiente para completar el rango"],
    dificultad: "Principiante",
  },
  dorsaleraTomaCerrada: {
    id: 36, slug: "dorsalera-toma-cerrada", nombre: "Dorsalera toma cerrada por delante",
    musculoPrincipal: "Espalda (dorsal ancho)",
    tecnica: "Agarre cerrado (barra V o similar), torso ligeramente atrás. Tirar hacia la parte alta del pecho llevando los codos hacia abajo y atrás.",
    erroresComunes: ["Usar impulso echando el cuerpo hacia atrás", "No completar el recorrido arriba"],
    dificultad: "Principiante",
  },
  remoBajo: {
    id: 37, slug: "remo-bajo", nombre: "Remo bajo",
    musculoPrincipal: "Espalda",
    tecnica: "Sentado en la polea baja, piernas semiflexionadas. Tirar de la agarradera hacia el abdomen llevando los codos atrás, apretando los omóplatos.",
    erroresComunes: ["Redondear la espalda al estirar los brazos", "Usar impulso del torso hacia atrás"],
    dificultad: "Principiante",
  },
  remoAltoSerrucho: {
    id: 38, slug: "remo-alto-serrucho", nombre: "Remo alto o serrucho",
    musculoPrincipal: "Espalda",
    tecnica: "De pie frente a la polea baja, torso ligeramente inclinado. Tirar la agarradera hacia la cadera en diagonal, como remando, apretando la espalda.",
    erroresComunes: ["Usar solo el brazo sin activar la espalda", "Rotar excesivamente el torso"],
    dificultad: "Principiante",
  },
  pullOverPolea: {
    id: 39, slug: "pull-over-polea", nombre: "Pull-over en polea",
    musculoPrincipal: "Espalda / Pectoral",
    tecnica: "De pie frente a la polea alta, brazos casi extendidos. Bajar los brazos en arco hasta la altura de los muslos, sintiendo el estiramiento del dorsal.",
    erroresComunes: ["Flexionar demasiado los codos (pasa a ser tríceps)", "Usar impulso del torso"],
    dificultad: "Principiante",
  },
  remoMaquina: {
    id: 40, slug: "remo-maquina", nombre: "Remo en máquina",
    musculoPrincipal: "Espalda",
    tecnica: "Sentado con el pecho apoyado en la almohadilla, agarres al frente. Tirar hacia atrás llevando los codos junto al cuerpo, apretando los omóplatos.",
    erroresComunes: ["Despegar el pecho del respaldo", "No completar el recorrido hacia atrás"],
    dificultad: "Principiante",
  },
  deltoidesMaquina: {
    id: 41, slug: "deltoides-maquina", nombre: "Deltoides en máquina (press militar)",
    musculoPrincipal: "Hombros",
    tecnica: "Sentado con respaldo, agarres a la altura del hombro. Empujar hacia arriba extendiendo los brazos sin arquear la espalda baja.",
    erroresComunes: ["Arquear la lumbar despegándose del respaldo", "Bajar el peso sin control"],
    dificultad: "Principiante",
  },
  voladasLaterales: {
    id: 42, slug: "voladas-laterales", nombre: "Voladas laterales",
    musculoPrincipal: "Hombro (deltoides lateral)",
    tecnica: "Sentado en la máquina, codos apoyados en las almohadillas laterales. Elevar los brazos hacia los lados hasta la altura del hombro.",
    erroresComunes: ["Usar impulso con el trapecio", "Subir por encima de la línea de hombro"],
    dificultad: "Principiante",
  },
  voladasPosterioresMaquina: {
    id: 43, slug: "voladas-posteriores-maquina", nombre: "Voladas posteriores en máquina",
    musculoPrincipal: "Hombro (deltoides posterior)",
    tecnica: "Sentado de frente a la máquina, pecho apoyado. Abrir los brazos hacia atrás apretando los omóplatos, y volver controlado.",
    erroresComunes: ["Usar impulso del torso", "Rango de movimiento muy corto"],
    dificultad: "Principiante",
  },
  voladasFrontales: {
    id: 44, slug: "voladas-frontales", nombre: "Voladas frontales",
    musculoPrincipal: "Hombro (deltoides anterior)",
    tecnica: "Sentado en la máquina, brazos apoyados al frente. Elevar los brazos hacia adelante hasta la altura del hombro y bajar controlado.",
    erroresComunes: ["Usar impulso balanceando el torso", "Subir por encima de la línea de hombro"],
    dificultad: "Principiante",
  },
  pressMilitarMancuernas: {
    id: 45, slug: "press-militar-mancuernas", nombre: "Press militar con mancuernas",
    musculoPrincipal: "Hombros",
    tecnica: "De pie, mancuernas a la altura del hombro. Empujar hacia arriba en línea recta hasta extender los brazos, sin arquear la espalda baja.",
    erroresComunes: ["Arquear excesivamente la espalda baja", "No estabilizar el core al empujar"],
    dificultad: "Intermedio",
  },
  pressHombrosMaquina: {
    id: 46, slug: "press-hombros-maquina", nombre: "Press en máquina para hombros",
    musculoPrincipal: "Hombros",
    tecnica: "Sentado con respaldo, agarres a la altura del hombro. Empujar hacia arriba sin bloquear de golpe los codos, y bajar controlado.",
    erroresComunes: ["Despegar la espalda del respaldo", "Bajar el peso demasiado rápido"],
    dificultad: "Principiante",
  },
  elevacionesLateralesPolea: {
    id: 47, slug: "elevaciones-laterales-polea", nombre: "Elevaciones laterales en polea",
    musculoPrincipal: "Hombro (deltoides lateral)",
    tecnica: "De costado a la polea baja, brazo cercano a la máquina. Elevar el brazo hacia el lado hasta la altura del hombro, con leve quiebre de codo.",
    erroresComunes: ["Usar impulso balanceando el torso", "Tirar con el trapecio en vez del hombro"],
    dificultad: "Principiante",
  },
  elevacionesFrontalesDisco: {
    id: 48, slug: "elevaciones-frontales-disco", nombre: "Elevaciones frontales con disco",
    musculoPrincipal: "Hombro (deltoides anterior)",
    tecnica: "De pie, disco sostenido con ambas manos al frente del muslo. Elevar hasta la altura del hombro con los brazos casi extendidos, y bajar controlado.",
    erroresComunes: ["Usar impulso de piernas y cadera", "Subir por encima de la altura del hombro"],
    dificultad: "Principiante",
  },
  elevacionesFrontalesBarra: {
    id: 49, slug: "elevaciones-frontales-barra", nombre: "Elevaciones frontales con barra",
    musculoPrincipal: "Hombro (deltoides anterior)",
    tecnica: "De pie, barra con agarre prono al frente del muslo. Elevar hasta la altura del hombro sin balancear el cuerpo, y bajar controlado.",
    erroresComunes: ["Balancear el torso para impulsar la barra", "Usar demasiado peso acortando el recorrido"],
    dificultad: "Principiante",
  },
  remoMentonBarra: {
    id: 50, slug: "remo-menton-barra", nombre: "Remo al mentón con barra",
    musculoPrincipal: "Hombros / Trapecio",
    tecnica: "De pie, barra con agarre cerrado al frente del cuerpo. Tirar hacia arriba llevando los codos por encima de las muñecas, hasta la altura del mentón.",
    erroresComunes: ["Agarre demasiado cerrado (molesta el hombro)", "Usar impulso de la espalda baja"],
    dificultad: "Intermedio",
  },
  curlAlternadoMancuernas: {
    id: 51, slug: "curl-alternado-mancuernas", nombre: "Curl alternado con mancuernas",
    musculoPrincipal: "Bíceps",
    tecnica: "De pie, mancuernas a los costados. Flexionar un brazo por vez llevando la mancuerna hacia el hombro, girando la muñeca hacia afuera.",
    erroresComunes: ["Balancear el cuerpo para impulsar el peso", "Mover el codo hacia adelante"],
    dificultad: "Principiante",
  },
  curlBarraRecta: {
    id: 52, slug: "curl-barra-recta", nombre: "Curl con barra recta",
    musculoPrincipal: "Bíceps",
    tecnica: "De pie, agarre supino en la barra recta. Flexionar los codos llevando la barra hacia el hombro sin mover el torso, y bajar controlado.",
    erroresComunes: ["Balancear el cuerpo para impulsar el peso", "Codos que se despegan del torso"],
    dificultad: "Principiante",
  },
  curlBancoScott: {
    id: 53, slug: "curl-banco-scott", nombre: "Curl en banco Scott",
    musculoPrincipal: "Bíceps",
    tecnica: "Brazos apoyados sobre el banco Scott, agarre supino. Flexionar el codo llevando el peso hacia el hombro, y bajar controlado hasta extensión casi completa.",
    erroresComunes: ["No extender completo el codo abajo", "Levantar los brazos del apoyo"],
    dificultad: "Principiante",
  },
  curlPoleaBaja: {
    id: 54, slug: "curl-polea-baja", nombre: "Curl en polea baja",
    musculoPrincipal: "Bíceps",
    tecnica: "De pie frente a la polea baja, agarre supino. Flexionar el codo llevando la barra hacia el hombro sin mover el torso.",
    erroresComunes: ["Balancear el cuerpo para impulsar el peso", "Codos que se despegan del torso"],
    dificultad: "Principiante",
  },
  curlMartillo: {
    id: 55, slug: "curl-martillo", nombre: "Curl martillo",
    musculoPrincipal: "Bíceps / Antebrazo",
    tecnica: "De pie, mancuernas con agarre neutro (palmas enfrentadas). Flexionar el codo llevando la mancuerna hacia el hombro, y bajar controlado.",
    erroresComunes: ["Balancear el cuerpo para impulsar el peso", "Mover el codo hacia adelante"],
    dificultad: "Principiante",
  },
  curlConcentrado: {
    id: 56, slug: "curl-concentrado", nombre: "Curl concentrado",
    musculoPrincipal: "Bíceps",
    tecnica: "Sentado, codo apoyado en la cara interna del muslo. Flexionar el codo llevando la mancuerna hacia el hombro, apretando el bíceps arriba.",
    erroresComunes: ["Mover el codo del apoyo", "Usar impulso del hombro"],
    dificultad: "Principiante",
  },
  pressFrancesBarra: {
    id: 57, slug: "press-frances-barra", nombre: "Press francés con barra",
    musculoPrincipal: "Tríceps",
    tecnica: "Acostado en banco, barra sostenida con agarre cerrado sobre la frente. Bajar flexionando solo los codos y extender hacia arriba sin mover los brazos.",
    erroresComunes: ["Abrir los codos hacia los costados", "Bajar la barra hacia la cara en vez de la frente"],
    dificultad: "Intermedio",
  },
  tricepsPolea: {
    id: 58, slug: "triceps-polea", nombre: "Tríceps en polea",
    musculoPrincipal: "Tríceps",
    tecnica: "De pie frente a la polea alta, codos pegados al torso. Extender los antebrazos hacia abajo hasta bloquear, y volver controlado sin mover los codos.",
    erroresComunes: ["Despegar los codos del torso", "Usar impulso del hombro"],
    dificultad: "Principiante",
  },
  extensionTricepsCuerda: {
    id: 59, slug: "extension-triceps-cuerda", nombre: "Extensión de tríceps en polea con cuerda",
    musculoPrincipal: "Tríceps",
    tecnica: "De pie frente a la polea alta con cuerda, codos pegados al torso. Extender abriendo la cuerda al final del recorrido, y volver controlado.",
    erroresComunes: ["Despegar los codos del torso", "No abrir la cuerda al final"],
    dificultad: "Principiante",
  },
  patadaTricepsMancuerna: {
    id: 60, slug: "patada-triceps-mancuerna", nombre: "Patada de tríceps con mancuerna",
    musculoPrincipal: "Tríceps",
    tecnica: "Apoyo de una mano y rodilla en el banco, brazo pegado al torso paralelo al piso. Extender el codo hacia atrás y volver controlado.",
    erroresComunes: ["Mover el brazo del torso", "Usar impulso en vez de extensión controlada"],
    dificultad: "Principiante",
  },
  extensionTricepsUnilateral: {
    id: 61, slug: "extension-triceps-unilateral", nombre: "Extensión de tríceps unilateral con mancuerna",
    musculoPrincipal: "Tríceps",
    tecnica: "De pie o sentado, mancuerna sostenida con un brazo detrás de la cabeza. Extender el codo hacia arriba sin moverlo de posición, y bajar controlado.",
    erroresComunes: ["Abrir el codo hacia el costado", "Usar impulso del hombro"],
    dificultad: "Principiante",
  },
  sentadillaSmith: {
    id: 62, slug: "sentadilla-smith", nombre: "Sentadilla en máquina Smith",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Barra sobre el trapecio, pies un poco adelantados respecto a la barra. Bajar controlado hasta que el muslo quede paralelo al piso, y subir.",
    erroresComunes: ["Rodillas colapsando hacia adentro", "Pies demasiado cerca de la línea de la barra"],
    dificultad: "Principiante",
  },
  sentadillaMaquina: {
    id: 63, slug: "sentadilla-maquina", nombre: "Sentadilla en máquina",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Espalda apoyada en el respaldo de la máquina, pies al ancho de hombros. Bajar controlado y empujar con los talones para volver arriba.",
    erroresComunes: ["Rodillas colapsando hacia adentro", "Talones que se levantan del apoyo"],
    dificultad: "Principiante",
  },
  prensa45: {
    id: 64, slug: "prensa-45", nombre: "Prensa 45°",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Sentado en la prensa, pies al ancho de hombros sobre la plataforma. Bajar controlado hasta 90° de rodilla y empujar sin bloquear de golpe.",
    erroresComunes: ["Bajar demasiado despegando la lumbar del respaldo", "Bloquear la rodilla con fuerza arriba"],
    dificultad: "Principiante",
  },
  sentadillaBulgara: {
    id: 65, slug: "sentadilla-bulgara", nombre: "Sentadilla búlgara",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Pie trasero apoyado en un banco, pie delantero al frente. Bajar controlando la rodilla trasera hacia el piso y subir con la pierna delantera.",
    erroresComunes: ["Apoyar demasiado peso en la pierna trasera", "Rodilla delantera colapsando hacia adentro"],
    dificultad: "Intermedio",
  },
  zancadasCaminando: {
    id: 66, slug: "zancadas-caminando", nombre: "Zancadas caminando con mancuernas",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Mancuernas a los costados, dar pasos largos alternando piernas hacia adelante. Bajar hasta que ambas rodillas formen 90° antes de avanzar.",
    erroresComunes: ["Pasos demasiado cortos", "Inclinar el torso hacia adelante"],
    dificultad: "Intermedio",
  },
  estocadas: {
    id: 67, slug: "estocadas", nombre: "Estocadas",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "De pie, dar un paso al frente o atrás según la variante. Bajar hasta que ambas rodillas formen 90°, y volver a la posición inicial.",
    erroresComunes: ["Rodilla delantera sobrepasando mucho la punta del pie", "Perder el equilibrio por un paso mal apoyado"],
    dificultad: "Principiante",
  },
  sentadillaSumoMancuerna: {
    id: 68, slug: "sentadilla-sumo-mancuerna", nombre: "Sentadilla sumo con mancuerna",
    musculoPrincipal: "Cuádriceps / Aductores",
    tecnica: "Piernas bien abiertas, mancuerna sostenida con ambas manos al centro. Bajar manteniendo el pecho arriba y empujar con los talones para subir.",
    erroresComunes: ["Rodillas colapsando hacia adentro", "No abrir lo suficiente las caderas al bajar"],
    dificultad: "Principiante",
  },
  stepUpMancuernas: {
    id: 69, slug: "step-up-mancuernas", nombre: "Step up con mancuernas",
    musculoPrincipal: "Cuádriceps / Glúteos",
    tecnica: "Mancuernas a los costados, subir a un banco o cajón con una pierna, apoyando todo el pie. Subir el cuerpo completo y bajar controlado.",
    erroresComunes: ["Impulsarse con la pierna de abajo en vez de la de arriba", "Apoyar solo la punta del pie en el cajón"],
    dificultad: "Intermedio",
  },
  pesoMuertoRumanoMancuernas: {
    id: 70, slug: "peso-muerto-rumano-mancuernas", nombre: "Peso muerto rumano con mancuernas",
    musculoPrincipal: "Isquiotibiales / Glúteos",
    tecnica: "Mancuernas al frente del cuerpo, piernas semi extendidas. Bajar empujando la cadera hacia atrás sin redondear la espalda, hasta sentir el estiramiento.",
    erroresComunes: ["Redondear la espalda baja", "Doblar demasiado las rodillas convirtiéndolo en sentadilla"],
    dificultad: "Intermedio",
  },
  curlFemoralSentado: {
    id: 71, slug: "curl-femoral-sentado", nombre: "Curl femoral sentado",
    musculoPrincipal: "Isquiotibiales",
    tecnica: "Sentado en la máquina, rodillo apoyado sobre el tobillo, respaldo ajustado. Flexionar la rodilla llevando el rodillo hacia abajo y volver controlado.",
    erroresComunes: ["Despegar la espalda del respaldo", "Usar impulso en vez de control"],
    dificultad: "Principiante",
  },
  patadaGluteoPolea: {
    id: 72, slug: "patada-gluteo-polea", nombre: "Patada de glúteo en polea",
    musculoPrincipal: "Glúteos",
    tecnica: "De pie frente a la polea baja, tobillera en el pie. Empujar la pierna hacia atrás y arriba apretando el glúteo, y volver controlado.",
    erroresComunes: ["Usar impulso de la espalda baja", "Rango de movimiento muy corto"],
    dificultad: "Principiante",
  },
  elevacionCaderasMaquina: {
    id: 73, slug: "elevacion-caderas-maquina", nombre: "Elevación de cadera en máquina",
    musculoPrincipal: "Glúteos",
    tecnica: "Espalda apoyada en el respaldo de la máquina, pies en la plataforma. Empujar la cadera hacia arriba apretando el glúteo, y bajar controlado.",
    erroresComunes: ["Arquear la zona lumbar en vez de extender la cadera", "Usar impulso de piernas"],
    dificultad: "Principiante",
  },
  puenteGluteo: {
    id: 74, slug: "puente-gluteo", nombre: "Elevación de cadera en colchoneta (puente)",
    musculoPrincipal: "Glúteos",
    tecnica: "Acostado boca arriba, rodillas flexionadas, pies apoyados. Empujar la cadera hacia arriba apretando el glúteo, y bajar sin tocar del todo el piso.",
    erroresComunes: ["Arquear la zona lumbar en vez de extender la cadera", "No apretar el glúteo arriba"],
    dificultad: "Principiante",
  },
  aductoresStep: {
    id: 75, slug: "aductores-step", nombre: "Aductores sobre step",
    musculoPrincipal: "Aductores",
    tecnica: "De pie sobre un step, una pierna colgando al costado. Bajar la pierna controlada por debajo del step y volver apretando el aductor.",
    erroresComunes: ["Rango de movimiento muy corto", "Usar impulso en vez de control"],
    dificultad: "Principiante",
  },
  aductoresMaquina: {
    id: 76, slug: "aductores-maquina", nombre: "Aductores en máquina",
    musculoPrincipal: "Aductores",
    tecnica: "Sentado en la máquina, piernas apoyadas en las almohadillas abiertas. Cerrar las piernas apretando el aductor, y volver controlado.",
    erroresComunes: ["Usar impulso del torso", "Soltar el peso en la vuelta"],
    dificultad: "Principiante",
  },
  gemelosSentadoMaquina: {
    id: 77, slug: "gemelos-sentado-maquina", nombre: "Gemelos sentado en máquina",
    musculoPrincipal: "Gemelos (sóleo)",
    tecnica: "Sentado, rodillas bajo las almohadillas, puntas de pie sobre la plataforma. Subir lo más alto posible y bajar hasta sentir el estiramiento.",
    erroresComunes: ["Rango de movimiento muy corto", "Rebotar en vez de controlar"],
    dificultad: "Principiante",
  },
  gemelosEnPrensa: {
    id: 78, slug: "gemelos-en-prensa", nombre: "Gemelos en prensa",
    musculoPrincipal: "Gemelos",
    tecnica: "Sentado en la prensa, solo la punta de los pies apoyada en la plataforma. Empujar extendiendo el tobillo y bajar hasta sentir el estiramiento.",
    erroresComunes: ["Rango de movimiento muy corto", "Bloquear la rodilla en vez de mover solo el tobillo"],
    dificultad: "Principiante",
  },
  gemelosUnilateralMancuerna: {
    id: 79, slug: "gemelos-unilateral-mancuerna", nombre: "Gemelos unilateral con mancuerna",
    musculoPrincipal: "Gemelos",
    tecnica: "De pie sobre un escalón con una pierna, mancuerna en la mano del mismo lado. Subir lo más alto posible y bajar controlado.",
    erroresComunes: ["Rango de movimiento muy corto", "Perder el equilibrio por falta de apoyo"],
    dificultad: "Principiante",
  },
  oblicuosPelotaEquilibrio: {
    id: 80, slug: "oblicuos-pelota-equilibrio", nombre: "Oblicuos con pelota en equilibrio",
    musculoPrincipal: "Abdomen (oblicuos)",
    tecnica: "Sentado sobre una pelota de estabilidad, manos detrás de la cabeza. Rotar el torso hacia cada lado manteniendo el equilibrio sobre la pelota.",
    erroresComunes: ["Perder el equilibrio y usar impulso", "Tirar del cuello con las manos"],
    dificultad: "Intermedio",
  },
  abdomenPelotaPiernasExtendidas: {
    id: 81, slug: "abdomen-pelota-piernas-extendidas", nombre: "Abdomen con pelota, piernas extendidas",
    musculoPrincipal: "Abdomen",
    tecnica: "Acostado con la pelota entre las manos y los pies, piernas extendidas. Elevar torso y piernas para pasar la pelota de las manos a los pies.",
    erroresComunes: ["Usar impulso en vez de control", "No contraer bien el abdomen al elevar"],
    dificultad: "Intermedio",
  },
  abdomenBajo: {
    id: 82, slug: "abdomen-bajo", nombre: "Abdomen bajo",
    musculoPrincipal: "Abdomen (bajo)",
    tecnica: "Acostado, manos apoyadas a los costados o bajo la lumbar. Despegar la cadera del piso llevando las rodillas hacia el pecho, y bajar controlado.",
    erroresComunes: ["Usar impulso de las piernas", "Arquear la espalda baja en vez de contraer el abdomen"],
    dificultad: "Principiante",
  },
  planchaDinamica: {
    id: 83, slug: "plancha-dinamica", nombre: "Plancha abdominal dinámica",
    musculoPrincipal: "Core",
    tecnica: "Apoyo en antebrazos y puntas de pie, cuerpo alineado. Llevar alternadamente cada rodilla hacia adelante sin perder la posición de plancha.",
    erroresComunes: ["Cadera elevada en forma de techo", "Perder la alineación al mover las rodillas"],
    dificultad: "Intermedio",
  },
  abdomenTocandoTalones: {
    id: 84, slug: "abdomen-tocando-talones", nombre: "Abdomen tocando talones",
    musculoPrincipal: "Abdomen (oblicuos)",
    tecnica: "Acostado, rodillas flexionadas y pies apoyados. Elevar levemente el torso y tocar alternadamente cada talón con la mano del mismo lado.",
    erroresComunes: ["Tirar del cuello", "Girar el torso completo en vez de solo elevarlo"],
    dificultad: "Principiante",
  },
  planchaCombinada: {
    id: 85, slug: "plancha-combinada", nombre: "Plancha abdominal combinada",
    musculoPrincipal: "Core",
    tecnica: "Apoyo en antebrazos y puntas de pie. Mantener la posición estática la primera mitad del tiempo y sumar movimiento dinámico en la segunda mitad.",
    erroresComunes: ["Cadera elevada en forma de techo", "Perder la posición al pasar a la fase dinámica"],
    dificultad: "Intermedio",
  },
  abdomenBicicleta: {
    id: 86, slug: "abdomen-bicicleta", nombre: "Abdomen oblicuo con giro (bicicleta)",
    musculoPrincipal: "Abdomen (oblicuos)",
    tecnica: "Acostado, manos detrás de la cabeza. Llevar el codo hacia la rodilla contraria alternando piernas, en un movimiento de pedaleo controlado.",
    erroresComunes: ["Tirar del cuello con las manos", "Hacer el movimiento demasiado rápido sin control"],
    dificultad: "Principiante",
  },
  crunchMaquina: {
    id: 87, slug: "crunch-maquina", nombre: "Crunch en máquina",
    musculoPrincipal: "Abdomen",
    tecnica: "Sentado en la máquina, torso apoyado en la almohadilla superior. Flexionar el torso hacia adelante contrayendo el abdomen, y volver controlado.",
    erroresComunes: ["Usar demasiado peso perdiendo la técnica", "Tirar con los brazos en vez del abdomen"],
    dificultad: "Principiante",
  },
  planchaLateral: {
    id: 88, slug: "plancha-lateral", nombre: "Plancha lateral",
    musculoPrincipal: "Abdomen (oblicuos)",
    tecnica: "Apoyo en un antebrazo y el costado del pie, cuerpo en línea recta. Mantener la cadera elevada sin dejarla caer durante todo el tiempo.",
    erroresComunes: ["Dejar caer la cadera", "Girar el torso hacia adelante o atrás"],
    dificultad: "Intermedio",
  },
  crunchPoleaAlta: {
    id: 89, slug: "crunch-polea-alta", nombre: "Crunch en polea alta",
    musculoPrincipal: "Abdomen",
    tecnica: "Arrodillado frente a la polea alta, cuerda detrás de la nuca. Flexionar el torso hacia abajo contrayendo el abdomen, sin mover la cadera.",
    erroresComunes: ["Tirar con los brazos en vez del abdomen", "Mover la cadera hacia atrás en vez de flexionar el torso"],
    dificultad: "Intermedio",
  },
  elevacionPiernasColgado: {
    id: 90, slug: "elevacion-piernas-colgado", nombre: "Elevación de piernas colgado",
    musculoPrincipal: "Abdomen (bajo)",
    tecnica: "Colgado de una barra con agarre firme. Elevar las piernas (flexionadas o extendidas) hacia el pecho contrayendo el abdomen, y bajar controlado.",
    erroresComunes: ["Balancear el cuerpo para impulsar las piernas", "No controlar la bajada"],
    dificultad: "Avanzado",
  },
  elevacionPiernasBanco: {
    id: 91, slug: "elevacion-piernas-banco", nombre: "Elevación de piernas en banco",
    musculoPrincipal: "Abdomen (bajo)",
    tecnica: "Acostado en un banco, manos sosteniendo el borde por detrás de la cabeza. Elevar las piernas extendidas o semiflexionadas contrayendo el abdomen bajo.",
    erroresComunes: ["Usar impulso en vez de control", "Arquear la espalda baja al bajar las piernas"],
    dificultad: "Principiante",
  },
  abdomenLenador: {
    id: 92, slug: "abdomen-lenador", nombre: "Abdomen oblicuo con mancuerna (leñador)",
    musculoPrincipal: "Abdomen (oblicuos)",
    tecnica: "De pie, mancuerna sostenida con ambas manos. Rotar el torso llevando la mancuerna en diagonal desde arriba de un hombro hasta la cadera contraria.",
    erroresComunes: ["Mover solo los brazos sin rotar el torso", "Usar demasiado peso perdiendo el control"],
    dificultad: "Intermedio",
  },
  puenteAbdominalEstatico: {
    id: 93, slug: "puente-abdominal-estatico", nombre: "Puente abdominal estático",
    musculoPrincipal: "Abdomen (core profundo)",
    tecnica: "Acostado boca arriba, brazos y piernas elevados en 90°. Bajar lentamente un brazo y la pierna opuesta hasta casi tocar el piso, sin despegar la zona lumbar, y volver.",
    erroresComunes: ["Despegar la lumbar del piso", "Bajar el brazo y la pierna del mismo lado en vez de lados opuestos"],
    dificultad: "Principiante",
  },
  nadoPecho: {
    id: 94, slug: "nado-pecho", nombre: "Nado pecho",
    musculoPrincipal: "Espinales / Zona lumbar",
    tecnica: "Acostado boca abajo en el piso o banco, brazos extendidos al frente. Elevar simultáneamente pecho, brazos y piernas en un movimiento controlado tipo nado.",
    erroresComunes: ["Elevar de más forzando el cuello", "Usar impulso brusco en vez de control"],
    dificultad: "Principiante",
  },
  espinalesBaston: {
    id: 95, slug: "espinales-baston", nombre: "Espinales con bastón",
    musculoPrincipal: "Espinales / Zona lumbar",
    tecnica: "De pie, bastón apoyado sobre los hombros como una barra. Flexionar el torso hacia adelante desde la cadera, manteniendo la espalda neutra, y volver.",
    erroresComunes: ["Redondear la espalda al flexionar", "Flexionar desde la zona lumbar en vez de la cadera"],
    dificultad: "Principiante",
  },
  supermanColchoneta: {
    id: 96, slug: "superman-colchoneta", nombre: "Superman en colchoneta",
    musculoPrincipal: "Espinales / Zona lumbar",
    tecnica: "Acostado boca abajo, brazos extendidos al frente. Elevar simultáneamente brazos y piernas del piso, apretando la zona lumbar, y bajar controlado.",
    erroresComunes: ["Elevar de más forzando el cuello", "Usar impulso brusco en vez de control"],
    dificultad: "Principiante",
  },
});

// ============================================================
// ENTRADA EN CALOR / CIERRE (cardio + elongación)
// ============================================================
// El documento pide mantener estos bloques "cuando corresponda".
// Se modelan como ejercicios más de la biblioteca (mismo formato,
// series=1) para no tener que tocar ningún componente de React.
Object.assign(EX, {
  calentamientoBicicleta: {
    id: 97, slug: "calentamiento-bicicleta", nombre: "Bicicleta",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Pedaleo continuo a intensidad moderada en bicicleta fija, para elevar la temperatura corporal antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  calentamientoEliptico: {
    id: 98, slug: "calentamiento-eliptico", nombre: "Elíptico",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Movimiento continuo a intensidad moderada en elíptico, para elevar la temperatura corporal antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  calentamientoRemo: {
    id: 99, slug: "calentamiento-remo", nombre: "Remo",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Remada continua a intensidad moderada en el remo ergométrico, activando piernas, espalda y core antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  calentamientoCinta: {
    id: 100, slug: "calentamiento-cinta", nombre: "Cinta",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Trote suave o caminata rápida en cinta, para elevar la temperatura corporal antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  calentamientoBicicletaEliptico: {
    id: 101, slug: "calentamiento-bicicleta-eliptico", nombre: "Bicicleta o elíptico",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Pedaleo o movimiento continuo a intensidad moderada en bicicleta fija o elíptico, para elevar la temperatura corporal antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  calentamientoCintaEliptico: {
    id: 102, slug: "calentamiento-cinta-eliptico", nombre: "Cinta o elíptico",
    musculoPrincipal: "Entrada en calor (cardio)",
    tecnica: "Trote suave o movimiento continuo a intensidad moderada en cinta o elíptico, para elevar la temperatura corporal antes del entrenamiento.",
    erroresComunes: ["Empezar a intensidad muy alta en frío", "Saltear la entrada en calor"],
    dificultad: "Principiante",
  },
  cierreAerobicoFinal: {
    id: 103, slug: "cierre-aerobico-final", nombre: "Aeróbico final",
    musculoPrincipal: "Cardio (cierre)",
    tecnica: "Actividad aeróbica continua en cinta, bicicleta, elíptico o remo, a intensidad moderada, durante 15 a 20 minutos al finalizar el entrenamiento de fuerza.",
    erroresComunes: ["Elegir una intensidad demasiado alta para sostener el tiempo completo", "Saltear este bloque de forma habitual"],
    dificultad: "Principiante",
  },
  cierreElongacion: {
    id: 104, slug: "cierre-elongacion", nombre: "Elongación",
    musculoPrincipal: "Elongación",
    tecnica: "Estiramiento sostenido (20-30 segundos por grupo muscular) de los principales grupos trabajados en la sesión, sin rebotes.",
    erroresComunes: ["Rebotar en vez de sostener el estiramiento", "Estirar en frío sin haber entrenado antes"],
    dificultad: "Principiante",
  },
});

// ============================================================
// HELPERS DE ARMADO DE RUTINA
// ============================================================
// sr(): parsea el texto exacto del documento ("4 x 12-10-8-8",
// "3 x 30 seg c/lado", "1 x 15 minutos", etc.) preservando el patrón
// de repeticiones tal cual está escrito (nunca lo simplifica).
function sr(text) {
  const m = text.match(/^(\d+)\s*x\s*(.+)$/i);
  if (m) return { series: Number(m[1]), repeticiones: m[2].trim() };
  return { series: 1, repeticiones: text.trim() };
}

// ex(): arma el objeto final de un ejercicio dentro de un día,
// leyendo SIEMPRE de la biblioteca EX (nunca duplica datos a mano).
// La miniatura se genera automáticamente a partir del video de
// YouTube; si el video no es de YouTube (ej. un link viejo de
// Runna) o no hay video, se conserva la imagen que ya tenía el
// ejercicio (o "" si es nuevo y nunca tuvo).
function ex(base, srText) {
  const { series, repeticiones } = sr(srText);
  const autoThumb = thumbnailFor(base.slug);
  const imagen = autoThumb || (base.imagen !== undefined ? base.imagen : img(base.slug));
  return {
    id: base.id,
    slug: base.slug,
    nombre: base.nombre,
    series,
    repeticiones,
    descanso: DESCANSO_GLOBAL,
    musculoPrincipal: base.musculoPrincipal,
    tecnica: base.tecnica,
    erroresComunes: base.erroresComunes,
    imagen,
    video: VIDEO_URLS[base.slug] || "",
    dificultad: base.dificultad,
    pendienteRevision: PENDIENTES_REVISION.has(base.slug) || undefined,
  };
}

// day(): arma un día completo a partir de tuplas [claveEX, "N x M"],
// agrupadas en bloques (Entrada en calor / Abdominales / Espinales /
// Parte principal / Trabajo de piernas / Gemelos / etc.) tal como
// están en el documento. El agrupamiento se conserva a través del
// ORDEN de los ejercicios (mismo orden que el documento), ya que la
// interfaz actual no tiene subtítulos de sección dentro del día.
function day(diaNum, titulo, bloques) {
  const ejercicios = [];
  for (const [, items] of bloques) {
    for (const [key, srText] of items) {
      if (!EX[key]) throw new Error(`Ejercicio no encontrado en la biblioteca: ${key}`);
      ejercicios.push(ex(EX[key], srText));
    }
  }
  return { dia: diaNum, titulo, ejercicios };
}

// ============================================================
// RUTINA DE 3 DÍAS — ORIGINAL DEL DOCUMENTO (misma para hombres y mujeres)
// ============================================================
const dias3 = [
  day(1, "Día 1 · Pecho y Bíceps", [
    ["Entrada en calor", [["calentamientoBicicletaEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["planchaCombinada", "1 x 30\" estático / 30\" dinámico"],
    ]],
    ["Espinales", [["nadoPecho", "4 x 15"]]],
    ["Parte principal", [
      ["pressBanca", "4 x 12-10-8-8"],
      ["pressInclinadoBarra", "4 x 12-10-8-8"],
      ["curlAlternadoMancuernas", "3 x 12"],
      ["curlBarraRecta", "3 x 12"],
    ]],
    ["Trabajo de piernas", [
      ["sentadillaSmith", "3 x 12"],
      ["aductoresStep", "3 x 15"],
      ["abduccionCadera", "3 x 15"],
    ]],
    ["Gemelos", [["gemelosSentadoMaquina", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(2, "Día 2 · Espalda y Tríceps", [
    ["Entrada en calor", [["calentamientoRemo", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["abdomenPelotaPiernasExtendidas", "4 x 12"],
      ["abdomenBicicleta", "4 x 15"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["jalonPecho", "4 x 12-12-10-10"],
      ["remoBajo", "3 x 12"],
      ["pressFrancesBarra", "4 x 12-10-10-10"],
      ["tricepsPolea", "3 x 15"],
    ]],
    ["Trabajo de piernas", [
      ["prensa45", "4 x 15"],
      ["patadaGluteoPolea", "3 x 15 c/pierna"],
      ["elevacionCaderasMaquina", "3 x 15"],
    ]],
    ["Gemelos", [["gemelosDePie", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(3, "Día 3 · Hombros y Piernas", [
    ["Entrada en calor", [["calentamientoBicicletaEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBajo", "4 x 15"],
      ["planchaLateral", "3 x 30 seg c/lado"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["deltoidesMaquina", "4 x 12"],
      ["voladasLaterales", "3 x 12"],
      ["voladasPosterioresMaquina", "3 x 12"],
      ["voladasFrontales", "3 x 12"],
    ]],
    ["Trabajo de piernas", [
      ["sentadillaMaquina", "3 x 12"],
      ["estocadas", "3 x 10 c/pierna"],
      ["extensionCuadriceps", "3 x 15"],
      ["curlFemoral", "3 x 12"],
    ]],
    ["Gemelos", [["gemelosDePie", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
];

// ============================================================
// HOMBRES — RUTINA NUEVA DE 4 DÍAS
// ============================================================
const hombres4diasRutina = [
  day(1, "Día 1 · Pecho y Bíceps", [
    ["Entrada en calor", [["calentamientoCintaEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["pressBanca", "4 x 12-10-10-8"],
      ["pressInclinadoMancuerna", "4 x 12-10-10-8"],
      ["aberturaPecho", "3 x 12"],
      ["curlBarraRecta", "4 x 10"],
      ["curlAlternadoMancuernas", "4 x 10"],
    ]],
    ["Gemelos", [["gemelosDePie", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(2, "Día 2 · Espalda y Tríceps", [
    ["Entrada en calor", [["calentamientoRemo", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["abdomenPelotaPiernasExtendidas", "4 x 12"],
      ["planchaLateral", "3 x 30 seg c/lado"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["jalonPecho", "4 x 12-12-10-10"],
      ["remoBarra", "4 x 10"],
      ["pullOverPolea", "3 x 12"],
      ["pressFrancesBarra", "4 x 12-10-10-10"],
      ["extensionTricepsCuerda", "3 x 15"],
    ]],
    ["Gemelos", [["gemelosSentadoMaquina", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(3, "Día 3 · Piernas", [
    ["Entrada en calor", [["calentamientoBicicleta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchMaquina", "4 x 15"],
      ["abdomenTocandoTalones", "4 x 12 c/lado"],
    ]],
    ["Espinales", [["hiperextension", "4 x 12"]]],
    ["Parte principal", [
      ["sentadilla", "4 x 12-10-8-8"],
      ["prensa45", "4 x 15-12-12-10"],
      ["sentadillaBulgara", "3 x 10 c/pierna"],
      ["curlFemoral", "3 x 12"],
    ]],
    ["Trabajo de tren superior", [
      ["pressMilitarMancuernas", "3 x 12"],
      ["elevacionesLaterales", "3 x 12"],
    ]],
    ["Gemelos", [["gemelosEnPrensa", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(4, "Día 4 · Hombros y Abdomen", [
    ["Entrada en calor", [["calentamientoCinta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchPoleaAlta", "4 x 15"],
      ["elevacionPiernasColgado", "4 x 12"],
    ]],
    ["Espinales", [["supermanColchoneta", "3 x 15"]]],
    ["Parte principal", [
      ["pressMilitar", "4 x 12-10-8-8"],
      ["pressHombrosMaquina", "3 x 12"],
      ["elevacionesLaterales", "4 x 12"],
      ["elevacionesLateralesPolea", "3 x 12"],
      ["voladasPosterioresMaquina", "3 x 12"],
      ["elevacionesFrontalesBarra", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["zancadas", "3 x 10 c/pierna"]]],
    ["Gemelos", [["gemelosDePie", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
];

// ============================================================
// HOMBRES — RUTINA NUEVA DE 5 DÍAS
// ============================================================
const hombres5diasRutina = [
  day(1, "Día 1 · Pecho", [
    ["Entrada en calor", [["calentamientoEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBajo", "4 x 15"],
      ["plancha", "4 x 40 seg"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["pressBanca", "4 x 12-10-8-8"],
      ["pressInclinadoMancuerna", "4 x 12-10-10-8"],
      ["pressDeclinadoMaquina", "3 x 12"],
      ["aberturaPecho", "3 x 12"],
      ["crucePoleas", "3 x 15"],
      ["fondosMaquinaAsistida", "3 x 12"],
    ]],
    ["Trabajo de piernas", [
      ["sentadillaSmith", "3 x 12"],
      ["aductoresMaquina", "3 x 15"],
    ]],
    ["Trabajo de tren superior", [["extensionTricepsCuerda", "3 x 15"]]],
    ["Gemelos", [["gemelosDePie", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(2, "Día 2 · Espalda", [
    ["Entrada en calor", [["calentamientoRemo", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["abdomenPelotaPiernasExtendidas", "4 x 12"],
      ["abdomenBicicleta", "4 x 15"],
      ["planchaLateral", "3 x 30 seg c/lado"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["jalonPecho", "4 x 12-12-10-10"],
      ["dorsaleraTomaCerrada", "3 x 12"],
      ["remoBarra", "4 x 10"],
      ["remoMaquina", "3 x 12"],
      ["remoMancuerna", "3 x 10 c/lado"],
      ["pullOverPolea", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["extensionCuadriceps", "3 x 15"]]],
    ["Trabajo de tren superior", [["curlPoleaBaja", "3 x 15"]]],
    ["Gemelos", [["gemelosSentadoMaquina", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(3, "Día 3 · Piernas", [
    ["Entrada en calor", [["calentamientoBicicleta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchMaquina", "4 x 15"],
      ["abdomenTocandoTalones", "4 x 12 c/lado"],
      ["planchaCombinada", "1 x 30\" estático / 30\" dinámico"],
    ]],
    ["Espinales", [["hiperextension", "4 x 12"]]],
    ["Parte principal", [
      ["sentadilla", "4 x 12-10-8-8"],
      ["prensa45", "4 x 15-12-12-10"],
      ["sentadillaBulgara", "3 x 10 c/pierna"],
      ["pesoMuertoRumanoMancuernas", "4 x 10"],
      ["curlFemoralSentado", "3 x 12"],
      ["hipThrust", "4 x 12"],
      ["abduccionCadera", "3 x 20"],
      ["aductoresMaquina", "3 x 20"],
    ]],
    ["Gemelos", [
      ["gemelosEnPrensa", "4 x 15"],
      ["gemelosUnilateralMancuerna", "3 x 15"],
    ]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(4, "Día 4 · Hombros", [
    ["Entrada en calor", [["calentamientoCinta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchPoleaAlta", "4 x 15"],
      ["elevacionPiernasColgado", "4 x 12"],
      ["abdomenLenador", "3 x 12 c/lado"],
    ]],
    ["Espinales", [["supermanColchoneta", "3 x 15"]]],
    ["Parte principal", [
      ["pressMilitar", "4 x 12-10-8-8"],
      ["pressHombrosMaquina", "3 x 12"],
      ["elevacionesLaterales", "4 x 12"],
      ["elevacionesLateralesPolea", "3 x 12"],
      ["voladasPosterioresMaquina", "3 x 12"],
      ["elevacionesFrontalesBarra", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["zancadas", "3 x 10 c/pierna"]]],
    ["Gemelos", [["gemelosDePie", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(5, "Día 5 · Brazos y Abdomen", [
    ["Entrada en calor", [["calentamientoEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
      ["elevacionPiernasBanco", "4 x 12"],
      ["plancha", "4 x 50 seg"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["curlBarraRecta", "4 x 10"],
      ["curlAlternadoMancuernas", "4 x 10"],
      ["curlMartillo", "3 x 12"],
      ["curlConcentrado", "3 x 12"],
      ["pressFrancesBarra", "4 x 10"],
      ["extensionTricepsCuerda", "4 x 12"],
      ["patadaTricepsMancuerna", "3 x 12"],
      ["fondosTriceps", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["stepUpMancuernas", "3 x 10 c/pierna"]]],
    ["Gemelos", [["gemelosSentadoMaquina", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
];

// ============================================================
// MUJERES — RUTINA NUEVA DE 4 DÍAS
// ============================================================
const mujeres4diasRutina = [
  day(1, "Día 1 · Glúteos y Cuádriceps", [
    ["Entrada en calor", [["calentamientoEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["hipThrust", "4 x 15-12-12-10"],
      ["sentadillaSumoMancuerna", "4 x 12"],
      ["prensa45", "4 x 15"],
      ["abduccionCadera", "4 x 20"],
    ]],
    ["Gemelos", [["gemelosDePie", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(2, "Día 2 · Espalda y Bíceps", [
    ["Entrada en calor", [["calentamientoRemo", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["abdomenPelotaPiernasExtendidas", "4 x 12"],
      ["planchaLateral", "3 x 30 seg c/lado"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["jalonPecho", "4 x 12-12-10-10"],
      ["remoBarra", "4 x 10"],
      ["remoMaquina", "3 x 12"],
      ["curlBiceps", "3 x 12"],
      ["curlAlternadoMancuernas", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["extensionCuadriceps", "3 x 15"]]],
    ["Gemelos", [["gemelosSentadoMaquina", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(3, "Día 3 · Glúteos y Femorales", [
    ["Entrada en calor", [["calentamientoBicicleta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchMaquina", "4 x 15"],
      ["abdomenTocandoTalones", "4 x 12 c/lado"],
    ]],
    ["Espinales", [["hiperextension", "4 x 12"]]],
    ["Parte principal", [
      ["pesoMuertoRumanoMancuernas", "4 x 12"],
      ["curlFemoralSentado", "3 x 12"],
      ["hipThrust", "4 x 12"],
      ["patadaGluteoPolea", "4 x 15 c/pierna"],
      ["aductoresMaquina", "3 x 20"],
    ]],
    ["Gemelos", [["gemelosEnPrensa", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(4, "Día 4 · Pecho, Hombros y Tríceps", [
    ["Entrada en calor", [["calentamientoCinta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
    ]],
    ["Espinales", [["supermanColchoneta", "3 x 15"]]],
    ["Parte principal", [
      ["pressBancaMancuernas", "4 x 12-10-10-8"],
      ["pressInclinadoMaquina", "3 x 12"],
      ["aberturaPecho", "3 x 12"],
      ["pressMilitar", "3 x 12"],
      ["elevacionesLateralesPolea", "3 x 12"],
      ["extensionTricepsCuerda", "4 x 12"],
      ["fondosTriceps", "3 x 12"],
    ]],
    ["Gemelos", [["gemelosUnilateralMancuerna", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
];

// ============================================================
// MUJERES — RUTINA NUEVA DE 5 DÍAS
// ============================================================
const mujeres5diasRutina = [
  day(1, "Día 1 · Glúteos (énfasis)", [
    ["Entrada en calor", [["calentamientoEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
      ["plancha", "4 x 40 seg"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["hipThrust", "4 x 15-12-12-10"],
      ["sentadillaSumoMancuerna", "4 x 12"],
      ["patadaGluteoPolea", "4 x 15 c/pierna"],
      ["pesoMuertoRumanoMancuernas", "4 x 12"],
      ["zancadasCaminando", "3 x 12 c/pierna"],
      ["abduccionCadera", "4 x 20"],
      ["puenteGluteo", "3 x 15"],
    ]],
    ["Gemelos", [["gemelosDePie", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(2, "Día 2 · Espalda y Bíceps", [
    ["Entrada en calor", [["calentamientoRemo", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["abdomenPelotaPiernasExtendidas", "4 x 12"],
      ["abdomenBajo", "4 x 15"],
      ["planchaLateral", "3 x 30 seg c/lado"],
    ]],
    ["Espinales", [["espinalesBaston", "4 x 12"]]],
    ["Parte principal", [
      ["jalonPecho", "4 x 12-12-10-10"],
      ["remoBarra", "4 x 10"],
      ["remoMaquina", "3 x 12"],
      ["pullOverPolea", "3 x 12"],
      ["curlBiceps", "3 x 12"],
      ["curlAlternadoMancuernas", "3 x 12"],
      ["curlConcentrado", "3 x 12"],
    ]],
    ["Trabajo de piernas", [["extensionCuadriceps", "3 x 15"]]],
    ["Gemelos", [["gemelosSentadoMaquina", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(3, "Día 3 · Piernas", [
    ["Entrada en calor", [["calentamientoBicicleta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchMaquina", "4 x 15"],
      ["abdomenTocandoTalones", "4 x 12 c/lado"],
      ["elevacionPiernasBanco", "4 x 12"],
      ["planchaCombinada", "1 x 30\" estático / 30\" dinámico"],
    ]],
    ["Espinales", [["hiperextension", "4 x 12"]]],
    ["Parte principal", [
      ["sentadilla", "4 x 12-10-8-8"],
      ["prensa45", "4 x 15"],
      ["sentadillaBulgara", "3 x 10 c/pierna"],
      ["curlFemoral", "4 x 12"],
      ["extensionCuadriceps", "3 x 15"],
      ["aductoresMaquina", "3 x 20"],
    ]],
    ["Gemelos", [["gemelosEnPrensa", "4 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(4, "Día 4 · Pecho, Hombros y Tríceps", [
    ["Entrada en calor", [["calentamientoCinta", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchAbdominal", "4 x 15"],
      ["abdomenBicicleta", "4 x 15"],
      ["plancha", "4 x 45 seg"],
    ]],
    ["Espinales", [["supermanColchoneta", "3 x 15"]]],
    ["Parte principal", [
      ["pressBancaMancuernas", "4 x 12-10-10-8"],
      ["pressInclinadoMaquina", "3 x 12"],
      ["aberturaPecho", "3 x 12"],
      ["pressMilitar", "3 x 12"],
      ["elevacionesLateralesPolea", "3 x 12"],
      ["extensionTricepsCuerda", "4 x 12"],
      ["fondosTriceps", "3 x 12"],
    ]],
    ["Gemelos", [["gemelosUnilateralMancuerna", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
  day(5, "Día 5 · Glúteos (segundo estímulo) y Abdomen", [
    ["Entrada en calor", [["calentamientoEliptico", "1 x 15 minutos"]]],
    ["Abdominales", [
      ["crunchPoleaAlta", "4 x 15"],
      ["elevacionPiernasColgado", "4 x 12"],
      ["abdomenLenador", "3 x 12 c/lado"],
      ["plancha", "4 x 50 seg"],
    ]],
    ["Espinales", [["hiperextension", "3 x 12"]]],
    ["Parte principal", [
      ["sentadillaSmith", "4 x 12"],
      ["stepUpMancuernas", "3 x 10 c/pierna"],
      ["pesoMuertoRumano", "4 x 12"],
      ["elevacionCaderasMaquina", "4 x 15"],
      ["abduccionCadera", "4 x 20"],
    ]],
    ["Gemelos", [["gemelosDePie", "3 x 15"]]],
    ["Aeróbico final", [["cierreAerobicoFinal", "1 x 15-20 minutos"]]],
    ["Elongación", [["cierreElongacion", "1 x Grupos trabajados"]]],
  ]),
];

// ============================================================
// ENSAMBLADO FINAL — 6 archivos (3 días es igual para ambos géneros)
// ============================================================
const files = {
  "hombres_3dias.json": { genero: "hombre", dias: 3, nombrePlan: "Rutina Oficial El Predio — 3 días", rutina: dias3 },
  "mujeres_3dias.json": { genero: "mujer", dias: 3, nombrePlan: "Rutina Oficial El Predio — 3 días", rutina: dias3 },
  "hombres_4dias.json": { genero: "hombre", dias: 4, nombrePlan: "Rutina Oficial El Predio — 4 días", rutina: hombres4diasRutina },
  "hombres_5dias.json": { genero: "hombre", dias: 5, nombrePlan: "Rutina Oficial El Predio — 5 días", rutina: hombres5diasRutina },
  "mujeres_4dias.json": { genero: "mujer", dias: 4, nombrePlan: "Rutina Oficial El Predio — 4 días", rutina: mujeres4diasRutina },
  "mujeres_5dias.json": { genero: "mujer", dias: 5, nombrePlan: "Rutina Oficial El Predio — 5 días", rutina: mujeres5diasRutina },
};

for (const [filename, data] of Object.entries(files)) {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`✓ ${filename} (${data.rutina.reduce((n, d) => n + d.ejercicios.length, 0)} ejercicios en ${data.rutina.length} días)`);
}

console.log(`\nBiblioteca total: ${Object.keys(EX).length} ejercicios.`);
