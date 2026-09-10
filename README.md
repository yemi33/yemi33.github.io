# yemi33.github.io

Yemi Shin's portfolio, with a Paint-inspired 2026 homepage.

## Local preview

Serve the repository with a static HTTP server:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. No dependency installation or build step is required.

## Pages and assets

- `index.html`: current portfolio, resume links, project previews, and drawing pad.
- `archive.html`: the Paint-themed experiments folder, including all earlier project entries.
- `resume.html`: a themed resume viewer with the original PDF download and a selectable text version.
- `minions/`: the Minions project guide in the same Paint window theme.
- `designs/`: the original three-direction design comparison.
- `css/portfolio.css` and `js/paint.js`: shared visual styles and Paint interactions.
- `assets/img/Yemi_Shin_Resume_AI_Mobile.pdf`: the current resume; the matching PNG is its browser-safe preview.

The homepage's project, resume, contact, and archive links work without JavaScript.
The drawing pad is optional; drawings stay in memory and are not uploaded or saved.

Homepage links use the current tab so they also work in embedded previews. With JavaScript,
"Let's say hello" shows the email address in a contact window before offering to
open a mail app. Selecting a drawing tool brings the drawing pad into view.

The archive's project files expand without JavaScript. Old project fragment URLs
still work; `js/archive.js` opens the matching file when a direct link is visited.
When replacing the resume PDF, regenerate its PNG preview and update the text
version in `resume.html` to keep the three representations in sync.
