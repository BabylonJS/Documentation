import { mkdirSync, writeFileSync } from "fs";
import { createRequire } from "module";
import { join } from "path";

import { createAppRouterEvaluation, renderAppRouterEvaluationMarkdown } from "../lib/appRouterEvaluation/staticAppRouterEvaluation";
import { getRedirects } from "../lib/buildUtils/redirects";
import { getTypeDocStaticPaths, hasTypeDocArtifacts } from "../lib/buildUtils/typedoc.utils";
import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";

const require = createRequire(import.meta.url);
const nextConfig = require("../next.config.js");

const getOptionalTypeDocRouteCount = (baseLocation: string) => {
    if (!hasTypeDocArtifacts(baseLocation)) {
        return undefined;
    }
    return getTypeDocStaticPaths(baseLocation).length;
};

const graph = getContentGraph();
const result = createAppRouterEvaluation({
    nextOutput: nextConfig.output,
    imagesUnoptimized: nextConfig.images?.unoptimized,
    trailingSlash: nextConfig.trailingSlash,
    contentRouteCount: graph.routeManifest.length,
    redirectRouteCount: getRedirects().length,
    typedocRouteCount: getOptionalTypeDocRouteCount("typedoc"),
    viewerRouteCount: getOptionalTypeDocRouteCount("packages/viewer"),
});

mkdirSync(contentArtifactsDirectory, { recursive: true });
writeFileSync(join(contentArtifactsDirectory, "app-router-evaluation.json"), `${JSON.stringify(result, null, 2)}\n`, { encoding: "utf-8" });
writeFileSync(join(contentArtifactsDirectory, "app-router-evaluation.md"), `${renderAppRouterEvaluationMarkdown(result)}\n`, { encoding: "utf-8" });

console.log(`App Router static export readiness: ${result.staticExportReady ? "ready for proof branch" : "not ready"}.`);
console.log(`Immediate migration recommended: ${result.shouldMigrateNow ? "yes" : "no"}.`);
console.log(`Wrote ${join(contentArtifactsDirectory, "app-router-evaluation.md")}.`);
