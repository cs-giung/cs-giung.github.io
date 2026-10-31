# Giung Nam's personal website

A statically exported ABOUT, BLOG, and CV website built with Next.js, React,
TypeScript, and Tailwind CSS. GitHub Pages serves the generated `out/` directory.

## Development

Use Node.js 24.2+ and npm 11+.

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. Development and production builds use separate
`.next-dev/` and `.next/` caches. For remote development, list trusted hostnames in
`NEXT_DEV_ALLOWED_ORIGINS` in an ignored `.env.development.local` file. Do not use
blanket origin wildcards.

## Content

- `data/cv.yaml`: intentionally public profile, contact, and academic CV information.
- `data/blog/`: published articles, notes, and attributed excerpts.
- `data/blog-links.yaml`: curated reading links.
- `data/blog-redirects.json`: compatibility aliases for existing article URLs.
- `public/`: reviewed assets; every file here is deployed, even if no page links to it.

`npm run new-post` saves drafts under ignored `.local/drafts/blog/` by default.
Publish only after reviewing the content, setting `draft: false`, and moving the
file into `data/blog/`. A draft flag does not make a file in a public repository
private.

Local records, environment files, assistant instructions, diagnostics, browser
reports, and unpublished materials do not belong in the public source tree.
The contact address in CV data is intentionally public; email obfuscation in the
export is an anti-harvesting measure, not secrecy.

## Checks and deployment

```sh
npm run verify
npx playwright install chromium webkit
npm run test:browser
```

The checks cover publication boundaries, lint, formatting, types, content contracts,
static exports, contact obfuscation, responsive layout, and interactive controls.
Configure an explicit Git commit email, preferably the noreply address shown in
GitHub's email settings. Do not rely on an automatically detected local-machine
identity. After staging changes, check the actual index before committing:

```sh
npm run check:public -- --staged
git diff --cached --stat
```

The publication check is a guardrail, not a complete secret or Git-history audit.
Removing a tracked file does not remove earlier versions from repository history.

GitHub Actions validates changes and deploys main-branch builds through GitHub
Pages. Only the static site artifact is uploaded; local/browser diagnostics are
not published as workflow artifacts.

Fonts are self-hosted. See [font sources and licenses](public/fonts/README.md).
Normal builds do not contact an external font API. Optional refresh commands are
`npm run fonts:interface` and `npm run fonts:blog-cjk`.

## License

Forked from [yuneg11/yuneg11.github.io](https://github.com/yuneg11/yuneg11.github.io)
under the MIT License. Original attribution is retained in `LICENSE`. Third-party
fonts retain their licenses; attributed article excerpts and linked works retain
their original authorship.
