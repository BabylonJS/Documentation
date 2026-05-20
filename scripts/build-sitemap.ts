import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory, createSitemapEntries, createSitemapXml } from "../lib/contentGraph/staticArtifacts";

const graph = getContentGraph();
const sitemapEntries = createSitemapEntries(graph);
const sitemapXml = createSitemapXml(graph);

mkdirSync(contentArtifactsDirectory, { recursive: true });
writeFileSync(join(contentArtifactsDirectory, "sitemap.xml"), `${sitemapXml}\n`, { encoding: "utf-8" });
writeFileSync(join(contentArtifactsDirectory, "sitemap-entries.json"), `${JSON.stringify(sitemapEntries, null, 2)}\n`, { encoding: "utf-8" });

console.log(`Wrote ${join(contentArtifactsDirectory, "sitemap.xml")} with ${sitemapEntries.length} URL(s).`);