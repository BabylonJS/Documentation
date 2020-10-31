# Apply Camera Behaviors

# Bouncing behavior

The bouncing behavior (`BABYLON.BouncingBehavior`) is designed to produce a small bouncing effect when an **ArcRotateCamera** reaches the lowerRadiusLimit or the upperRadiusLimit.

The bouncing behavior can be configured using the following properties:

- `transitionDuration`: Define the duration of the animation, in milliseconds. By default the value is set to 450ms
- `lowerRadiusTransitionRange`: Define the length of the distance animated by the transition when lower radius is reached. By default the value is set to 2
- `upperRadiusTransitionRange`: Define the length of the distance animated by the transition when upper radius is reached. By default the value is set to -2
- `autoTransitionRange`: Define a value indicating if the lowerRadiusTransitionRange and upperRadiusTransitionRange are defined automatically. Transition ranges will be set to 5% of the bounding box diagonal in world space

You can easily turn on this behavior on an ArcRotateCamera with the following code:

```javascript
camera.useBouncingBehavior = true;
```

You can find a live demo here: https://www.babylonjs-playground.com/#6FBD14

# AutoRotation Behavior

The autoRotation behavior (`BABYLON.AutoRotationBehavior`) is designed to create a smooth rotation of an **ArcRotateCamera** when there is no user interaction.

This behavior can be configured with the following properties:

- `idleRotationSpeed`: Speed at which the camera rotates around the mesh
- `idleRotationWaitTime`: Time (in milliseconds) to wait after user interaction before the camera starts rotating
- `idleRotationSpinupTime`: Time (milliseconds) to take to spin up to the full idle rotation speed
- `zoomStopsAnimation`: Flag that indicates if user zooming should stop animation

You can easily turn on this behavior on an ArcRotateCamera with the following code:

```javascript
camera.useAutoRotationBehavior = true;
```

You can find a live demo here: https://www.babylonjs-playground.com/#6FBD14#1

# Framing Behavior

The framing behavior (`BABYLON.FramingBehavior`) is designed to automatically position an **ArcRotateCamera** when its target is set to a mesh.
It is also useful if you want to prevent the camera to go under a virtual horizontal plane.

This behavior can be configured with the following properties:

- `mode`: The behavior can be configured to:
- `BABYLON.FramingBehavior.IgnoreBoundsSizeMode`: The camera can move all the way towards the mesh
- `BABYLON.FramingBehavior.FitFrustumSidesMode`: The camera is not allowed to zoom closer to the mesh than the point at which the adjusted bounding sphere touches the frustum sides
- `radiusScale`: Define the scale applied to the radius (1 by default)
- `positionY`: Define the Y offset of the primary mesh from the camera's focus (0 by default)
- `defaultElevation`: Define the angle above/below the horizontal plane to return to when the return to default elevation idle behaviour is triggered, in radians (0.3 by default)
- `elevationReturnTime`: Define the time (in milliseconds) taken to return to the default beta position (1500 by default). Negative value indicates camera should not return to default
- `elevationReturnWaitTime`: Define the delay (in milliseconds) taken before the camera returns to the default beta position (1000 by default)
- `zoomStopsAnimation`: Define if user zooming should stop animation
- `framingTime`: Define the transition time when framing the mesh, in milliseconds (1500 by default)

You can easily turn on this behavior on an ArcRotateCamera with the following code:

```javascript
camera.useFramingBehavior = true;
```

You can find a live demo here: https://www.babylonjs-playground.com/#6FBD14#2
