# VibeBoss.ai · Landingpage

Statische Landingpage (HTML/CSS/JS) für VibeBoss.ai – kein Build-Schritt, kein Framework.
Dark- und Light-Mode, Deutsch/Englisch umschaltbar.

## Lokal starten

```bash
python3 -m http.server 8770
```

Dann <http://localhost:8770> öffnen.

## Auf Vercel deployen

1. Auf [vercel.com/new](https://vercel.com/new) dieses Repository importieren.
2. Framework Preset: **Other**. Build Command und Output Directory leer lassen.
3. Deploy.

`vercel.json` setzt Cache- und Sicherheits-Header. `.vercelignore` hält `_source/` und `logos/` aus dem Deployment heraus.

## Aufbau

```
.
├── index.html            Komplette Seite inkl. SVG-Icon-Sprite
├── assets/
│   ├── css/style.css     Design-System, alle Sections, Responsive
│   ├── js/main.js        Theme, Sprache, Menü, FAQ, Editor-Mockup, Scroll-Animationen (GSAP)
│   ├── img/              Presenter-Bilder, Problem-Foto, Avatare (WebP)
│   └── brand/            VibeBoss-Logos, die die Seite verwendet
├── logos/                Vollständiges Logo-Paket (nicht deployt)
├── _source/              Original-PNGs der generierten Bilder (nicht deployt)
├── vercel.json
└── .vercelignore
```

## Anpassen

| Was | Wo |
|---|---|
| Texte Deutsch | direkt im HTML |
| Texte Englisch | Attribut `data-en` am selben Element |
| Farben, Dark/Light | CSS-Variablen oben in `assets/css/style.css` |
| Ziel von „Kostenlos starten“ | `href` am Link mit `data-signup` in `index.html` |
| Beispielvideo | Elemente mit `data-video` (zeigen aktuell nur einen Hinweis) |

Nach CSS/JS-Änderungen die Versionsnummer an den Links in `index.html` erhöhen (`?v=9` → `?v=10`).

## Vor dem Livegang

- **Testimonials, Sterne und Avatare sind Platzhalter** (KI-generierte Gesichter, erfundene Zitate) – im HTML mit `PLATZHALTER` markiert. Durch echte Kundenstimmen ersetzen oder entfernen.
- Ziel-URL für die Anmeldung und ein echtes Beispielvideo eintragen.
- Impressum und Datenschutz verlinken (Footer-Links sind leer).
- Google Fonts und GSAP lokal einbinden (DSGVO).
- Vorschaubild/Open-Graph-Tags, Canonical und ggf. eigene englische Seite ergänzen.
