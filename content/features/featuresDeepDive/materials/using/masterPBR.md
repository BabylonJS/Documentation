---
title: Mastering PBR Materials
image:
description: Dive further into learning about PBR materials in Babylon.js.
keywords: diving deeper, materials, PBR, Physically Based Rendering, HDR, Environment
further-reading:
video-overview:
video-content:
---

## Introduction

The two simplified versions of PBR Materials, e.g. _PBRSpecularGlossinessMaterial_ and _PBRMetallicRoughnessMaterial_, are a good introduction to PBR. However, using PBRMaterial itself gives you more control over the material through features such as

- Refraction
- Standard Light Falloff
- LightMaps
- Dedicated image processing

[**Demo Scene - PBR Materials**](https://www.babylonjs.com/Demos/PBRRough/)

This page addresses _the differences_ between PBRMaterial and its simpler versions.

## From MetallicRoughness To PBRMaterial

To set up PBRMaterial in Metallic/Roughness mode, at least one of the following properties has to be set (otherwise it works in Specular/Glossiness mode by default):

- metallic
- roughness
- metallicTexture

To switch from PBRMetallicRoughnessMaterial to the more fully featured PBRMaterial, a few properties need to be renamed (this rename was not done in the richer material in order to keep backward compatibility with prior versions):

| PBRMetallicRoughnessMaterial | PBRMaterial            |
| ---------------------------- | ---------------------- |
| baseColor                    | albedoColor            |
| baseTexture                  | albedoTexture          |
| metallicRoughnessTexture     | metallicTexture        |
| environmentTexture           | reflectionTexture      |
| normalTexture                | bumpTexture            |
| occlusionTexture             | ambientTexture         |
| occlusionStrength            | ambientTextureStrength |

As the channels used for metallic or roughness can be customized, you will need to add the following flags to set it up like the simpler material:

```javascript
pbr.useRoughnessFromMetallicTextureAlpha = false;
pbr.useRoughnessFromMetallicTextureGreen = true;
pbr.useMetallnessFromMetallicTextureBlue = true;
```

<Playground id="#2FDQT5#14" title="Customizing Metallic Surfaces In PBR" description="Simple example of customizing metallic surfaces in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster1.webp"/>

Once the conversion is done, let's see the custom options available in this version:

- **useRoughnessFromMetallicTextureAlpha**: the metallic texture contains the roughness information in its alpha channel.
- **useRoughnessFromMetallicTextureGreen**: the metallic texture contains the roughness information in its green channel (useRoughnessFromMetallicTextureAlpha needs to be false).
- **useMetallnessFromMetallicTextureBlue**: the metallic texture contains the metallic information in its blue channel (it is considered in the red channel by default).
- **useAmbientOcclusionFromMetallicTextureRed**: the metallic texture contains the ambient occlusion information in its red channel.
- **useAmbientInGrayScale**: the ambient occlusion is forced to read only from the red channel of the ambient texture or from the red channel of the metallic texture.

## From SpecularGlossiness To PBRMaterial

Setting up the PBRMaterial in Specular/Glossiness mode is different.  
The following properties need to be null or undefined:

- metallic
- roughness
- metallicTexture

To switch from the PBRSpecularGlossinessMaterial to the richer PBRMaterial, a few of the properties need to also be renamed:

| PBRSpecularGlossinessMaterial | PBRMaterial            |
| ----------------------------- | ---------------------- |
| diffuseColor                  | albedoColor            |
| diffuseTexture                | albedoTexture          |
| specularGlossinessTexture     | reflectivityTexture    |
| specularColor                 | reflectivityColor      |
| glossiness                    | microSurface           |
| normalTexture                 | bumpTexture            |
| occlusionTexture              | ambientTexture         |
| occlusionStrength             | ambientTextureStrength |

Also, as the channel used for glossiness can be customized, you will need to add the following flag to set it up like the simpler material:

```javascript
pbr.useMicroSurfaceFromReflectivityMapAlpha = false;
```

<Playground id="#Z1VL3V#8" title="Customizing Glossiness Surfaces In PBR" description="Simple example of customizing glossiness surfaces in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster2.webp"/>

Once the conversion is done, let's see the custom options available in this version:

- **microSurfaceTexture**: Enables the ability to store the glossiness on the red channel of a separate texture.
- **useAlphaFromAlbedoTexture**: the opacity information is contained in the alpha channel of the albedo texture.
- **useMicroSurfaceFromReflectivityMapAlpha**: the reflectivity texture contains the microSurface or glossiness information in its alpha channel.
- **useAmbientInGrayScale**: the ambient occlusion is forced to read only from the red channel of the ambient texture or from the red channel of the metallic texture.

## Controlling Specular Reflections on Metallic-Roughness Materials
Specular reflections are heavily influenced by the Fresnel Effect, which states that the amount of light reflected from a surface depends on the angle from which it is viewed. The point at which a surface is perpendicular to the viewing angle is considered Fresnel Zero or Fresnel at 0 degrees which can be shortened to F0. Typically, a smooth dielectric material will reflect between 2% and 5% of the light hitting the surface at F0. Surfaces that are mostly parallel to the viewing angle are considered grazing angles and are referred to as Fresnel at 90 degrees or F90. At F90, a smooth dielectric material will reflect nearly 100% of light hitting the surface. Normally, when using a PBR Metallic-Roughness material the reflectance values for F0 are hard-coded in the shader and reflectance colors for dielectric materials come from light color. 

There are times, however, when having control over the power or color of the specular reflections of a PBR metallic-roughness material is desirable. Further, there are substances that can’t be accurately rendered without this type of control. A PBR specular-glossiness material can be used for these types of substances, but there are ways to use a metallic-roughness material to render a substance which needs modification to its specular reflections.

For glTF models, there is a [Khronos extension called `KHR_materials_specular`](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_specular) which adds `specular` and `specularColor` parameters to the metallic-roughness material. Additionally, the extension allows using textures to control these values through `specularTexture` and `specularColorTexture`. These parameters affect the dielectric BRDF to change the specular power or color of F0 reflections, previously only attainable using specular-glossiness materials. If a glTF file is authored with this extension, the Babylon.js loaders will translate the glTF material description to a `PBRMaterial` with the parameters set correctly.

Babylon.js materials constructed as metallic-roughness can also exert control over specular highlights through several parameters on `PBRMaterial`. Beyond the basic setup of the material, these parameters need to be defined to shape specular reflections.

- **metallicF0Factor**: This is the same as `specularFactor` from `KHR_materials_specular`. This parameter is multiplied with `metallicReflectanceColor` to control the intensity of specular reflections.
- **metallicReflectanceColor**: This is the same as `specularColorFactor` from `KHR_materials_specular`. This parameter sets specular color at F0. As surface normals move toward F90, this value is interpolated to white.
- **metallicReflectanceTexture**: This is a texture that holds values for `metallicReflectanceColor` in the RGB channels and values for `metallicF0Factor` in the Alpha channel. The texture components are multiplied with `metallicReflectanceColor` and `metallicF0Factor` when calculating the final specular contribution. This texture can be used as a single input for both `metallicReflectanceColor` and `metallicF0Factor` if authoring a `PBRMaterial` right in engine. However, if working with textures from a glTF file authored with the `KHR_material_specular` extension, this parameter acts as `specularTexture` as defined in the extension. This is because the extension defines `specularTexture` and `specularColorTexture` as two different textures with `specularTexture` holding the strength of specular reflections in the alpha channel. If working with `KHR_material_specular` textures, assign the texture defined as `specularTexture` to the `metallicReflectanceTexture` parameter and set the `useOnlyMetallicFromMetallicReflectanceTexture` parameter to true.
- **reflectanceTexture**: This is the same as `specularColorTexture` from `KHR_materials_specular`. The color stored in the texture’s RGB channels is multiplied with `metallicReflectanceColor` and scaled by `metallicF0Factor` to produce the final specular contribution **only if** there is no texture assigned to `metallicReflectanceTexture` *or* `useOnlyMetallicFromMetallicReflectanceTexture` is set to true. Otherwise, any texture assigned to `metallicReflectanceTexture` will have its RGB channels used in place of this texture.
- **useOnlyMetallicFromMetallicReflectanceTexture**: If this parameter is set to true, only the Alpha channel of `metallicReflectanceTexture` is used in lighting calculations. This parameter is important if using textures authored for the `KHR_material_specular` extension because if both `metallicReflectanceTexture` and `reflectanceTexture` are assigned textures, `metallicReflectanceTexture` will be used by default unless `useOnlyMetallicFromMetallicReflectanceTexture` is set to true. If the parameter is set to true, the RGB channels of the texture assigned to `reflectanceTexture` will be used to determine values for `metallicReflectanceColor`.

To help illustrate how these parameters work together, consider the following snippets of code, which are all valid approaches to controlling specular reflections in a metallic-roughness material.

```javascript
// creating material from scratch using only metallicReflectanceTexture 
// metReflectTex.rgb * metallicReflectanceColor scaled 
// by metReflectTex.a * metallicF0Factor
let pbrMat = new BABYLON.PBRMaterial("pbrMat", scene);
pbrMat.metallicF0Factor = 0.9;
pbrMat.metallicReflectanceColor = new BABYLON.Color3(0.63, 0.12, 0.12);
pbrMat.metallicReflectanceTexture = new BABYLON.Texture("metReflectTex.png", scene);

// creating material from scratch using only reflectanceTexture
// reflectTex.rgb * metallicReflectanceColor scaled by metallicF0Factor
let pbrMat = new BABYLON.PBRMaterial("pbrMat", scene);
pbrMat.metallicF0Factor = 0.9;
pbrMat.metallicReflectanceColor = new BABYLON.Color3(0.63, 0.12, 0.12);
pbrMat.reflectanceTexture = new BABYLON.Texture("reflectTex.png", scene);

// creating material from KHR_material_specular textures
// specularColorTexture.rgb * metallicReflectanceColor scaled 
// by specularTexture.a * metallicF0Factor
let pbrMat = new BABYLON.PBRMaterial("pbrMat", scene);
pbrMat.metallicF0Factor = 0.9;
pbrMat.metallicReflectanceColor = new BABYLON.Color3(0.63, 0.12, 0.12);
pbrMat.metallicReflectanceTexture = new BABYLON.Texture("specularTexture.png", scene);
pbrMat.reflectanceTexture = new BABYLON.Texture("specularColorTexture.png", scene);
pbrMat.useOnlyMetallicFromMetallicReflectanceTexture = true;

```
<Playground id="#FU2ZQ7" title="Specular Reflections Using PBRMaterial" description="How to control specular reflections on a PBR Metallic-Roughness material." image="/img/playgroundsAndNMEs/pbrMaterial_specular.webp"/>


## Opacity

Another interesting addition to reflection is the ability to keep the most luminous part of the reflection over a transparent surface. It may not sound intuitive at first, but if you look through a window at night from a lit room, you can see the reflection of lights or a TV on the glass. The same is true for reflection in the PBR Material. A special property, `pbr.useRadianceOverAlpha = true;`, has been added to let you control this effect. Not only reflection (AKA radiance), but also specular highlights can be seen on top of transparency.

<Playground id="#19JGPR#13" title="Opacity In PBR" description="Simple example of opacity in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster3.webp"/>

```javascript
glass.reflectionTexture = hdrTexture;
glass.alpha = 0.5;
```

This behavior can be turned off through the properties:

```javascript
useRadianceOverAlpha = false;
useSpecularOverAlpha = false;
```

## Refraction (Back Compat)

Refraction is a little bit like reflection (please, purists, do not kill me now—I only said a little) because it relies heavily on the environment to change the way the material looks. Basically, if reflection could be compared to seeing the sun and clouds on the surface of a lake, refraction would be like seeing oddly shaped fish under the surface (through the water). There is more on refraction on the next page.

As refraction is equivalent to how you can **see through different material boundaries**, the effect can be controlled through transparency in BJS. A special property helps you do this: simply put `pbr.linkRefractionWithTransparency=true;` in your code, and then alpha will control how refractive the material is. Setting it to false leaves alpha controlling the default transparency.

<Playground id="#19JGPR#12" title="Refraction In PBR" description="Simple example of refraction in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster4.webp"/>

```javascript
const glass = new BABYLON.PBRMaterial("glass", scene);
glass.reflectionTexture = hdrTexture;
glass.refractionTexture = hdrTexture;
glass.linkRefractionWithTransparency = true;
glass.indexOfRefraction = 0.52;
glass.alpha = 0; // Fully refractive material
```

You can still notice some reflection on your material due to energy conservation. Please note that, since 4.0, you should rely on the settings in the next section to define everything that affects what happens under the material surface. But don't worry: we will keep the current setup in place for backward compatibility.

## Sub Surface

The sub surface section of the material defines everything happening below the surface. It currently supports Refraction and Translucency.

## Refraction

I will not redefine the refraction component here, as it has been addressed in the previous section, but will only highlight the main differences [here](/features/featuresDeepDive/materials/using/reflectionTexture).

Enabling the refraction would be done through a flag on the sub surface section:

<Playground id="#FEEK7G#17" title="Enabling Refraction In PBR" description="Simple example of how to enable refraction in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster5.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isRefractionEnabled = true;
pbr.subSurface.refractionIntensity = 0.8;
```

As before you can control the index of refraction:
<Playground id="#FEEK7G#24" title="Controlling The Index Of Refraction" description="Simple example of how to control the index of refraction in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster6.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isRefractionEnabled = true;
pbr.subSurface.indexOfRefraction = 1.5;
```

Please note that here the index of refraction represents the value you can find in the nomenclature and not its inverse like in the legacy setup.

You can control the tint of the material (representing its color below the surface) by configuring two properties:

- `tintColor`: defines the color of the tint.
- `tintColorAtDistance`: defines at what distance under the surface the color should be the defined one (simulating absorption through beer lambert law).

<Playground id="#FEEK7G#25" title="Color Control In PBR" description="Simple example of how to control color in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster7.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isRefractionEnabled = true;
pbr.subSurface.indexOfRefraction = 1.5;
pbr.subSurface.tintColor = BABYLON.Color3.Teal();
```

By default, the thickness of the material is understood to be the `maxThickness` value of the subSurface. You can easily change the thickness by relying on a thickness map:

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isRefractionEnabled = true;
pbr.subSurface.indexOfRefraction = 1.5;
pbr.subSurface.tintColor = BABYLON.Color3.Teal();

pbr.subSurface.thicknessTexture = texture;
pbr.subSurface.minimumThickness = 1;
pbr.subSurface.maximumThickness = 10;
```

The actual thickness per pixel would then be `minimumThickness + thicknessTexture.r * maximumThickness`. This helps clamp the actual value between a minimum and maximum defined by a texture.

## Translucency

Refraction is good for representing light passing through a low-density medium such as beer or wine. But what if your material were denser, like milk, where the light would be diffused throughout the material?

![SubSurface](/img/extensions/PBRSubSurface.webp)

In this case, you can rely on the translucency properties of the material.

<Playground id="#FEEK7G#37" title="Translucency In PBR" description="Simple example of how to control translucency in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster8.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isTranslucencyEnabled = true;
pbr.subSurface.translucencyIntensity = 0.8;
```

Sharing some setup with refraction (which makes sense, as we are talking about the same material), you can rely on the tint color to define the color of the material below the surface:

<Playground id="#FEEK7G#27" title="Tint Color In PBR" description="Simple example of how to control tint color in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster9.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isTranslucencyEnabled = true;
pbr.subSurface.tintColor = BABYLON.Color3.Teal();
```

The setup is identical, relying on both previously defined values:

- `tintColor`: defines the color of the tint.
- `tintColorAtDistance`: defines at what distance under the surface the color should be the defined one (simulating absorption through beer lambert law).

It also fully respects the previously defined thickness configuration: the actual thickness per pixel would then be `minimumThickness + thicknessTexture.r * maximumThickness`.

## Scattering

To add another layer of detail to what really happens beneath the surface of the material, you can add scattering. It simulates the small bounces of light that take place inside the material, causing light to exit at a different location from where it entered.

It can be really useful on materials like skin, foliage, wax, dense colored liquids, ice cubes, gemstones, etc.

You can use this in addition to translucency to accurately represent the spread of light inside the material.

![SubSurfaceScattering](/img/extensions/PBRSubSurfaceScattering.webp)

<Playground id="#5H0H89#5" title="Sub-Surface Scattering In PBR" description="Simple example of how to control sub-surface scattering color in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster10.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

scene.enableSubSurfaceForPrePass().metersPerUnit = 0.01;

pbr.metallic = 0;
pbr.roughness = 0.2;

pbr.subSurface.isScatteringEnabled = true;
```

For this effect to be physically accurate, you have to indicate the ratio between scene units and the real world distance in meters, by filling the property `metersPerUnit` of the scene pre-pass renderer. It is by default set to 1 meter = 1 unit.

### Diffusion profiles

Pushing realism even further, material volume albedo affects how far light travels inside the material. Thus, you can register your material profile as the average volumetric albedo it is made of.

Let's say you want a skin-tone diffusion profile. You can add this to your subsurface configuration by doing:

<Playground id="#W7DYG2#144" title="Skin Tone Using A Diffusion Profile In PBR" description="Simple example of skin tone using a diffusion profile in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster11.webp"/>

```javascript
pbr.subSurface.scatteringDiffusionProfile = new BABYLON.Color3(0.75, 0.25, 0.2);
```

You can have up to 5 different colors registered as diffusion profiles.

_Warning ! Performance and compatibility notice_

This effect uses a lot of WebGL 2 structures under the hood, so it is only compatible with WebGL 2.
Furthermore, please note that the use of subsurface scattering triggers a post-process, and it adds a lot of additional work for the GPU.  
In other words, use it wisely, and keep in mind that smaller GPUs won't necessarily have the resources to run this effect.

## Mask

If you want to define the intensity of the different effects (Refraction or Translucency), you can use the leftover channels of the thickness map. As we are trying to limit the overall number of textures used in materials, we decided to pack the mask information into the g channel for the translucency intensity factor and the alpha channel for the refraction intensity (b has been reserved for the next release).

As this might be counterintuitive considering the black and white texture generated by external tools, we put this feature under an opt-in flag to prevent any surprises:

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
sphere.material = pbr;

pbr.metallic = 0;
pbr.roughness = 0;

pbr.subSurface.isRefractionEnabled = true;
pbr.subSurface.indexOfRefraction = 1.5;

pbr.subSurface.isTranslucencyEnabled = true;
pbr.subSurface.translucencyIntensity = 0.8;

pbr.subSurface.tintColor = BABYLON.Color3.Teal();

pbr.subSurface.thicknessTexture = texture;
pbr.subSurface.minimumThickness = 1;
pbr.subSurface.maximumThickness = 10;

pbr.subSurface.useMaskFromThicknessTexture = true;
```

## Clear Coat

Clear coat is a way to simulate the coating you can find in automotive car paint, for instance. It is usually a transparent layer of paint that can be used to cover the colored coat.

![SubSurface](/img/extensions/PBRClearCoat.webp)

The clear coat is the upper surface of the material.

<Playground id="#FEEK7G#36" title="Clear Coat In PBR" description="Simple example of clear coat in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster12.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 0.0;
pbr.roughness = 1.0;

pbr.clearCoat.isEnabled = true;
pbr.clearCoat.intensity = 0.5;
```

As the clear coat is the final interaction layer with the external medium, it applies on top of the bump map, which can be great for simulating coating above small geometries represented by the bump map:

<Playground id="#FEEK7G#28" title="Clear Coat and Bump Map In PBR" description="Simple example of clear coat and bump map in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster13.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
// Ensures irradiance is computed per fragment to make the
// Bump visible
pbr.forceIrradianceInFragment = true;
pbr.bumpTexture = new BABYLON.Texture("textures/floor_bump.png", scene);
pbr.metallic = 0.0;
pbr.roughness = 1.0;

pbr.clearCoat.isEnabled = true;
```

This goes without saying, but sometimes even the coating has imperfections that can have a different shape from the bump map:

<Playground id="#FEEK7G#30" title="Clear Coat, Imperfections, and Bump Map In PBR" description="Simple example of clear coat, imperfections, and bump map in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster14.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
// Ensures irradiance is computed per fragment to make the
// Bump visible
pbr.forceIrradianceInFragment = true;
pbr.bumpTexture = new BABYLON.Texture("textures/floor_bump.png", scene);
pbr.metallic = 0.0;
pbr.roughness = 1.0;

pbr.clearCoat.isEnabled = true;
const coatBump = new BABYLON.Texture("textures/waterbump.png", scene);
pbr.clearCoat.bumpTexture = coatBump;
```

This is all great, but what about a different color (not all coatings are transparent—think about the coating around candies)? You can control the tint of the clear coat through four properties:

- `isTintEnabled`: enables or disables the tint.
- `tintColor`: defines the main color of the tint.
- `tintColorAtDistance`: defines at what distance under the surface the color should be the defined one.
- `tintThickness`: defines the thickness of the coating.

It is intuitive enough to understand that the thicker the coat is, the darker the color of the surface under the coating will appear. We carefully follow [Beer Lambert's law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) in order to deduce the final color based on the chosen color, the "at distance" value, and the thickness.

<Playground id="#FEEK7G#7" title="Clear Coat Thickness In PBR" description="Simple example of clear coat thickness in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster15.webp"/>

```javascript
pbr.clearCoat.isTintEnabled = true;
pbr.clearCoat.tintColor = BABYLON.Color3.Teal();
pbr.clearCoat.tintColorAtDistance = 1;
pbr.clearCoat.tintThickness = 1.5;
```

By default, the clear coat is fully glossy. Yet, you can define a special roughness value for the coating, simulating, for instance, a worn coating:

<Playground id="#FEEK7G#31" title="Clear Coat Roughness In PBR" description="Simple example of clear coat roughness in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster16.webp"/>

```javascript
pbr.clearCoat.roughness = 0.15;
```

Finally, you can play with the Index of Refraction of the coating to change the Fresnel effect applied to the environment. The default configuration represents a polyurethane layer:

<Playground id="#FEEK7G#50" title="Clear Coat Index Of Refraction In PBR" description="Simple example of clear coat index of refraction in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster17.webp"/>

```javascript
pbr.clearCoat.isTintEnabled = true;
pbr.clearCoat.indexOfRefraction = 2;
```

For convenience, all of the configuration here can also be stored in textures:

- `texture`: defines the clear coat basic data. r is an intensity factor, and g is a roughness factor.
- `bumpTexture`: defines the clear coat specific bump texture.
- `tintColorAtDistance`: defines at what distance under the surface the color should be the defined one.
- `tintTexture`: defines the clear tint values in a texture. rgb is tint and a is a thickness factor.

## Iridescence

Iridescence is a way to simulate the thin film effect you can find on thin layers of oils on the ground. It usually looks like amazing rainbow colors.

![Iridescence](/img/extensions/PBRIridescence.webp)

In the PBR material, you can enable iridescence with the following code:

<Playground id="#2FDQT5#1505" title="Iridescence In PBR" description="Simple example of iridescence in PBR." image="/img/extensions/PBRIridescence.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.iridescence.isEnabled = true;
pbr.iridescence.intensity = 0.9;
```

You can control the iridescence index of refraction and thickness through their relative properties:

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.iridescence.isEnabled = true;
pbr.iridescence.indexOfRefraction = 1.3;
pbr.iridescence.minimumThickness = 100; // in nanometers
pbr.iridescence.maximumThickness = 400; // in nanometers
```

By default, the thickness will be used as a fixed value equal to the maximum thickness.

To provide more control, a texture can be used to control the intensity. The value of the R channel will be used to deduce the thickness from the interpolation between min and max thickness:

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.iridescence.isEnabled = true;
pbr.iridescence.texture = intensityTexture;
```

Similarly, a texture can also be used to control thickness (it will be read from the G channel):

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.iridescence.isEnabled = true;
pbr.iridescence.thicknessTexture = thicknessTexture;
```

The thickness read from the texture will be considered as a percentage of how thick it is between the minimumThickness and maximumThickness.

## Anisotropy

By default, the PBR material is isotropic. This means the shape of the reflection is identical in every direction. Nevertheless, in real life some materials show very elongated highlights. For instance, when looking at an old vinyl disc (yes, I am that old), you can see the specular lighting spreading from the center to the edge:

![Anisotropy](/img/extensions/PBRAnisotropy.webp)

<Youtube id="Zk0A5UzNLNw"/>

In the PBR material, you can enable anisotropy with the following code:

<Playground id="#FEEK7G#10" title="Anisotropy In PBR" description="Simple example of anisotropy in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster18.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.anisotropy.isEnabled = true;
pbr.anisotropy.intensity = 0.5;
```

Please note that the anisotropic effect follows the tangent space of the material and thus requires it to be well-defined. As you can notice in the previous demo, I used a highly tessellated sphere to make the effect look right. The best effect would be achieved by defining the tangents of your meshes.

The anisotropic direction is by default along the tangent direction. You can modify it by using the following parameter:

<Playground id="#FEEK7G#32" title="Modified Anisotropy In PBR" description="Simple example of modified anisotropy in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster19.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.anisotropy.isEnabled = true;
pbr.anisotropy.direction.x = 0.5;
pbr.anisotropy.direction.y = 1;
```

As usual, you can control all of those parameters by using a dedicated texture. rg is direction (stored like bump map) b is an intensity factor.

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.anisotropy.isEnabled = true;
pbr.anisotropy.texture = texture;
```

## Sheen

Some materials have totally different shapes for the specular lobe. By default, the specular lobe in the PBR material is not well suited to the wide specular lobe seen on fabric materials like satin. This is the main reason we introduced sheen in the material, so that since 4.0 you can represent fabric materials using PBR.

In the PBR material, you can enable sheen with the following code:

<Playground id="#FEEK7G#33" title="Sheen In PBR" description="Simple example of sheen in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster20.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 1.0;
pbr.roughness = 0.0;

pbr.sheen.isEnabled = true;
pbr.sheen.intensity = 0.5;
```

Please note that the sheen effect will only be useful on rough dielectric materials (metallic = 0). Actually, if the roughness is small, the shape of the specular lobe is so thin that you would not see any differences with the none sheen specular lobe.

To help with multicolor materials like certain kinds of satin, you can control the tint of the sheen with the following code:

<Playground id="#FEEK7G#35" title="Multi Color In PBR" description="Simple example of multi color in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster21.webp"/>

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 0.0;
pbr.roughness = 0.5;

pbr.sheen.isEnabled = true;
pbr.sheen.color = BABYLON.Color3.Red();
```

As usual, you can control all of those parameters by using a dedicated texture. rgb is tint and a is an intensity factor.

```javascript
const pbr = new BABYLON.PBRMaterial("pbr", scene);
pbr.metallic = 0.0;
pbr.roughness = 0.5;

pbr.sheen.isEnabled = true;
pbr.sheen.texture = texture;
```

## Normal Map / Parallax

Normal mapping and Parallax are supported in the exact same way as the standard material. Please, refer to the following links for more information:

- [Normal Map](/features/featuresDeepDive/materials/using/normalMaps)
- [Parallax](/features/featuresDeepDive/materials/using/parallaxMapping)

## LightMaps

LightMaps are available in the same way they are in the standard material by assigning a texture to the `lightmapTexture` property. This can also be used as a shadowMap instead by switching the dedicated control flag `useLightmapAsShadowmap` to true.

<Playground id="#V5R1J0" title="Simple lightmap example" description="Simple example of how to use lightmaps in PBR."/>

## Image Processing

The Processing Configuration can be applied directly on the material as explained in the [image processing documentation](/features/featuresDeepDive/postProcesses/usePostProcesses#imageprocessing).

## Light Setup

Always considering what "Nature does", we reconsidered the BJS light falloff effect in the PBR Material.

Three main properties have been added to offer a better simulation of the lights.

## Inverse Square Falloff

This is a type of falloff that is pretty close to how light behaves in real life (it is implemented in engines like BJS and [Unreal](https://docs.unrealengine.com/latest/INT/Resources/ContentExamples/Lighting/4_2/index.html); I may be overselling it here :-) )

Compared to the BJS lighting model, instead of playing with an arbitrary range for the lights, the light impact will decrease proportionally to the inverse of the light distance squared.

```javascript
float lightDistanceFalloff = 1.0 / ((lightDistanceSquared + 0.0001));
return lightDistanceFalloff;
```

So, the farther you are, the higher your intensity will need to be to reach a surface.

To go even further, the intensity you define on the lights follows physics-based units:

- Point and Spot lights are defined in luminous intensity (candela, m/sr)
- Directional and Hemispheric lights in illuminance (nit, cd/m2)

To make it compatible with the standard material, you can easily disable this behavior and use the Physical Falloff like this:

```javascript
pbr.usePhysicalLightFalloff = false;
```

## IntensityMode

Lights now have an intensity mode that enables you to convert the intensity metric from one type to another. This can help set up your analytical lights closer to real-life measurements:

```javascript
// Default automatic mode best fitting with the light type.
light.intensityMode = BABYLON.Light.INTENSITYMODE_AUTOMATIC;
// Lumen (lm)
light.intensityMode = BABYLON.Light.INTENSITYMODE_LUMINOUSPOWER;
// Candela (lm/sr)
light.intensityMode = BABYLON.Light.INTENSITYMODE_LUMINOUSINTENSITY;
// Lux (lm/m^2)
light.intensityMode = BABYLON.Light.INTENSITYMODE_ILLUMINANCE;
// Nit (cd/m^2)
light.intensityMode = BABYLON.Light.INTENSITYMODE_LUMINANCE;
```

## Light Radius

Light Radius has been added as a property of each light and reflects the fact that, in real life, most lights are not single points.

Why? Simply because if your material is really glossy, each specular highlight (from direct lights) will only be seen as a simple dot.

<Playground id="#19JGPR#10" title="Small Dot Light Radius Using PBR" description="Simple example of a small dot light radius using PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster22.webp"/>

Now, increasing the light radius makes this dot wider.

<Playground id="#19JGPR#11" title="Wider Dot Light Radius Using PBR" description="Simple example of a wider dot light radius using PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster23.webp"/>

Internally, this uses a number of approximations, such as Tan(theta) being almost theta for small angles, so if you try to use a radius bigger than a tenth of the light distance, you will not see the desired effect.

## Shadows (as the standard material)

Shadows are fully equivalent to the Standard material. All the documentation can be found here: [Shadows](/features/featuresDeepDive/lights/shadows);

## Notes

You can find below a few notes which could be helpful during the creation of your scenes.

## Specular Aliasing

Glossy materials are subject to Specular Aliasing artifacts. These artifacts are usually visible as bright dots flickering on meshes when animating the model or moving the camera.

They could be the result of several factors:

- Sharp Edges in the geometry
- Bump Map Texture
- ... For more information, you can consult this page about [anti-aliasing techniques](http://blog.selfshadow.com/2011/07/22/specular-showdown/)

Babylon version 3.2 includes a simple way to enable Specular anti-aliasing in PBR materials:

```javascript
pbr.enableSpecularAntiAliasing = true;
```

<Playground id="#1XJD4C" title="Specular Aliasing in PBR" description="Simple example of specular aliasing in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster24.webp"/>

## Environment Irradiance

A big part of the lighting in PBR is provided by the environment texture. This provides two kinds of light contributions: **radiance, which could be considered similar to reflection**, and **irradiance, which could be thought of as the diffuse component of Image Based Lighting**.

If you are creating a model that is **rough** and **not metallic** (in metallic workflow) or **not specular** (in specular glossiness mode), most of the illumination will be provided by both the analytical lights and the environment texture.

In Babylon JS, in order to **optimize** the computation of **irradiance**, it is computed in the **vertex shader** and interpolated in the fragment shader. Unfortunately, this **prevents us from relying on the normal map** to perform the computation and can therefore **introduce artifacts** by not emphasizing the bumpiness of the surface. Most of the time this is acceptable, but with **rough, non-reflective materials** it can significantly change the visual result.

You can see below, on the left, a rough, non-reflective model in the default configuration, and on the right, a model with `forceIrradianceInFragment` enabled.

![pbrForceIrradianceInFragment](/img/how_to/Environment/pbrForceIrradianceInFragment.webp)

To force the computation of irradiance in the fragment shader, set the corresponding parameter to true:

```javascript
pbr.forceIrradianceInFragment = true;
```

Another point is that the irradiance, or diffuse part of the IBL, could wash out your shadows if the environment lighting is strong. If you wish, you can reduce its intensity separately from the reflection by scaling the polynomials used to create it:

```javascript
scene.onReadyObservable.addOnce(() => {
  hdrTexture.sphericalPolynomial.scale(0.1);
});
```

## Spherical Harmonics

As we noticed in 4.0, our fast approach to computing environment irradiance may not have been accurate enough in certain use cases. We now, by default, have a more accurate representation of diffuse IBL. If you would prefer to focus on speed, you can easily revert to our previous method by switching the `sphericalHarmonics` property to false:

```javascript
pbr.brdf.useSphericalHarmonics = false;
```

Here is what the difference looks like live (toggle the Spherical Harmonics switch on and off to see the difference):

<Playground id="#FEEK7G#38" title="Spherical Harmonics in PBR" description="Simple example of using spherical harmonics in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster25.webp"/>

If you want to hear the full story behind it, you can read our blog post: [A tale of a bug](https://medium.com/@babylonjs/a-tale-of-a-bug-ce7e84467800).

## Irradiance Map

In some special cases where the environment texture is highly dynamic (like a bright sun having a very high exposure value), the spherical representation of the diffuse IBL might not be enough. For performance reasons, we limit the representation to the first 3 bands. A highly dynamic texture cannot be represented through only 3 bands. In this case, you can rely on a texture instead of a spherical representation.

In order to rely on a texture, you can set the `irradianceTexture` field of your `environmentTexture` as follows:

```javascript
scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("specular.dds", scene);
scene.environmentTexture.irradianceTexture = new BABYLON.CubeTexture("irradiance.dds", scene);
```

Please, note that both textures should have the same properties: Cube vs 2D, Gamma vs Linear, RGBD or the chosen coordinates mode. Those properties do not need to be set on the main `environmentTexture` to prevent redundancy.

## Energy Conservation

As we knew from the beginning, our PBR lighting model was not energy-conservative. Thanks to a number of new white papers in this area, we have been able to introduce a way to embrace energy conservation in real time. This basically means that your rough metallic models will look brighter and closer to what nature does.

In case you would like to turn this feature off, to for instance get a closer cross engine rendering look, you can turn off the energy conservation flag on the PBR material.

```javascript
pbr.brdf.useEnergyConservation = false;
```

Here is what the difference looks like live (the left sphere is using energy conservation while the right one is not):

<Playground id="#FEEK7G#39" title="Energy Conservation in PBR" description="Simple example of energy conservation in PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster26.webp"/>

## Image Based Lighting: Babylon VS RayTracers

We spent a lot of time working on the implementation of our IBL environments. We reworked how we generate the DDS prefiltered environments so that we align with what perceptual ray tracers and popular game engines like Unity and Unreal do with their IBL rendering. We are approximating a perceptual roughness model in which what is perceived as 50% rough falls in the middle of the linear roughness ramp. The GGX algorithm that we use for our lighting calculations has more of a linear roughness scale, which loses clarity in reflections quickly (by around 0.3 roughness). We adjusted the falloff to mirror what happens in Arnold ray tracing, which is the renderer we chose as our ground truth for this work:

![RayTracer](/img/how_to/Environment/RayTracer.webp)

We were able to largely match the perceptual falloff from the Arnold ray tracer, while using a prefiltered MIP chain in the DDS ignoring the last two MIP levels. We have some deviation from the high roughness in the ray traced ground truth, but since fully rough materials don't really exist in the real world, there is no way to know if Arnold is right in these areas.

## How to Debug

To simplify troubleshooting within the PBR material, a special section has been added to the Inspector:

![Inspector](/img/how_to/Materials/PBRDebug.webp)

You can choose from the exhaustive list of information what you would like to see. You can also use the split position to choose at which horizontal position the debug mode starts on the screen. This can help when looking at different renders side by side. The output factor can be helpful if you are looking at very small values, as it makes differences in color easier to see on screen.

<Playground id="#2FDQT5#104" title="Using The Inspector with PBR" description="Simple example of using the inspector with PBR." image="/img/playgroundsAndNMEs/divingDeeperPBRMaster26.webp"/>
