---
title: Framework Versions
image:
description: Learn about the different versions of Babylon.js.
keywords: diving deeper, contribution, contribute, open-source, oss, versions
further-reading:
video-content:
---

# Framework versions

## General

Babylon comes in two different versions - the preview version and the stable version. Those two differentiate themselves in the following ways:

- The preview version is a work in progress version of the engine. Even though we do our best to never introduce backwards-compatibility issues, it sometimes includes breaking changes.
- The stable version is our latest build from the master branch.

Both versions are considered to be stable and can be used in production. In certain cases (if we still haven't introduced any new features we don't want to have on the stable branch) the preview and the stable versions are identical.

Both versions have their own CDN endpoint. The preview version is available on [preview.babylonjs.com](https://preview.babylonjs.com) and the stable version is available on [cdn.babylonjs.com](https://cdn.babylonjs.com).

When a new version is released on npm it is tagged with either stable or preview.

We keep the same version for all of our public repositories. Every time we release a new version, all of our public framework packages (which can be found on npmjs.com: [https://www.npmjs.com/~babylonjs](https://www.npmjs.com/~babylonjs)) will receive a new version update as well, even when they sometimes don't change. As a rule of thumb stick with the same version for all of your dependencies. This is especially important when it comes to the major version - when using babylon's core 5.X, make sure to use all other dependencies in version 5.X.

## Versioning

### Stable

Until Babylon 5.0 we took a different approach towards versioning. Our stable version was fixed for a long period of time, and our preview version was constantly updating. We have always recommended using the preview version to get the latest features.

Starting Babylon 5.0 we take a different approach towards versioning. We are releasing a new minor version each Thursday of the week from our master branch, containing the latest features and bug fixes. During the week, if a bug fix is required we will release a patched version of the framework. That means that if for example we are at version 5.1.1 at the moment, next Thursday will introduce version 5.2.0. It is possible that until then we will release 5.1.2 or even 5.1.3. We don't update older minor versions. 5.1.1 will not include bug fixes that were introduced in 5.2.0. We recommend using the carret (`^`) when setting the framework version in your package.json. This way you will always get the latest of this major version.

We guarantee **no breaking changes** in our public API between minor versions. Breaking changes will be introduced between major versions. The only time we might introduce breaking changes is when a the browsers introduced a change in their API that forces us to change our API. As we usually abstract our APIs this rarely happens.

Major versions will be released when the preview version's features are ready to be merged to master.

### Preview

When needed, we will introduce the preview branch and the preview version. The preview version will, in general, include features that we still don't want in our latest stable master branch. The versioning schema of the preview branch will follow the pre-release versioning schema, starting with alpha, then beta, and then rc. If for example our master branch is at major version 5, the preview branch will be in prerelease major version 6, with the first version released as alpha - `6.0.0-alpha.0`. We will increment the alpha version at least once a week (and probably more). Once the features are all stable, we will move to `beta` - `6.0.0-beta.0` and so on. When ready to be released, we will use the rc prerelease identifier - `6.0.0-rc.0`. Once ready to be merged to master, we will increase the major version of master. This is a long process that will probably happen once a year.

## Changelog

To see what changed in each version you can take a look at our changelog on the main repository. It is located at [https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md](https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md) as is updated on every publish to npm. When updated outside of the update process (possible in certain cases) unreleased features will be included in the "upcoming" version. Those are the features that will be introduced in our next minor/patch release.

## Nightlies

Our preview CDN is updated every night with the latest features and bug fixes, even when there was no package version update. Our playground is using the preview CDN so you can always use the playground to test out the upcoming features. In this case, the version of the engine will still state the npm version, but will include everything on the master branch.

## NPM releases

We have two flavors of releases:

- [UMD packages](/divingDeeper/developWithBjs/npmSupport)
- [ES6 packages](/divingDeeper/developWithBjs/treeShaking)

When developing please make sure to pick the one that fits your architecture. We recommend using the ES6 packages which allow your to reduce the final release's size using tree shaking.
