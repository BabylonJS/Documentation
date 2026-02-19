---
title: Inspector V2
image:
description: Learn all about the incredibly powerful debug layer called "The Inspector" in Babylon.js.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
    - title: Inspector V1
      url: /toolsAndResources/inspector
video-overview:
video-content:
---

The Babylon.js Inspector is a diagnostic tool that makes it possible to inspect and manipulate a scene in real time. Fundamentally this includes a hierarchical view of the scene and properties of individual entities within the scene (like nodes, meshes, materials, etc.), as well as many additional features that are detailed later in this documentation.

The Inspector is included in Babylon tools like [Playground](/toolsAndResources/thePlayground) and [Sandbox](/toolsAndResources/sandbox) and can be toggled on or off with buttons in their toolbars.

The Inspector is also available as an API to be used in your own projects, which can be found in the [@babylonjs/inspector](https://www.npmjs.com/package/@babylonjs/inspector) package.

Following is a basic example showing how to attach Inspector to a Babylon scene.

<CodeSandbox id="msdvk8" title="Inspector V2 - Intro" height="600px" />

## Extensibility

Inspector V2 is highly extensible. When using the API, you can easily add new features that are unique to your Babylon project. Additionally, Inspector supports dynamically installed extensions that are scenario specific. This helps keep the core Inspector small and prevents the UI from being overwhelming. You can think of this just like Visual Studio Code (for example), where you only install the extensions that add optional features for the scenarios that are important to you. You can learn more in the [Extensibility API](/toolsAndResources/inspectorv2/extensibilityAPI) and [Examples](/toolsAndResources/inspectorv2/examples) sections.

## Backward Compatibility

Inspector V2 aims to be backward compatible with Inspector V1, and also have feature parity with Inspector V1, except in a few cases where APIs or features are mostly unused in Inspector V1. This also means that much of the [Inspector V1 documentation](/toolsAndResources/inspector) is still valid and useful, though for screenshots and videos you may have to map older UX to newer UX.
