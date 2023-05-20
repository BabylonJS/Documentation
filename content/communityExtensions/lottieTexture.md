## Introduction
This is an integration of lottie-web and babylonjs.

He allows you to load the lottie json file as a texture for babylonjs

[Demo](https://babylonjs-lottie-demo.netlify.app/)


## What is Lottie?

Lottie is an iOS, Android, and React Native library that renders After Effects animations in real time, allowing apps to use animations as easily as they use static images.

[Official website](https://airbnb.design/lottie/)
## install
```shell
pnpm add babylonjs-lottie @babylonjs/core
```

Currently relies on the "@babylonjs/core" package, probably does not support "babylonjs" package

## example

Load lottie json file
```javascript
import {LottieTexture} from "babylon-lottie"

let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {} /*option*/)
```

Create a box and set the texture to lottie animation
```javascript
let box = MeshBuilder.CreateBox("box")
let mat = new PBRMaterial("pbr", scene)
let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/Aniki Hamster.json", scene, {} /*option*/)
mat.albedoTexture = lottieTexture
box.material = mat
mat.unlit = true
```

LottieTexture exposes the lottieAnimation property.

You can use it to control the playback pause of the animation, or to get the playback progress, and other api.
```javascript
let lottieTexture = await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {} /*option*/)

lottieTexture.lottieAnimation.play()
lottieTexture.lottieAnimation.pause()
lottieTexture.lottieAnimation.currentFrame()
//....
```
option
```javascript
await LottieTexture.LoadFromUrlAsync("name", "/lottie.json", scene, {
    useAnimeSize: false, // If true then use the width and height set in the animation file
    autoPlay: true,
    width: 512,
    height: 512,
    loop: true,
})

```
