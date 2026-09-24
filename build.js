// Genera index.html (español) y en/index.html (inglés) a partir de src/index.html.
// Uso: node build.js
const fs = require("node:fs");
const path = require("node:path");

const SITE = "https://migratoriosmx.com/";
const WHATSAPP_NUMBER = "+52 664 735 8258";
const EMAIL = "migratoriosmxs@gmail.com";

const PAGES = { es: "index.html", en: "en/index.html" };

const SERVICES = {
  es: [
    "Visa de residente temporal o permanente",
    "Canje de visa por tarjeta de residente",
    "Renovación de residencia temporal",
    "Cambio a residencia permanente",
    "Residencia por vínculo familiar",
    "Residencia para jubilados y rentistas",
    "Naturalización mexicana",
    "Permiso para trabajar",
    "Constancia de inscripción del empleador",
    "Regularización migratoria",
    "Notificación de cambios ante el INM",
  ],
  en: [
    "Temporary or permanent resident visa",
    "Visa exchange for resident card",
    "Temporary residency renewal",
    "Change to permanent residency",
    "Residency through family ties",
    "Residency for retirees and financially independent",
    "Mexican citizenship (naturalization)",
    "Work permit",
    "Employer registration certificate",
    "Immigration regularization",
    "Notification of changes to the INM",
  ],
};

const TEXT = {
  es: {
    base: "",
    url: SITE,
    ogLocale: "es_MX",
    title: "Trámites migratorios en México: residencia y visas | Anait Ceja",
    description:
      "Gestoría migratoria en línea para extranjeros que quieren vivir en México: visa de residente, canje y renovación de tarjeta, residencia temporal y permanente, regularización y naturalización. Revisión gratuita de tu caso.",
    ogTitle: "Anait Ceja · Gestoría Migratoria",
    ogDescription: "Desde tu primera visa hasta tu ciudadanía mexicana, te acompaño en cada paso. Revisión gratuita de tu caso.",
    ogImage: `${SITE}img/banner-es.webp`,
    name: "Anait Ceja · Gestoría Migratoria",
    alternateName: "Anait Ceja · Mexico Expat Services",
    catalogName: "Trámites migratorios",
    whatsappMessage: "Hola Anait, me gustaría una revisión gratuita de mi caso migratorio.",
    mailSubject: "Revisión gratuita de mi caso migratorio",
    navLabel: "Principal",
    menuLabel: "Menú",
    statsLabel: "Experiencia",
    switchLabel: "English version",
    otherHref: "en/",
    otherLang: "en",
  },
  en: {
    base: "../",
    url: `${SITE}en/`,
    ogLocale: "en_US",
    title: "Mexico Residency & Immigration Services for Expats | Anait Ceja",
    description:
      "Online immigration services for expats moving to Mexico: resident visas, card exchange and renewal, temporary and permanent residency, regularization and Mexican citizenship. Free case review.",
    ogTitle: "Anait Ceja · Mexico Expat Services",
    ogDescription: "From your first visa to Mexican citizenship, I'm with you every step of the way. Free case review.",
    ogImage: `${SITE}img/banner-en.webp`,
    name: "Anait Ceja · Mexico Expat Services",
    alternateName: "Anait Ceja · Gestoría Migratoria",
    catalogName: "Mexico immigration services",
    whatsappMessage: "Hi Anait, I'd like a free review of my immigration case.",
    mailSubject: "Free review of my immigration case",
    navLabel: "Main",
    menuLabel: "Menu",
    statsLabel: "Experience",
    switchLabel: "Versión en español",
    otherHref: "../",
    otherLang: "es",
  },
};

function whatsappUrl(number, message) {
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function mailtoUrl(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function structuredData(lang) {
  const t = TEXT[lang];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: t.name,
    alternateName: t.alternateName,
    description: t.description,
    url: t.url,
    image: t.ogImage,
    logo: `${SITE}img/favicon.svg`,
    telephone: WHATSAPP_NUMBER,
    email: EMAIL,
    address: { "@type": "PostalAddress", addressLocality: "Hermosillo", addressRegion: "Sonora", addressCountry: "MX" },
    areaServed: { "@type": "Country", name: lang === "es" ? "México" : "Mexico" },
    availableLanguage: ["es", "en"],
    founder: { "@type": "Person", name: "Anait Ceja" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.catalogName,
      itemListElement: SERVICES[lang].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  };
}

const escapeAttr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// Quita los textos del otro idioma y deja los del idioma pedido sin la etiqueta <span lang>.
function keepLanguage(html, lang) {
  const other = lang === "es" ? "en" : "es";
  return html
    .replace(new RegExp(`^[ \\t]*<span lang="${other}">[^<]*<\\/span>\\n`, "gm"), "")
    .replace(/<span lang="(es|en)">([^<]*)<\/span>/g, (_, spanLang, text) => (spanLang === lang ? text : ""))
    .replace(/[ \t]+$/gm, "");
}

function buildPage(source, lang) {
  const t = TEXT[lang];
  const values = {
    ...t,
    lang,
    jsonld: JSON.stringify(structuredData(lang), null, 2),
    whatsapp: whatsappUrl(WHATSAPP_NUMBER, t.whatsappMessage),
    mailto: mailtoUrl(EMAIL, t.mailSubject),
    esActive: lang === "es" ? ' class="is-active"' : "",
    enActive: lang === "en" ? ' class="is-active"' : "",
  };
  const raw = new Set(["jsonld", "esActive", "enActive"]);
  const filled = source.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Marcador sin valor: ${match}`);
    return raw.has(key) ? values[key] : escapeAttr(values[key]);
  });
  return keepLanguage(filled, lang).replace(/^<!-- Fuente bilingüe.*\n/m, "");
}

function build(root = __dirname) {
  const source = fs.readFileSync(path.join(root, "src/index.html"), "utf8");
  const nested = source.match(/<span lang="(es|en)">[^<]*<(?!\/span>)/);
  if (nested) throw new Error(`Un <span lang> no puede contener otras etiquetas: ${nested[0]}`);
  for (const [lang, file] of Object.entries(PAGES)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buildPage(source, lang));
  }
}

if (require.main === module) {
  build();
  console.info(`Generado: ${Object.values(PAGES).join(", ")}`);
}

module.exports = { buildPage, build, whatsappUrl, mailtoUrl, PAGES };
