---
title: Node Material Post Processes
image-url: /img/defaultImage.png
description: Learn how to create custom Post Process effects using the Node Material.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor, post process
further-reading:
video-overview:
video-content:
---

## Creating Post Processes with Node Materials

Starting with Babylon.js v4.2, you can now create post processes with the node material editor.

You need simply to change the mode to _Post Process_:

![PostProcess choice](/img/how_to/Materials/postprocessMenu.png)

In this mode, the special block **CurrentScreen** corresponds to the frame buffer that will be passed to your post process when you use this material as a post process in a real scenario. You can load any texture you want, it's simply an helper for you to see how your post process will render in the end.

Some blocks are made unavailable in this mode (they are hidden from the block list), as they have no meaning: the mesh, particle and animation blocks.

When you have created your post process material in the NME, you can create a regular `BABYLON.PostProcess` instance by calling the `NodeMaterial.createPostProcess` method:

```javascript
const postProcess = nodeMaterial.createPostProcess(camera);
```

You can also update an existing post process:

```javascript
const myPostProcess = new BABYLON.PostProcess(...);
...
nodeMaterial.createEffectForPostProcess(myPostProcess);
```

PG: <Playground id="#WB27SW#1" title="NME Post Process Playground Example" description="Playground example of using the Node Material Editor to create a Post Process effect." image="/img/playgroundsAndNMEs/PGNMEPostProcess.jpg" isMain={true} category="Node Material"/>

As for regular node materials, you can access the blocks programmatically and change their values:

Base material: <Playground id="#WB27SW#4" title="NME Post Process Base Node Material" description="Playground example of a NME Post Process Base Material." image="/img/playgroundsAndNMEs/PGNMEPostProcessBaseMaterial.jpg"/>

Programmatically updated material: <Playground id="#WB27SW#3" title="NME Post Process Base Material Modification" description="Playground example of modifying a base Post Process material programmatically." image="/img/playgroundsAndNMEs/PGNMEPostProcessBaseMaterialModification.jpg"/>