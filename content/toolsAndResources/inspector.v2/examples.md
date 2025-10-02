---
title: Examples
image:
description: Inspector V2 extensibility examples.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
video-overview:
video-content:
---

Following are a number of concrete examples showing how to extend Inspector V2.

<Alert severity="info">
The code is shown by default for each example, but you can **drag the divider on the right towards the left to reveal a live demo of the example**. Be patient as it will take a few seconds for the live demo to load!
</Alert>

## Side Panes

This example demonstrates how to add an entirely new side pane (along side Scene Explorer, Properties, etc.).

In this example, the new left side pane intercepts messages from Babylon's `Logger` class and displays them in the side pane. Look for a new tab icon that looks like a document next to the Scene Explorer tab icon in the upper left.

<CodeSandbox id="5r44gx" title="Inspector V2 - Adding a Side Pane" />

## Toolbar Items

This example demonstrates how to add an item to the toolbar.

For this example, assume that limiting draw calls is critical for your project, and so you want to have a persistent draw call count with some coloring that makes it very clear when your draw call count is surpassing some thresholds you have defined. This example adds a draw call count to the bottom toolbar, and for demonstration purposes animates the camera away from the model so more and more meshes are in the view frustum and not culled, thereby increasing the draw call count. Look in the lower right corner for a draw call count that increases as the camera moves, and the color changes to draw attention to the high draw call count.

<CodeSandbox id="jpzd28" title="Inspector V2 - Adding a Toolbar Item" />

## Scene Explorer

This example demonstrates adding a section to Scene Explorer. Note that Scene Explorer itself is a side pane, and uses `IShellService` just like the first example on this page to add itself as a new side pane, and it additionally exposes its own extensibility points to allow new sections (and commands) to be added to Scene Explorer.

In this example, the project specific code uses `AssetContainer`s, and the goal is to list those `AssetContainer`s in Scene Explorer to make it easy to understand which ones are currently loaded. Look in the Scene Explorer pane and you will see a new section at the top labeled "Asset Containers".

<Alert severity="info">
Adding entities to Scene Explorer only is of limited value, since you don't see any useful properties when you select it. In the next section, we'll add properties for our model objects to make the extension more useful!
</Alert>

<CodeSandbox id="695j5p" title="Inspector V2 - Adding a Scene Explorer Section" />

## Properties

This example demonstrates how to add a section to the Properties pane.

Specifically, it builds on the previous example and adds properties for our model object. It creates sections for meshes, skeletons, and textures. Each of these sections lists the entities (meshes, skeletons, textures) that were loaded for this model, and links to the entity to select it (to show it in Scene Explorer and the Properties pane). It also adds a property to the existing "General" section of `Mesh`es that links back to the owning model. The idea here is that this would probably be useful if you make heavy use of `AssetContainer`s (e.g. by loading glTF models) and want to be able to understand which models contributed which entities to the scene.

<CodeSandbox id="8k76r3" title="Inspector V2 - Adding to the Properties Pane" />

## Custom Extensibility

All of the examples so far only *consume* other services to add new functionality. You can also *produce* services that can be consumed by other services. The services you produce can provide state or functionality or extension points.

This example demonstrates how to produce a new service that can be consumed by other services.

Specifically, it builds on the earlier example showing the draw call count in the bottom toolbar by making the warning/danger thresholds configurable in the Settings pane. A second `ServiceDefintion` is added that adds a new section to the Settings pane, and the *produces* a service (`IGraphicsBudgetService`) that simply exposes these thresholds and an `Observable` that fires when they change. Then, the draw calls toolbar item service consumes this new `IGraphicsBudgetService` to determine when it should show the warning/danger colors for the draw call count. You could imagine other services (e.g. other parts of the UI) also consuming the `IGraphicsBudgetService` (for example, you could have the properties pane show a warning/danger indicator for a `Mesh` if it exceeds a vertex count threshold).

<CodeSandbox id="hvmtjn" title="Inspector V2 - Producing a Service" />

## Dynamic Extensions

All of the examples so far have demonstrated [static](/toolsAndResources/inspectorv2/architecture#static-extensions) extensions where new `ServiceDefinition`s are loaded immediately upon the call to `ShowInspector`. It's also possible to defer loading of an extension until a user explicitly installs it via Inspector's extensions dialog. These are called [dynamic](/toolsAndResources/inspectorv2/architecture#dynamic-extensions) extensions.

This example modifies the previous example by making the graphics budget service and draw call toolbar item collectively a dynamic extension that must be installed before it is loaded. Notice in the example below there is a second tab, `graphicsBudgetService.tsx`. This contains the default export that is needed for the `getExtensionModuleAsync` function to work correctly.

<CodeSandbox id="98pthf" title="Inspector V2 - Dynamic Extension" files="/src/index.tsx,/src/graphicsBudgetService.tsx" />
