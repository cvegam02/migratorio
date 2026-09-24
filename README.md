# Anait Ceja · Gestoría Migratoria

Página de una sola sección para los servicios de gestoría migratoria de Anait Ceja (en inglés: Mexico Expat Services). Es HTML, CSS y JavaScript puros: no hay que instalar ni compilar nada.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y todos los textos, en español (`lang="es"`) y en inglés (`lang="en"`) |
| `styles.css` | Diseño; los colores están en variables al inicio (`:root`) |
| `script.js` | Cambio de idioma, enlaces de WhatsApp y correo, y animaciones |
| `img/` | Imágenes: `hero.webp` (banner), `banner-es/en.webp` (vista previa al compartir), `anait.svg` (foto provisional), `favicon.svg` |

## Cambios comunes

- **WhatsApp o correo:** edita `WHATSAPP_NUMBER` y `EMAIL` al inicio de `script.js`, así como los `href` de respaldo y el texto visible en la sección de contacto de `index.html` (busca `526647358258` y `migratoriosmxs`).
- **Foto de Anait:** guarda la foto como `img/anait.webp` (cuadrada, unos 800×800 px) y en `index.html` cambia `img/anait.svg` por `img/anait.webp`.
- **Textos:** cada texto aparece dos veces en `index.html`: `<span lang="es">…</span><span lang="en">…</span>`. Cambia los dos.

## Ver la página en tu computadora

Abre `index.html` con doble clic, o levanta un servidor local:

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

## Pruebas

```bash
node --test tests/
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube esta carpeta (rama `main`).
2. En el repositorio, entra a **Settings → Pages**.
3. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
4. En uno o dos minutos la página queda en `https://<usuario>.github.io/<repositorio>/`.

La página está publicada en https://migratoriosmx.com/ (dominio comprado en GoDaddy). El archivo `CNAME` le indica a GitHub Pages el dominio; no lo borres. Si algún día cambia la dirección, actualiza también `canonical`, `og:url`, `og:image` y los datos estructurados en `index.html`, además de `sitemap.xml`.

DNS en GoDaddy: cuatro registros `A` para `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153), un `CNAME` de `www` a `cvegam02.github.io`, y ningún otro registro `A` ni reenvío.

## Google (SEO)

- `index.html` incluye la dirección canónica y datos estructurados del negocio (`application/ld+json`). Si cambian el teléfono, el correo o los servicios, actualízalos también ahí.
- `sitemap.xml` lista la página; actualiza `<lastmod>` cuando hagas cambios importantes.
- Para dar de alta la página: entra a [Google Search Console](https://search.google.com/search-console), agrega la propiedad de tipo **Dominio** `migratoriosmx.com` (se verifica con un registro TXT en GoDaddy) y envía el sitemap `https://migratoriosmx.com/sitemap.xml`.
