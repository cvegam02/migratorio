# Anait Ceja · Gestoría Migratoria

Página de una sola sección para los servicios de gestoría migratoria de Anait Ceja (en inglés: Mexico Expat Services). Es HTML, CSS y JavaScript puros: no hay que instalar ni compilar nada.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `src/index.html` | **Fuente que se edita.** Estructura y textos en los dos idiomas: `<span lang="es">…</span><span lang="en">…</span>` |
| `build.js` | Genera las dos páginas publicadas. También contiene títulos, descripciones, datos estructurados, WhatsApp y correo de cada idioma |
| `index.html` | Página en español (generada, no editar) |
| `en/index.html` | Página en inglés (generada, no editar) |
| `styles.css` | Diseño; los colores están en variables al inicio (`:root`) |
| `script.js` | Menú móvil, barra de WhatsApp y animaciones |
| `img/` | Imágenes: `hero.webp` (banner), `banner-es/en.webp` (vista previa al compartir), `anait.svg` (foto provisional), `favicon.svg` |

## Cómo hacer cambios

1. Edita `src/index.html` (textos) o `build.js` (títulos, descripciones, WhatsApp, correo, servicios para Google).
2. Genera las páginas: `node build.js`
3. Corre las pruebas: `node --test tests/` (avisan si olvidaste el paso 2).
4. Haz commit y push de todo, incluidas `index.html` y `en/index.html`.

Reglas del archivo fuente: cada `<span lang>` debe contener solo texto (sin otras etiquetas), y cada texto visible va en los dos idiomas.

## Cambios comunes

- **WhatsApp o correo:** edita `WHATSAPP_NUMBER` y `EMAIL` al inicio de `build.js`, y el texto visible en la sección de contacto de `src/index.html` (busca `664 735 8258` y `migratoriosmxs`).
- **Foto de Anait:** guarda la foto como `img/anait.webp` (cuadrada, unos 800×800 px) y en `src/index.html` cambia `img/anait.svg` por `img/anait.webp`.

## Ver la página en tu computadora

Abre `index.html` (español) o `en/index.html` (inglés) con doble clic, o levanta un servidor local:

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

La página está publicada en https://migratoriosmx.com/ (dominio comprado en GoDaddy). El archivo `CNAME` le indica a GitHub Pages el dominio; no lo borres. Si algún día cambia la dirección, actualiza `SITE` en `build.js`, las etiquetas `hreflang` en `src/index.html` y `sitemap.xml`, y corre `node build.js`.

DNS en GoDaddy: cuatro registros `A` para `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153), un `CNAME` de `www` a `cvegam02.github.io`, y ningún otro registro `A` ni reenvío.

## Google (SEO)

- Español en `/` e inglés en `/en/`, cada una con su título, descripción, dirección canónica, etiquetas `hreflang` y datos estructurados, generados por `build.js`.
- `sitemap.xml` lista las dos páginas; actualiza `<lastmod>` cuando hagas cambios importantes.
- Para dar de alta la página: entra a [Google Search Console](https://search.google.com/search-console), agrega la propiedad de tipo **Dominio** `migratoriosmx.com` (se verifica con un registro TXT en GoDaddy) y envía el sitemap `https://migratoriosmx.com/sitemap.xml`.
