---
title: Node Material Procedural Textures
image-url: /img/defaultImage.png
description: Learn how to create Proecedural Textures using the Node Material.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor, procedural texture
further-reading:
video-overview:
video-content:
---

## Creating Procedural textures

Starting with Babylon.js v4.2, you can now create procedural textures with the node material editor.

You need simply to change the mode to _Procedural texture_ this time:

Some blocks are made unavailable in this mode (they are hidden from the block list), as they have no meaning: the mesh, particle and animation blocks.

When you have created your procedural texture in the NME, you can create a regular `BABYLON.ProceduralTexture` instance by calling the `NodeMaterial.createProceduralTexture` method:

```javascript
const proceduralTexture = nodeMaterial.createProceduralTexture(256);
```

As always, you can also load the NodeMaterial from our snippet server:

```
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

BABYLON.NodeMaterial.ParseFromSnippetAsync("#A7A3UB#1", scene).then((nodeMaterial) => {
    const proceduralTexture = nodeMaterial.createProceduralTexture(256);

    let mat = new BABYLON.StandardMaterial();

    mat.emissiveTexture = proceduralTexture;

    ground.material = mat;
});
```

Playground: <Playground id="#8S19ZC#1" title="NME Procedural Texture Example" description="Playground example of using the Node Material Editor to create a Procedural Texture." image="/img/playgroundsAndNMEs/PGNMEProceduralTexture.jpg" isMain={true} category="Node Material"/>

You can check out this video for more information:
<Youtube id="qqMuuSM7GvI"/>
