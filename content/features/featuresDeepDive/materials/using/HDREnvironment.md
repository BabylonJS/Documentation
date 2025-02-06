---
title: Using An HDR Environment For PBR
image:
description: Learn about using an HDR Environment in your Babylon.js scene.
keywords: diving deeper, materials, PBR, Physically Based Rendering, HDR, Environment
further-reading:
video-overview:
video-content:
---

## Introduction

The highly recommended way to setup an environment texture is through an HDR ready file (either DDS or ENV) containing a cube texture with prefiltered MipMaps.

To load an HDR environment, you can use a [createDefaultEnvironment](https://doc.babylonjs.com/typedoc/classes/babylon.scene#createdefaultenvironment):

```javascript
scene.createDefaultEnvironment();
```

This will load the file [_environmentSpecular.env_](https://assets.babylonjs.com/environments/environmentSpecular.env) from _assets.babylonjs.com_.

To load a custom env texture, simply set the `scene.environmentTexture`:

```javascript
const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.env", scene);
scene.environmentTexture = hdrTexture;
```

You can also use an option in `createDefaultEnvironment()`:

```javascript
scene.createDefaultEnvironment({
    environmentTexture: "texture-url.env"
}););
```

We are detailing below the two supported ways of creating such files.

As of 4.2 we now support prefiltering directly in the Sandbox!

.hdr files are easy to find on the web so it looks like the most convenient input for filtering.

## Creating a compressed environment texture using the Sandbox

As the generated DDS files can be relatively large (32Mb for a 512px wide file), we introduced in Babylon a special way to pack your texture. Here are the steps to follow to create the `.env` files used in Babylon.js:

- go to the [sandbox](https://sandbox.babylonjs.com/)
- drag &amp; drop a PBR scene file ([example](https://models.babylonjs.com/PBR_Spheres.glb))
- drag &amp; drop your .dds environmentTexture file ([example](https://playground.babylonjs.com/textures/environment.dds))
- open the Inspector, go to the Tools, and click on `Generate .env texture`

![inspector env texture tool](/img/how_to/Environment/inspector-generate-env-texture.png)

You can now download and use your `.env` environment, using this bit of code:

```
scene.environmentTexture = new BABYLON.CubeTexture("environment.env", scene);
```

As of 7.48.0, you can even check the diffuse box to ensure your env texture will contain the diffuse information in a texture. This can help a lot with the rendering quality at the expense of a tiny big bigger file (about 10 more kb).

See [What is a .env (Tech Deep Dive)](#what-is-a-env-tech-deep-dive) part at the bottom of this page to know more.

## IBL Texture tool

In case you have a .hdr texture, you're able to use the [IBL Texture Tool](https://www.babylonjs.com/tools/ibl/) to convert it in an easy way to .env.

Just drag &amp; drop your .hdr file, wait a bit, and save the .env wherever you want.

## Directly use .hdr files

In case you want to directly use a .hdr file and are not able to prefilter it to a .env or a .dds from the sandbox or an external tool, you can do it at the moment your texture is loaded.

```javascript
const reflectionTexture = new BABYLON.HDRCubeTexture("./textures/environment.hdr", scene, 128, false, true, false, true);
```

This method will involve a small delay in the loading of the texture, due to the prefiltering being achieved on-the-fly. Therefore it is preferable to use .env or .dds files for optimal performance.
Please note that WebGL2 is required for prefiltering on-the-fly.

As sometimes you might even want to fully filter in realtime (for animated reflections for instance) you might want to have a look at [the reflection probes tutorial](/features/featuresDeepDive/environment/reflectionProbes).

As of 7.48.0 new options are available on the prefiltering front.
- The parameter `prefilterIrradianceOnLoad` prefilters the HDR texture and stores the diffuse part of the IBL as a texture instead of harmonics. This gives a lot more dynamicity to the output and can allow "true" hdr.
- The parameter `prefilterUsingCdf` can be used to generate the irradiance texture containing by relying on the HDR CDF data which helps a lot to get closer from Ray tracers.

![IBL Filters](/img/how_to/environment/iblFilters.png)

## Using a pure cube texture

![inspector env texture tool](/img/how_to/environment/inspector-generate-env-texture.png)

While using a .dds or .env cube texture is the best option, you may want to still rely on classic cube texture (mostly for size reason).
So, you can still do this as well:

```javascript
scene.environmentTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
```

In this case you won't be able to get HDR rendering and some visual artifacts may appear (mostly when using glossiness or roughness).

## What is a .env (Tech Deep Dive)

The issue we are addressing with .env is the size and quality of our IBL Environment Textures. We decided to implement our custom packing to simplify sharing and downloading those assets. This file needs to work cross platform for an easy deployment hence why we are not relying directly on compressed textures.

We are then packing in one file (similar to DDS or KTX) a json manifest header, the polynomial information and all the faces of the mipmaps chain from the prefiltered cube texture in .png format (which compresses more than decently and decode really fast in all browsers.).

In order to keep an HDR support with png, we chose to rely on RGBD as it offers a better distribution of the value in the low range than RGBM by keeping the [0-1] range untouched knowing it is generally used more frequently. It is also less complex to decode at runtime than LogLUV when needed. It seems the like the best tradeoff for us.

RGBD also offers none to low transparency in the lower range preventing browser relying on premultiplication of alpha to loose data in the most visible area. We also introduced a special offset from the max range ensuring that we are not reaching problematic values of alpha in legacy browsers (when alpha is too close from 0 the color quantization is created unacceptable banding artifacts).

In WebGL2 browsers, we are unpacking the data to HalfFloat or FullFloat texture if supported to speedup the runtime and allow correct some interpolations.

The file is also packing the polynomials harmonics vs sphericals to match what Babylon is expected internally speeding up load time by not having to compute or transform them anymore.

As rendering to LOD or even copy to LOD of Half/Fulll float texture does not work consistently on WebGL1 based browser, we are unpacking in live the data in the fragment shader. As RGBD interpolation is not correct we ensured with different test cases that the generated visual artifacts were worth the transport gain. It looks ok in the sets of textures we have been testing.

As an example of result, we can now rely on 512px cube sized texture with around 3Mb of data vs 32 Mb for the unpacked version without noticing any blocking quality drops. This also speed ups our time to first frame by not requiring the compute of the polynomials anymore.
