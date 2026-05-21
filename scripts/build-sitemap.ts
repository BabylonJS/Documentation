import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getTypeDocStaticPaths } from "../lib/buildUtils/typedoc.utils";
import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import {
    contentArtifactsDirectory,
    createSitemapEntries,
    createSitemapXmlFromEntries,
    type SitemapEntry,
} from "../lib/contentGraph/staticArtifacts";

const createTypeDocSitemapEntries = (baseLocation: string): SitemapEntry[] =>
    getTypeDocStaticPaths(baseLocation).map(({ params }) => ({
        url: baseLocation === "typedoc" && params.id.length === 1 && params.id[0] === "index"
            ? "/typedoc"
            : `/${baseLocation}/${params.id.join("/")}`,
    }));

const uniqueSortedEntries = (entries: SitemapEntry[]) => {
    return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values()).sort((left, right) => left.url.localeCompare(right.url));
};

const graph = getContentGraph();
const sitemapEntries = uniqueSortedEntries([
    ...createSitemapEntries(graph),
    { url: "/typedoc" },
    ...createTypeDocSitemapEntries("typedoc"),
    ...createTypeDocSitemapEntries("packages/viewer"),
]);
const sitemapXml = createSitemapXmlFromEntries(sitemapEntries);
const sitemapContent = `${sitemapXml}\n`;

mkdirSync(contentArtifactsDirectory, { recursive: true });
mkdirSync("public", { recursive: true });
writeFileSync(join(contentArtifactsDirectory, "sitemap.xml"), sitemapContent, { encoding: "utf-8" });
writeFileSync(join(contentArtifactsDirectory, "sitemap-entries.json"), `${JSON.stringify(sitemapEntries, null, 2)}\n`, { encoding: "utf-8" });
writeFileSync(join("public", "sitemap.xml"), sitemapContent, { encoding: "utf-8" });

console.log("Wrote " + join("public", "sitemap.xml") + " with " + sitemapEntries.length + " URL(s).");
