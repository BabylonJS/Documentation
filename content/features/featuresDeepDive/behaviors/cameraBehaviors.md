---
title: Camera Behaviors
image:
description: Everything you want to know about camera behaviors.
keywords: diving deeper, behaviors, cameras, camera behaviors
further-reading:
video-overview:
video-content:
---

# Applying Camera Behaviors

## Bouncing Behavior

The bouncing behavior (`BABYLON.BouncingBehavior`) is designed to produce a small bouncing effect when an `ArcRotateCamera` reaches the `lowerRadiusLimit` or the `upperRadiusLimit`.

This behavior can be configured using the following properties:

- `transitionDuration`: Defines the duration of the animation, in milliseconds. The default value is 450ms.
- `lowerRadiusTransitionRange`: Defines the length of the distance animated by the transition when the lower radius is reached. The default value is 2.
- `upperRadiusTransitionRange`: Defines the length of the distance animated by the transition when the upper radius is reached. The default value is -2.
- `autoTransitionRange`: Defines whether `lowerRadiusTransitionRange` and `upperRadiusTransitionRange` are defined automatically. Transition ranges will be set to 5% of the bounding box diagonal in world space.

To enable this behavior on an `ArcRotateCamera`:

```javascript
camera.useBouncingBehavior = true;
```

You can find a live demo here: <Playground id="#6FBD14" title="Bouncing Behavior Example" description="A simple example of the camera bouncing behavior." image="/img/playgroundsAndNMEs/divingDeeperCameraBehaviors1.webp" isMain={true} category="Behaviors"/>

## AutoRotation Behavior

The auto-rotation behavior (`BABYLON.AutoRotationBehavior`) is designed to create a smooth rotation of an `ArcRotateCamera` when there is no user interaction.

This behavior can be configured with the following properties:

- `idleRotationSpeed`: Speed at which the camera rotates around the mesh.
- `idleRotationWaitTime`: Time (in milliseconds) to wait after user interaction before the camera starts rotating.
- `idleRotationSpinupTime`: Time (in milliseconds) to take to spin up to the full idle rotation speed.
- `zoomStopsAnimation`: Flag that indicates whether user zooming should stop the animation.

To enable this behavior on an `ArcRotateCamera`:

```javascript
camera.useAutoRotationBehavior = true;
```

You can find a live demo here: <Playground id="#6FBD14#1" title="AutoRotation Behavior Example" description="A simple example of the camera AutoRotation behavior." image="/img/playgroundsAndNMEs/divingDeeperCameraBehaviors2.webp"/>

## Framing Behavior

The framing behavior (`BABYLON.FramingBehavior`) is designed to automatically position an `ArcRotateCamera` when its target is set to a mesh. It is also useful if you want to prevent the camera from going under a virtual horizontal plane.

This behavior can be configured using the following properties:

- `mode`: The behavior can be configured to:
- `BABYLON.FramingBehavior.IgnoreBoundsSizeMode`: The camera can move all the way toward the mesh.
- `BABYLON.FramingBehavior.FitFrustumSidesMode`: The camera is not allowed to zoom closer to the mesh than the point at which the adjusted bounding sphere touches the frustum sides.
- `radiusScale`: Defines the scale applied to the radius (1 by default).
- `positionScale`: Sets the scale to apply on the Y axis to position the camera focus (0.5 by default, which means the center of the bounding box).
- `defaultElevation`: Defines the angle above or below the horizontal plane to return to when the return-to-default-elevation idle behavior is triggered, in radians (0.3 by default).
- `elevationReturnTime`: Defines the time (in milliseconds) taken to return to the default beta position (1500 by default). A negative value indicates that the camera should not return to the default.
- `elevationReturnWaitTime`: Defines the delay (in milliseconds) before the camera returns to the default beta position (1000 by default).
- `zoomStopsAnimation`: Defines whether user zooming should stop the animation.
- `framingTime`: Defines the transition time when framing the mesh, in milliseconds (1500 by default).

To enable this behavior on an `ArcRotateCamera`:

```javascript
camera.useFramingBehavior = true;
```

You can find a live demo here: <Playground id="#6FBD14#2" title="Framing Behavior Example" description="A simple example of the camera Framing behavior." image="/img/playgroundsAndNMEs/divingDeeperCameraBehaviors3.webp" isMain={true} category="Behaviors"/>
