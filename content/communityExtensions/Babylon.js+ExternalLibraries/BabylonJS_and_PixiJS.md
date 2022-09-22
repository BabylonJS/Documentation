---
title: Babylon.js and Pixi.js
image:
description: How to integrate Babylon.js and Pixi.js.
keywords: babylon.js, extension, external libraries, external, pixi, pixi.js
further-reading:
video-overview:
video-content:
---

Pixi.js is a fast, lightweight, open source 2D library with full support for webGL with a very fast rendering speed. It is great to use as a UI in combination with Babylon.js, making a perfect duo for your web game world.

## Setup Pixi.js rendering

```javascript
var pixiRenderer = new PIXI.WebGLRenderer({
  context: engine._gl,
  view: engine.getRenderingCanvas(),
  clearBeforeRender: false,
  autoStart: false,
});
```

## Add Pixi.js Sprites to Stage

```javascript
var stage = new PIXI.Container();
var sprite = PIXI.Sprite.from("https://i.imgur.com/1yLS2b8.jpg");
sprite.anchor.set(0.5);
sprite.position.set(canvas.width / 2, canvas.height / 2);
stage.addChild(sprite);
```

The _clearBeforeRender_ and _autoStart_ are two very important properties that must be used and set to _false_.

## Rendering Sequence

The render sequence of Babylon.js and Pixi.js is also very important, Babylon.js must be rendered first.

```javascript
engine.runRenderLoop(function () {
  scene.render();
  engine.wipeCaches(true);

  pixiRenderer.reset();
  pixiRenderer.render(stage);
});
```

[Working JSFiddle Example Pixi.js in Front](https://jsfiddle.net/y5q7Lb1v/40/)

It is possible to place a Pixi.js stage behind a Babylon.js scene provided you use

```javascript
scene.autoClear = false;
```

to make the background of the scene transparent. In this case render Pixi.js before Babylon.js.

```javascript
engine.runRenderLoop(function () {
  pixiRenderer.reset();
  pixiRenderer.render(stage);

  scene.autoClear = false;
  scene.render();
  engine.wipeCaches(true);
});
```

It is also possible to combine these and have Pixi.js stages behind and in front of a Babylon.js scene.

```javascript
engine.runRenderLoop(function () {
  pixiRenderer.reset();
  pixiRenderer.render(stage);

  scene.autoClear = false;
  scene.render();
  engine.wipeCaches(true);

  pixiRenderer.reset();
  pixiRenderer.render(stage1);
});
```

[JSFiddle Example Multiple Pixi.js Stages](https://jsfiddle.net/y5q7Lb1v/42/)

## WebGL1 Problems

When your browser is running webGL1 then you need to reset the Pixi.js context first for each rendering as below.

```javascript
engine.runRenderLoop(function () {
  if (engine.webGLVersion === 1) {
    pixiRenderer.reset();
  }
  scene.render();
  engine.wipeCaches(true);

  pixiRenderer.reset();
  pixiRenderer.render(stage);
});
```

## Spine animation with pixi.js

![image info](https://raw.githubusercontent.com/pixijs/examples/gh-pages/examples/assets/pixi-spine/spineboy-pro.png)

Running 2D spine animation is now easy using the pixi spine extension @https://github.com/pixijs/pixi-spine
Here's a sample code of how to run a simple spineboy animation

```javascript
loader.add("spineboy", "https://raw.githubusercontent.com/pixijs/examples/gh-pages/examples/assets/pixi-spine/spineboy-pro.json");

loader.load((loader, resources) => {
  let spineboy = new PIXI.spine.Spine(resources.spineboy.spineData);
  spineboy.scale.set(0.4);
  spineboy.state.setAnimation(0, "portal", false);
  spineboy.x = 1000;
  spineboy.y = 650;
  spineboy.state.getCurrent(0).onComplete = () => {
    spineboy.state.setAnimation(0, "shoot", true);
  };
  pixi.stage.addChild(spineboy);
});
```

[Working playground with spine animation](https://www.babylonjs-playground.com/#DX6LWQ)
For more api info as regards spine animation, visit [github](https://github.com/pixijs/pixi-spine)

## Pixi.js Versions

Always use the [latest released version of Pixi.js](https://github.com/pixijs/pixi.js/releases)
