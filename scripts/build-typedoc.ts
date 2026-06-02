import typedocConfig, { viewerConfig } from "../configuration/typedoc.config";
import { buildTypeDocArtifacts } from "../lib/buildUtils/typedocBuild.utils";

const force = process.argv.includes("--force");

const targets = [
    { title: typedocConfig.title, baseLocation: "typedoc", config: typedocConfig },
    { title: viewerConfig.title, baseLocation: "packages/viewer", config: viewerConfig },
];

async function main() {
    for (const target of targets) {
        console.log(`Building TypeDoc artifacts for ${target.baseLocation}${force ? " with force rebuild" : ""}...`);
        const paths = await buildTypeDocArtifacts(target.title, target.baseLocation, target.config, { force });
        console.log(`Built ${paths.length} TypeDoc route(s) for ${target.baseLocation}.`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
