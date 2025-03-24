---
title: Getting Started - Chapter 3 - Character Animation
image:
description: Learn to load objects with animation, into your scene.
keywords: getting started, start, chapter 3, animation, animation basics, character animation, model loading
further-reading:
video-overview:
video-content:
---

# Getting Started - Character Animation

## A Walking Figure
Sometimes the easiest way to add a model to a scene is to obtain one from elsewhere. This could be one you have created in your favorite model building software or one your have purchased.

The *Dude* model is one that has been built with its own skeleton animation.

![dude walking](/img/getstarted/dude.gif)

Once imported the character and its skeleton are obtained from the meshes and skeletons properties of the results object.

```javascript
BABYLON.ImportMeshAsync("/scenes/Dude/Dude.babylon" /* model file */, scene).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                
    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
});
```

<Playground id="#SFW46K#1371" title="Loading an Animated Character" description="Simple example of loading an animated character into your scene." image="/img/playgroundsAndNMEs/getingStartedCharacterAnimation.jpg"/>

Currently the character is set in one position and we would like him to walk around the village. This time instead of creating another animation object for the character we will change its position and orientation before each frame is rendered. 