---
title: 3D Commerce Certified Viewer
image: 
description: Learn how to get a 3D Commerce certified viewer version based on the Babylon.js engine.
keywords: diving deeper, 3D Commerce, glTF, viewer
further-reading:
video-overview:
video-content:
---

This page will walk you through the 3D Commerce Viewer Certification Program, what it is, and how to get a certified viewer version based on the Babylon.js engine.

## 3D Commerce Viewer Certification Program

3D visualization technologies, initially developed for gaming and visual effects, are beginning to transform online retail experiences, advertising, and even physical retail experiences with AR/VR. 3D Commerce is a standardization working group from [**Khronos Group**](https://www.khronos.org/) aiming at removing the barriers to deploying 3D in e-commerce. 

The Viewer Certification Program enables 3D viewers across the industry to demonstrate that they can accurately and consistently display 3D products, clearing the way for reliable 3D and AR-powered shopping across multiple platforms and devices.

![3D Viewer Certification Program Overview (source: Khronos Web site)](/img/how_to/3D-commerce-certif/2021-3dcommerce-certification-overview.jpg)

This program is still in its early days and as a member of this working group, the Babylon.js Team is fully engaged in helping to develop and support its adoption. More info on the [**3D Commerce Web site**](https://www.khronos.org/3dcommerce/).

## Babylon.js Sandbox - certified version

A special version of the [**Babylon.js Sandbox**](https://sandbox.babylonjs.com) has been certified because some parameters have to be set differently than the default engine values (which cannot be changed for backward compatibility reasons):

- Specular over alpha has to be turned off (right side of the picture below). It was being used to render glass before the apparition of dedicated glTF extensions such as transmission and volume.
  ![Specular over alpha turned-on (left) and off (right)](/img/how_to/3D-commerce-certif/specular-over-alpha.jpg)

- Tone mapping is enabled using `Khronos PBR Neutral`. See [here](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products) for more info about this tone mapping technique.

This 3D Commerce certified Babylon.js Sandbox is accessible here: [**https://3dcommerce.babylonjs.com**](https://3dcommerce.babylonjs.com)

## Certified viewer version based on Babylon.js engine

If you have an existing viewer (or are developing a viewer) based on Babylon.js engine, you can get a certified viewer version by:

- Setting a flag in the glTF loader to enable transparency as coverage which will turn off specular over alpha:
  ```JavaScript
  SceneLoader.OnPluginActivatedObservable.add((plugin) => {
      if (plugin.name === "gltf") {
          const loader = plugin as GLTFFileLoader;
          loader.transparencyAsCoverage = true;
      }
  });
  ```

- Enabling the `Khronos PBR Neutral` tone mapping for a scene:
  ```JavaScript
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_KHR_PBR_NEUTRAL;
  ```

The Certification program will likely evolve with the glTF format and new extensions being taken into consideration. If some changes are not backward compatible, we'll make sure to continue documenting them on this page.
