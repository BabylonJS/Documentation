# Babylon.js documentation website

The page is written using Next.js (Server-side react framework).

## Requirements

* Node 12 and up
* yarn

## Getting Started

Install dependencies

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Custom markdown components

Markdowns can now be augmented with special components. For example, adding:

```html
<Playground id="#Y642I8" title="Tinted Shadows Example" description="A Playground example of tinted shadows."/>
```

will add a playground to the examples pane, allow to show its preview, add a styled link and add it to the search index for the playground. This will also generate images for this playground's preview when needed. Please make sure to commit those images.

Documentation for all markdown components is coming soon.

[![Powered by vercel](public/powered-by-vercel.svg?raw=true)](https://vercel.com/?utm_source=new-doc-page&utm_campaign=oss)
