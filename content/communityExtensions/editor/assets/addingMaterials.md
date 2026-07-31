---
title: Adding material assets
image: 
description: Understanding how to add and manage materials in a Babylon.JS Editor project
keywords: editor, workspace, assets, material
further-reading:
video-overview:
video-content:
---


## Introduction

Materials are considered to be assets and are available in the `Assets Browser` panel once they are created.

To create a material, use the Assets Browser panel toolbar `Add -> Materials -> ...`.

Common materials `Standard`, `PBR`, and `Node` are supported, as well as most of the available materials from
the [Materials Library](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary).
Once a material has been added to the assets, its preview (thumbnail) is created automatically.

![CreatingMaterial](/img/extensions/Editor/AddingMaterials/creating-material.webp)

## Assigning a Material

To assign a material to a mesh, simply drag and drop the material asset from the assets browser onto the mesh in
the preview panel or in the inspector.

Once a material asset has been dropped, if the material has not been previously instantiated, the editor creates its instance automatically. If the material has already been instantiated, the existing reference is assigned to the mesh.

Example of dragging and dropping a material asset onto a mesh in the `Preview Panel`:

![DropInPreview](/img/extensions/Editor/AddingMaterials/drop-in-preview.webp)

Example of selecting a mesh in the graph or scene and dragging and dropping a material asset into
the inspector's `Material` field:

![DropInInspector](/img/extensions/Editor/AddingMaterials/drop-in-inspector.webp)

## Editing a Material

To edit a material, simply click the material in the `Assets Browser` panel or `Assets` panel.
Once clicked, the inspector is updated to show the editable properties of the material.

If the material has not been instantiated, assign it to a mesh first. Otherwise, the inspector will not be populated because the material instance cannot be found.

![EditingMaterial](/img/extensions/Editor/AddingMaterials/editing-material.webp)

## Refreshing Thumbnails

To save performance in the Editor, material thumbnails are not updated continuously. If, for example, one or more texture assets have changed, the thumbnail will not necessarily be updated.

To update material thumbnails, simply select the materials in the assets browser, `right-click` them,
and select `Refresh Preview`.

![RefreshingThumbnails](/img/extensions/Editor/AddingMaterials/refreshing-thumbnails.webp)
