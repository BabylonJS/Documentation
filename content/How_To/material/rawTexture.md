---
title: Creating Raw RBG Textures
image: 
description: Learn how to create raw rgb textures in Babylon.js.
keywords: diving deeper, materials, advanced, texture, raw texture, raw
further-reading:
video-overview:
video-content:
---

The Raw Texture feature is incredibly simple, but unbelievably powerful! It allows you to create a texture from raw data! This type of thing is perfect for creating procedural textures on the fly. Let's take a look at how to create a simple RBG texture from scratch.

Creating a Raw RBG Texture can be done using the following construction method:

```javascript
new BABYLON.RawTexture.CreateRGBTexture(data, width, height, scene);
```

data: This is the raw data that you'll use for the rbg values of each pixel of your texture. The data needs to be an 8-bit array...specifically a javascript 'uint8array.'

width: The desired width of the texture you'd like to create.

height: The desired height of the texture you'd like to create.

scene: Your Babylon scene.

Here's a small demo of it working. Check out line 29 in this playground: <Playground id="#3TM0BZ" title="Raw Texture Noise Terrain Example" description="Simple example of using noise data to generate an rgb texture, used as a height map to displace a mesh for a terrain effect." image="/img/playgroundsAndNMEs/divingDeeperRawTexture1.jpg"/>

In this case, random noise is being generated, converted into a Uint8Array and that is then used to create a Raw RGB Texture.

Here is a video explanation, diving a little futher into how this demo uses the raw texture.

<Youtube id="YKqXcrWliww"/>

## Diving Deeper

Of course, creating an RBG texture on the fly is only the tip of the iceberg. There's a LOT more you can do with Raw Texture, such as creating RGBA, Luminance, Alpha, and Luminance Alpha textures. 

For more detail, be sure to check out the full API documentation on Raw Texture [here](/api/classes/babylon.rawtexture).