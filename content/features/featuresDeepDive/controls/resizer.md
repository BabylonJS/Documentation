---
title: Resizer Control
image-url: /img/defaultImage.webp
description: The Babylon.js Resizer Control is a web control built on top of Babylon.js to accelerate the resizing of pictures on web pages at blazing-fast speed.
keywords: web controls, hardware accelerated, 2D, resize, scale, images
further-reading:
video-overview:
video-content:
---

# Resizer Control

The Babylon.js Resizer Control is a web control built on top of Babylon.js to accelerate the resizing of pictures on web pages at blazing-fast speed.

## Introduction

It is common on the web to need to resize a picture on demand. It is easy enough to do with static pictures and CSS, but what about capturing a frame from a video or a snapshot from a canvas?

This component can also be paired with the [Timeline](./timeline) and helps resize thumbnails before uploading them to the GPU, without relying on a separate canvas element and thus avoiding the extra copies required.

![Resizer](/img/features/controls/resizer.webp)

## How to use

### Installation

To get started with the resizer, you first need to install the controls npm package.

```javascript
npm install @babylonjs/controls
```

To reduce the size of your web page, the controls library is based on the ES6 version of `@babylonjs/core` used as a peer dependency. Therefore, if you are not relying on it so far in your project, you also need to install core:

```javascript
npm install @babylonjs/core
```

Please note that, while the controls are still in preview, it might be preferable to use their latest update with:

```javascript
npm install @babylonjs/controls@preview
npm install @babylonjs/core@preview
```

### Instantiation

Once done, you can now import the resizer control in your code:

```javascript
import { Resizer } from "@babylonjs/controls/resizer";
```

And simply instantiate it on your page:

```javascript
const resizer = new Resizer(resizerCanvas);
```

You simply need to provide a canvas on which we can use a WebGL context. You can also provide another Babylon.js control to share the WebGL context.

## Resizing to the canvas

This is by far the simplest option if you have a canvas on your page. You simply need to use the following code to fit the provided element to the canvas size:

```javascript
resizer.resize(imageToResize);
```

On the previous line, imageToResize could be either:

- the url of a picture.
- a video element (the current visible frame of the video will be used)
- another canvas element (the current visible state will be used)

The source image will be stretched in both directions to fit the target canvas.

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

## How to Use with the Timeline

Creating the texture is one thing, but being able to use it is even better.

For instance, you can simply pair the resizer with the timeline:

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

The two important points are:

- Use a shared control context by passing one control to the constructor of the other one.
- Returning a resized texture from the thumbnail callback.

That's it: both controls are linked together, making efficient use of the GPU without wasting resources on thumbnails that are larger than needed.

This is actually the technique we are relying on in the demo. The source can be seen on [Github](https://github.com/BabylonJS/Controls/blob/master/www/timeline/index.ts)

## Full Code Sample

You can find the entirety of the code sample above on [Github](https://github.com/BabylonJS/Controls/blob/master/www/resizer/index.ts) if you want to see it in action and better understand how some of the features can be used.

## Live Demo

Please have a look at the [Live Resizer Demo](https://controls.babylonjs.com/resizer) to better appreciate how it works.
