# Documentation Modernization Plan

## Goal

Modernize the Babylon.js documentation architecture while preserving static page export as the deployment model.

The target architecture should make the site easier to maintain, easier to validate, faster to build locally, and safer to evolve. This plan intentionally avoids server rendering, runtime APIs, middleware, ISR, and any deployment feature that conflicts with the current static hosting architecture.

## Phase Status

| Phase                                                | Status      | Notes                                                                                                                                                                                                                            |
| ---------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1: Centralize Markdown Compilation             | Done        | Shared compiler added under `lib/markdown`; home page, docs page, and markdown regression tests now use it. `npm test` and `npm run build` pass.                                                                                 |
| Phase 2: Build a Typed Content Graph                 | Done        | Typed content graph added under `lib/contentGraph`; docs static paths now use the graph route manifest; graph regression tests cover metadata, breadcrumbs, examples, and navigation order. `npm test` and `npm run build` pass. |
| Phase 3: Add Schema Validation                       | Done        | Standalone `npm run validate:content` command added and wired into `npm run build`; validation checks structure, frontmatter, links, markdown refs, and example metadata. `npm test` and `npm run build` pass                    |
| Phase 4: Make Static Artifacts Explicit              | Done        | Content artifacts, sitemap, docs search, playground search, and search upload now have explicit scripts. `npm test` and `npm run build` pass.                                                                                    |
| Phase 5: Isolate Playground Preview Image Generation | Done        | Preview-image checks and generation now have explicit scripts. `npm test` and `npm run build` pass.                                                                                                                              |
| Phase 6: Isolate Page UI Features                    | Not started | Depends on stable page data boundaries.                                                                                                                                                                                          |
| Phase 7: TypeDoc Pipeline Cleanup                    | Not started | TypeDoc build artifacts still come from the existing pipeline.                                                                                                                                                                   |
| Phase 8: Evaluate Static App Router Migration        | Not started | Only evaluate after the static data pipeline is stable.                                                                                                                                                                          |

## Non-Negotiable Constraints

- Keep `output: "export"` in Next.js.
- Every public documentation page must remain statically generated.
- Existing URLs should continue to work, either directly or through the existing redirect system.
- Search, sitemap generation, TypeDoc output, and playground metadata should be generated as static build artifacts.
- Local development must not require production secrets such as `SEARCH_API_KEY`.
- Documentation authors should continue writing markdown/MDX content without needing to understand the full build system.
- Any future App Router route must be compatible with static export.

## Non-Goals

- Do not move to server-side rendering.
- Do not require ISR, middleware, server actions, or runtime-only routes.
- Do not require Next image optimization, since static export currently uses unoptimized images.
- Do not change public URLs unless redirects are planned and validated.
- Do not rewrite all documentation content as part of the architecture migration.
- Do not replace the published docs structure in one large PR.

## Current Pain Points

- Page generation mixes too many responsibilities: content loading, route discovery, validation, search indexing, sitemap updates, playground scanning, screenshot generation, MDX compilation, and page rendering.
- The main docs route and home page duplicate parts of the MDX serialization flow.
- Markdown metadata is loosely typed and normalized dynamically, which makes authoring errors harder to catch early.
- TypeDoc generation is a large subsystem but is currently coupled to static path/page generation.
- Interactive docs behavior, such as examples and table-of-contents state, is owned by page route components instead of isolated feature components.
- Some build side effects only happen under environment flags, making local and production behavior harder to reason about.

## Target Architecture

The target shape is a static-first documentation system with clear boundaries:

```text
Markdown files + structure.json
        |
        v
Content graph builder
        |
        +--> validation report
        +--> route manifest
        +--> search documents
        +--> sitemap entries
        +--> playground/example manifest
        |
        v
Next static renderer
        |
        v
Exported static site
```

TypeDoc should become a sibling static pipeline:

```text
Babylon.js source/packages
        |
        v
TypeDoc builder
        |
        +--> generated API HTML/data
        +--> API search documents
        +--> API sitemap entries
        +--> legacy redirect map
        |
        v
Next static renderer
```

The architecture has four layers:

1. Content graph layer.
2. Build artifact layer.
3. Rendering layer.
4. Client interaction layer.

## Architectural Principles

- Build data first, render pages second.
- Keep page routes thin.
- Prefer explicit build steps over hidden side effects inside `getStaticProps` or route components.
- Use typed data contracts between build utilities and React components.
- Keep static artifacts inspectable in `.temp/` or `public/`, depending on whether they are deployment output.
- Make production-only work explicit and easy to skip locally.
- Improve architecture incrementally so each PR can be reviewed and shipped safely.
- Preserve the current content authoring model unless a later phase deliberately changes it.
- Run a code review pass after every phase before starting the next phase.

## Next.js Strategy

The first modernization pass should keep the Pages Router unless a specific phase calls for an App Router proof of concept. This reduces risk while we separate content, build artifacts, and rendering concerns.

After the build pipeline is cleaner, we can evaluate an App Router migration that still keeps static export. If we migrate, the useful App Router features are:

- `generateStaticParams` for static docs routes.
- `generateMetadata` for typed page metadata.
- Nested layouts for docs, API docs, search, examples, and playground pages.
- React Server Components for reading prebuilt static data.
- Client components only for interactive islands such as search input, theme toggling, example panels, and active TOC tracking.

Features that should remain out of scope while static export is required:

- Runtime server rendering.
- ISR.
- Middleware-dependent routing.
- Server actions.
- Runtime API routes for core documentation behavior.
- Next's optimized image pipeline.

## Phase 1: Centralize Markdown Compilation

Create one shared markdown/MDX compilation module and use it from all static docs pages.

Proposed files:

- `lib/markdown/compileMarkdown.ts`
- `lib/markdown/frontmatter.ts`
- `lib/markdown/plugins.ts`
- `lib/markdown/markdownComponents.ts` or a re-export of the existing component map

Tasks:

- Move `next-mdx-remote` serialization options into one function.
- Ensure the home page and dynamic documentation page use the same compiler.
- Keep existing remark/rehype behavior: GFM, math, KaTeX, slugs, and custom MDX components.
- Update markdown parsing tests to call the shared compiler instead of duplicating the setup.

Acceptance criteria:

- No user-visible rendering change. Done.
- Existing markdown snapshot tests pass. Done.
- Adding or upgrading a markdown plugin only requires changing one module. Done.

Phase 1 verification:

- `npm test` passed.
- `npm run build` passed with existing TypeDoc/static export warnings.
- Code review pass completed after implementation.

## Phase 2: Build a Typed Content Graph

Extract content discovery and structure traversal into a dedicated graph builder.

Proposed files:

- `lib/contentGraph/buildContentGraph.ts`
- `lib/contentGraph/types.ts`
- `lib/contentGraph/loadStructure.ts`
- `lib/contentGraph/loadMarkdownFile.ts`
- `lib/contentGraph/navigation.ts`
- `lib/contentGraph/examples.ts`

The graph should include:

- Route id and URL.
- Source markdown path.
- Raw content.
- Parsed frontmatter.
- Effective metadata after defaults and overrides.
- Breadcrumbs.
- Previous and next pages.
- Child pages.
- Further reading links.
- Internal links discovered in markdown.
- Playground/NME/NGE/SFE/NRGE references.
- Last modified time.
- Derived image URL.
- GitHub edit URL.

Tasks:

- Move structure traversal out of route-level code.
- Replace the module-level `childPageData` cache with graph lookup helpers.
- Keep the existing `structure.json` format for now.
- Provide lookup helpers such as `getPageByRoute`, `getAllRoutes`, and `getChildPages`.

Acceptance criteria:

- `getStaticPaths` can be implemented from the graph route manifest. Done.
- The graph exposes page lookup data without search, sitemap, or screenshot side effects. Done.
- Existing routes and navigation behavior are preserved. Done.

Phase 2 verification:

- Added `ContentGraph` types, structure loading, graph construction, route manifest generation, metadata/frontmatter normalization, breadcrumbs, previous/next IDs, child IDs, internal link extraction, example reference extraction, source paths, last modified times, and GitHub edit URLs.
- Updated the docs catch-all route to use the graph route manifest for static paths while keeping page rendering on the existing page data helper until later artifact isolation phases.
- Added `__tests__/content-graph.test.ts`.
- `npm test` passed.
- `npm run build` passed with existing TypeDoc tracing, large page data, internal link, and playground screenshot timeout warnings.
- Code review pass completed after implementation.

## Phase 3: Add Schema Validation

Add explicit validation for documentation structure and markdown frontmatter.

Implementation note:

- Use a small typed validator in `lib/contentGraph/validateContentGraph.ts` for now instead of adding a schema dependency. A later pass can still move the rule definitions to `zod` or another schema library if the validation surface grows.

Validation should cover:

- Required structure fields.
- Unknown or misspelled frontmatter keys.
- `further-reading` shape.
- `video-overview` and `video-content` shape.
- `toc-levels` type.
- Missing markdown files referenced by `structure.json`.
- Markdown files not referenced by `structure.json`.
- Duplicate content references.
- Internal links that do not resolve and are not covered by redirects.
- Custom markdown components with missing or malformed required props.

Tasks:

- Implement validation as a standalone build command.
- Keep validation usable locally without production environment variables.
- Make validation errors actionable for docs authors.
- Add fixture tests for common valid and invalid metadata cases.

Acceptance criteria:

- A contributor can run one command and understand what is wrong with a docs page. Done.
- Production builds fail on invalid content structure. Done.
- Existing valid docs continue to pass after any required cleanup. Done.

Phase 3 verification:

- Added `npm run validate:content` and wired it into `npm run build` before `next build`.
- Added validation for structure fields, missing/unreferenced markdown files, duplicate content references, frontmatter keys and value shapes, internal links, redirects, and playground/NME/NGE/SFE/NRGE metadata.
- Existing legacy cleanup opportunities are reported as warnings so static export stays unblocked while authors get actionable feedback.
- Added `__tests__/content-validation.test.ts` with valid corpus coverage and focused invalid fixture coverage.
- `npm run validate:content` passed with 0 errors and known warnings.
- `npm test` passed.
- `npm run build` passed with validation enabled, plus existing TypeDoc tracing, large page data, internal link, and playground screenshot timeout warnings.
- Code review pass completed after implementation.

## Phase 4: Make Static Artifacts Explicit

Move generated artifacts out of route generation side effects.

Proposed commands:

```json
{
  "build:content": "node scripts/build-content.mjs",
  "validate:content": "node scripts/validate-content.mjs",
  "build:search": "node scripts/build-search.mjs",
  "build:sitemap": "node scripts/build-sitemap.mjs",
  "build:typedoc": "node scripts/build-typedoc.mjs"
}
```

The exact command names can change, but each concern should be separately runnable.

Static artifacts may include:

- `.temp/content/content-graph.json`
- `.temp/content/route-manifest.json`
- `.temp/content/validation-report.json`
- `.temp/typedoc/...`
- `public/api-search/...`
- `public/sitemap.xml`
- Search upload payloads or local static search indexes

Tasks:

- Generate sitemap from graph data instead of page render side effects.
- Generate search documents from graph data instead of `getPageData` side effects.
- Generate playground search metadata from graph data.
- Keep Azure Search upload as an explicit CI/deployment step, not a requirement for local static rendering.

Acceptance criteria:

- Running `next build` does not need to mutate external search services. Done.
- Local builds work without search secrets. Done.
- Generated artifacts can be inspected when a build fails. Done.

Phase 4 verification:

- Added `npm run build:content`, `npm run build:search`, `npm run build:sitemap`, and `npm run upload:search`.
- `build:content` writes inspectable `.temp/content` graph, route manifest, validation report, sitemap XML, and search payloads before `next build`.
- Documentation and playground search payloads are generated from the content graph instead of `getPageData` route rendering.
- Azure Search upload is isolated to `npm run upload:search` and requires `SEARCH_API_KEY` only when that explicit command is run.
- Removed documentation and TypeDoc search/sitemap mutation calls from route generation.
- TypeDoc still generates local API search JSON during its existing page-data pipeline, which is tracked as Phase 7 cleanup.
- Playground preview screenshots still run during page generation when missing, which remains the Phase 5 scope.
- `npm run build:content`, `npm run build:search`, `npm run build:sitemap`, `npm test`, and `npm run build` passed.
- Code review pass completed after implementation.

## Phase 5: Isolate Playground Preview Image Generation

Remove browser screenshot generation from page data loading.

Tasks:

- Scan the content graph for playground/editor references.
- Detect missing preview images in a dedicated script.
- Generate missing images only when explicitly requested.
- Add a dry-run mode that reports missing images without launching Puppeteer.
- Keep generated images reviewable as normal assets.

Acceptance criteria:

- Normal static page generation does not unexpectedly launch Puppeteer. Done.
- Missing image checks are visible to contributors. Done.
- Image generation remains available when intentionally invoked. Done.

Phase 5 verification:

- Added pure content-graph preview image scanning in `lib/contentGraph/exampleImages.ts`.
- Added `npm run check:example-images` for report-only missing image checks without launching Puppeteer.
- Added `npm run build:example-images` for intentional screenshot generation, plus `--dry-run` and optional `--strict` modes.
- Removed Puppeteer imports and preview screenshot generation from `lib/buildUtils/tools.ts` and normal `getPageData` execution.
- Current corpus reports 1930 preview image references, 1922 existing images, and 8 missing images.
- `npm run check:example-images`, `npm run build:example-images -- --dry-run`, `npm test`, and `npm run build` passed.
- Code review pass completed after implementation.

## Phase 6: Isolate Page UI Features

Split the dynamic docs page into smaller feature components.

Proposed files:

- `features/docs/DocsPage.tsx`
- `features/docs/DocsMdxRenderer.tsx`
- `features/docs/DocsExamplesProvider.tsx`
- `features/docs/DocsTableOfContentsProvider.tsx`
- `features/docs/useHashScroll.ts`
- `features/docs/useExamplePanel.ts`

Tasks:

- Move example registration and active example state out of route components.
- Move TOC registration and active heading state out of route components.
- Move hash scrolling behavior into a hook.
- Keep layout and metadata behavior stable.
- Reduce duplication between the home page and regular docs pages.

Acceptance criteria:

- Route files mostly connect static data to feature components.
- Interactive behavior remains client-side and works in exported static pages.
- The docs page is easier to test in isolation.

## Phase 7: TypeDoc Pipeline Cleanup

Treat TypeDoc as its own static build pipeline.

Tasks:

- Keep TypeDoc generation cacheable under `.temp/typedoc`.
- Move API search index generation into the TypeDoc build command.
- Move legacy API redirect map generation into the TypeDoc build command.
- Keep API page rendering focused on reading generated TypeDoc content.
- Avoid regenerating TypeDoc during normal page lookup when cached output exists.
- Document environment variables used by the TypeDoc pipeline.

Acceptance criteria:

- API docs generation can be run and debugged independently.
- API page routes remain statically exported.
- API search artifacts are deterministic and inspectable.

## Phase 8: Evaluate Static App Router Migration

Only start this phase after the content graph and artifact pipeline are stable.

Potential target layout:

```text
app/
  layout.tsx
  page.tsx
  [...slug]/
    page.tsx
  typedoc/
    [[...slug]]/
      page.tsx
  search/
    page.tsx
  examples/
    page.tsx
  playground/
    page.tsx
```

Tasks:

- Prove static export compatibility in a small branch.
- Replace `getStaticPaths` with `generateStaticParams`.
- Replace route-level `Head` usage with `generateMetadata`.
- Move shared chrome into layouts.
- Keep interactive features as client components.
- Compare generated output paths against the current build.

Acceptance criteria:

- `next build` still produces a static export.
- URLs, metadata, and generated HTML remain compatible with the current deployment.
- The migration provides clear maintainability value beyond folder movement.

## Search Strategy Options

We should decide whether search remains Azure Search backed, becomes static, or uses a hybrid approach.

### Option A: Keep Azure Search

Pros:

- Minimal product behavior change.
- Existing production search behavior is preserved.

Cons:

- Requires secrets for indexing.
- Search indexing is harder to reproduce locally.

### Option B: Static Search Index

Examples: Pagefind, Orama, MiniSearch, FlexSearch.

Pros:

- Fits static export naturally.
- No production secret required for local builds.
- Search output is a deployable artifact.

Cons:

- Requires product evaluation for ranking, size, and API docs scale.
- Playground search may still need custom handling.

### Option C: Hybrid

Use static search for docs/API content and keep custom or hosted search for playground-specific discovery.

Pros:

- Improves local/static docs behavior while preserving richer specialized search where needed.

Cons:

- Two search systems to maintain.

Recommendation: evaluate static search after the content graph exists, because the graph will make either option easier.

## Testing Strategy

Keep tests focused on architectural contracts rather than snapshots alone.

Recommended coverage:

- Markdown compilation fixtures.
- Frontmatter schema validation.
- Structure graph traversal.
- Breadcrumb generation.
- Previous/next generation.
- Further reading resolution.
- Internal link validation.
- Playground reference extraction.
- Sitemap entry generation.
- Search document generation.
- TypeDoc URL mapping and redirect behavior.

Required validation commands during migration:

```bash
npm test
npm run build
```

Additional commands should be added as the pipeline becomes explicit:

```bash
npm run validate:content
npm run build:content
npm run build:typedoc
```

## Suggested PR Breakdown

1. Centralize markdown compilation with no behavior change.
2. Add content graph types and graph builder behind existing APIs.
3. Move route manifest generation to the content graph.
4. Add frontmatter and structure validation.
5. Move search document generation out of page data loading.
6. Move sitemap generation out of page data loading.
7. Move playground metadata extraction and preview checks out of page data loading.
8. Split docs page UI into feature components.
9. Clean up TypeDoc pipeline boundaries.
10. Evaluate static App Router migration in a proof-of-concept branch.

## Decisions To Make

- Should generated content graph files be committed, or should they always be build artifacts?
- Should local search become static, hosted, or hybrid?
- Should playground screenshot generation remain automatic, become an explicit command, or move to CI?
- Should `structure.json` remain the source of truth, or should navigation eventually move into frontmatter plus generated ordering metadata?
- Should App Router migration be a goal, or only an option after the pipeline cleanup?
- What is the maximum acceptable production build time?

## Definition Of Done

The modernization effort is successful when:

- The site still exports static pages.
- Local builds do not require production secrets.
- Rendering a page does not mutate search, sitemap, screenshots, or external services.
- Docs content has clear validation errors before deployment.
- Markdown compilation is centralized and tested.
- Search and sitemap artifacts are generated from explicit build steps.
- TypeDoc generation is isolated and cacheable.
- Route components are thin and mostly render already-prepared data.
- Future Next.js migration choices are easier because data and rendering are no longer tangled.
