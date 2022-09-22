---
title: Applying Delta Changes To A Scene
image:
description: Learn about using the delta system in Babylon.js to save and reload changes made to your scenes.
keywords: diving deeper, scene, delta system
further-reading:
video-overview:
video-content:
---

Starting with Babylon.js v4.2, you have the opportunity to apply delta changes to a scene.
This means you can "record" all changes done to a scene and later on reapply these changes.

This is particularly useful when you load a scene from a .babylon or a .gltf file and you want to apply changes to it (without reexporting the scene from your DCC tool).

## Recording the changes

To record changes done to a scene, you simply have to create a new `SceneRecorder` and call its `track()` function:

```javascript
var recorder = new BABYLON.SceneRecorder();

recorder.track(scene);
```

This will mark the origin of the changes eg. the original state of your scene. Every changes (well, almost actually, please check the limitations chapter below) made after that call will be tracked and available in the delta file.

## Applying the changes

Once you're done with the changes you want to record, you can get the delta file with this call:

```javascript
var delta = recorder.getDelta();
```

The returned value is a JSON object that you can download or reuse later.

To donwload it, you can leverage the Tools class:

```javascript
BABYLON.Tools.Download(JSON.stringify(delta), "delta.json");
```

If you want to apply it to your scene, you can call that static function:

```javascript
BABYLON.SceneRecorder.ApplyDelta(delta, scene);
```

## Example

Let's have a look at an example to see it in action:

```javascript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
sphere.position.y = 1;

var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

// Instantiate the recorder
var recorder = new BABYLON.SceneRecorder();

recorder.track(scene);

// Let's make some changes
sphere.position.y = 0;
scene.clearColor.r = 1;

light.intensity = 0;

var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);

ground.dispose();

// Now we can get the delta file
let delta = recorder.getDelta();

// Just to see the changes, we are updating the value so we can see what the delta is doing
ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
light2.dispose();
sphere.position.y = 2;
scene.clearColor.r = 0;
light.intensity = 1.0;

// Apply the delta
BABYLON.SceneRecorder.ApplyDelta(delta, scene);
```

You can play with this code on this Playground: <Playground id="#MPD4TQ#1" title="Delta System Example" description="Simple example showing how to save deltas and apply them to your scene."/>

## Using the Inspector

You can also use the Inspector to record your delta. To do so, jump to the Tools tab and select the [Start recording] button in the Replay section:

![Replay section](/img/how_to/scene/inspector-record.jpg)

When you are done with your recording, go to the same place and hit the [Generate delta file]:

![Replay section](/img/how_to/scene/inspector-generate.jpg)

This will download the file locally.

## Limitations

The recorder has some limitations listed here:

- It will only record simple values (array, colors, vectors, boolean, number)
- It will not record large state changes like:
  - Updating the material property of a mesh
  - Updating the skeleton property of a mesh
  - Updating mesh's geometry
