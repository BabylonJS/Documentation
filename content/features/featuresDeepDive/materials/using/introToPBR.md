---
title: Introduction to Physically Based Rendering
image:
description: Start learning about Physically Based Rendering in Babylon.js.
keywords: diving deeper, materials, PBR, Physically Based Rendering
further-reading:
video-overview:
video-content:
---

## Introduction

The aim of Physically Based Rendering, PBR, is to to simulate **real life lighting**.

PBR is a grouping of techniques; it does not force you to choose one in particular. Among others, we can cite some like:

- [Disney](http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_slides_v2.pdf)
- [Ashkimin Shirley BRDF](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.18.4558&rep=rep1&type=pdf)

In Babylon.js, PBR is done thanks to PBRMaterial. This material contains all features required by modern physically based rendering. On this page we look at two pre-set simplified versions that allow you to quickly get started with PBR.

You can find a demonstration of the effect of using the [PBRMaterial](https://www.babylonjs.com/Demos/PBRGlossy/) from the main Babylon.js website.

![pbrsample](/img/pbr.jpg)

The two additional materials are `PBRMetallicRoughnessMaterial` and `PBRSpecularGlossinessMaterial`. They both implement a specific convention based on GLTF specifications:

- [Metallic roughness convention](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#metallic-roughness-material) (This is the recommended convention)
- [Specular glossiness convention](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness/README.md)

## PBRMetallicRoughnessMaterial

This material is based on five main values:

- baseColor / baseTexture: The base color has two different interpretations depending on the value of metalness. When the material is a metal, the base color is the specific measured reflectance value at normal incidence (F0). For a non-metal the base color represents the reflected diffuse color of the material.
- metallic: Specifies the metallic scalar value of the material. Can also be used to scale the metalness values of the metallic texture.
- roughness: Specifies the roughness scalar value of the material. Can also be used to scale the roughness values of the metallic texture.
- metallicRoughnessTexture: Texture containing both the metallic value in the B channel and the roughness value in the G channel to keep better precision. Ambient occlusion can also be saved in R channel.
- environmentTexture: texture

As you are already really familiar with the Babylon Standard Material now we'll only try to address here the main differences and as the simplest setup; your only changes will be to instantiate a **PBRMetallicRoughnessMaterial** instead of a **StandardMaterial**.

```javascript
const pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
```

Apply this material to the object of your choice, e.g.:

```javascript
sphere.material = pbr;
```

Now you can define the physical based values of your material to get a great look and feel:

```javascript
pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.metallic = 0;
pbr.roughness = 1.0;
```

<Playground id="#2FDQT5" title="Roughness Using PBR" description="Simple example PBR roughness in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro1.jpg"/>

With this specific configuration, you can see that there is no reflection at all (metallic set to 0) and no specular (roughness set to 1).

If we want to introduce more reflection we can just do the opposite:

```javascript
pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.metallic = 1.0;
pbr.roughness = 0;
```

But in this case, we need something to reflect. To define this environment, just add this line:

```javascript
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
```

This call will create all required data used by the materials to produce final output.

<Playground id="#2FDQT5#11" title="Reflective Metallic Surface Using PBR" description="Simple example of a reflective metallic surface using PBR in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro2.jpg"/>

Perhaps a bit too reflective now, so let's add more roughness to give it a more golden look:

```javascript
pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.metallic = 1.0;
pbr.roughness = 0.4;
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
```

<Playground id="#2FDQT5#12" title="Reflective Surface With Roughness Using PBR" description="Simple example of a reflective surface with roughness using PBR in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro3.jpg"/>

To get more precise over how metallic and roughness on your object, you can also specify the metallicRoughnessTexture:

```javascript
pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.metallic = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
pbr.roughness = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
pbr.metallicRoughnessTexture = new BABYLON.Texture("/textures/mr.jpg", scene);
```

<Playground id="#2FDQT5#13" title="Reflective Surface With A Metallic Roughness Texture" description="Simple example of a reflective surface with a metallic roughness texture in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro4.jpg"/>

## PBRSpecularGlossinessMaterial

This material is based on five main values:

- diffuseColor / diffuseTexture: Specifies the diffuse color of the material.
- specularColor: Specifies the specular color of the material. This indicates how reflective is the material (none to mirror).
- glossiness: Specifies the glossiness of the material. This indicates "how sharp is the reflection".
- specularGlossinessTexture: Specifies both the specular color RGB and the glossiness A of the material per pixels.
- environmentTexture: texture

The setup of this material is comparable to the one used for PBRMetallicRoughnessMaterial:

```javascript
const pbr = new BABYLON.PBRSpecularGlossinessMaterial("pbr", scene);
pbr.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.glossiness = 0.4;
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
```

<Playground id="#Z1VL3V#5" title="Surface Glossiness With PBR" description="Simple example of surface glossiness with PBR in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro5.jpg"/>

The specularGlossinessTexture can then (like the metallicRoughnessTexture texture) be used to provide more control over specular and glossiness:

```javascript
pbr.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
pbr.glossiness = 1.0;
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
pbr.specularGlossinessTexture = new BABYLON.Texture("/textures/sg.png", scene);
```

<Playground id="#Z1VL3V#4" title="Glossiness Texture Added In PBR" description="Simple example of glossiness texture added in PBR in your scene." image="/img/playgroundsAndNMEs/divingDeeperPBRIntro6.jpg"/>

## Light setup

Dynamic lights are an important part of your PBR setup. You can decide to have no light and only use the environment texture to light your scene or you can decide to add additional light sources to enhance your rendering.

By default, light intensities are computed using the inverse squared distance from the source. This is a type of falloff that is pretty close from what light does in real life. So, the further you are, the bigger your intensity will need to be to reach a surface.

To even go further, the intensity you define on the lights follows physics notions:

- Point and Spot lights are defined in luminous intensity (candela, m/sr)
- Directional and Hemispheric lights in illuminance (nit, cd/m2)

You'll find more info about how dynamic lighting works in mastering PBR but first we look at using high dynamic range (HDR) for use with PBR
