# Personal website for Emma Walquist

This repository contains a single-page static website (HTML/CSS/JS) that serves as a fancy résumé and publication list.

How it works
- index.html: main site.
- assets/css/styles.css: styles.
- assets/js/app.js: loads publications from publications/publications.json and renders them.
- publications/publications.json: your list of publications. Add, edit, and commit.

Quick setup
1. Customize index.html: replace name, biography, links, and optionally add a profile image at assets/profile.jpg.
2. Add your publications to publications/publications.json using the provided examples.
3. Commit & push to GitHub.
4. Enable GitHub Pages on the repository (Settings → Pages) and serve from the main branch (root) or a docs/ folder if you prefer.

Adding publications
- Each publication is a JSON object with fields: id, title, authors (array), venue, year, type (journal|conference|book|preprint), doi, url, pdf, pages, abstract, tags.
- You can export BibTeX from Zotero/Google Scholar and convert it to this JSON format with a small script; I can provide a converter on request.

Possible next improvements (I can help implement)
- Add BibTeX / Zotero import and parsing (auto-generate publications.json).
- Add ORCID / Google Scholar badges and automatic sync.
- Add an RSS or publications feed.
- Add a small admin interface to add publications without editing JSON.
- Better design polish and animations.

License & notes
- This starter is MIT-friendly. Use and adapt as you wish.
