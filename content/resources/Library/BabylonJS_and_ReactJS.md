---
title: Babylon.js and React
image:
description: How to integrateBabylon.js into a React application.
keywords: babylon.js, extension, external libraries, external
further-reading:
video-overview:
video-content:
---

## How to useBabylon.js with React

For anyone interested, it is not difficult to integrate Babylon.js into a React application.

## What you need

It's up to you if you choose Create React App or a custom project; only how to load Babylon.js in a component will be discussed here. This example uses the newer `@babylonjs/core` ES6 NPM, but can also be modified to work with the `babylonjs` NPM.

## Component

We are going to build a reusable React component that takes care of starting up Babylon.js for us!

In a working React project you first need to install the package `@babylonjs/core` using npm or yarn:

```bash
npm install @babylonjs/core
```

```bash
yarn add @babylonjs/core
```

Create a file called `SceneComponent.jsx` and add this:

```jsx
import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest}) => {
  const reactCanvas = useRef(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas ref={reactCanvas} {...rest} />;
};
```

> In 45 lines we have:
>
> - Reusable React Component for Babylon.js.
> - Will resize the engine when window is resized.
> - Cleans up resources automatically when unmounted.
> - Any extra props you add to this component will flow to the canvas (ie: style/className).
> - We only need to add this component to a page and specify a method to run when the scene is ready. A `<canvas />` element is created and a Babylon.js engine and scene are created and started.
> - If you want more control of the runRenderLoop, just remove it from here and add it in your `onSceneReady` prop.
> - TypeScript source can be copied from [here](https://raw.githubusercontent.com/brianzinn/babylonjs-hook/master/src/babylonjs-hook.tsx).

The above component is available in NPM, if you prefer:

```bash
npm add babylonjs-hook
yarn add babylonjs-hook
```

Here is a page using our component:

```jsx
import React from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css";

let box;

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);
```

## A few notes on the code

This will show the basic playground in your website! A rotation has been added in the render loop (and the sphere changed to a box, so you would notice).

If you would like to see this in action, there is a boilerplate project using the original NPM `babylonjs`, which you can clone from

- [Reactjs +Babylon.js + Electron](https://github.com/blurymind/babylon-react-electron-app)

There is a boilerplate using above component with ES6 NPM `@babylonjs/core` here

- [Reactjs +Babylon.js](https://github.com/brianzinn/babylonjs-cra-vanilla-ts)

## Adding otherBabylon.js NPMs

If you start with the `@babylonjs` [ES6 NPMs](/workflow/wfDeeper/developWithBjs/treeShaking) (as we have done) then add those ones only.

> For GUI use `@babylonjs/gui` instead of the NPMs that don't start with `@`.

## Conclusion

Integrating Babylon.js into a React site turns out to be not so tough. SinceBabylon.js 3.1 we can use ES6 imports not only forBabylon.js, but also for supported libraries (GUI/loaders/etc).

If the above component we created does everything you need then that's all you will need and you are all set! If you want to take it a step further you may want to take the `react-babylonjs` renderer for a spin.

## react-babylonjs renderer

A renderer is a next-level React integration that lets you use JSX to build your scenes and GUI. State changes will flow automatically to yourBabylon.js components (and persist through HMR) and you can maintain your scene graph in a declarative syntax and through components.

There is an NPM project called `react-babylonjs` that is a react renderer for Babylon.js.

What you are able to easily do is powerful, because inside the Scene component you can declare Babylon.js objects like Cameras/Meshes/Lights/Materials/Textures/3D Models/etc, using familiar JSX. Meanwhile there are escape hatches that allow you to work imperatively as well.

>Babylon.js ES6 + CRA (Create React App) project examples:
>
> - JavaScript (examples for 3D models, GUI, VR, behaviors, props/state management)
>   - [source](https://github.com/brianzinn/create-react-app-babylonjs)
>   - [demo](https://brianzinn.github.io/create-react-app-babylonjs/)
> - TypeScript (GUI + physics + shadows)
>   - [source](https://github.com/brianzinn/create-react-app-typescript-babylonjs)
>   - [demo](https://brianzinn.github.io/create-react-app-typescript-babylonjs/)
> - [Electron](https://github.com/brianzinn/react-babylonjs-electron) (Electron added to above TypeScript project)
> - [PWA](https://github.com/brianzinn/create-react-app-babylonjs-pwa) (Progressive Web App)

`react-babylonjs` (https://github.com/brianzinn/react-babylonjs) links to many live storybook code examples (skybox, CSG, dynamic terrain, behaviors, GUI, react hooks, integrations (PIXI, react-spring, gsap, chroma-js), 3D models, physics, shadows, layers (glow/highlight), textures, fresnel parameters, PBR, etc.
