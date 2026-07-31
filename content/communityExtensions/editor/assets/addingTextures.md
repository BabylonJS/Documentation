---
title: Adding texture assets
image: 
description: Understanding how to add and manage textures in a Babylon.JS Editor project
keywords: editor, workspace, assets, texture
further-reading:
video-overview:
video-content:
---

## Applying Textures to Materials

Textures available in the assets browser can be applied to materials.
By default, textures available in the assets browser are not instantiated in the scene.

To instantiate textures in the scene and use them on materials, simply drag and drop the texture assets
into the appropriate list boxes in the inspector.

In the inspector, all list boxes related to textures (for example, `Environment Texture` in the scene inspector) support
drag and drop from the assets browser.

![ApplyTextureMaterialInspector](/img/extensions/Editor/AddingTextures/apply-material-inspector.webp)

## Cloning Textures

Multiple instances of the same texture file can be created using the `Assets` panel.

Once a texture has been instantiated, it appears in the assets panel. Simply right-click the texture and select
`Clone...`. Enter the name of the texture instance to create, and a new instance sharing the same texture file
is created and available in the assets panel.

As in the Assets Browser panel, textures from the assets panel can be dragged and dropped.

![CloningTexture](/img/extensions/Editor/AddingTextures/cloning-texture.webp)

## Editing A Texture

To edit a texture, simply click it in the `Assets Browser` panel or `Assets` panel.
Once a texture has been clicked, the inspector is updated to show the editable properties of the clicked texture.

In the assets browser, if a texture file has multiple instances, a menu appears so you can select the texture instance
to edit in the inspector.

![EditingTexture](/img/extensions/Editor/AddingTextures/editing-texture.webp)
