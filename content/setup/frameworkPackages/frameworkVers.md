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

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production. The purpose of our CDN is to serve Babylon packages to developers who are learning how to use the platform and for running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

We keep the same version for all of our public repositories. Every time we release a new version, all of our public framework packages (which can be found on npmjs.com: [https://www.npmjs.com/~babylonjs](https://www.npmjs.com/~babylonjs)) will receive a new version update as well, even when they sometimes don't change. As a rule of thumb stick with the same version for all of your dependencies. This is especially important when it comes to the major version - when using babylon's core 5.X, make sure to use all other dependencies in version 5.X.

## Versioning

### Stable

Until Babylon 5.0 we took a different approach towards versioning. Our stable version was fixed for a long period of time, and our preview version was constantly updating. We have always recommended using the preview version to get the latest features.

Starting Babylon 5.0 we take a different approach towards versioning. We are releasing a new minor version each Thursday of the week from our master branch, containing the latest features and bug fixes. During the week, if a bug fix is required we will release a patched version of the framework. That means that if for example we are at version 5.1.1 at the moment, next Thursday will introduce version 5.2.0. It is possible that until then we will release 5.1.2 or even 5.1.3. We don't update older minor versions. 5.1.1 will not include bug fixes that were introduced in 5.2.0. We recommend using the carret (`^`) when setting the framework version in your package.json. This way you will always get the latest of this major version.

We guarantee **no breaking changes** in our public API between minor versions. Breaking changes will be introduced between major versions. The only time we might introduce breaking changes is when a the browsers introduced a change in their API that forces us to change our API. As we usually abstract our APIs this rarely happens.

## Changelog

To see what changed in each version you can take a look at our changelog on the main repository. It is located at [https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md](https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md) as is updated on every publish to npm. When updated outside of the update process (possible in certain cases) unreleased features will be included in the "upcoming" version. Those are the features that will be introduced in our next minor/patch release.

## Nightlies

Our preview CDN is updated every night with the latest features and bug fixes, even when there was no package version update. Our playground is using the preview CDN so you can always use the playground to test out the upcoming features. In this case, the version of the engine will still state the npm version, but will include everything on the master branch.

## NPM releases

We have two flavors of releases:

- [UMD packages](/setup/frameworkPackages/npmSupport)
- [ES6 packages](/setup/frameworkPackages/es6Support)

When developing please make sure to pick the one that fits your architecture. We recommend using the ES6 packages which allow your to reduce the final release's size using tree shaking.

## CDN Current Versions

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production. The purpose of our CDN is to serve Babylon packages to developers who are learning how to use the platform and for running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

### Direct Usage of Packages

These packages can be imported directly from the CDN, as needed, using

```javascript
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/babylon.max.js"></script>

<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js"></script>

<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.js"></script>

<script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
<script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js"></script>

<script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
<script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js"></script>

<script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
<script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.js"></script>

<script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>
<script src="https://cdn.babylonjs.com/gui/babylon.gui.js"></script>

<script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
<script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js"></script>

<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.max.js"></script>
```

### View Packages

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production.

**Babylon.js Core**  
Minimum Version - [https://cdn.babylonjs.com/babylon.js](https://cdn.babylonjs.com/babylon.js)  
Readable Version - [https://cdn.babylonjs.com/babylon.max.js](https://cdn.babylonjs.com/babylon.max.js)

**Babylon.js Supported Advanced Materials**  
Minimum Version - [https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js](https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js)  
Readable Version - [https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js](https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js)

**Babylon.js All Official Loaders (OBJ, STL, glTF)**  
Minimum Version - [https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js](https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js)  
Readable Version - [https://cdn.babylonjs.com/loaders/babylonjs.loaders.js](https://cdn.babylonjs.com/loaders/babylonjs.loaders.js)

**Babylon.js Post Processes**  
Minimum Version - [https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js](https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js)  
Readable Version - [https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js](https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js)

**Babylon.js Procedural Textures**  
Minimum Version - [https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js)  
Readable Version - [https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js)

**Babylon.js Scene/Mesh Serializers**  
Minimum Version - [https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js](https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js)  
Readable Version - [https://cdn.babylonjs.com/serializers/babylonjs.serializers.js](https://cdn.babylonjs.com/serializers/babylonjs.serializers.js)

**Babylon.js GUI**  
Minimum Version - [https://cdn.babylonjs.com/gui/babylon.gui.min.js](https://cdn.babylonjs.com/gui/babylon.gui.min.js)  
Readable Version - [https://cdn.babylonjs.com/gui/babylon.gui.js](https://cdn.babylonjs.com/gui/babylon.gui.js)

**Babylon.js Inspector**  
Minimum Version - [https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js](https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js)  
Readable Version - [https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js](https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js)

**Babylon.js Viewer**  
Minimum Version - [https://cdn.babylonjs.com/viewer/babylon.viewer.js](https://cdn.babylonjs.com/viewer/babylon.viewer.js)  
Readable Version - [https://cdn.babylonjs.com/viewer/babylon.viewer.max.js](https://cdn.babylonjs.com/viewer/babylon.viewer.max.js)
