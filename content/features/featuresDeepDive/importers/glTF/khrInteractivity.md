---
title: KHR_interactivity
image:
description: Learn how Babylon.js loads, validates, runs, and inspects ratified KHR_interactivity graphs.
keywords: babylon.js, gltf, KHR_interactivity, flow graph, interactive assets
further-reading:
    - title: Flow Graph Overview
      url: /features/featuresDeepDive/flowGraph
    - title: Flow Graph Editor
      url: /toolsAndResources/flowGraphEditor
video-overview:
video-content:
---

## Overview

Babylon.js supports Phase 1 of the ratified [`KHR_interactivity`](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_interactivity) glTF extension. The glTF loader validates each behavior graph, converts valid graphs to Babylon.js Flow Graphs, and runs the graph selected by the extension.

The import keeps a canonical copy of the source document alongside the executable graphs. This copy preserves graph names, declarations, types, variables, events, configurations, dynamic sockets, references, `extras`, and additional extension data. Applications and tools can inspect this data even when a graph cannot run.

## Default Runtime Behavior

When a glTF or GLB file uses `KHR_interactivity`, the loader:

- Uses the ratified specification rules to validate every graph.
- Isolates invalid graphs so other valid graphs in the same asset can still load.
- Creates a Flow Graph for each graph that can be converted.
- Starts only the valid graph selected by the root `graph` property.
- Starts no graph when the selected graph is invalid.
- Waits for interactivity import before the scene-loading promise resolves.
- Prevents the normal glTF animation auto-start step so the behavior graph can control animation playback.

An unknown core operation makes its graph invalid. An operation supplied by an unsupported additional extension is preserved as an inspectable typed no-op, but it does not execute.

## Loading And Inspecting An Interactive Asset

Load the asset through the normal scene loader, then use [`GetKHRInteractivityImportResult`](/typedoc/functions/BABYLON.GLTF2.Loader.Extensions.GetKHRInteractivityImportResult) to inspect the most recently appended interactive asset:

```typescript
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF/2.0";
import {
    GetKHRInteractivityImportResult,
    GetKHRInteractivityImportResults,
} from "@babylonjs/loaders/glTF/2.0/Extensions/KHR_interactivity";

await AppendSceneAsync("interactive.glb", scene);

const result = GetKHRInteractivityImportResult(scene);
if (result) {
    console.log("Selected graph:", result.document.defaultGraphIndex);

    for (const graphResult of result.graphs) {
        console.log(graphResult.graph.name, graphResult.graph.valid);
        console.log(graphResult.diagnostics);
    }
}

// Use this form when several interactive assets were appended to one scene.
const allResults = GetKHRInteractivityImportResults(scene);
```

The import result contains:

- `document`: the canonical source document, its selected graph, and root-level diagnostics in `document.diagnostics`.
- `graphs`: one graph result per source graph, in source order.
- `pathConverter`, `glTF`, and `hostResolver`: the import-scoped services used by the executable graphs.
- `assetIndex`: a stable, zero-based identity when several interactive assets are appended to one scene.

Each entry in `result.graphs` contains:

- `graph`: the canonical source graph, including its validity and graph-level validation diagnostics.
- `serializedFlowGraph`: the converted graph when conversion succeeded.
- `flowGraph` and `coordinator`: the runtime objects when runtime construction was enabled.
- `diagnostics`: graph-level validation, conversion, and runtime errors or warnings, with JSON pointer paths back to the source.

[`GetKHRInteractivityImportResults`](/typedoc/functions/BABYLON.GLTF2.Loader.Extensions.GetKHRInteractivityImportResults) returns every result for the scene in load order. The singular getter remains convenient, but it returns only the latest result.

The coordinators belong to the loaded scene and are disposed when that scene is disposed.

## Loader Options

Configure the extension through the glTF loader's `extensionOptions`:

```typescript
await AppendSceneAsync("interactive.glb", scene, {
    pluginOptions: {
        gltf: {
            extensionOptions: {
                KHR_interactivity: {
                    autoStart: false,
                    parseOnly: true,
                    strictValidation: true,
                },
            },
        },
    },
});
```

| Option | Default | Behavior |
| --- | --- | --- |
| `autoStart` | `true` | Starts the selected valid graph after import. Set it to `false` to create runtime graphs without starting one. |
| `parseOnly` | `false` | Keeps the canonical document and converted serializations without creating runtime Flow Graphs or coordinators. |
| `strictValidation` | `true` | Enforces the ratified specification. Set it to `false` only when a tool must inspect a pre-ratification asset. |

`parseOnly: true` takes priority over runtime construction, so `autoStart` has no effect in parse-only mode.

## Strict Validation And Compatibility

Production loading is strict by default. A graph with an invalid structure, invalid socket, unknown core operation, or other ratified contract error is rejected instead of being changed silently. The graph remains in the canonical document with source-path diagnostics, and valid sibling graphs remain available.

`strictValidation: false` is a compatibility path for older assets created before ratification. It can lower shapes that the final specification rejects. Use it for inspection or migration tools, not as the normal production setting.

## Flow Graph Editor Import

To inspect an interactive asset visually, drag its `.gltf` or `.glb` file into the [Flow Graph Editor](https://flowgraph.babylonjs.com) Scene Preview. Drop external buffers and textures with the main `.gltf` file when needed.

The editor:

- Opens every `KHR_interactivity` graph in its own tab.
- Selects the root default graph when it is executable, or the first executable graph when the default is invalid.
- Keeps invalid graphs as named empty tabs and reports their diagnostics in the log.
- Preserves imported composites, source paths, dynamic sockets, and unsupported additional-extension operations for inspection.
- Uses explicit compatibility import so pre-ratification assets can still be examined.

The editor does not currently save or reload imported `KHR_interactivity` graphs as Flow Graph JSON. These graphs depend on runtime services owned by the imported asset. Standards-compliant `KHR_interactivity` export is planned for a later phase.

## Current Scope

Phase 1 covers standards-compliant loading, execution, inspection, and editor import. It does not add `KHR_interactivity` authoring or glTF export. Keep the original glTF or GLB file as the source of truth when inspecting an imported graph in the editor.

This behavior was introduced by BabylonJS/Babylon.js#18903.
