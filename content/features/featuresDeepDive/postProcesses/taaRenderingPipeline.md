---
title: Temporal Anti-Aliasing (TAA) Rendering Pipeline
image:
description: Learn about the temporal anti-aliasing rendering pipeline in Babylon.js.
keywords: diving deeper, post processes, post process, rendering, temporal anti aliasing, TAA
further-reading:
  [
    "https://de45xmedrsdbp.cloudfront.net/Resources/files/TemporalAA_small-59732822.pdf",
    "https://bartwronski.com/2014/03/15/temporal-supersampling-and-antialiasing/",
    "https://advances.realtimerendering.com/s2016/s16_Ke.pptx",
  ]
video-overview:
video-content:
---

## Introduction

Aliasing is one of the most annoying problems when working with computer-generated images. It can spoil your experience, even when using the latest 3D rendering techniques. Aliasing appears in the form of jagged lines (geometric aliasing) or bright spots (specular/shading aliasing) and gets worse with movement.

![Geometric aliasing](/img/how_to/taaRenderingPipeline/intro_geom_aliasing.webp)
<font size="2">Geometric aliasing (look at all the mostly horizontal lines)</font>

![Shading aliasing](/img/how_to/taaRenderingPipeline/intro_shading_aliasing.webp)
<font size="2">Shading aliasing (look at the bright spots around the buttons)</font>

Aliasing exists because of the discrete nature of the screen (composed of pixels) and because each pixel can only be one color. Each pixel is effectively a small window on a part of the scene and should be able to display all the colors visible from that window to accurately describe the scene, but as it can only be one color, we have to make a decision about which color to display. There are many algorithms that deal with this problem, and Temporal Anti-Aliasing (TAA) is one of them. For the moment, Babylon.js implements a basic version of the algorithm (only for static scenes), because, as you’ll see, a full implementation can be quite complex.

## TAA rendering pipeline

You can use TAA in your own programs thanks to the TAA rendering pipeline:
```javascript
const taaRenderPipeline = new BABYLON.TAARenderingPipeline("taa", scene, [camera]);

taaRenderPipeline.isEnabled = true;
taaRenderPipeline.samples = 8;
```
You'll get ghosting artifacts when you move the camera or objects (read below if you want to understand why), so you may want to activate the pipeline only when everything is static.

This PG demonstrates it with the camera: <Playground id="#539X0P#44" title="TAA Rendering Pipeline Example" description="BoomBox scene with temporal anti-aliasing" isMain={true} category="Post-processing"/>

You can use two parameters with the rendering pipeline:
* `samples`: Number of accumulated samples. The larger the value, the better the anti-aliasing, but the longer it takes to converge.
* `factor`: The factor used to blend the history image with the current image.

See below for further explanations of `samples` and `factor`, and if you'd like to know more about our implementation.

## Temporal Anti-Aliasing general principles

The main idea is quite simple: render the scene several times, each time with a different (small) offset for the projection matrix so that the rendered scene is slightly offset within the one-pixel limit. By averaging all the renderings, you’ll obtain a pretty good anti-aliasing effect.

![Jittering camera](/img/how_to/taaRenderingPipeline/camera_jittering.webp)
<font size="2">Jittering the camera — from [Unigine documentation](https://developer.unigine.com/en/docs/latest/principles/render/antialiasing/taa?rlang=cpp)</font>

However, rendering the scene several times per frame would seriously affect performance. This is where the “temporal” part of TAA comes in: we render the scene once per frame (with a different projection offset each time), and average the result over several consecutive frames. In this way, the cost of calculation is spread over several frames. It will take some time to obtain a smoothed image (8 frames, for example, if we choose 8 different offsets), but if we work at 60 frames per second, it won’t be too noticeable. Let’s see how this works in practice.

## Camera offset

The camera needs to be shifted slightly so that the scene is slightly different from one frame to the next, but still within the dimensions of one pixel.

So, after projection onto the 2D screen, we want to stay within the boundaries of one pixel. The projection matrix for a perspective camera is as follows:

![Projection matrix](/img/how_to/taaRenderingPipeline/camera_offset_math1.webp)
<font size="2">Projection matrix for a perspective camera</font>

Let’s project a 3D point (in `view` coordinate space):

![Projected point](/img/how_to/taaRenderingPipeline/camera_offset_math2.webp)
<font size="2">Projected point (result is in clip space)</font>

What we want to do is apply an offset `(dx, dy)` to the 2D coordinates `(ax, by)`, i.e. something like `(ax+dx, by+dy)`. Let’s add dx and dy to the projection matrix:

![Offset](/img/how_to/taaRenderingPipeline/camera_offset_math3.webp)
<font size="2">Offset added to the projection matrix</font>

We have an extra `z` factor on `dx` and `dy`, but don’t forget that the GPU will perform a division by the `w` coordinate as part of the normal rendering pipeline, to convert clip space to NDC (Normalized Device Coordinate) space! As you can see above, `w=z` (`w` is the 4th coordinate of the projected vector), so the `z` factor will cancel out when we divide by `w` and we’ll get what we want, a `(dx,dy)` shift of the 2D coordinates:

![Conversion from clip to NDC space](/img/how_to/taaRenderingPipeline/camera_offset_math4.webp)
<font size="2">Conversion from clip to NDC space performed by the GPU</font>

Note that the coordinates to which `(dx,dy)` apply are in NDC space, which is in the interval **[-1,1]** for `x`/`y`. So, if `dx` and `dy` are values in the interval **[0,1]**, they must be multiplied by `(2/width, 2/height)`, where `width` and `height` are the dimensions of the output (usually the screen), if the offsets are not to exceed the one-pixel limit.

On the code side, it’s easy enough: just define the offsets in the projection matrix as follows:
```javascript
const projMat = camera.getProjectionMatrix();
projMat.m[8] = dx * 2 / width;
projMat.m[9] = dy * 2 / height;
projMat.markAsUpdated();
```

In the real code, we’ll apply a translation `(-0.5, -0.5)` to `(dx,dy)` because the 2D pixel coordinate is the pixel center coordinate.

## Generating the offsets

We could use random values for the offsets, but we can get better results by using a [low-discrepancy sequence](https://en.wikipedia.org/wiki/Low-discrepancy_sequence). I won’t go into the details; you’ll find plenty of documentation on the subject on the Internet if you’re interested. The generally accepted method for TAA is to use a [Halton sequence](https://en.wikipedia.org/wiki/Halton_sequence). The code to generate this sequence can also be easily found, and we implemented our [own version](https://doc.babylonjs.com/typedoc/classes/babylon.halton2dsequence) which you can use for your own purpose if you wish.

As an illustration, here are the locations of 8 points generated with a Halton sequence created from the starting numbers (2,3):

![Halton 8](/img/how_to/taaRenderingPipeline/halton8.webp)
<font size="2">From [High Quality Temporal Supersampling](https://de45xmedrsdbp.cloudfront.net/Resources/files/TemporalAA_small-59732822.pdf) by Brian Karis (Unreal Engine)</font>

Note that when we’ve used all the points from the Halton sequence for our projection offsets, we restart from the first point.

## Averaging the frames

What we could do is accumulate (“additive blending”) each frame into a render target, then divide by the number of frames to get the final average. To avoid division, we could apply a weight to the color before writing it to the output. For example, if we use a sequence of 8 Halton samples, we’d use a weight of 1/8 for each frame. However, this method is a bit cumbersome, we’d have to clear the render target before restarting the Halton sequence, and it’s not well suited to handling motion (which our implementation doesn't do, however). In addition, blending is more demanding in terms of performance, as it requires the source target to be read during the process.

Instead, we perform a moving average using this formula (it can be shown that this formula converges to the mean of `x(t)` values when `α` is small — see slides 15 and 16 of [High Quality Temporal Supersampling](https://de45xmedrsdbp.cloudfront.net/Resources/files/TemporalAA_small-59732822.pdf)):

![Average formula](/img/how_to/taaRenderingPipeline/average_formula.webp)

`s(t-1)` is the current average of a given pixel, `x(t)` is the new color of the pixel in the current frame, and `s(t)` is the new average. `α` is a small number, to be chosen by the user. A larger number will make the formula converge faster, but towards a number that will deviate more from the true mean than if a smaller value is chosen, but in this case, it will converge more slowly… Generally, a value in the **[0.05, 0.1]** range will give good results.

We used a rendering pipeline to implement this averaging, and a ping-pong of two render targets: one render target is used as the source (`s(t-1)`) and the other stores the result of the calculation for the current frame (`s(t)`). The render targets are exchanged at the end of the calculation in order to swap their roles for the next frame.

## Shortcomings

In the Playground linked above, try to move/rotate the camera when "Enable TAA" is enabled and "Disable on camera move" is disabled. You’ll get some heavy ghosting:

![Ghosting](/img/how_to/taaRenderingPipeline/ghosting.webp)

This is because in the formula :

![Average formula](/img/how_to/taaRenderingPipeline/average_formula.webp)

`s(t-1)` should not be the accumulation for the pixel we’re currently processing, but rather we should find out where this pixel was located in the previous image to obtain the accumulation for this pixel! And therein lies the complexity. If you want more details, here are a few references (among many others!):
* [High Quality Temporal Supersampling](https://de45xmedrsdbp.cloudfront.net/Resources/files/TemporalAA_small-59732822.pdf) by Brian Karis (Unreal Engine)
* [Temporal supersampling and antialiasing](https://bartwronski.com/2014/03/15/temporal-supersampling-and-antialiasing/) by Bart Wronski (Assassin’s Creed 4)
* [Temporal Antialiasing in Uncharted 4](https://advances.realtimerendering.com/s2016/s16_Ke.pptx) by Ke Xu (Naughty Dog)

What you can do to reduce ghosting is to increase the value of the `factor` property. But at some point, you’ll start to see flicker, so you can’t increase it too much.