---
title: How to use BabylonJS with Vue - async scene methods
image:
description: How to integrate BabylonJS into a Vue application.
keywords: babylonJS, extension, external libraries, external, vue, vue2, vue3, quasar
further-reading:
video-overview:
video-content:
---

Sometimes you will need to issue a command from your Vue component to the BabylonJS scene, maybe it will be an animation and you need to know, when the required operation, let it be our animation, finishes.

## Prerequisites

The goal of this tutorial is to show how to connect the two frameworks together and not how to use these frameworks alone. You need to be familiar with both frameworks at basic level to get started.

You need to cloned the repository from https://github.com/RolandCsibrei/babylonjs-vue2-javascript-basic-setup. This is were we left off in part 1 so you can edit along reading the tutorial, or you can clone a repo with all the changes already made from here: https://github.com/RolandCsibrei/babylonjs-vue2-javascript-basic-setup/tree/async-scene-methods.

## The Example

Open `src/scenes/MyFirstScene.js` and implement the animation method as follows. We have to make our function `async` and return a new `Promise` object. If we couldn't find the mesh specified by the `name` parameter, we `reject`, otherwise we create a simple animation of the `visibility` property on the `Mesh` object. We set the `onAnimationEnd` callback to `resolve` our `Promise`. That's really simple!

```jsx
async animateMeshVisibility(name, from, to, speed) {
    return new Promise((resolve, reject) => {
      const m = this.scene.getMeshByName(name);
      if (!m) {
        reject("No mesh");
      }

      const visibilityAnimation = new Animation(
        "anim",
        "visibility",
        60,
        Animation.ANIMATIONTYPE_FLOAT
      );
      const keys = [];

      const frames = 60;
      keys.push({
        frame: 0,
        value: from,
      });

      keys.push({
        frame: frames,
        value: to,
      });

      visibilityAnimation.setKeys(keys);

      m.animations = [visibilityAnimation];
      this.scene.beginAnimation(m, 0, frames, false, speed, () => {
        resolve();
      });
    });
  },
```

In the file `src/components/BabylonScene.vue` make the following changes. We have added a button to trigger the animation. Our `hide` function must be `async` so we can `await` the asynchronous method defined in the scene code. When the animation ends an alert is displayed.

```jsx
<template>
  <div>
    <button @click="hide">Hide the cube</button>
    <br />
    <canvas ref="bjsCanvas" width="500" height="500" />
  </div>
</template>

<script>
import myScene from "../scenes/MyFirstScene";

export default {
  name: "BabylonScene",
  methods: {
    async hide() {
      await myScene.animateMeshVisibility("box", 1, 0, 0.3);
      alert("Done");
    },
  },
  mounted() {
    const bjsCanvas = this.$refs.bjsCanvas;
    if (bjsCanvas) {
      myScene.createScene(bjsCanvas);
    }
  },
};
</script>
```

Now we are ready to `npm run serve`, click on the button and after the cube has faded out, we get an alert.

## Where to go next?

Visit our great [Getting started](/features/start "Getting started") page.

## Links

[All links from this tutorial at one place](/workflow/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_0/ "All links from this tutorial at one place")

[Part 1](/workflow/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_1/ "How to use BabylonJS with Vue") of this tutorial

[Part 2](/workflow/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_2/ "How to pass data between BabylonJS and Vue") of this tutorial

[Part 4](/workflow/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_4/ "BabylonJS and Vue - messages driven scene") of this tutorial

GitHub starter project: https://github.com/RolandCsibrei/babylonjs-vue2-javascript-basic-setup

GitHub: https://github.com/RolandCsibrei/babylonjs-vue2-javascript-basic-setup/tree/async-scene-methods
