---
title: Introduction - Chapter 2 - Combining Meshes
image: 
description: Continue your Babylon.js learning by combining meshes in your scene.
keywords: getting started, start, chapter 2, combine, combine meshes, merge
further-reading:
    - title: More on Merging Meshes
      url: /features/divingDeeper/mesh/mergeMeshes
video-overview:
video-content:
---

# Introduction - Combining Meshes

## Combining Meshes Using Merge Meshes
This is a straight forwarded way of combining two or more meshes.

```javascript
const combined = BABYLON.Mesh.MergeMeshes(Array_of_Meshes_to_Combine)
```
In our case this would be
```javascript
const house = BABYLON.Mesh.MergeMeshes([box, roof])
```
<Playground id="#KBS9I5#75" title="Combining Meshes In Your Scene" description="A playground demonstrating how to combine meshes inside of your scene." image="/img/playgroundsAndNMEs/gettingStartedCombineMeshes.jpg"/>

![house 5](/img/getstarted/house5.png)

The first thing we note is that the whole house is covered in only one of the materials used. Fortunately this can be corrected using the multiMultiMaterial parameter of *MergeMeshes*, unfortunately this is the final parameter of a long list. The code now looks like
```javascript
const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
```
At this stage it is important to note that the second parameter being true disposes of the original meshes and the last parameter being true allows the original material to be applied separately to the parts matching the original meshes.

<Playground id="#KBS9I5#76" title="Combining Meshes And Preserving Material Assignments" description="A playground demonstrating how to combine meshes while preserving material assignments." image="/img/playgroundsAndNMEs/gettingStartedCombineMeshes2.jpg"/>

![house 3](/img/getstarted/house3.png)

Before considering how to make multiple copies of our house we will first: find out the basics of [exporting](/toolsAndResources/glTFExporter) our models; how to [import](/features/divingDeeper/importers) models made with Babylon.js or other software; and how to display your scene or models on your own website.