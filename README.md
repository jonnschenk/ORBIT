# ORBIT — Explore Beyond

A space exploration platform featuring real astronomical images from NASA.
Semantic HTML · SASS · Vanilla JavaScript (ES modules) · Axios (CDN). No frameworks.

**Author:** Jonathan Ramírez

- **Live site:** _coming soon_
- **Repository:** _coming soon_

<!-- Screenshot: save it as assets/images/screenshot.png and uncomment the line below.
![ORBIT home page](assets/images/screenshot.png)
-->

## Features

- **Astronomy Picture of the Day:** NASA's daily image (or video thumbnail) with date, description, and credits.
- **Image library search:** free-text search across NASA's public archive.
- **Quick filters:** chips for galaxies, nebulae, Moon, Earth, and missions.
- **Detail modal:** a native `<dialog>` that loads the full-size image, description, credits, and a source link.
- **Clear states:** loading skeletons, empty results, and a connection error with a retry button.
- **Responsive and accessible:** mobile menu, active section highlighting, keyboard focus, skip link, and `prefers-reduced-motion` support.

## Project requirements

| Requirement | How it is met |
|---|---|
| Free-to-use API | NASA Open APIs (APOD and NASA Image and Video Library) |
| At least two endpoints | `/planetary/apod`, `/search`, and `/asset/{nasa_id}` (see `js/api.js`) |
| SASS for styles and layouts | Partials loaded with `@use`, variables in `_tokens.scss`, mixins for breakpoints and glass effects in `_mixins.scss`, nesting with BEM naming |
| Semantic HTML | `header`, `nav`, `main`, `section`, `figure`, `footer`, `dialog`, `template`, `role="search"`, and ARIA labels |
| Vanilla JavaScript, no jQuery | ES modules split into `config`, `api`, `ui`, `modal`, and `main` |
| Axios with async/await | A shared Axios instance with a timeout; every request uses `async/await` with `try/catch` and shows an error state |
| DOM and interactivity | Search form, filter chips, card rendering from a `<template>`, modal, mobile menu, and `IntersectionObserver` for navigation and reveal effects |
| GitHub repository and hosting | See the links at the top of this file |

## Getting started

Open `index.html` with the **Live Server** extension for VS Code.

Compile `scss/main.scss` into `css/main.css`:

```bash
npm install
npm run build:css   # compile once
npm run watch:css   # recompile on every change
```

The **Live Sass Compiler** extension also works; `.vscode/settings.json` points it to `css/`.

## NASA APIs

| Module | Endpoint | Key required |
|---|---|---|
| Astronomy Picture of the Day | `https://api.nasa.gov/planetary/apod` | Yes (`DEMO_KEY` for development) |
| Search, gallery, and modal | `https://images-api.nasa.gov/search` and `/asset/{nasa_id}` | No |

`DEMO_KEY` has a low limit (about 30 requests per hour per IP). For production, request a free key at
https://api.nasa.gov and update `js/config.js`.

## Project structure

```
index.html
package.json            Sass build scripts
.vscode/settings.json   Live Sass Compiler output to css/
assets/
  favicon.svg
  images/               hero illustration (also the APOD fallback)
css/main.css            ← generated from SASS
scss/
  abstracts/            design tokens (colors, typography, breakpoints) and mixins
  base/                 reset, base typography, utilities, reveal effects
  layout/               header and footer
  components/           buttons, chips, search, cards, states, modal
  sections/             hero, APOD, explore, about
js/
  config.js             URLs, API key, and constants
  api.js                Axios: getApod, searchImages, searchMany, getLargeImage
  ui.js                 card, APOD, and state rendering
  modal.js              <dialog> with full-size image and credits
  main.js               search, filters, navigation, and startup
```

## Search states

`loading` → `results` | `empty` | `error`, managed by `showState()` in `ui.js`.
A `requestId` variable prevents a slower response from overwriting a newer one.

## Colors and typography

Paper `#F7F8FA` · Petrol `#263A54` · Ink `#10141C` · Silver `#E6EAF0` · Ice `#A9C0CD`
Space Grotesk (headings) · Inter (body text)

## Credits

Images and data: NASA Open APIs. ORBIT is an independent project and is not affiliated with or endorsed by NASA.

© 2026 Jonathan Ramírez
# ORBIT---Explore-Beyond
# ORBIT
# ORBIT
