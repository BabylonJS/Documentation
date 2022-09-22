---
title: Integrate With CesiumJS
image:
description: Learn how to integrate BabylonJS with CesiumJS
keywords: babylon.js, extension, external libraries, external, cesium, CesiumJS
further-reading:
video-overview:
video-content:
---

CesiumJS is an open source JavaScript library for creating world-class 3D globes and maps with the best possible performance, precision, visual quality, and ease of use. Because both BabylonJS and CesiumJS show 3D scene with javascript, it is possible to integrate them together for a better visual effect.

Inspired by [Integrating Cesium with Three.js](https://cesium.com/blog/2017/10/23/integrating-cesium-with-threejs/), the base point of the solution is to render two libraries in two canvases, the canvas upper for BabylonJS. Set the upper canvas `pointer-events: none;`, CesiumJS will have the control and we make BabylonJS's camera to follow CesiumJS's.

## Setup CesiumJS

```javascript
const LNG = -122.4175,
  LAT = 37.655;

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
  useDefaultRenderLoop: false,
});

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 300),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-90.0),
  },
});

// get these two points for later setup of BabylonJS root node.
const base_point = cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 50));
const base_point_up = cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 300));
```

## Setup BabylonJS

`Scene's clearColor` is important, we should make background transparent to see things renderer in CesiumJS.

```javascript
const engine = new BABYLON.Engine(canvas);
const scene = new BABYLON.Scene(engine);
scene.clearColor = BABYLON.Color4(0, 0, 0, 0);

const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
```

## Rendering Sequence

Before BabylonJS rendering, we should change BabylonJS's camera's position and rotation to make it absolutely the same with CesiumJS's.

```javascript
function cart2vec(cart) {
  return new BABYLON.Vector3(cart.x, cart.z, cart.y);
}

const fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy);
camera.fov = (fov / 180) * Math.PI;

const civm = viewer.camera.inverseViewMatrix;
const camera_matrix = BABYLON.Matrix.FromValues(civm[0], civm[1], civm[2], civm[3], civm[4], civm[5], civm[6], civm[7], civm[8], civm[9], civm[10], civm[11], civm[12], civm[13], civm[14], civm[15]);

// I'm sure it is able to get the result with the matrix directly, but I'm not familiar with matrixs, so you can do it yourselves.:)
const scaling = BABYLON.Vector3.Zero(),
  rotation = BABYLON.Vector3.Zero(),
  transform = BABYLON.Vector3.Zero();
camera_matrix.decompose(scaling, rotation, transform);
const camera_pos = cart2vec(transform),
  camera_direction = cart2vec(viewer.camera.direction),
  camera_up = cart2vec(viewer.camera.up);

const rotation_y = Math.atan(camera_direction.z / camera_direction.x);
if (camera_direction.x < 0) rotation_y += Math.PI;
rotation_y = Math.PI / 2 - rotation_y;
const rotation_x = Math.asin(-camera_direction.y);
const camera_up_before_rotatez = new BABYLON.Vector3(-Math.cos(rotation_y), 0, Math.sin(rotation_y));
const rotation_z = Math.acos(camera_up.x * camera_up_before_rotatez.x + camera_up.y * camera_up_before_rotatez.y + camera_up.z * camera_up_before_rotatez.z);
rotation_z = Math.PI / 2 - rotation_z;
if (camera_up.y < 0) rotation_z = Math.PI - rotation_z;

camera.position.x = camera_pos.x - base_point.x;
camera.position.y = camera_pos.y - base_point.y;
camera.position.z = camera_pos.z - base_point.z;
camera.rotation.x = rotation_x;
camera.rotation.y = rotation_y;
camera.rotation.z = rotation_z;
```

CesiumJs must render first as we need the parameters of its camera.

```javascript
engine.runRenderLoop(() => {
  viewer.render();
  moveBabylonCamera();
  scene.render();
});
```

## Setup root node

This step is actually not necessary, but it will make things easier.

```javascript
const root_node = new BABYLON.TransformNode("BaseNode", scene);
root_node.lookAt(base_point_up.subtract(base_point));
root_node.addRotation(Math.PI / 2, 0, 0);

// Then you can add your meshes to root_node.
const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 }, scene);
const material = new BABYLON.StandardMaterial("Material", scene);
material.emissiveColor = new BABYLON.Color3(1, 0, 0);
material.alpha = 0.5;
box.material = material;
box.parent = root_node;

const ground = BABYLON.MeshBuilder.CreateGround(
  "ground",
  {
    width: 100,
    height: 100,
  },
  scene,
);
ground.material = material;
ground.parent = root_node;
```

## Example

An example can be found here: [cesium-babylonjs](https://github.com/Hypnosss/cesium-babylonjs).
