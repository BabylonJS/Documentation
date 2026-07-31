---
title: Adding mesh assets
image: 
description: Understanding how to add and manage meshes in a Babylon.JS Editor project
keywords: editor, workspace, assets, mesh
further-reading:
video-overview:
video-content:
---

## Adding Meshes To The Scene

To add a new mesh (or hierarchy of meshes, depending on the nature of the source file) to the scene, simply
drag and drop the source file on the preview panel. The mesh(es) will be added where the source file has been
dropped.

When adding meshes to the scene, all skeletons, geometries and materials will be loaded and instantiated in the scene.

Because materials are packed into source files, each material that does not already exist in the assets is created as a `.material` file.

![AddingMeshes](/img/extensions/Editor/AddingMeshes/adding-meshes.webp)

## Updating Existing Meshes

Meshes can be updated even if they were created using an older version of their source files.
Once a source mesh file (.babylon, .fbx, etc.) has been updated in the assets, `right-click the mesh file` and
select `"Update References"`.

Meshes can be updated by:
* Choosing which component to update (geometry, material, skeleton)
* Forcing all components to update (geometry(ies), material(s), and skeleton(s))

![UpdatingReferences](/img/extensions/Editor/AddingMeshes/updating-references.webp)

## Examining Meshes

At any time, `double-clicking a mesh file` in the assets browser opens a new window (or a tabbed window on macOS)
to examine a mesh source file.

Once loaded, the Babylon.JS Inspector appears to inspect the mesh(es) available in the source file.
You can refer to [the inspector documentation](https://doc.babylonjs.com/toolsAndResources/tools/inspector]) to understand how to use the Babylon.JS Inspector.

![ExaminingAsset](/img/extensions/Editor/AddingMeshes/examining-asset.webp)

## Cleaning Assets
To let users manage their own assets, the Editor never removes unused assets unless asked to do so. This means that when you update meshes, old materials and textures remain available in the assets panel. Do not forget to clear unused assets (for example, unused materials and then unused textures) to keep the project clean if you are sure the old assets are no longer needed.
