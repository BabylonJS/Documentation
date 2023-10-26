// next.config.js
// const withSass = require("@zeit/next-sass");
const withMDX = require("@next/mdx")();
module.exports = withMDX(
    {
        sassOptions: {
            includePaths: ["./styles"],
        },
        staticPageGenerationTimeout: 150,
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
