---
title: OpenPBR
image:
description: Read about the support of OpenPBR in Babylon.js and learn about its features.
keywords: diving deeper, materials, PBR, Physically Based Rendering, OpenPBR
further-reading:
video-overview:
video-content:
---

## Introduction

[OpenPBR](https://github.com/AcademySoftwareFoundation/OpenPBR?tab=readme-ov-file) is an open standard developed by Autodesk and Adobe, that defines an artist friendly material model and with a focus on interoperability. Materials authored using it should have a consistent look on platforms that support OpenPBR.

The implementation of OpenPBR support in Babylon.js has started and its status is listed below.


## OpenPBR model description

OpenPBR is a so-called über shader. Unlike node based or closure based models like MaterialX or MDL, which allow to describe arbitrarily complex shaders, OpenPBR has a fixed material structure. This saves valuable time because the structure is already designed (by gauging the most valuable material features to cover the majority of production needs), but is less flexible and will not cover all possible cases.


## OpenPBR support in Babylon.js

The parameters controlling the behaviour of the different parts of the material are organised in groups: Base, Specular, Transmission, Subsurface, Coat, Fuzz, Emission, Thin-film, Geometry.


### Base

Most of the Base group is already expected to work in Babylon.js. One notable missing element is the new [energy conserving Oren-Nayar diffuse model](https://arxiv.org/abs/2410.18026) introduced for OpenPBR.

| Parameter                | Support in Babylon.js |
| ------------------------ | --------------------- |
| `base_weight`            | Present as `PBRBaseMaterial._baseWeightTexture` and `_baseWeight` |
| `base_color`             | Present as `PBRBaseMaterial._albedoTexture` and `_albedoColor` |
| `base_metalness`         | Present as `PBRBaseMaterial._metallicTexture` and `_metallic` |
| `base_diffuse_roughness` | Missing. |


### Specular

In OpenPBR, the specular lobe uses the F82-tint model and a new anisotropy parametrisation.

| Parameter                       | Support in Babylon.js |
| ------------------------------- | --------------------- |
| `specular_weight`               | Missing               |
| `specular_color`                | To be evaluated       |
| `specular_roughness`            | Present as `PBRBaseMaterial._microSurfaceTexture` and `_roughness` |
| `specular_roughness_anisotropy` | To be evaluated       |
| `specular_ior`                  | To be evaluated       |


### Transmission

In OpenPBR, Transmission represents the volume part in which scattering is limited or absent.

| Parameter                             | Support in Babylon.js |
| ------------------------------------- | --------------------- |
| `transmission_weight`                 | To be evaluated       |
| `transmission_color`                  | To be evaluated       |
| `transmission_depth`                  | To be evaluated       |
| `transmission_scatter`                | To be evaluated       |
| `transmission_scatter_anisotropy`     | To be evaluated       |
| `transmission_dispersion_scale`       | To be evaluated       |
| `transmission_dispersion_abbe_number` | To be evaluated       |


### Subsurface

In OpenPBR, Subsurface represents the volume part in which scattering is strong.

| Parameter                       | Support in Babylon.js |
| ------------------------------- | --------------------- |
| `subsurface_weight`             | To be evaluated       |
| `subsurface_color`              | To be evaluated       |
| `subsurface_radius`             | To be evaluated       |
| `subsurface_radius_scale`       | To be evaluated       |
| `subsurface_scatter_anisotropy` | To be evaluated       |


### Coat

| Parameter                   | Support in Babylon.js |
| --------------------------- | --------------------- |
| `coat_weight`               | Present as `PBRClearCoatConfiguration.intensity` |
| `coat_color`                | Present as `PBRClearCoatConfiguration.tintColor` |
| `coat_roughness`            | Present as `PBRClearCoatConfiguration.roughness` |
| `coat_roughness_anisotropy` | Missing               |
| `coat_ior`                  | Present as `PBRClearCoatConfiguration.indexOfRefraction` |
| `coat_darkening`            | Missing               |


### Fuzz

What OpenPBR refers to as "Fuzz" is what some models call "Sheen", but expressive enough to cover cases like clothes or dust.

| Parameter        | Support in Babylon.js |
| ---------------- | --------------------- |
| `fuzz_weight`    | To be evaluated       |
| `fuzz_color`     | To be evaluated       |
| `fuzz_roughness` | To be evaluated       |


### Emission

In OpenPBR, the emissive properties of a material are given in physical units. This requires the renderer to handle physical light units to get a correct result.

| Parameter            | Support in Babylon.js |
| -------------------- | --------------------- |
| `emission_luminance` | To be evaluated       |
| `emission_color`     | To be evaluated       |


### Thin-film

In OpenPBR, iridescence uses a thin-film model. Iridescence is already supported in Babylon.js and exposes similar parameters, but the model might be different.

| Parameter             | Support in Babylon.js |
| --------------------- | --------------------- |
| `thin_film_weight`    | Present as `PBRIridescenceConfiguration.intensity` |
| `thin_film_thickness` | Exposed as `PBRIridescenceConfiguration.thicknessTexture` with `minimumThickness` and `maximumThickness` |
| `thin_film_ior`       | Present as `PBRIridescenceConfiguration.indexOfRefraction` |


### Geometry

OpenPBR only describes the material, but it expects to be given certain information about the geometry.

| Parameter               | Support in Babylon.js |
| ----------------------- | --------------------- |
| `geometry_opacity`      | To be evaluated       |
| `geometry_thin_walled`  | To be evaluated       |
| `geometry_normal`       | To be evaluated       |
| `geometry_tangent`      | To be evaluated       |
| `geometry_coat_normal`  | To be evaluated       |
| `geometry_coat_tangent` | To be evaluated       |
