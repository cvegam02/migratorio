# Página de Anait Ceja — Diseño

Fecha: 2026-09-23

## Objetivo

Página web sencilla para que Anait Ceja, gestora migratoria, consiga clientes: extranjeros de cualquier parte del mundo que quieren vivir en México. Éxito = un visitante entiende qué trámites gestiona, confía en su experiencia y le escribe por WhatsApp o correo para pedir la revisión gratuita de su caso.

## El negocio

- **Nombre ES:** Anait Ceja · Gestoría Migratoria
- **Nombre EN:** Anait Ceja · Mexico Expat Services
- **Perfil:** gestora migratoria (no abogada). Trabajó 8 años en el Instituto Nacional de Migración (2014–2022) atendiendo cientos de casos de extranjeros; desde 2022 ofrece servicios migratorios por cuenta propia.
- **Clientes:** extranjeros de cualquier país que quieren vivir o regularizarse en México.
- **Atención:** 100 % en línea; en persona solo si el cliente está en la zona de Hermosillo, Sonora, donde vive Anait.
- **Idiomas de atención:** español e inglés (la página no explica cómo atiende en inglés).
- **Oferta de primer contacto:** revisión gratuita del caso y cotización sin compromiso. No se publican precios.
- **Contacto:** WhatsApp +52 664 735 8258 · migratoriosmxs@gmail.com
- **Foto:** pendiente; se usa un placeholder hasta que llegue.

## Servicios (11, en 3 grupos)

**Personas y familias / Individuals & families**
1. Visa de residente temporal o permanente (trámite consular)
2. Canje de visa por tarjeta de residente
3. Renovación de residencia temporal
4. Cambio de residencia temporal a permanente
5. Residencia por vínculo familiar
6. Residencia para jubilados y rentistas (solvencia económica)
7. Naturalización mexicana

**Trabajo y empresas / Work & business**
8. Permiso para trabajar
9. Constancia de inscripción del empleador

**Seguimiento y regularización / Follow-up & regularization**
10. Regularización migratoria
11. Notificación de cambios (domicilio, estado civil, empleo, etc.)

## Secciones de la página

1. **Inicio** — nombre, frase principal ("Te acompaño en tu trámite migratorio para vivir en México" / "I'll guide you through your immigration process to live in Mexico"), botón principal "Revisión gratuita por WhatsApp" y enlace secundario de correo.
2. **Servicios** — los 11 trámites en los 3 grupos, cada uno con una línea de explicación.
3. **Cómo funciona** — 3 pasos: (1) Me escribes y me cuentas tu caso. (2) Reviso tu situación sin costo y te envío una cotización. (3) Te acompaño en línea durante todo el trámite.
4. **Sobre mí** — foto, 8 años en el INM (2014–2022), independiente desde 2022, cientos de casos, vive en Hermosillo, atiende en línea a todo el mundo y en persona en la zona de Hermosillo.
5. **Contacto** — WhatsApp y correo, repitiendo "revisión gratuita y cotización sin compromiso".
6. **Pie** — nombre, año, aviso: "Gestoría migratoria. No somos un despacho de abogados." / "Immigration paperwork services. We are not a law firm."

### Reglas de contenido

- No decir que Anait es abogada ni ofrecer asesoría legal o representación.
- No prometer resultados ni insinuar "contactos" o influencia por haber trabajado en el INM; se destaca experiencia y conocimiento del proceso.
- No mencionar cómo atiende en inglés.
- No publicar precios.

## Estilo visual

Minimalista con calidez mexicana:
- Fondo blanco y arena muy claro; mucho espacio en blanco.
- Acento principal terracota (botones y detalles); acento secundario verde oscuro (títulos, pie).
- Tipografía sans-serif moderna y legible; máximo una fuente de Google Fonts.
- Colores y fuentes en variables CSS (`:root`); contraste AA en texto y botones.
- Mobile-first, márgenes laterales de 16 px en celular.

## Arquitectura

```
index.html      # estructura y todos los textos (ES y EN)
styles.css      # estilos
script.js       # cambio de idioma + enlaces de contacto
img/anait.svg   # placeholder de la foto
README.md       # cómo editar y publicar
.nojekyll
```

Sin frameworks, sin build, sin dependencias de producción. Publicación en GitHub Pages con "Deploy from branch: main".

### Idiomas

- Cada texto aparece dos veces: `<span lang="es">…</span><span lang="en">…</span>`.
- `<html>` lleva `data-lang="es"|"en"`; el CSS oculta el idioma inactivo.
- Idioma inicial: el guardado en `localStorage` si es válido; si no, el del navegador (`en*` → inglés, cualquier otro → español).
- Botón ES/EN en el encabezado; guarda la elección (con `try/catch`).
- Sin JavaScript: se ve en español.

### Contacto

- Número y correo definidos una sola vez, en constantes al inicio de `script.js`.
- WhatsApp: `https://wa.me/526647358258?text=<mensaje>` con mensaje prellenado en el idioma activo ("Hola Anait, me gustaría una revisión gratuita de mi caso migratorio." / "Hi Anait, I'd like a free review of my immigration case.").
- Correo: `mailto:migratoriosmxs@gmail.com?subject=<asunto>` en el idioma activo.
- Enlaces con `href` de respaldo en el HTML para funcionar sin JavaScript.

## Manejo de errores

- Si falla `localStorage`, el idioma se elige por el navegador en cada visita.
- Si falla JavaScript, la página se ve en español y los enlaces de respaldo funcionan.

## Verificación

- Pruebas de la lógica de `script.js` con `node --test`.
- Validación del HTML con `npx html-validate`.
- Sin navegador: la revisión visual (celular, escritorio, cambio de idioma, enlaces) la hace el usuario.

## Fuera de alcance

Formulario, agenda de citas, blog, testimonios, preguntas frecuentes, precios, dominio propio, analítica.
