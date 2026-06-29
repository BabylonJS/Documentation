import typedocConfig, { babylonLiteConfig, viewerConfig } from "../configuration/typedoc.config";
import { clearBabylonLiteTypeDocArtifacts, getBabylonLiteRepositoryPath } from "../lib/babylonLiteDocs";
import { buildTypeDocArtifacts, buildTypeDocArtifactsFromRepository } from "../lib/buildUtils/typedocBuild.utils";

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

    const babylonLiteRepositoryPath = await getBabylonLiteRepositoryPath();
    if (!babylonLiteRepositoryPath) {
        clearBabylonLiteTypeDocArtifacts();
        console.log("Skipping Babylon Lite TypeDoc artifacts because BabylonJS/Babylon-Lite is not public.");
        return;
    }

    console.log(`Building TypeDoc artifacts for lite/typedoc${force ? " with force rebuild" : ""}...`);
    const paths = await buildTypeDocArtifactsFromRepository(babylonLiteRepositoryPath, babylonLiteConfig.title, "lite/typedoc", babylonLiteConfig, { force, buildLegacyRedirects: false });
    console.log(`Built ${paths.length} TypeDoc route(s) for lite/typedoc.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
