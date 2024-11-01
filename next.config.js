// next.config.js
// keeping comments for future deployment possibilities
const withMDX = require("@next/mdx")();
module.exports = withMDX(
    {
        output: "export",
        // experimental: {
        //   workerThreads: false,
        //   cpus: 1,
        // },
        sassOptions: {
            includePaths: ["./styles"],
        },
        staticPageGenerationTimeout: 400,
        images: {
            unoptimized: true,
        },
        assetPrefix: process.env.BASE_PATH || "",
        async redirects() {
            return [
              {
                source: '/typedoc',
                destination: '/typedoc/modules/BABYLON', // Matched parameters can be used in the destination
                permanent: true,
              },
            ]
          },
    },
);
