---
title: Hotspot
image: 
description: Learn how compute hotspot on deformed meshes
keywords: diving deeper, meshes, hotspot
further-reading:
video-overview:
video-content:
---

# Hotspot

Hotspot is a feature designed to compute world space positions within the triangles of deformed geometry. For instance, it can calculate the center of a triangle on a mesh that is being deformed by an animated skeleton. This world space position can then be projected onto the screen, creating a 2D Hotspot. This allows certain areas of an animated mesh to be made more visible to the user.

## Getting an hotspot

Simple example of a hotspot :
```javascript
const hotspotQuery = {pointIndex:[6527,6526,6525],barycentric:[0.723, 0.079, 0.196]};
BABYLON.GetHotSpotToRef(mesh, hotspotQuery, worldPosition);
```

`pointIndex` represents to 3 vertices used to compute the transformed triangle. Usually, it corresponds to a real rendered triangle indices.
`barycentric` is the barycentric coordinates of the hotspot point in the triangle composed by `pointIndex`.

## Getting hotspot query values

Scene picking queries provide everything needed. To fill a query object, first pick inside the displayed scene.

```javascript
const pickResult = scene.pick(scene.pointerX, scene.pointerY);
if (pickResult.hit) {
    const indices = pickResult.pickedMesh.getIndices();
    const base = pickResult.faceId * 3;
    hotspotQuery.pointIndex[0] = indices[base];
    hotspotQuery.pointIndex[1] = indices[base+1];
    hotspotQuery.pointIndex[2] = indices[base+2];
    hotspotQuery.barycentric[0] = pickResult.bu;
    hotspotQuery.barycentric[1] = pickResult.bv;
    hotspotQuery.barycentric[2] = 1 - pickResult.bu - pickResult.bv;
    hotspotQuery.meshIndex = scene.meshes.indexOf(pickResult.pickedMesh);
}	
```

## Projecting hotspot to get 2D values

This works for any world coordinate, not just hotspots.

```javascript
const renderWidth = engine.getRenderWidth();
const renderHeight = engine.getRenderHeight();

const viewportWidth = camera.viewport.width * renderWidth;
const viewportHeight = camera.viewport.height * renderHeight;
const viewport = new BABYLON.Viewport(0, 0, viewportWidth, viewportHeight);

let screenPosition = new BABYLON.Vector3();

BABYLON.Vector3.ProjectToRef(worldPosition, mesh.getWorldMatrix(), scene.getTransformMatrix(), viewport, screenPosition);
line.x2 = screenPosition.x;
line.y2 = screenPosition.y;
```

<Playground id="#BQOFIX#7" title="Simple Example of Mesh Hotspot" description="Hotspot hooked to a animated skinned mesh."/>
