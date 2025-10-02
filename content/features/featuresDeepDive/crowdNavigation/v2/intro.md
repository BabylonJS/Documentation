---
title: Introduction to NavigationPlugin V2
image:
description: Learn about NavigationPlugin V2
keywords: extensions, babylon.js, crowd, addons, navigation
further-reading:
video-overview:
video-content:
---

## Why are there two versions of the Navigation plugins?

V1 uses an old a not maintained javascript package which often causes issues when used with ES6 and bundlers. V1 is being deprecated.

V2 uses the remarkable [recast-navigation-js](https://github.com/isaac-mason/recast-navigation-js) library by Isaac Mason (thank you Isaac!), which is fully ES6 compliant, it's up to date and well maintained.

V2 would eventually replace V1 in the future, after it gets thouroghly tested. That's why V2 is in the `ADDONS` and not already in the `core` package. Since the two versions should be fully compatible, only the internal implementation details and the underlying Recast/Detour libraries has been changed you can easily switch to V2 without rewriting your code.

There is one change though. You need to initialize the plugin by calling an `async` factory function instead of a constructor used in V1.

## How to use the navigation plugin V2?

```javascript
const navigationPlugin = await ADDONS.CreateNavigationPluginAsync(); // uses WASM under the hood
const navigationPlugin = await ADDONS.CreateNavigationPluginWorkerAsync(); // under construction
```

This call will dynamically load the `recast-navigation-js` library and will initialize it.

### The new async createNavMeshAsync function

You can create a navmesh by calling the new async function:
```ts
const result = createNavMeshAsync(meshes: Array<Mesh>, parameters: INavMeshParametersV2): Promise<CreateNavMeshResult>;
```

Important! A worker version is not supported yet, we are working on it! In production environment you would use a pregenerated nav mesh so this should not be a issue. You can use [NavMesh generator](https://navmesh-generator.babylonjs.xyz/) to generate your nav meshes or use the `navigationPlugin.getNavmeshData(): Uint8Array` (present in V1 as well) or `navigationPlugin.getTileCacheData(): Uint8Array` (new) functions to get the nav mesh binary data. You can import the exported data using:

```ts
navigationPlugin.buildFromNavmeshData(data: Uint8Array): void
navigationPlugin.buildFromTileCacheData(tileCacheData: Uint8Array, tileCacheMeshProcess?: TileCacheMeshProcess): void
```

## ES6 example

```
npm i @babylonjs/addons @recast-navigation/core @recast-navigation/generators
```

```ts
import { CreateNavigationPluginAsync } from "@babylonjs/addons";
import * as RecastCore from "@recast-navigation/core";
import * as RecastGenerators from "@recast-navigation/generators";

await RecastCore.init();
const navigationPlugin = await CreateNavigationPluginAsync({
    instance: {
        ...RecastCore,
        ...RecastGenerators,
    },
});
```

Since you are injecting the `recast-navigation` libraries yourself, you can also use the plugin with the `NullEngine` on a server, because when an instance is injected this way, the libraries will not be loaded using an HTML <script> tag.

## Recommended links not just for first time users

Most of the functions in the navigation plugin interface are self-explanatory even for the first time user, it's recommended to get familiar with concepts at Recast: [https://recastnav.com/](https://recastnav.com/).

Since the navigation plugin V2 acts as a facade around `recast-navigation-js` it's recommended to visit recast-navigation-js [GitHub repo](https://github.com/isaac-mason/recast-navigation-js) as well.

To easily generate your NavMesh and/or TileCache use the [NavMesh generator](https://navmesh-generator.babylonjs.xyz/)



