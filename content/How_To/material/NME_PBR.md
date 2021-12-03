---
title: Node Material and PBR
image-url: /img/defaultImage.png
description: Using Physically Based Rendering with the Node Material.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor
further-reading:
video-overview:
video-content:
---

## Creating PBR materials

It is incredibly easy to utilize Physically Based Rendering with Node Materials thanks to the PBRMettalic_Roughness block.

You can use these playgrounds and materials as starting points for your own experiments to create PBR materials in the NME (note that the node material may take some time to load in the PG - the mesh will stay black until the material is loaded):

-   Full use of all PBR blocks:
-   PG: <Playground id="#D8AK3Z#16" title="PBR Blocks Playground" description="Playground of the full use of PBR blocks in NME." image="/img/playgroundsAndNMEs/PGPBRNME.jpg" isMain={true} category="Node Material"/>
-   Material: <nme id="#EPY8BV#6" title="PBR Blocks NME" description="Node Material Editor of the full use of PBR blocks." image="/img/playgroundsAndNMEs/NMEPBRNME.jpg"/>
-   PBR material with sheen only:
    -   PG: <Playground id="#MUX769#4" title="PBR Blocks Sheen Only Playground" description="Playground of PBR blocks in NME using sheen only." image="/img/playgroundsAndNMEs/PGPBRSheenNME.jpg"/>
    -   Material: <nme id="#V3R0KJ" title="PBR Blocks Sheen Only NME" description="Node Material Editor of PBR blocks using sheen only." image="/img/playgroundsAndNMEs/NMEPBRSheenNME.jpg"/>
-   PBR material with clear coat only:
    -   PG: <Playground id="#0XSPF6#6" title="PBR Blocks Clear Coat Only NME" description="Playground of PBR blocks in NME using clear coat only." image="/img/playgroundsAndNMEs/PGPBRclearCoatNME.jpg"/>
    -   Material: <nme id="#C3NEY1#4" title="PBR Blocks Sheen Only NME" description="Node Material Editor of PBR blocks using clear coat only." image="/img/playgroundsAndNMEs/NMEPBRclearCoatNME.jpg"/>
-   PBR material with sub surface only:
    -   PG: <Playground id="#7QAN2T#8" title="PBR Blocks sub surface Only Playground" description="Playground of PBR blocks in NME using sub surface only." image="/img/playgroundsAndNMEs/PGPBRsubSurfaceNME.jpg"/>
    -   Material: <nme id="#100NDL#1" title="PBR Blocks sub surface Only NME" description="Node Material Editor of PBR blocks using sub surface only." image="/img/playgroundsAndNMEs/NMEPBRsubSurfaceNME.jpg"/>

The inputs of the different PBR blocks are using the same names as in the `PBRMetallicRoughnessMaterial` class, so you can refer to [this doc](/typedoc/classes/babylon.pbrmetallicroughnessmaterial) for explanations about them.

Some of the parameters are available as properties when clicking on the block in the NME.

For eg, for `Reflection`:

![Reflection properties](/img/how_to/Materials/nme_reflection_prop.png)

Or for `PBRMetallicRoughness`:

![PBR properties](/img/how_to/Materials/nme_pbr_prop.png)

As for the standard `PBRMaterial`, if no texture is provided for the **Reflection** / **Refraction** texture, the one declared at the scene level (`scene.environmentTexture`) is used instead.

By default, if something is connected to the `a` input of the `FragmentOutput` block, alpha blending is enabled. If you don't need alpha blending, don't connect this input.

Regarding the `PBRMetallicRoughness` block, you have access to each output component separately (`ambient`, `diffuse`, `specular`, ...) if you want or you can directly use `lighting` to get the composite output. In the names of the separate outputs, `dir` means `direct` (component from direct lights) and `Ind` means `Indirect` (component from indirect lighting, meaning the environment).

A note about image processing and manual compositing: Note that the composited `lighting` output of the `PBRMetallicRoughness` block also adds image processing from the scene. If you desire to to add additional components to the standard lighting setup, you will want to do the compositing yourself, using the separated components. The outputs of the separated components are in Linear color space. This is important because if you desire to calculate scene image processing in your manual composite, you'll need the `ImageProcessing` block. This block assumes input values in gamma color space by default and runs an internal conversation to a linear color space output. You will need to turn this conversion off in the `ImageProcessing` block properties to pass linear through without a conversion. 

<Youtube id="CRg8P1Af1M0"/>