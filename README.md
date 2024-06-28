# Babylon.js documentation website

## Requirements

- Node 16 and up

## Getting Started

Install dependencies

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Custom markdown components

Markdowns can now be augmented with special components. For example, adding:

```html
<Playground id="#Y642I8" title="Tinted Shadows Example" description="A Playground example of tinted shadows." />
```

will add a playground to the examples pane, allow to show its preview, add a styled link and add it to the search index for the playground. This will also generate images for this playground's preview when needed. Please make sure to commit those images.

Documentation for all markdown components is coming soon.

<!-- [![Powered by vercel](public/powered-by-vercel.svg?raw=true)](https://vercel.com/?utm_source=babylonjs&utm_campaign=oss) -->
