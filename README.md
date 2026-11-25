# Lipi

Word counter and one-click text cleanup.

**Live:** https://lipi.avlokai.com

**For:** Students with word limits, writers, marketers and anyone cleaning up text pasted from a PDF or email.

## What it does

- Words, characters, sentences, paragraphs, reading and speaking time
- Change case: upper, lower, title, sentence
- Remove duplicate lines, empty lines and extra spaces
- Join lines broken by PDF copy-paste, keep paragraphs
- Sort naturally, reverse, number, slugify, strip HTML, plain quotes
- Undo for every step, draft kept locally

Unicode aware: counts Hindi, Tamil, Arabic and other scripts correctly.

## Privacy

Everything runs in your browser. There is no backend, no analytics and no account. Nothing you enter is uploaded.

## Run locally

No build step and no runtime dependencies. Serve the folder with any static server:

```
npx serve .
```

## Tests

The logic lives in `lib.js` as pure functions, tested with the Node test runner (Node 20+):

```
npm test
```

## Files

- `index.html` page and styles
- `app.js` wiring between the page and the logic
- `lib.js` pure logic, no DOM
- `lib.test.js` tests
- `base.css`, `ui.js` shared look and small DOM helpers

## Licence

MIT. Made by [Sushanth Kasturi](https://sushanth.avlokai.com).
