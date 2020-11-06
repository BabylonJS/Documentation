---
title: WebVR Experience Helper
image: 
description: Set up a VR scene with one line of code.
keywords: welcome, babylon.js, diving deeper, WebVR, WebVR Camera, VR
further-reading:
video-overview:
video-content:
---

# How to use the WebVR experience helper

## WebVR vs WebXR

While the WebVR experience helper will continue to be supported, it is strongly recommended that projects instead use the [WebXR experience helper](https://doc.babylonjs.com/how_to/webxr_experience_helpers). For more information, check out our [introduction to WebXR](https://doc.babylonjs.com/how_to/introduction_to_webxr).

## Introduction

The WebVR Experience Helper provides a quick way to add WebVR support to a Babylon scene.

Features include:

1. WebVR camera and non-WebVR camera initialization
1. Enter WebVR button
1. Teleportation and rotation in the world
1. Gaze tracking with mesh selection from HMD and controllers

## Setup

A VRExperienceHelper can be created directly from the scene.

```javascript
var scene = new BABYLON.Scene(engine);
var vrHelper = scene.createDefaultVRExperience();
```

This will initialize a WebVR camera and a non-WebVR camera in the scene. It will also create an enterVR button at the bottom right of the screen which will start rendering to the HMD on click.

### Options

- createDeviceOrientationCamera(default: true): If the non-WebVR camera should be created. To use an existing camera, create it and then initialize the helper with this set to false in the constructor.
- createFallbackVRDeviceOrientationFreeCamera(default: true): When no HMD is connected, this flag specifies if the VR camera should fallback to a VRDeviceOrientationFreeCamera which will render each eye on the screen. This can be set to false to only enable entering VR if an HMD is connected.

## Detect if fallback orientation camera is supported

If a webVR capable device is not detected Babylon will fallback to using a vrDeviceOrientationCamera however device orientation will only be available if the device has an orientation sensor available. In the latest version of Safari, the orientation sensor is disabled by default and it does not prompt users to enable it in settings so currently this must be done by the app. See https://www.applemust.com/how-and-why-to-use-motion-orientation-settings-in-ios/

```javascript
vrHelper.onAfterEnteringVRObservable.add(() => {
  if (scene.activeCamera === vrHelper.vrDeviceOrientationCamera) {
    BABYLON.FreeCameraDeviceOrientationInput.WaitForOrientationChangeAsync(1000)
      .then(() => {
        // Successfully received sensor input
      })
      .catch(() => {
        alert(
          "Device orientation camera is being used but no sensor is found, prompt user to enable in safari settings"
        );
      });
  }
});
```

See it in action here: <Playground id="#TAFSN0#230" title="Fallback Orientation Camera Example" description="A simple example of detecting if a fallback orienation camera is supported." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper1.jpg"/>

## Teleportation and Rotation

To enable teleportation in the scene, create a mesh that the user should be able to teleport to and then enable teleportation with that mesh's name.

```javascript
var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
vrHelper.enableTeleportation({ floorMeshName: "ground" });
```

To teleport, hold up on the joystick to display where the user will be teleported to and then release to teleport.
To rotate, move the joystick to the left or to the right.

When WebVR controllers are connected, the teleportation will be based on where the controller is pointing.

When WebVR controllers are not connected, the user will teleport to where the user is looking and teleportation can be triggered with an Xbox controller.

## Teleportation events

Teleportation has two observables you can subscribe to:

onBeforeCameraTeleport: Observable raised when teleportation is requested, receiving target Vector3 position as parameter:

```javascript
vrHelper.onBeforeCameraTeleport.add(targetPosition => {
  //Raised before camera is teleported
});
```

onAfterCameraTeleport: Observable raised when teleportation animation finishes, receiving target Vector3 position as parameter:

```javascript
vrHelper.onAfterCameraTeleport.add(targetPosition => {
  //Raised after teleportation animation finishes
});
```

To enable teleportation in the scene, create a mesh that the user should be able to teleport to and then enable teleportation with that mesh's name.

```javascript
var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
vrHelper.enableTeleportation({ floorMeshName: "ground" });
```

## Enabling / disabling teleportation

Teleportation can be enabled or disabled on demand by using the property teleportationEnabled:

```javascript
// Enable teleportation
vrHelper.teleportationEnabled = true;

//Disable teleportation (teleportation mesh will not be displayed)
vrHelper.teleportationEnabled = false;
```

To customize the teleportation target mesh the following property can be set to the mesh you'd like to use:

```javascript
vrHelper.teleportationTarget = BABYLON.Mesh.CreateSphere(
  "sphere1",
  4,
  0.1,
  scene
);
```

## Accessing cameras

The VR and non-VR camera can be accessed from the helper to handle any application specific logic.

```javascript
// Initial camera before the user enters VR
vrHelper.deviceOrientationCamera;
// WebVR camera used after the user enters VR
vrHelper.webVRCamera;
// One of the 2 cameras above depending on which one is in use
vrHelper.currentVRCamera;
```

## Accessing controllers

The controllers can be accessed from the helper to handle any application specific logic.

```javascript
vrHelper.onControllerMeshLoaded.add(webVRController => {
  var controllerMesh = webVRController.mesh;
  webVRController.onTriggerStateChangedObservable.add(() => {
    // Trigger pressed event
  });
});
```

Please note that the microsoft controllers are using the GLB file format and require the [GLTF Loader](https://doc.babylonjs.com/how_to/gltf#gltf-file-import).

## Accessing vr device position and rotation

Position and rotation in Babylon space can be accessed through the webVRCamera's devicePosition and deviceRotationQuaternion

```javascript
// Left and right hand position/rotation
if (vrHelper.webVRCamera.leftController) {
  leftHand.position = vrHelper.webVRCamera.leftController.devicePosition.clone();
  leftHand.rotationQuaternion = vrHelper.webVRCamera.leftController.deviceRotationQuaternion.clone();
}
if (vrHelper.webVRCamera.rightController) {
  rightHand.position = vrHelper.webVRCamera.rightController.devicePosition.clone();
  rightHand.rotationQuaternion = vrHelper.webVRCamera.rightController.deviceRotationQuaternion.clone();
}

// Head position/rotation
head.position = vrHelper.webVRCamera.devicePosition.clone();
head.rotationQuaternion = vrHelper.webVRCamera.deviceRotationQuaternion.clone();
```

See an Example here: <Playground id="#VIGXA3#7" title="Accessing VR Device position and rotation Example" description="A simple example of accessing a vr device's position and rotation." image=""/>

## Gaze and interaction

Gaze and interactions can be enabled through the enableInteractions method. See Example: <Playground id="#JA1ND3#40" title="Gaze and Interactions Example" description="A simple example of handling VR Gaze and Interaction." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper2.jpg"/>

```javascript
vrHelper.enableInteractions();
```

This will start casting a ray from either the user's camera or controllers. Where this ray intersects a mesh in the scene, a small gaze mesh will be placed to indicate to the user what is currently selected.

Please note the gaze controllers will simulate pointer events so `scene.onPointerObservable` will be raised when gaze is enabled.

To filter which meshes the gaze can intersect with, the raySelectionPredicate can be used:

```javascript
vrHelper.raySelectionPredicate = mesh => {
  if (mesh.name.indexOf("Flags") !== -1) {
    return true;
  }
  return false;
};
```

This will cause the user's gaze to pass through any mesh which results in the raySelectionPredicate returning false.

As the user moves between meshes with their gaze, the onNewMeshSelected event will occur.
Note: This only works after interactions have been enabled.

```javascript
vrHelper.onNewMeshSelected.add(mesh => {
  // Mesh has been selected
});
```

This will return the single closest mesh that was selected.

Prior to onNewMeshSelected an event called onNewMeshPicked is raised when a mesh is selected based on meshSelectionPredicate successful evaluation. This observable notifies a PickingInfo object to subscribers.

```javascript
vrHelper.onNewMeshPicked.add(pickingInfo => {
  //Callback receiving ray cast picking info
});
```

As the user unselects a mesh with their gaze or controller, the onSelectedMeshUnselected event will occur.

```javascript
vrHelper.onSelectedMeshUnselected.add(mesh => {
  // Mesh has been unselected
});
```

You can add your own filtering logic with meshSelectionPredicate.
Note: This will be applied after the raySelectionPredicate.

```javascript
vrHelper.meshSelectionPredicate = mesh => {
  if (mesh.name.indexOf("Flags01") !== -1) {
    return true;
  }
  return false;
};
```

The logic order for raySelectionPredicate, meshSelectionPredicate, onNewMeshPicked, onNewMeshSelected are as followed:

1. Ray is casted from the controller
2. When the ray hits an object the raySelectionPredicate will be called and if true the ray will collide there and be stopped otherwise the ray will pass through the object
3. Teleportation target location is updated to where the ray collided if the collision is also a floor mesh
4. If the collision object was not collided with on the last frame meshSelectionPredicate is checked, if it returns true the onNewMeshPicked event is fired and then onNewMeshSelected is fired

The gaze tracker can be customized by setting the gazeTrackerMesh. <Playground id="#ZHYP5K" title="GazeTrackerMesh Example" description="A simple example showing how to use the gazeTrackerMesh." image=""/>

```javascript
vrHelper.gazeTrackerMesh = BABYLON.Mesh.CreateSphere("sphere1", 4, 0.1, scene);
```

On specific devices like iOS (where fullscreen is not supported), you may want to set `vrHelper.enableGazeEvenWhenNoPointerLock = true` to let the gaze controller run even when not under fullscreen and pointer lock.

## Grab

By combining By combining WebVR controller method and add/removeChild method, you can grab objects by pressing trigger button.

```javascript
webVRController.onTriggerStateChangedObservable.add(stateObject => {
  if (webVRController.hand == "left") {
    if (selectedMesh != null) {
      //grab
      if (stateObject.value > 0.01) {
        webVRController.mesh.addChild(selectedMesh);
        //ungrab
      } else {
        webVRController.mesh.removeChild(selectedMesh);
      }
    }
  }
});
```

Selected mesh is detected by onNewMeshSelected method.

```javascript
VRHelper.onNewMeshSelected.add(function(mesh) {
  selectedMesh = mesh;
});

VRHelper.onSelectedMeshUnselected.add(function() {
  selectedMesh = null;
});
```

See the example.

- <Playground id="#B4C2AH" title="Grabbing Objects Example" description="A simple example of how to grab objects using the WebVRController." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper3.jpg"/>

## Multiview

To improve rendering performance by up to 2x, try using [Multiview](/How_To/Multiview) which will render both eyes in a single render pass

## Examples

Scenes:

- <Playground id="#JA1ND3#6" title="Sponza" description="Sponza scene." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper4.jpg"/>
- <Playground id="#JA1ND3#15" title="Mansion" description="Mansion scene." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper5.jpg"/>
- <Playground id="#JA1ND3#18" title="Hill Valley" description="Hill Valley scene." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper6.jpg"/>

Games:

- <Playground id="#32DWVS#4" title="Minecraft JMJ" description="Minecraft JMJ Game." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper7.jpg"/>
- <Playground id="#FAXLY2" title="Fruit Ninja" description="Fruit Ninja Game." image="/img/playgroundsAndNMEs/divingDeeperWebVRExperienceHelper8.jpg"/>