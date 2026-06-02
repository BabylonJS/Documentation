export interface RouteFamilyEvaluation {
    name: string;
    currentRoute: string;
    proposedAppRoute: string;
    staticParamsSource: string;
    routeCount?: number;
    compatible: boolean;
    notes: string[];
}

export interface AppRouterEvaluationInput {
    nextOutput?: string;
    imagesUnoptimized?: boolean;
    trailingSlash?: boolean;
    contentRouteCount: number;
    redirectRouteCount: number;
    typedocRouteCount?: number;
    viewerRouteCount?: number;
}

export interface AppRouterEvaluationResult {
    staticExportReady: boolean;
    shouldMigrateNow: boolean;
    targetLayout: string[];
    routeFamilies: RouteFamilyEvaluation[];
    blockers: string[];
    requiredRefactors: string[];
    validationPlan: string[];
}

export const createAppRouterEvaluation = (input: AppRouterEvaluationInput): AppRouterEvaluationResult => {
    const routeFamilies: RouteFamilyEvaluation[] = [
        {
            name: "Home",
            currentRoute: "pages/index.tsx",
            proposedAppRoute: "app/page.tsx",
            staticParamsSource: "single static page",
            routeCount: 1,
            compatible: true,
            notes: ["Can reuse the existing compiled markdown page data once shared shell providers are moved out of _app."],
        },
        {
            name: "Markdown documentation",
            currentRoute: "pages/[...id].tsx",
            proposedAppRoute: "app/[...slug]/page.tsx",
            staticParamsSource: "getContentGraph().routeManifest plus generated redirect pages",
            routeCount: input.contentRouteCount + input.redirectRouteCount,
            compatible: true,
            notes: ["The content graph already exposes static route IDs that map directly to generateStaticParams."],
        },
        {
            name: "TypeDoc API",
            currentRoute: "pages/typedoc/[[...id]].tsx",
            proposedAppRoute: "app/typedoc/[[...slug]]/page.tsx",
            staticParamsSource: "prebuilt .temp/typedoc/docdirectory files via getTypeDocStaticPaths()",
            routeCount: input.typedocRouteCount,
            compatible: input.typedocRouteCount !== undefined,
            notes: ["Phase 7 made TypeDoc generation explicit, so App Router pages can read prebuilt artifacts without generating during route discovery."],
        },
        {
            name: "Viewer API",
            currentRoute: "pages/packages/viewer/[...id].tsx",
            proposedAppRoute: "app/packages/viewer/[...slug]/page.tsx",
            staticParamsSource: "prebuilt .temp/packages/viewer/docdirectory files via getTypeDocStaticPaths(baseLocation)",
            routeCount: input.viewerRouteCount,
            compatible: input.viewerRouteCount !== undefined,
            notes: ["Uses the same explicit TypeDoc artifact flow as the main API docs."],
        },
        {
            name: "Tool pages",
            currentRoute: "pages/examples, pages/playground, pages/search, pages/toggleColor, pages/404",
            proposedAppRoute: "app/examples/page.tsx, app/playground/page.tsx, app/search/page.tsx, app/toggleColor/page.tsx, app/not-found.tsx",
            staticParamsSource: "single static pages",
            routeCount: 5,
            compatible: true,
            notes: ["Interactive search/playground pages must remain client components or be wrapped by client islands."],
        },
    ];

    const staticExportReady = input.nextOutput === "export" && input.imagesUnoptimized === true && input.trailingSlash === true && routeFamilies.every((family) => family.compatible);

    return {
        staticExportReady,
        shouldMigrateNow: false,
        targetLayout: [
            "app/layout.tsx",
            "app/page.tsx",
            "app/[...slug]/page.tsx",
            "app/typedoc/[[...slug]]/page.tsx",
            "app/packages/viewer/[...slug]/page.tsx",
            "app/examples/page.tsx",
            "app/playground/page.tsx",
            "app/search/page.tsx",
            "app/toggleColor/page.tsx",
            "app/not-found.tsx",
        ],
        routeFamilies,
        blockers: [
            "The equivalent App Router files cannot coexist with the current Pages Router files at the same public URLs; the migration needs a dedicated branch that removes or renames conflicting pages as it adds app routes.",
            "The shared Layout currently imports next/head, next/router, and React client hooks; App Router layouts are server components by default, so the chrome needs a client shell plus server metadata helpers.",
            "_app.tsx owns BaseUrlProvider, ThemeToggle, global styles, and analytics scripts; these responsibilities need to move to app/layout.tsx and client providers.",
            "_document.tsx owns document-level icons, manifest links, theme color, and BASE_URL plumbing; these need App Router metadata/layout equivalents.",
        ],
        requiredRefactors: [
            "Extract a metadata factory that converts MarkdownMetadata/IPageProps into App Router Metadata without relying on next/head.",
            "Extract a client DocsShell/LayoutShell that owns drawer, search box, theme toggle, breadcrumbs, and route-aware interactions using next/navigation.",
            "Keep MDX rendering, example panels, TypeDoc parsing, search, examples, and playground UI as client components where they use browser APIs.",
            "Add a route-output comparison script in the migration branch to diff exported paths before and after the Pages Router replacement.",
        ],
        validationPlan: [
            "Run npm run build:typedoc before the App Router build so TypeDoc generateStaticParams can read prebuilt artifacts.",
            "Run npm run build and verify output remains static export only.",
            "Compare exported route lists for content docs, redirects, TypeDoc, Viewer API, search, examples, playground, and 404.",
            "Spot-check metadata for home, a markdown doc page, a redirected doc page, a TypeDoc page, and a tool page.",
        ],
    };
};

export const renderAppRouterEvaluationMarkdown = (result: AppRouterEvaluationResult) => {
    const routeRows = result.routeFamilies.map((family) => `| ${family.name} | ${family.currentRoute} | ${family.proposedAppRoute} | ${family.routeCount ?? "missing artifacts"} | ${family.compatible ? "Yes" : "No"} |`).join("\n");
    const targetLayout = result.targetLayout.map((item) => `- \`${item}\``).join("\n");
    const blockers = result.blockers.map((item) => `- ${item}`).join("\n");
    const requiredRefactors = result.requiredRefactors.map((item) => `- ${item}`).join("\n");
    const validationPlan = result.validationPlan.map((item) => `- ${item}`).join("\n");

    return `# Static App Router Migration Evaluation

## Recommendation

Do not migrate the production routes in this branch. The static data pipeline is ready for an App Router proof branch, but the equivalent \`app/\` routes conflict with the existing \`pages/\` routes and the shared shell still needs client/server boundary cleanup.

Static export readiness: ${result.staticExportReady ? "ready for a dedicated proof branch" : "not ready"}.
Immediate migration recommended: ${result.shouldMigrateNow ? "yes" : "no"}.

## Proposed App Router Layout

${targetLayout}

## Route Family Mapping

| Area | Current route | Proposed App Router route | Route count | Static compatible |
| ---- | ------------- | ------------------------- | ----------- | ----------------- |
${routeRows}

## Blockers

${blockers}

## Required Refactors

${requiredRefactors}

## Validation Plan

${validationPlan}
`;
};
