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

In OpenPBR, a surface material is considered to be made of "slabs", that can be mixed or layered. The slabs that compose the OpenPBR are organised as shown in this diagram from the official documentation:

FIXME: diagram


## OpenPBR support in Babylon.js

The parameters controlling the behaviour of the different parts of the material are organised in groups: Base, Specular, Transmission, Subsurface, Coat, Fuzz, Emission, Thin-film, Geometry.


### Base

Most of the Base group is already expected to work in Babylon.js. One notable missing element is the new [energy conserving Oren-Nayar](https://arxiv.org/abs/2410.18026) introduced for OpenPBR.

| Parameter                | Support in Babylon.js |
| ------------------------ | --------------------- |
| `base_weight`            | Newly implemented |
| `base_color`             | Corresponds to the `albedoColor` input |
| `base_metalness`         | Strictly equivalent to the `metallic` input |
| `base_diffuse_roughness` | The diffuse parameter is missing, and the implemented diffuse is a different model. |


### Specular

In OpenPBR, the specular lobe uses the F82-tint model and a new anisotropy parametrisation.

| Parameter                       | Support in Babylon.js |
| ------------------------------- | --------------------- |
| `specular_weight`               | FIXME                 |
| `specular_color`                | FIXME                 |
| `specular_roughness`            | Strictly equivalent to the `roughness` input |
| `specular_roughness_anisotropy` | FIXME                 |
| `specular_ior`                  | FIXME                 |


### Transmission

In OpenPBR, Transmission represents the volume part in which scattering is limited or absent.

| Parameter                             | Support in Babylon.js |
| ------------------------------------- | --------------------- |
| `transmission_weight`                 | FIXME                 |
| `transmission_color`                  | FIXME                 |
| `transmission_depth`                  | FIXME                 |
| `transmission_scatter`                | FIXME                 |
| `transmission_scatter_anisotropy`     | FIXME                 |
| `transmission_dispersion_scale`       | FIXME                 |
| `transmission_dispersion_abbe_number` | FIXME                 |


### Subsurface

In OpenPBR, Subsurface represents the volume part in which scattering is strong.

| Parameter                       | Support in Babylon.js |
| ------------------------------- | --------------------- |
| `subsurface_weight`             | FIXME                 |
| `subsurface_color`              | FIXME                 |
| `subsurface_radius`             | FIXME                 |
| `subsurface_radius_scale`       | FIXME                 |
| `subsurface_scatter_anisotropy` | FIXME                 |


### Coat

| Parameter                   | Support in Babylon.js |
| --------------------------- | --------------------- |
| `coat_weight`               | FIXME                 |
| `coat_color`                | FIXME                 |
| `coat_roughness`            | FIXME                 |
| `coat_roughness_anisotropy` | FIXME                 |
| `coat_ior`                  | FIXME                 |
| `coat_darkening`            | FIXME                 |


### Fuzz

What OpenPBR refers to as "Fuzz" is what some models call "Sheen", but expressive enough to cover cases like clothes or dust.

| Parameter        | Support in Babylon.js |
| ---------------- | --------------------- |
| `fuzz_weight`    | FIXME                 |
| `fuzz_color`     | FIXME                 |
| `fuzz_roughness` | FIXME                 |


### Emission

In OpenPBR, the emissive properties of a material are given in physical units. This requires the renderer to handle physical light units to get a correct result.

| Parameter            | Support in Babylon.js |
| -------------------- | --------------------- |
| `emission_luminance` | FIXME                 |
| `emission_color`     | FIXME                 |


### Thin-film

In OpenPBR, iridescence uses a thin-film model.

| Parameter             | Support in Babylon.js |
| --------------------- | --------------------- |
| `thin_film_weight`    | FIXME                 |
| `thin_film_thickness` | FIXME                 |
| `thin_film_ior`       | FIXME                 |


### Geometry

OpenPBR only describes the material, but it expects to be given certain information about the geometry.

| Parameter               | Support in Babylon.js |
| ----------------------- | --------------------- |
| `geometry_opacity`      | FIXME                 |
| `geometry_thin_walled`  | FIXME                 |
| `geometry_normal`       | FIXME                 |
| `geometry_tangent`      | FIXME                 |
| `geometry_coat_normal`  | FIXME                 |
| `geometry_coat_tangent` | FIXME                 |
