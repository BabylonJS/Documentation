// next.config.js
// keeping comments for future deployment possibilities
const withMDX = require("@next/mdx")();
module.exports = withMDX({
    output: "export",
    sassOptions: {
        includePaths: ["./styles"],
        silenceDeprecations: ["legacy-js-api"],
    },
    staticPageGenerationTimeout: 400,
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    assetPrefix: process.env.BASE_URL || "",
    // async redirects() {
    //     return [
    //       {
    //         source: '/typedoc',
    //         destination: '/typedoc/modules/BABYLON', // Matched parameters can be used in the destination
    //         permanent: true,
    //       },
    //     ]
    //   },
});
