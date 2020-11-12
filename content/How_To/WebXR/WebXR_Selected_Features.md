---
title: WebXR Selected Features
image: 
description: Learn about key WebXR features in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR
further-reading:
video-overview:
video-content:
---

## Teleportation Module

A lot of (native) VR games have a teleportation feature to allow movement in the scene. It is the most convenient way of moving in a scene without the user feeling dizzy or disoriented.

Babylon has supported teleportation in WebVR and has now upgraded the feature to have a lot of different abilities.

The teleportation feature enabled the following ways to interact with the camera's position:

1. Move forward using direct/indirect rays
2. Move backwards
3. Rotate in place.

Quick note about the **WebXR emulator** - Even thou it doesn't have support for it just yet, the WebXR emulator adds a Thumbstick to the emulated controller, making it impossible to simulate teleportation. To get teleportation working you will need to enable `useMainComponentOnly` (described below) to disable the thumbstick's teleportation. It is recommended to only enable this during development, unless this is the required behavior.

### Enabling teleportation

The teleportation module is turned on per default when using the [WebXR Default Experience Helper](/divingDeeper/webXR/webXRExperienceHelpers#the-basic-experience-helper). To turn it on or re-enable it use the following code:

```javascript
const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
    xrInput: xr.input,
    // add options here
    floorMeshes: [ground, secondFloor, thirdFloor],
});
```

The latest options can be found in the [WebXR teleportation feature's source code](https://github.com/BabylonJS/Babylon.js/blob/master/src/XR/features/WebXRControllerTeleportation.ts#L31).

Some teleportation parameters are needed during construction and are therefore only configurable in the constructor's `options` parameter. To reconfigure parameters which have no public getter/setter, re-enable the feature:

```javascript
var xrHelper = await scene.createDefaultXRExperienceAsync({
    xrInput: xrHelper.input,
    floorMeshes: [ground] /* Array of meshes to be used as landing points */,
});
// ...
// needs a reconfigure - re-enable the feature (will discard the old one and create a new one!)
xrHelper.teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
    xrInput: xrHelper.input,
    floorMeshes: [ground],
    renderingGroupId: 1,
});
```

Notice that the only obligatory option for the teleportation feature is the xrInput, which are the controllers it is going to use in order to teleport the user.

### Setting floor meshes

Floor meshes are most important for teleportation, as the module needs to know where the users are allowed to land and where not.

When using the [WebXR Default Experience Helper](/divingDeeper/webXR/webXRExperienceHelpers#the-basic-experience-helper) you can set the floorMeshes during initialization:

```javascript
var xrHelper = await scene.createDefaultXRExperienceAsync({
    xrInput: xr.input,
    floorMeshes: [ground] /* Array of meshes to be used as landing points */,
});
const teleportation = xrHelper.teleportation;
```

When enabling the feature yourself you can provide it in the options object:

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
});
```

If you want to add a mesh after the teleportation feature was enabled, you can use the `addFloorMesh` function:

```javascript
teleportation.addFloorMesh(ground2);
```

And to remove simply use the `removeFloorMesh` function:

```javascript
teleportation.removeFloorMesh(ground2);
```

A simple example for enabling floor meshes: <Playground id="#B8D5Z6" title="Enable Floor Meshes" description="Simple example of enabling floor meshes." image=""/>

### Direct and indirect landing zones

The teleportation landing zone is defined by the person holding the controllers. There are two ways of teleportation: direct teleportation and indirect (parabolic) teleportation.

Direct teleportation means - the user aims at the position they want to land at (a straight line). This is used when the ground and the landing location is in sight and is the most convenient and straight-forward way of moving forward.

![Direct WebXR teleportation](/img/how_to/xr/xr-direct-teleportation.png)

An indirect line means the user aims up high and creates a parabolic path. This is used to go across obstacles, or to teleport from one floor to the other.

![Indirect WebXR teleportation](/img/how_to/xr/xr-indirect-teleportation.png)

The direct teleportation is always enabled. The indirect teleportation is enabled per default, but it is possible to disable it using a flag:

```javascript
// disable the parabolic (indirect) teleportation ray
teleportation.parabolicRayEnabled = false;
```

To make the parabolic ray go further you can set the radius that is used to create the inspection ray when pointing the ray at 90 degrees up (Default is 5):

```javascript
teleportation.parabolicCheckRadius = 10;
```

Note that the parabolic ray's radius is bigger, the lower the rotation angle of the controller. The compensation calculation is done using this formula:

```javascript
const compensation = 1 + (Math.PI / 2 - Math.abs(rotationOnTheXAxis));
```

The compensation is multiplied by the defined radius and changes the current ray intersection radius.

### Different input sources

The default input source is an XR headset with two handheld controllers. This input source in WebXR is called `TrackedPointer` .

When the input source has a thumbstick or a touchpad, moving the finger forward will trigger the ray-casting mode. Rotating the finger after seeing the ray casted will rotate the direction in which the user lands. Releasing the finger when seeing a landing zone will move the user there.

When no thumbstick or touchpad is available, the main component (usually a trigger) will be used. See [WebXR input sources](/divingDeeper/webXR/webXRInputControllerSupport) for more information about the main component. When using the main component, which is usually a button, you can define a certain amount of time in milliseconds after which the user will teleport, if still holding the trigger. The default is 3 seconds.

This configuration value can be found in the constructor's options and it is called `timeToTeleport` :

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    timeToTeleport: 5000,
});
```

Note that when using a button, it is impossible to allow rotation, so the user's orientation will stay the same as it was before they teleported.

To force the user to use the main component only (even if a thumbstick is available) use the `useMainComponentOnly` flag when constructing:

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    timeToTeleport: 5000,
    useMainComponentOnly: true,
});
```

### The teleportation landing zone

The teleportation landing zone is a group of meshes means to show the user where they are going to land and in which direction. Its default version looks like this:

![Indirect WebXR teleportation](/img/how_to/xr/xr-teleportation-landing-zone.png)

Each part of the teleportation landing zone is configurable:

#### The landing zone's material

The material of the landing zone (the dark circle on the floor) can be configured when constructing the feature using css colors:

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    defaultTargetMeshOptions: {
        teleportationFillColor: "#55FF99",
        teleportationBorderColor: "blue",
    },
});
```

Which looks like this:

![WebXR Custom landing zone](/img/how_to/xr/xr-landing-zone-custom.png)

The example can be found here: <Playground id="#B8D5Z6#9" title="Custom Landing Zone" description="Simple example of a custom landing zone." image=""/>

#### The ring's material

The rotation ring's material can be provided by the user:

```javascript
let myCustomMaterial = new BABYLON.StandardMaterial("ground", scene);
myCustomMaterial.backFaceCulling = false;
myCustomMaterial.diffuseColor = BABYLON.Color3.Green();
myCustomMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);

const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    defaultTargetMeshOptions: {
        torusArrowMaterial: myCustomMaterial,
    },
});
```

Will look like this:

![Custom material for ring](/img/how_to/xr/xr-custom-material-turos-ring.png)

#### Disable the ring up-and-down animation

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    defaultTargetMeshOptions: {
        disableAnimation: true,
    },
});
```

And now the ring won't animate up and down when the target zone is casted

#### Disable lighting on the ring

To make sure the ring is always visible no matter the lighting in the scene is, set the `disableLighting` flag when constructing the feature:

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    defaultTargetMeshOptions: {
        disableLighting: true,
    },
});
```

This will look like this with light intensity 0.5:

![Disable lighting on ring](/img/how_to/xr/xr-ring-disable-lighting.png)

### Rotating while teleporting

It is possible to not allow the user to rotate after casting the initial ray. It is a flag straight on the teleportation object and it is called `rotationEnabled` :

```javascript
teleportation.rotationEnabled = false;
```

### Backwards movement

Backwards movement is on per default. When the user "pulls" the thumbstick or the touchpad backwards they will move a predefined distance, if this distance is available on any floor mesh behind them.

To configure the distance to move use the `backwardsTeleportationDistance` flag:

```javascript
teleportation.backwardsTeleportationDistance = 1.0; // Default is 0.7
```

To disable backwards moving use this flag:

```javascript
teleportation.backwardsMovementEnabled = false; // Default is 0.7
```

### Rotation in place

When moving the thumbstick left and right (X-Axis movement on the thumbstick/touchpad) the user will rotate a predefined amount. To default rotation is 22.5 degrees (in radians: `Math.PI / 8` ). To change this use the `rotationAngle` flag:

```javascript
// rotate 45 degrees
teleportation.rotationAngle = Math.PI / 4;
```

### Rendering to a different layer or rendering group

If you want the render the teleportation target zone on top of the rest of the meshes you can use one of two ways:

1. rendering group id (See [Rendering groups](/divingDeeper/materials/advanced/transparent_rendering))
2. Utility layer (See [UtilityLayerRenderer](/divingDeeper/mesh/utilityLayerRenderer))

To set the rendering group id :

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    renderingGroupId: 1,
});
```

This will look like this (notice it renders on top of the ground that should hide it):

![Rendering group for target zone](/img/how_to/xr/xr-rendering-group-ring.png)

To set a utility layer:

```javascript
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    useUtilityLayer: true,
    // optional
    customUtilityLayerScene: customScene, // a different utility layer scene to use. If not the default utility layer scene will be used
});
```

### Snap-to (Hotspots)

Some XR experiences require the user to land at an exact location (and sometimes ONLY at exact locations). The teleportation snap-to feature allows you to define spots where the user can land and where the teleportation ray will snap (with a specific threshold).

To enable snap-to points you can use one of the two:

-   provide an array of hotspots (Vector3) to the options when enabling the feature:

```javascript
const interestingSpot = new BABYLON.Vector3(-4, 0, 4);
const interestingSpot2 = new BABYLON.Vector3(4, 0, 4);
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    snapPositions: [interestingSpot, interestingSpot2],
});
```

-   Add points after the feature is enabled:

```javascript
teleportation.addSnapPoint(new BABYLON.Vector3(0, 0, 6));
```

Note that it is always expected that the snap-to points will be on a mesh that is defined as a floor mesh. Babylon will not check that! If you put the hotspot too far away from a floor mesh, the results will be unexpected (for example, the user might hover).

To change the snap-to radius, use the `snapToPositionRadius` parameter. Default is 0.8 units or 80 cm and it cannot be 0:

```javascript
const interestingSpot = new BABYLON.Vector3(-4, 0, 4);
const interestingSpot2 = new BABYLON.Vector3(4, 0, 4);
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    snapPositions: [interestingSpot, interestingSpot2],
    snapToPositionRadius: 1.2,
});
```

Now any position of target zone within a 1.2 units (meters) radius of one of the snap-to points will change the target zoné location to be the close point. You can test it in this playground:

-   <Playground id="#DGS0NV#1" title="Snap To Point With Movement Freedom" description="Simple example of snapping to a point with movement freedom." image=""/>

If you want to disable the user's free movements and only let the user land on snap-to points, set the `snapPointsOnly` , either during construction:

```javascript
const interestingSpot = new BABYLON.Vector3(-4, 0, 4);
const interestingSpot2 = new BABYLON.Vector3(4, 0, 4);
const teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: [ground],
    snapPositions: [interestingSpot, interestingSpot2],
    snapToPositionRadius: 1.2,
    snapPointsOnly: true,
});
```

or afterwards:

```javascript
teleportation.snapPointsOnly = true;
```

The feature will look like this:

![Rendering group for target zone](/img/how_to/xr/xr-snap-to-teleportation.gif)

You can play around in this playground:

<Playground id="#DGS0NV#3" title="Snap-to Hotspot Example" description="Simple example of snap-to hotspots." image=""/>