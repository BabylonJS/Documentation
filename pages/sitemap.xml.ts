// import { getAvailableUrls } from "../lib/buildUtils/content.utils";
// import { getLastModified } from "../lib/buildUtils/tools";
// import { generateTypeDoc } from "../lib/buildUtils/typedoc.utils";

// const generateSitemap = (data: { location: string; lastModified?: Date }[], origin: string) => {
//     let xml = "";

//     data.map(({ location, lastModified }) => {
//         xml += `<url><loc>${origin + location}</loc>${lastModified !== undefined ? `<lastmod>${lastModified}</lastmod>` : ""}</url>`;
//     });

//     return `<?xml version="1.0" encoding="UTF-8"?>
//       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//         ${xml}
//       </urlset>`;
// };

// export async function getServerSideProps({ res }) {
//     const data: { location: string; lastModified?: Date }[] = [
//         {
//             location: "/",
//             lastModified: new Date(),
//         },
//     ];

//     // pages
//     const paths = getAvailableUrls();
//     paths.forEach((path) => {
//         const lastModified = getLastModified(path.params.content);
//         data.push({
//             location: "/" + path.params.id.join("/"),
//             lastModified,
//         });
//     });

//     // API
//     data.push({
//         location: '/typedoc'
//     });
//     const apiPaths = await generateTypeDoc();
//     apiPaths.forEach(path => {
//         data.push({
//             location: '/typedoc/'+path.params.id.join('/')
//         })
//     })

//     res.setHeader("Content-Type", "text/xml");
//     res.write(generateSitemap(data, "http://doc.babylonjs.com"));
//     res.end();

//     return {
//         props: {},
//     };
// }

const SitemapIndex = () => null;
export default SitemapIndex;
