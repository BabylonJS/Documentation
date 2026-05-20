import { describe, expect, it } from "vitest";

import { createAppRouterEvaluation, renderAppRouterEvaluationMarkdown } from "../lib/appRouterEvaluation/staticAppRouterEvaluation";

describe("Static App Router migration evaluation", () => {
    it("marks the current static export architecture ready for a proof branch", () => {
        const result = createAppRouterEvaluation({
            nextOutput: "export",
            imagesUnoptimized: true,
            trailingSlash: true,
            contentRouteCount: 10,
            redirectRouteCount: 2,
            typedocRouteCount: 4,
            viewerRouteCount: 1,
        });

        expect(result.staticExportReady).toBe(true);
        expect(result.shouldMigrateNow).toBe(false);
        expect(result.routeFamilies.map((family) => family.proposedAppRoute)).toContain("app/[...slug]/page.tsx");
        expect(result.blockers).toContain("The equivalent App Router files cannot coexist with the current Pages Router files at the same public URLs; the migration needs a dedicated branch that removes or renames conflicting pages as it adds app routes.");
    });

    it("requires prebuilt TypeDoc artifacts before considering the proof branch ready", () => {
        const result = createAppRouterEvaluation({
            nextOutput: "export",
            imagesUnoptimized: true,
            trailingSlash: true,
            contentRouteCount: 10,
            redirectRouteCount: 0,
        });

        expect(result.staticExportReady).toBe(false);
        expect(result.routeFamilies.find((family) => family.name === "TypeDoc API")?.compatible).toBe(false);
        expect(result.routeFamilies.find((family) => family.name === "Viewer API")?.compatible).toBe(false);
    });

    it("renders a markdown report with route mapping and validation steps", () => {
        const report = renderAppRouterEvaluationMarkdown(
            createAppRouterEvaluation({
                nextOutput: "export",
                imagesUnoptimized: true,
                trailingSlash: true,
                contentRouteCount: 1,
                redirectRouteCount: 1,
                typedocRouteCount: 1,
                viewerRouteCount: 1,
            }),
        );

        expect(report).toContain("# Static App Router Migration Evaluation");
        expect(report).toContain("app/typedoc/[[...slug]]/page.tsx");
        expect(report).toContain("Run npm run build:typedoc before the App Router build");
    });
});
