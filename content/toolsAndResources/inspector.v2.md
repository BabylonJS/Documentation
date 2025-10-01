---
title: Inspector V2
image:
description: Learn all about the incredibly powerful debug layer called "The Inspector" in Babylon.js.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
video-overview:
video-content:
---

The Babylon.js Inspector is a diagnostic tool that makes it possible to inspect and manipulate a scene in real time. Fundamentally this includes a hierarchical view of the scene and properties of individual entities within the scene (like nodes, meshes, materials, etc.), as well as many additional features that are detailed later in this documentation.

The Inspector is included in Babylon tools like [Playground](/toolsAndResources/thePlayground) and [Sandbox](/toolsAndResources/sandbox) and can be toggled on or off with buttons in their toolbars.

The Inspector is also available as an API to be used in your own projects, which can be found in the [@babylonjs/inspector](https://www.npmjs.com/package/@babylonjs/inspector) package.

<Alert severity="warning">
Currently Inspector V2 is in preview, and so you must view and install a `@preview` version of the package to try V2 (otherwise you will be using the legacy V1). For example: https://www.npmjs.com/package/@babylonjs/inspector/v/8.29.0-preview
</Alert>

Following is a basic example showing how to attach Inspector to a Babylon scene.

<CodeSandbox id="msdvk8" title="Inspector V2 Intro" height="600px" />

## Extensibility

Inspector V2 is highly extensible. When using the API, you can easily add new features that are unique to your Babylon project. Additionally, Inspector supports dynamically installed extensions that are scenario specific. This helps keep the core Inspector small and prevents the UI from being overwhelming. You can think of this just like Visual Studio Code (for example), where you only install the extensions that add optional features for the scenarios that are important to you. You can learn more in the [Examples](/toolsAndResources/inspectorv2/examples) section.
