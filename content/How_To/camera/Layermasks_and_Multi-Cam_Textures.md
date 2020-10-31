# How To Use Layermasks and Multi-Camera Textures

# Different meshes for multiple cameras using Layermasks

A `layerMask` is a number assigned to each mesh and camera. It is used at the bit level to indicate whether lights and cameras should shine-upon or show the mesh. The default value, 0x0FFFFFFF, will cause the mesh to be illuminated and shown by any stock light and camera.

The feature is used primarily when multiple cameras are active at the same time. If you wish to have a mesh that is always visible on the screen and pickable, e.g. a button, you might add a second camera and light to the scene to exclusively show and light it.

You'll need the 2nd camera to ONLY see the button. The button should also only be visible once.

Notice that the default `layerMask` starts with the first 4 bits being 0, or off. If the 2nd camera and button were to both have a `layerMask` with one of the 4 values below, then the 2nd camera would only see the button:

- 0x10000000
- 0x20000000
- 0x40000000
- 0x80000000

It should also be noted that a mesh with a `layerMask` of 0, can never be seen by anyone. This might be good for hiding things.

To setup for multi-cameras:

```javascript
if (scene.activeCameras.length === 0){
    scene.activeCameras.push(scene.activeCamera);
}
var secondCamera = new Babylon.Camera(...);
secondCamera.layerMask = 0x10000000;
scene.activeCameras.push(secondCamera);

var Button = new BABYLON.Mesh(...);
Button.layerMask = 0x10000000;
```

# Lights

Unless the material of the meshes for the 2nd camera is purely emissive, this still leaves any light for the button illuminating all the other meshes, and other lights in the scene illuminating the button. To keep scene lights from illuminating the button, loop through the existing lights, and set the excludeWithLayerMask value:

```javascript
for (var i = scene.lights.length - 1; i >= 0; i--) {
  scene.lights[i].excludeWithLayerMask = 0x10000000;
}
```

Then make the "button" light:

```javascript
var light = new BABYLON.Light(...);
light.includeOnlyWithLayerMask = 0x10000000;
```

Finally, if there may be more lights generated later, you can register a call-back whenever a light is added:

```javascript
scene.onNewLightAdded = onNewLight;
```

This could be:

```javascript
onNewLight = function(newLight, positionInArray, scene) {
  newLight.excludeWithLayerMask = 0x10000000;
};
```

# Gun Sight Example

Here is a simple example of using a 2nd orthographic camera which shows a gun sight. To keep it simple, emissive material was used to avoid lighting it. Just copy and paste it into any scene, then call it. The `layerMask` chosen also allows Babylon's Dialog extension to inter-operate. Perhaps these could be combined to do a heads-up tank sight with range finder.

A commercial quality implementation would probably not use `CreateBox()`, since it creates depth faces that cannot be seen straight-on anyway. It should also take into account a window size change, unless it is a tablet app.

```javascript
function addGunSight(scene) {
  if (scene.activeCameras.length === 0) {
    scene.activeCameras.push(scene.activeCamera);
  }
  var secondCamera = new BABYLON.FreeCamera(
    "GunSightCamera",
    new BABYLON.Vector3(0, 0, -50),
    scene
  );
  secondCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  secondCamera.layerMask = 0x20000000;
  scene.activeCameras.push(secondCamera);

  meshes = [];
  var h = 250;
  var w = 250;

  var y = BABYLON.Mesh.CreateBox("y", h * 0.2, scene);
  y.scaling = new BABYLON.Vector3(0.05, 1, 1);
  y.position = new BABYLON.Vector3(0, 0, 0);
  meshes.push(y);

  var x = BABYLON.Mesh.CreateBox("x", h * 0.2, scene);
  x.scaling = new BABYLON.Vector3(1, 0.05, 1);
  x.position = new BABYLON.Vector3(0, 0, 0);
  meshes.push(x);

  var lineTop = BABYLON.Mesh.CreateBox("lineTop", w * 0.8, scene);
  lineTop.scaling = new BABYLON.Vector3(1, 0.005, 1);
  lineTop.position = new BABYLON.Vector3(0, h * 0.5, 0);
  meshes.push(lineTop);

  var lineBottom = BABYLON.Mesh.CreateBox("lineBottom", w * 0.8, scene);
  lineBottom.scaling = new BABYLON.Vector3(1, 0.005, 1);
  lineBottom.position = new BABYLON.Vector3(0, h * -0.5, 0);
  meshes.push(lineBottom);

  var lineLeft = BABYLON.Mesh.CreateBox("lineLeft", h, scene);
  lineLeft.scaling = new BABYLON.Vector3(0.01, 1, 1);
  lineLeft.position = new BABYLON.Vector3(w * -0.4, 0, 0);
  meshes.push(lineLeft);

  var lineRight = BABYLON.Mesh.CreateBox("lineRight", h, scene);
  lineRight.scaling = new BABYLON.Vector3(0.01, 1, 1);
  lineRight.position = new BABYLON.Vector3(w * 0.4, 0, 0);
  meshes.push(lineRight);

  var gunSight = BABYLON.Mesh.MergeMeshes(meshes);
  gunSight.name = "gunSight";
  gunSight.layerMask = 0x20000000;
  gunSight.freezeWorldMatrix();

  var mat = new BABYLON.StandardMaterial("emissive mat", scene);
  mat.checkReadyOnlyOnce = true;
  mat.emissiveColor = new BABYLON.Color3(0, 1, 0);

  gunSight.material = mat;
}
```

See it in action: https://www.babylonjs-playground.com/pg/2GXKNW/revision/22
