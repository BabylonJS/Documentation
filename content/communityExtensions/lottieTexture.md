---
title: Lottie Texture
image: 
description: An extension library for loading and playing Lottie animation files in Babylon.js.
keywords: extensions, texture, animation, lottie, lottie texture
further-reading:
video-overview:
video-content:
---

An extension library for loading and playing Lottie animation files in Babylon.js.

## Introduction
This is an integration of lottie-web and Babylon.js.

It allows you to load a Lottie JSON file as a texture for Babylon.js.

[Demo](https://babylonjs-lottie-demo.netlify.app/)


## What is Lottie?

Lottie is an iOS, Android, and React Native library that renders After Effects animations in real time, allowing apps to use animations as easily as they use static images.

[Official website](https://airbnb.design/lottie/)
## install
```shell
pnpm add babylonjs-lottie @babylonjs/core
```

It currently relies on the "@babylonjs/core" package and probably does not support the "babylonjs" package.

## example

Load a Lottie JSON file
```javascript
import {LottieTexture} from "babylon-lottie"

let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {} /*option*/)
```

Create a box and set its texture to the Lottie animation
```javascript
let box = MeshBuilder.CreateBox("box")
let mat = new PBRMaterial("pbr", scene)
let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/Aniki Hamster.json", scene, {} /*option*/)
mat.albedoTexture = lottieTexture
box.material = mat
mat.unlit = true
```

LottieTexture exposes the lottieAnimation property.

You can use it to pause playback, get playback progress, and access other APIs.
```javascript
let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {} /*option*/)

lottieTexture.lottieAnimation.play()
lottieTexture.lottieAnimation.pause()
lottieTexture.lottieAnimation.currentFrame()
//....
```
Options
```javascript
await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {
    useAnimeSize: false, // If true then use the width and height set in the animation file
    autoPlay: true,
    width: 512,
    height: 512,
    loop: true,
})

```
