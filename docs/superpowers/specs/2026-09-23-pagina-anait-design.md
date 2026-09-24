# Página de Anait — Diseño

Fecha: 2026-09-23

## Objetivo

Página web personal y sencilla para que Anait ofrezca sus servicios profesionales de migración. Éxito = un visitante entiende qué ofrece y la contacta por WhatsApp o correo en pocos segundos, desde el celular o la computadora.

## Lo que se acordó

- Tipo: página personal / de servicios profesionales de migración.
- Contacto: WhatsApp y correo electrónico (sin formulario).
- Idioma: español e inglés, con botón para cambiar.
- Secciones: Inicio, Servicios, Sobre mí, Contacto.
- Contenido: textos, foto, número y correo de ejemplo; se reemplazan después.
- Hosting: GitHub Pages.
- Validación: la hace el usuario; Claude no abre el navegador.

## Supuestos

- Una sola página con scroll (no varias páginas).
- Sin frameworks, sin paso de build, sin dependencias de npm.
- Publicación con "Deploy from branch: main" (sin GitHub Actions).

## Arquitectura

```
index.html      # estructura y todos los textos (ES y EN)
styles.css      # estilos, mobile-first
script.js       # cambio de idioma + enlaces de contacto
img/anait.svg   # foto de ejemplo (placeholder)
README.md       # cómo editar y publicar
```

### Idiomas

- Cada texto aparece dos veces en el HTML: `<span lang="es">…</span><span lang="en">…</span>`.
- El `<html>` lleva `data-lang="es"` o `data-lang="en"`; el CSS oculta el idioma no activo.
- Idioma inicial: el guardado en `localStorage`; si no hay, el del navegador (`en*` → inglés, cualquier otro → español).
- Botón ES/EN en el encabezado cambia `data-lang`, el atributo `lang` del documento y guarda la elección (con `try/catch`, por si el almacenamiento está bloqueado).
- Sin JavaScript: se muestra español.

### Contacto

- Número de WhatsApp y correo definidos una sola vez, en constantes al inicio de `script.js`.
- `script.js` arma los enlaces:
  - WhatsApp: `https://wa.me/<numero>?text=<mensaje>` con un mensaje prellenado en el idioma activo; se actualiza al cambiar de idioma.
  - Correo: `mailto:<correo>` con asunto en el idioma activo.
- Los enlaces tienen un `href` de respaldo en el HTML, para que funcionen sin JavaScript.

### Secciones

1. **Inicio** — nombre, frase principal, botones WhatsApp y correo.
2. **Servicios** — tarjetas: visas, residencia permanente, ciudadanía/naturalización, permisos de trabajo, reunificación familiar, asesoría y llenado de formularios.
3. **Sobre mí** — foto y párrafo corto de experiencia.
4. **Contacto** — WhatsApp, correo, zona de atención.
5. **Pie** — nombre, año y aviso breve.

### Estilo

- Limpio y profesional, mobile-first, con márgenes laterales de 16 px en celular.
- Colores y tipografía en variables CSS (`:root`) para cambiarlos fácil.
- Una fuente de Google Fonts como máximo; sin otras dependencias externas.
- Accesible: contraste suficiente, `alt` en la imagen, botones con texto visible.

### Contenido de ejemplo (cuidado legal)

- Los textos no dicen que Anait es abogada ni prometen resultados.
- El pie incluye un aviso: "No soy abogada; no ofrezco asesoría legal" / "I am not an attorney; I do not provide legal advice" (se ajusta cuando ella confirme su certificación).

## Manejo de errores

- Si falla `localStorage`, el idioma se elige por el navegador en cada visita.
- Si falla JavaScript, la página se ve en español y los enlaces de respaldo siguen funcionando.

## Verificación

- Validación del HTML con una herramienta de línea de comandos, si hay alguna disponible (sin navegador).
- Revisión manual del usuario: celular y escritorio, cambio de idioma, enlaces de WhatsApp y correo.
- No se agregan pruebas automatizadas: es una página estática sin lógica que las justifique.

## Fuera de alcance

Formulario, agenda de citas, blog, testimonios, preguntas frecuentes, dominio propio, analítica.
