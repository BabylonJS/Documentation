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

Babylon.js comes in two versions: the preview version and the stable version. They differ in the following ways:

- The preview version is a work-in-progress version of the engine. Even though we do our best never to introduce backward-compatibility issues, it sometimes includes breaking changes.
- The stable version is our latest build from the master branch.

Both versions are considered stable and can be used in production. In some cases, if no new features have been introduced that we want to keep off the stable branch, the preview and stable versions are identical.

Both versions have their own CDN endpoint. The preview version is available on [preview.babylonjs.com](https://preview.babylonjs.com) and the stable version is available on [cdn.babylonjs.com](https://cdn.babylonjs.com).

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

We keep the same version for all of our public repositories. Every time we release a new version, all of our public framework packages (which can be found on npmjs.com: [https://www.npmjs.com/~babylonjs](https://www.npmjs.com/~babylonjs)) receive a version update as well, even if some packages have not changed. As a rule of thumb, stick with the same version for all of your dependencies. This is especially important for the major version: when using Babylon core 5.x, make sure all other dependencies are also version 5.x.

## Versioning

### Stable

Until Babylon 5.0, we took a different approach to versioning. Our stable version remained fixed for a long period, while our preview version was updated constantly. We always recommended using the preview version to get the latest features.

Starting with Babylon 5.0, we took a different approach to versioning. We release a new minor version each Thursday from our master branch, containing the latest features and bug fixes. During the week, if a bug fix is required, we release a patch version of the framework. That means that if, for example, the current version is 5.1.1, next Thursday introduces version 5.2.0. Before then, we may release 5.1.2 or even 5.1.3. We do not update older minor versions, so 5.1.1 will not include bug fixes introduced in 5.2.0. We recommend using the caret (`^`) when setting the framework version in your package.json. This way, you will always get the latest release within that major version.

We guarantee **no breaking changes** in our public API between minor versions. Breaking changes are introduced between major versions. The only time we might introduce breaking changes between minor versions is when browsers introduce a change in their API that forces us to change ours. Because we usually abstract our APIs, this rarely happens.

## Changelog

To see what changed in each version, take a look at our changelog in the main repository. It is located at [https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md](https://github.com/BabylonJS/Babylon.js/blob/master/CHANGELOG.md) and is updated on every publish to npm. When it is updated outside the publish process, which can happen in some cases, unreleased features are included in the "upcoming" version. These are the features that will be introduced in our next minor or patch release.

## Nightlies

Our preview CDN is updated every night with the latest features and bug fixes, even when there was no package version update. Our playground is using the preview CDN so you can always use the playground to test out the upcoming features. In this case, the version of the engine will still state the npm version, but will include everything on the master branch.

## NPM releases

We have two flavors of releases:

- [UMD packages](/setup/frameworkPackages/npmSupport)
- [ES6 packages](/setup/frameworkPackages/es6Support)

When developing, please make sure to pick the one that fits your architecture. We recommend using the ES6 packages, which allow you to reduce the final release size through tree shaking.

## CDN Current Versions

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

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

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

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
