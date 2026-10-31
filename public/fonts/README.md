# Self-hosted fonts

Normal builds and page loads do not contact a font API. Licenses are shipped in
`public/fonts/` and included in the static export. Optional refresh scripts use
Google Fonts only when explicitly invoked by a maintainer.

## Interface fonts

| Family     | Use                     | Source files                               | License                           |
| ---------- | ----------------------- | ------------------------------------------ | --------------------------------- |
| Geist      | Shared interface        | `assets/fonts/geist/Geist-Latin.woff2`     | `public/fonts/geist/OFL.txt`      |
| Geist Mono | Interface/code fallback | `assets/fonts/geist/GeistMono-Latin.woff2` | `public/fonts/geist/OFL-Mono.txt` |

`next/font/local` bundles these variable Latin faces into hashed assets. Their
sources are outside `public/` to avoid deploying a redundant second font binary.
`assets/fonts/geist/manifest.json` records download URLs, licenses, and checksums.
Refresh them with `npm run fonts:interface`. System fonts provide interface fallback
for scripts outside the Latin subset.

## Reading fonts

| Family                               | Author / upstream                                                                | Use                                            |
| ------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| Source Serif 4                       | [Adobe / Source Serif Project](https://github.com/adobe-fonts/source-serif)      | Article bodies and headings                    |
| Departure Mono                       | [Helena Zhang](https://departuremono.com/)                                       | Letter envelopes                               |
| Noto Serif TC (CSS alias `Blog CJK`) | [Noto / Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoseriftc) | Han-character fallback and PDF-safe quotations |

Each reading-font directory contains its SIL Open Font License 1.1 (`OFL.txt`).
Source Serif 4 uses unmodified Latin WOFF2 builds with normal/italic variable
weights 400–700 and the optical-size axis. Math and code retain their own fonts;
there is no date-based font selection.

## Han characters and printing

`noto-serif-tc/NotoSerifTC-Blog.woff2` contains the Han characters currently used in
blog Markdown. It is registered in normal and italic contexts, deliberately using
upright Han glyphs in quotations. This avoids the missing synthetic-italic glyphs
observed in Chromium PDF output. Latin italic text still uses Source Serif 4 Italic.

When adding Han characters, run:

```sh
npm run fonts:blog-cjk
npm run test:blog
```

The development-only updater downloads a WOFF2 subset, its OFL license, and a
`subset.json` manifest with characters, exact URLs, and SHA-256. Commit those files.
Tests fail when new Han characters require a refresh. Other scripts use the
explicit system fallbacks rather than a build-time Google Fonts dependency.

## Reading-font sources

- [Source Serif 4 CSS](https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&display=swap), upstream `google/fonts/ofl/sourceserif4/OFL.txt`.
- Departure Mono: see `departure-mono/README.md` for its source and checksum.
- Noto Serif TC: see `noto-serif-tc/subset.json`; upstream license is `google/fonts/ofl/notoseriftc/OFL.txt`.

| File                            | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| SourceSerif4-Latin.woff2        | `2a24bad466f09b88b8e9cbc488bf774117c912e66374c57bf4716855849143f8` |
| SourceSerif4-Latin-Italic.woff2 | `011e0ca2bd14c5dff94aa4c61121b8d057b95dbdbb2af621b175fed1059cfd5e` |
