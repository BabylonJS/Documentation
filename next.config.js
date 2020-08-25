// next.config.js
const withSass = require("@zeit/next-sass");
const withTM = require("next-transpile-modules")(["react-bulma-components"]);
module.exports = withTM(
    withSass({
        sassLoaderOptions: {
            includePaths: ["./styles"],
        },
        // cssModules: true,
        // cssLoaderOptions: {
        //     importLoaders: 2,
        //     localIdentName: "[local]___[hash:base64:5]",
        // },
    }),
);
