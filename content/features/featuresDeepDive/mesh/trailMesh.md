---
title: Trail Mesh
image:
description: Learn how to draw a trail mesh in Babylon.js.
keywords: diving deeper, meshes, trail, trailmesh
further-reading:
video-overview:
video-content:
---

## How To Use TrailMesh

`TrailMesh` creates a new `Mesh` that trails another.

```javascript
let options = {
    diameter: 1.5,
    length: 100,
    segments: 10,
    sections: 4,
    doNotTaper: false,
    autoStart: true
};
const newTrail = new BABYLON.TrailMesh(name, generator, scene, options);

newTrail.start(); //Starts the trailing mesh.
newTrail.stop(); //Stops the trailing mesh.
```

| variable             | description                                             |
| -------------------- | ------------------------------------------------------- |
| name                 | The value used by scene.getMeshByName() to do a lookup. |
| generator            | The mesh to generate a trail.                           |
| scene                | The scene to add this mesh to.                          |
| options              | The object containing trail parameters.                 |


There are a variety of parameters you can set to create different types of trails to suit your needs. If you do not specify `segments`, it will default to the `length` of the trail, ie, a trail with a length of 60 will have 60 segments.

| options property     | value                                               | default value |
| -------------------- | --------------------------------------------------- |---------------|
| diameter (optional)  | _(number)_ Diameter of trailing mesh.                 | 1             |
| length (optional)    | _(number)_ Length of trailing mesh.                   | 60            |
| segments (optional)  | _(number)_ Segments of trailing mesh.                 | length        |
| sections (optional)  | _(number)_ Cross-section of trailing mesh. Min 2.     | 4             |
| doNoTaper (optional) | _(boolean)_ Whether the trail should taper.           | false         |
| autoStart (optional) | _(boolean)_ Automatically starts the trailing mesh.   | true          |


TrailMesh will be affected by all modifications to the generator mesh. Using `bakeCurrentTransformIntoVertices` on the generator after scaling (and before a position shift) will prevent the TrailMesh from scaling.

## Example Usage

```javascript
let alpha = Math.PI;
// Create a mesh for the trail to follow.
const cube = BABYLON.MeshBuilder.CreateBox("cube", {}, scene);
cube.scaling.y = 2;
cube.bakeCurrentTransformIntoVertices();
cube.position.x = Math.sin(alpha) * 10;
cube.position.z = Math.cos(alpha) * 10;
cube.computeWorldMatrix(true);

// Trail options
let options = {
    diameter: 1.5,
    length: 100,
    segments: 10,
    sections: 4,
    doNotTaper: false,
    autoStart: true
};
const trail = new BABYLON.TrailMesh("new", cube, scene, options);

const sourceMat = new BABYLON.StandardMaterial("sourceMat", scene);
sourceMat.emissiveColor = sourceMat.diffuseColor = new BABYLON.Color3.Red();
sourceMat.specularColor = new BABYLON.Color3.Black();

trail.material = sourceMat;

const observer = scene.onBeforeRenderObservable.add(animate);
function animate() {
  alpha += Math.PI / 120;
  cube.position.x = Math.sin(alpha) * 10;
  cube.position.z = Math.cos(alpha) * 10;
  cube.rotation.x = (Math.PI * alpha) / 2;
  cube.rotation.y = alpha;
}
```

## Examples

- <Playground id="#1F4UET#33" title="Glowing orbs with trail" description="Simple example of using trailmesh in your scene."/>

- <Playground id="#1640Q5#1" title="Trailmesh vfx" description="An example of adding vfx using the trailmesh."/>
