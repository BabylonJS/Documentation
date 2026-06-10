---
title: Smart Assets
image:
description: A scene-level registry that maps stable keys to asset URLs so models, textures, and materials can be reloaded, swapped, and persisted independently of the runtime objects they create.
keywords: babylon.js, tools, resources, inspector, smart assets, smartassetmanager, asset map, babylonproj
further-reading:
    - title: Override Manager
      url: /toolsAndResources/inspectorv2/overrideManager
    - title: Project Files (.babylonproj)
      url: /toolsAndResources/inspectorv2/projectFile
video-overview:
video-content:
---

## What are Smart Assets?

The **Smart Asset Manager** (SAM) is a per-scene registry that maps stable string *keys* to asset *URLs*, and tracks every runtime object that each load produced. Once an asset is loaded through SAM, you can ask the registry for it by key, swap its URL, reload it from disk, or unload it — without having to chase down references in `scene.meshes`, `scene.textures`, and so on.

SAM is the foundation that the Inspector V2 [Override Manager](/toolsAndResources/inspectorv2/overrideManager) and the [`.babylonproj`](/toolsAndResources/inspectorv2/projectFile) project file format are built on, but it's a standalone API in `@babylonjs/core` and useful on its own for any code that needs a stable, named handle to an external asset.

Use Smart Assets when you want to:

- Treat external models and textures as **named addressable resources** instead of opaque URLs.
- Allow assets to be **swapped or hot-reloaded** at runtime without manually disposing the objects they created.
- Resolve assets by key when you do **not** control how they were loaded (e.g. they were brought in by a glTF) but you still want a per-asset handle.
- Persist a scene's asset list as a portable, declarative JSON manifest.

The SAM API is a set of module-level functions on `BABYLON`. There is no class to `new` — the per-scene manager is created lazily the first time you touch the API, and lives on `scene.metadata` under a private symbol.

## Quick start

This playground registers a glTF and a standalone texture under stable keys, then opens the Inspector V2 **Project Authoring** (Smart Assets) pane and runs a timed tour of the API — reload, add-and-bind a texture, unload, reload, swap a URL, and remove — so you can watch the **Assets** list update live. Open the developer console to follow each step.

<Playground id="#CNWWA5#0" title="Smart Assets - Basics" description="Register, load, bind, reload, swap, and remove assets while watching the Inspector Smart Assets pane." />

The pattern is intentionally minimal:

```javascript
// No GetSmartAssetManager() call is needed — the per-scene manager is created
// lazily the first time you load (or register) an asset.

// Register + load a glTF in one call. Returns the AssetContainer.
await BABYLON.LoadSmartAssetAsync(scene, "boombox", "https://playground.babylonjs.com/scenes/BoomBox/BoomBox.gltf");

// Register + load a standalone texture (routed to Texture / CubeTexture / HDRCubeTexture by extension).
const env = await BABYLON.LoadSmartAssetTextureAsync(scene, "envmap", "https://playground.babylonjs.com/textures/environment.env");
scene.environmentTexture = env;
```

## Core API

All SAM functions are top-level exports from `@babylonjs/core` (also reachable as `BABYLON.*` in the Playground).

### Scene-file assets

| Function | Purpose |
| --- | --- |
| `RegisterSmartAsset(scene, key, url, options?)` | Add an entry to the registry without loading it. Use this when you want to declare an asset up front and load it later. |
| `LoadSmartAssetAsync(scene, key, url?, options?)` | Register (if a URL is supplied) and load a scene-file asset (glTF, OBJ, .babylon...). Returns the `AssetContainer`. Repeating the call with the same URL is a cache hit. |
| `UnloadSmartAssetAsync(scene, key)` | Dispose the loaded objects for a key but keep the registry entry. |
| `ReloadSmartAssetAsync(scene, key)` | Unload and re-load the asset, optionally fetching fresh bytes via a `reloadSource` callback. |
| `RemoveSmartAssetAsync(scene, key)` | Unload **and** remove the key from the registry. |
| `LoadAllSmartAssetsAsync(scene)` | Concurrently load every registered key that hasn't been loaded yet. Used by [project file](/toolsAndResources/inspectorv2/projectFile) load. |

### Standalone textures

```javascript
const texture = await BABYLON.LoadSmartAssetTextureAsync(scene, "albedo", "https://playground.babylonjs.com/textures/bloc.jpg");
```

SAM routes texture URLs to the correct loader based on file extension: `.env` and `.dds` go through `CubeTexture`, `.hdr` through `HDRCubeTexture`, everything else through `Texture`. The set of recognized texture extensions is exposed by `BABYLON.GetSmartAssetTextureExtensions()`.

When a texture key doesn't already have a `displayName`, SAM sets it to the key. This is why textures loaded from `blob:` URLs (e.g. user-uploaded files) still show a human-readable name in the Scene Explorer and material slot pickers instead of an opaque URL.

### Querying the registry

| Function | Purpose |
| --- | --- |
| `GetSmartAssetManager(scene)` | Returns (and lazily creates) the manager for a scene. |
| `GetAllSmartAssets(scene)` | A read-only `Map<key, url>` of every registered entry. |
| `FindSmartAssetKeyForObject(scene, object)` | Reverse lookup: returns the key that owns a runtime `Node` / `Material` / `BaseTexture` / `AnimationGroup`, or `undefined` if the object was created locally. |
| `AddSmartAssetManagerCreatedObserver(callback)` | Notified once for each new manager (useful for inspector services). |

The manager itself exposes:

- `sam.scene` — the owning scene.
- `sam.onChangedObservable` — fires on every registration, load, unload, reload, or remove. Subscribe to keep UI in sync.
- `sam.onAssetNotFound` — see [the fallback section below](#recovering-from-missing-assets).

## Declarative asset maps

Instead of registering assets one at a time, you can describe the whole set as a small JSON document and load it in one shot:

```json
{
    "version": 1,
    "assets": {
        "boombox": { "url": "BoomBox/BoomBox.gltf" },
        "buggy":   { "url": "Buggy/glTF/Buggy.gltf" },
        "envmap":  { "url": "https://playground.babylonjs.com/textures/environment.env", "type": "texture" }
    }
}
```

`LoadSmartAssetMapAsync` accepts a URL (fetched as JSON), a `File` (typically user-dragged), or a pre-parsed object. Relative URLs are resolved against the optional `rootUrl` argument; absolute, `data:`, and `blob:` URLs are used as-is, so you can mix and match. Entries can declare a loader `type` (e.g. `"texture"`), an explicit `extension` (useful for blob URLs that have no recognizable filename), or arbitrary user-defined `metadata`.

`SerializeSmartAssetManagerMap(scene, baseUrl?)` rebuilds the same document from the live registry, so the format round-trips cleanly. Pass a `baseUrl` to relativize URLs that share its prefix.

Asset maps are also the asset layer of the [`.babylonproj`](/toolsAndResources/inspectorv2/projectFile) project file format; the project file just adds an overrides section and a companion `.babylon` for user-created objects on top of the same JSON.

## Binding textures to materials

SAM-tracked textures keep their identity across reloads, so the natural pattern for assigning a texture to a material slot is to look it up by key rather than by URL or by index into `scene.textures`:

```javascript
const findTexture = (key) =>
    scene.textures.find((t) => BABYLON.FindSmartAssetKeyForObject(scene, t) === key);

const mat = new BABYLON.PBRMaterial("paintMat", scene);
mat.albedoTexture = findTexture("albedo");
```

Re-registering the same key with a new URL atomically swaps the underlying texture; bindings made through the helper above pick up the new texture without any extra work.

<Playground id="#ETJUZH#0" title="Smart Assets - Textures and Material Binding" description="Load textures via SAM and bind them to PBR material slots." />

This is the exact pattern the `.babylonproj` loader uses to re-attach user-authored materials to SAM-tracked textures after a round trip — see [Project Files](/toolsAndResources/inspectorv2/projectFile#companion-babylon-and-texture-bindings).

## Recovering from missing assets

If a registered URL fails to load (404, dead `blob:` URL backed by a closed `FileSystemFileHandle`, moved local file, ...), SAM calls the optional `onAssetNotFound` callback. Return a replacement URL string or `File` object to retry, or `null` to give up.

```javascript
const sam = BABYLON.GetSmartAssetManager(scene);

sam.onAssetNotFound = async (key, expectedUrl) => {
    console.warn(`"${key}" not found at ${expectedUrl}`);
    if (key === "hero") {
        // A real editor might prompt the user to pick a file here.
        return "https://playground.babylonjs.com/scenes/BoomBox/BoomBox.gltf";
    }
    return null;
};
```

The retry also **rewrites the registry**, so subsequent reloads use the resolved URL directly. This is what makes a `.babylonproj` resilient to being reopened on a machine where the user's local file paths have changed.

You don't have to build the file-picker UI yourself. Inspector V2 ships a ready-made missing-asset prompt — assign `inspectorAssetNotFoundHandler` (or call `installInspectorAssetNotFoundHandler(sam)`, both public `@babylonjs/inspector-v2` exports) and a failed load shows a *"Locate the file or click Skip"* dialog with a native file picker; the chosen file is returned to SAM as the replacement. This is exactly how the Inspector's [Project Authoring](/toolsAndResources/inspectorv2/projectFile) pane wires `onAssetNotFound`, and any app that opens Inspector V2 can reuse it:

```javascript
// Requires Inspector V2 to be open (it hosts the prompt).
sam.onAssetNotFound = BABYLON.INSPECTOR.inspectorAssetNotFoundHandler;
```

The playground below uses this built-in prompt: when the broken URL fails, click **Locate File…** and pick any `.glb`/`.gltf` (or Skip).

<Playground id="#L83X13#0" title="Smart Assets - onAssetNotFound Fallback" description="Recover from a broken asset URL using the Inspector's built-in file-picker prompt." />

## How SAM tracks runtime objects

When `LoadSmartAssetAsync` returns, every `Node`, `Material`, `BaseTexture`, `AnimationGroup`, `Light`, and `Camera` in the resulting `AssetContainer` is associated with the asset's key via an internal `WeakMap`. That's what makes `FindSmartAssetKeyForObject` cheap and lets `UnloadSmartAssetAsync` cleanly dispose only the objects a particular asset produced.

The manager itself is stored on `scene.metadata` under a private `Symbol`, so it's invisible to `Object.values` / `JSON.stringify` (and doesn't accidentally appear in the Inspector's metadata viewer or create a cycle when scenes are serialized).

When the scene is disposed, the manager unloads everything it owns and detaches itself automatically.

## Tree-shaking notes

SAM is fully tree-shakeable. The manager module has no top-level side effects: importing `GetSmartAssetManager` alone does **not** pull in texture loaders, scene-file loaders, the asset-map serializer, or anything else. Each function in the API table above lives in its own export, so an application that only needs `LoadSmartAssetTextureAsync` does not pay for the rest.

## Related

- [Override Manager](/toolsAndResources/inspectorv2/overrideManager) — persistent property diffs that work alongside SAM-tracked assets.
- [Project Files (.babylonproj)](/toolsAndResources/inspectorv2/projectFile) — the on-disk format that composes a SAM map, overrides, and a companion `.babylon` for user-created scene content.
