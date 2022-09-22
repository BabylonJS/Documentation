---
title: Resizer Control
image-url: /img/defaultImage.png
description: The Babylon.js Resizer Control is a web control built on top of Babylon.js in order to accelerate the resizing of pictures in web pages with blazing fast speed.
keywords: web controls, hardware accelerated, 2D, resize, scale, images
further-reading:
video-overview:
video-content:
---

# Resizer Control

The Babylon.js Resizer Control is a web control built on top of Babylon.js in order to accelerate the resizing of pictures in web pages with blazing fast speed.

## Introduction

It regularly happens on the web that one needs to resize a picture on demand. It is easy enough to do with static pictures and css, but what about capturing a frame from a video or a snapshot from a canvas ?

Also this component can come in as a pair with the [Timeline](./timeline) and helps resizing thumbnails before uploading them to the GPU without relying on a separate canvas element and thus preventing the extra copies required.

![Resizer](/img/features/controls/resizer.png)

## How to use

### Installation

To begin with the timeline, you first need to install the controls npm package.

```javascript
npm install @babylonjs/controls
```

To reduce the size of your web page, the controls library is based on the es6 version of `@babylonjs/core` used as a peer dependency. Therefore if you are not relying on it so far in you project, you also need to install core:

```javascript
npm install @babylonjs/core
```

Please note, that while the controls are still in preview, it might be preferable to use their latest update with:

```javascript
npm install @babylonjs/controls@preview
npm install @babylonjs/core@preview
```

### Instantiation

Once done, you can now import the resizer control in your code:

```javascript
import { Resizer } from "@babylonjs/controls/resizer";
```

And simply instantiate it in your page:

```javascript
const resizer = new Resizer(resizerCanvas);
```

You simply need to provide a canvas on which we will be able to use a WebGL context. You could as well provide another Babylon.js control in order to share the WebGL context.

## Resizing to the canvas

This is by far the simplest, if you have a canvas in your page. You simply need to use the following code to fit the provided element to the canvas size:

```javascript
resizer.resize(imageToResize);
```

On the previous line, imageToResize could be either:

- the url of a picture.
- a video element (the current visible frame of the video will be used)
- another canvas element (the current visible state will be used)

The source image will be stretch in both direction to fit in the target canvas.

## Resizing to a Babylon Texture

Instead of resizing directly to a canvas, you could prefer to only create a Babylon.js texture on the GPU. For this, you can use the following function:

```javascript
const texture = resizer.getResizedTexture(imageToResize, { width: 128, height: 100 });
```

Like before, imageToResize could be either:

- the url of a picture.
- a video element (the current visible frame of the video will be used).
- another canvas element (the current visible state will be used).

You also need to provide the size you want your texture to have on the GPU.

Now you are free to use this texture with any other controls.

## How to use with the timeline

Creating the texture is one thing but being able to use it is even better.

For instance you can simply pair the use of the resizer with the timeline:

```javascript
const resizer = new Resizer(canvas);
const timeline = new Timeline(resizer, {
    [...]
    getThumbnailCallback: (time: number) => {
        hiddenVideo.currentTime = time;
        return resizer.getResizedTexture(hiddenVideo, { width: 128, height: 100 });
    }
});
```

The 2 important points are:

- Use a shared control context by passing one control to the constructor of the other one.
- Returning a resized texture from the thumbnail callback.

That is it, both controls are linked together making an efficient use of the GPU without wasting resources with bigger thumbnails than needed.

This is actually the technique we are relying on in the demo. The source can be seen on [Github](https://github.com/BabylonJS/Controls/blob/master/www/timeline/index.ts)

## Full Code Sample

You can find the integrallity of the code sample above on [Github](https://github.com/BabylonJS/Controls/blob/master/www/resizer/index.ts) if you want to see it in action and better see how some of the functionalities could be used.

## Live Demo

Please, have a look at the [Live Resizer Demo](https://controls.babylonjs.com/resizer) to better appreciate how it works.
