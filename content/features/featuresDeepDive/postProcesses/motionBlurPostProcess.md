---
title: Motion Blur Post Process
image: 
description: Learn how to use the motion blur post process in Babylon.js.
keywords: diving deeper, post processes, post process, motion blur
further-reading:
video-overview:
video-content:
---

## Introduction
You can find an example of the motion blur post-process in our playground: <Playground id="#E5YGEL#2" title="Motion Blur Post Process Example" description="Simple example of the motion blur post process."/>

## Creating the motion blur post-process

You only need to create an instance of `BABYLON.MotionBlurPostProcess`.
```javascript
var motionblur = new BABYLON.MotionBlurPostProcess(
    "mb", // The name of the effect.
    scene, // The scene containing the objects to blur according to their velocity.
    1.0, // The required width/height ratio to downsize to before computing the render pass.
    camera // The camera to apply the render pass to.
);
```

The blur is based on object velocities. The faster an object's transformation changes, the stronger the blur on that object. Velocity is affected by each object's position, rotation, and scale:
- Rotation: <Playground id="#9LRA3T#4" title="Rotational Motion Blur" description="Simple example showing rotational motion blur."/>
- Scale: <Playground id="#9LRA3T#6" title="Scaling Motion Blur" description="Simple example of motion blur based on scale."/>
- Position: <Playground id="#9LRA3T#8" title="Positional Motion Blur" description="Simple example of motion blur based on position."/>

## Customizing
By default, the post-process will blur the scene using a coefficient named `motionStrength`. Its default value is equal to `1` and can be customized:
```javascript
motionblur.motionStrength = 2; // double the blur effect
```
Example: <Playground id="#9LRA3T#10" title="Customizing Motion Blur" description="Simple example of customizing the motion blur post process."/>

For performance/quality reasons, you can also customize the blur quality. To blur an image, the effect takes some samples around the current pixel. The more samples you take, the higher the blur quality. You can customize the number of samples using the `motionBlurSamples` property. Its default value is `32`:
```javascript
motionblur.motionBlurSamples = 16; // divide quality by 2
```

## Optimizing your application
By default, the post-process will blur all objects that generate a velocity (position, rotation, and scale). This also includes skinned meshes animated by their bones.
Sometimes, complex skinned meshes can have too many bones and can cause a drop in frame rate. You can choose to exclude a skinned mesh from bone computation while rendering the velocity map and apply blur only to its position/rotation/scale variation. The `MotionBlurPostProcess` provides a helper to add and remove skinned meshes:
```javascript
// Now, the mesh "mySkinnedMesh" will not compute bones velocities and will save performances.
motionblur.excludeSkinnedMesh(mySkinnedMesh);
```

```javascript
// Previously excluded, the mesh "mySkinnedMesh" will now compute bones velocities for a better render.
motionblur.removeExcludedSkinnedMesh(mySkinnedMesh);
```

## Limitations
To improve performance, the motion blur velocity map is rendered at the same time as the depth and normal buffers using the geometry render buffer.
The clear color of the render buffer collides with the needed clear color of the velocity map and can generate glitches like this: <Playground id="#E5YGEL#3" title="Limitations In The Motion Blur Post Process" description="Simple example showcasing colliding visual artifacts between the clear color of the render buffer and the velocity map."/>. As a limitation, your scene must occur in a closed environment OR have at least a skybox to hide the empty space that causes these glitches.

# Notes
The Motion Blur post-process requires at least WebGL 2 support, or WebGL 1 support with multiple render targets. If neither is available, the post-process will work as a passthrough.

## Disabling Object-Based Motion Blur
By default, the motion blur post-process uses object-based velocity to calculate blur. In large scenes, calculating the velocity of every visible object can be costly. Object-based velocity can be disabled to fall back to screen-based mode. Screen-based mode avoids calculating object velocities by basing the velocity only on the camera's movement.

To enable screen-based mode, simply disable object-based mode on the post-process:
```javascript
// Disable object-based mode in order to enable screen-based mode.
motionblur.isObjectBased = false;
```

Example: <Playground id="#E5YGEL#7" title="Screen-Based Motion Blur" description="Simple example of customizing the motion blur post process to disable object-based mode."/>
