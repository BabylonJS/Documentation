---
title: Rendering Edges
image:
description: Learn all about the edge renderer in Babylon.js.
keywords: diving deeper, meshes, edges, edge rendering
further-reading:
video-overview:
video-content:
---

# Edges Renderer

BABYLON.EdgesRenderer is a tool used to render edges on top of a mesh. Edges are rendered between two faces if the dot product of their normals is less than epsilon.

## How to use it

![Edge Renderer](/img/edgesRenderer.jpg)

You can enable edges rendering like this:

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box1", { size: 2 }, scene);
box.enableEdgesRendering();
box.edgesWidth = 4.0;
box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
```

The `enableEdgesRendering` can be called with a custom epsilon (default value is 0.95).

```javascript
box.enableEdgesRendering(0.9999);
```

Dot product is the cosine of the angle between the vectors, so for default epsilon 0.95 the angle is acos(.95) ~= 18 degrees - so if the angle between two faces is less than that no line gets drawn.

If you need to turn-off edges rendering:

```javascript
box.disableEdgesRendering();
```

You can try edges rendering here: <Playground id="#TYAHX#10" title="Edge Rendering Example 1" description="Simple example of edge rendering."/>

If your mesh has instances, you can either use a renderer for each instance by enabling the edges rendering for each instance as explained above, or by using the source mesh renderer for all instances.

To do this, just set:

```javascript
sourceMesh.edgesShareWithInstances = true;
```

PG: <Playground id="#7BY3TM" title="Edge Rendering Example 2" description="Simple example of edge rendering."/>

## EdgesRenderer and Transparent meshes

The EdgesRenderer is the last component of a [rendering group](/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups) to be rendered, which can effect rendering when there are transparent meshes other than the one using the renderer. See this scene for an example:

![Edges rendering over transparent object](/img/features/edgesRenderer/edgesRenderer1.png)

<Playground id="#TYAHX#282" title="Edge renderer and Transparent Meshes" description="Shows the interaction between an edge renderer in an object and another, transparent, object."/>

You may notice that both the back box and the ground's edges renderers are rendering on top of the front, partially transparent mesh. That happens because the edges rendering happen after all other steps in the scene, even after the transparent (alpha blended) meshes are rendered. For more information on the rendering order of meshes, check the [Transparent Rendering](features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-order) page. There are two possible solutions to this. One is to set the transparent objects' rendering group id to a higher value than the meshes with the edges renderer:

![Solution 1](/img/features/edgesRenderer/edgesRenderer2.png)

And another is to set `forceDepthWrite = true` on the transparent material:

![Solution 2](/img/features/edgesRenderer/edgesRenderer3.png)

Note that in this case, the edges renderer won't show up behind the transparent mesh.
