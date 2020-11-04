// next.config.js
const withSass = require("@zeit/next-sass");
const withMDX = require("@next/mdx")({
    options: {
        remarkPlugins: [require("remark-slug"), require("remark-lint")],
        rehypePlugins: [require("rehype-highlight")],
    },
});
module.exports = withMDX(
    withSass({
        sassLoaderOptions: {
            sassOptions: {
                includePaths: ["./styles"],
            },
        },
        // cssModules: true,
        // cssLoaderOptions: {
        //     importLoaders: 2,
        //     localIdentName: "[local]___[hash:base64:5]",
        // },
        webpack: (config, { isServer }) => {
            if (isServer) {
                require("./lib/buildUtils/sitemap");
            }

            return config;
        },
    }),
);
