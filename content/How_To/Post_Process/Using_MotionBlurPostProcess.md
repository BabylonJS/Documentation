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
You can find an example of the motion blur post-process in our playground: <Playground id="#E5YGEL#2" title="Motion Blur Post Process Example" description="Simple example of the motion blur post process." image=""/>

## Creating the motion blur post-process

You just have to create an instance of BABYLON.MotionBlurPostProcess
```javascript
var motionblur = new BABYLON.MotionBlurPostProcess(
    "mb", // The name of the effect.
    scene, // The scene containing the objects to blur according to their velocity.
    1.0, // The required width/height ratio to downsize to before computing the render pass.
    camera // The camera to apply the render pass to.
);
```

The blur is based on objects velocities. More the object's transformation is changing fast, more the blur is high for the object. Velocity is affected by each object position, rotation and scale:
- Rotation: <Playground id="#9LRA3T#4" title="Rotational Motion Blur" description="Simple example showing rotational motion blur." image=""/>
- Scale: <Playground id="#9LRA3T#6" title="Scaling Motion Blur" description="Simple example of motion blur based on scale." image=""/>
- Position: <Playground id="#9LRA3T#8" title="Positional Motion Blur" description="Simple example of motion blur based on position." image=""/>

## Customizing
By default, the post-process will blur the scene using a coefficient named `motionStrength`. Its default value is equal to `1` and can be customized:
```javascript
motionblur.motionStrength = 2; // double the blur effect
```
Example: <Playground id="#9LRA3T#10" title="Customizing Motion Blur" description="Simple example of customizing the motion blur post process." image=""/>

For performances/quality reason, you can also customize the blur quality. To blur an image, the effect
takes, for the current pixel, some samples around the current pixel one. More you take samples, more the quality of the blur is high. So, you can customize the number of samples using the property `motionBlurSamples`. Its default value is equal to `32`:
```javascript
motionblur.motionBlurSamples = 16; // divide quality by 2
```

## Optimizing your application
By default, the post-process will blur all objects that generate a velocity (position, rotation and scale). This includes also skinned meshes animated by its bones.
Sometimes, complex skinned meshes can have too much bones and can generate a drop in framerate. You can decide to exclude a skinned mesh from bones computation while rendering the velocity map and apply blur only on their position/rotation/scale variation. The `MotionBlurPostProcess` provides an helper to add and remove skinned meshes:
```javascript
// Now, the mesh "mySkinnedMesh" will not compute bones velocities and will save performances.
motionblur.excludeSkinnedMesh(mySkinnedMesh);
```

```javascript
// Previously excluded, the mesh "mySkinnedMesh" will now compute bones velocities for a better render.
motionblur.removeExcludedSkinnedMesh(mySkinnedMesh);
```

## Limitations
To save performances, the motion blur's velocity map is rendered at the same time than depth buffer and normal buffer using the geometry render buffer.
The clear color of the render buffer collides with the needed clear color of the velocity map and can generate glitchs like this: <Playground id="#E5YGEL#3" title="Limitations In The Motion Blur Post Process" description="Simple example showcasing colliding visual artifacts between the clear color of the render buffer and the velocity map." image=""/>. As a limitation, your scene must occur in a closed environment OR have at least a skybox to hide the empty space that causes these glitchs.

# Notes
The Motion Blur post-process needs at least support of WebGL 2 or WebGL 1 with multiple render targets support. If not available, the post-process will work as a passthrough.