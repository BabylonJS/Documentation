import { existsSync, readFile, readFileSync, writeFile, writeFileSync } from "fs";
import { sep, join, resolve } from "path";

const basePath = join(process.cwd(), `.${sep}public`);
const sitemapFile = resolve(basePath, 'sitemap.xml');

export const addToSitemap = async (name: string, url: string, lastModified?: string) => {
    if (!existsSync(sitemapFile)) {
        await createSitemapFile();
    }
    const data = readFileSync(sitemapFile);

    console.log('writing data to sitemap');

    let theFile = data.toString().split("\n");
    const endOfFile = theFile.splice(-1, 1);
    endOfFile.unshift(`<url><loc>${url}</loc>${lastModified !== undefined ? `<lastmod>${lastModified}</lastmod>` : ""}</url>`);
    writeFileSync(sitemapFile, [...theFile, ...endOfFile].join("\n"), {encoding: "utf-8"});
};

const createSitemapFile = async () => {
    console.log('writing xml file');
    writeFileSync(
        sitemapFile,
        `<?xml version="1.0" encoding="UTF-8"?>
           <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          </urlset>`,
          {encoding: "utf-8"}
    );
};
