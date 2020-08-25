# How To Apply Bumps, Opacity, Tiling and Detail Maps
A range of effects can be achieved with textures using a few extra lines of code.

## Bump Map
Bump mapping is a technique to simulate bump and dents on a rendered surface. These are made by creating a **normal map** from an image. 
The means to do this can be found on the web, a search for 'normal map generator' will bring up free and paid for methods of doing this. 


![Image Bump Map](/img/how_to/Materials/bump.png)

Normal Map from Image &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Original Image

A bump map can be used with a color; with its original image or another image as below.

![Bump Example](/img/how_to/Materials/bump_spheres.png)

### Creating a Bump Map Example
Just add a _bumpTexture_ to any existing textures.

```javascript
var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
myMaterial.bumpTexture = new BABYLON.Texture("PATH TO NORMAL MAP", scene);
```

* [Playground Example of Bump Maps](https://www.babylonjs-playground.com/#20OAV9#23)

### Inverting Bumps and Dents
Use _invertNormalMapX_ and/or _invertNormalMapY_ on the material.

```javascript
var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
myMaterial.bumpTexture = new BABYLON.Texture("PATH TO NORMAL MAP", scene);
myMaterial.invertNormalMapX = true;
myMaterial.invertNormalMapY = true
```

## Opacity
The opacity of a material can be graded using an image with varying tranparency. The following PNG image with 
a transparency gradient can be applied to a material using _opacityTexture_

![Opacity Map](/img/how_to/Materials/degrade_map.png)

with the same gradient applied to the material as in the image below.

![Opacity Material](/img/how_to/Materials/degraded_plane.png)

* [Playground Example of Opacity](https://www.babylonjs-playground.com/#20OAV9#24)

### Applying Opacity
Add an _opacityTexture_ to any existing texture.
```javascript
var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
myMaterial.opacityTexture = new BABYLON.Texture("PATH TO NORMAL MAP", scene);
```

## Tiling
When a material is applied to a mesh the image used for a texture is positioned according to coordinates. 
Rather than x, y which are already in use for the 3D axes the letters u and v are used for the coordinates.

![uv axes](/img/how_to/Materials/crate.png)

To tile an image you use the _uScale_ and/or _vScale_ properties, of the texture, to set the number of tiles in each direction.

```javascript
myMaterial.diffuseTexture.uScale = 5.0;
myMaterial.diffuseTexture.vScale = 5.0;
```
## Offsetting
To offset your texture on your mesh, you  use the _uOffset_ and _vOffset_ properties, of the texture, to set the offset in each direction.

```javascript
myMaterial.diffuseTexture.uOffset = 1.5;
myMaterial.diffuseTexture.vOffset = 0.5;
```
* [Playground Example of Tiling and Offset](https://www.babylonjs-playground.com/#20OAV9#25)

## Details maps

A detail map (also called secondary map) is generally used to add extra details to the regular main texture when viewed up close.

See for eg this marble texture without detail map:
![Without detail map](/img/how_to/Materials/detailmap_without.jpg)

You can see fairly big areas with uniform colors because the texture is zoomed in.

You can use a detail map to improve on this:
![With detail map](/img/how_to/Materials/detailmap_with.jpg)

The detail map used in the picture above only contains an albedo (diffuse) channel which is tiled ten times over the main texture.

You can also add a normal channel in the detail map:
![Bump - Without detail map](/img/how_to/Materials/detailmap_bump_without.jpg)
![Bump - With detail map](/img/how_to/Materials/detailmap_bump_with.jpg)

The first picture is the main + bump textures without detail map, the second picture is the main + bump textures + detail map with albedo and normal channels.

The detail map can contains albedo (diffuse), normal and roughness (for PBR materials only) channels, dispatched this way (following **Unity** convention):
* Red channel: greyscale albedo
* Green channel: green component of the normal map
* Blue channel: roughness
* Alpha channel: red component of the normal map

A picture can help to better visualize the channels:
![Channels of the detail map](/img/how_to/Materials/detailmap_channels.jpg)

Note that a mid-gray value (0.5 on a 0..1 scale) for the channels will disable the effect: setting 0.5 in the Green and Alpha channels will disable the detail bump map, for eg.

You can take advantage of this to make the detail map effects fade when the texture gets minimized on screen: you simply need to create mip maps that fade to the 0.5 value after a given level.

For eg, you can decide that the fading effect begins at mip level 3, and is fully achieved at level 5, meaning that from level 3 to 5 the R/G/B/A values are interpolated from their initial values to the 0.5 value, then at level 5 and onward all values are set to 0.5, disabling the detail map effects completely. If you use the mip map levels this way, don't forget to activate trilinear interpolation!

You can enable detail mapping this way:
```javascript
myMaterial.detailMap.texture = new BABYLON.Texture("textures/detailmap.png", scene);
myMaterial.detailMap.isEnabled = true;
```

You can control the strength of the albedo/normal/roughness detail effects this way:
```javascript
myMaterial.detailMap.diffuseBlendLevel = 0.1; // between 0 and 1
myMaterial.detailMap.bumpLevel = 1; // between 0 and 1
myMaterial.detailMap.roughnessBlendLevel = 0.25; // between 0 and 1
```

You can use this PG to experiment with detail maps: 
* [Detail map playground Example](https://playground.babylonjs.com/#5NS7A2#4)

![Detail map PG](/img/how_to/Materials/detailmap_pg.jpg)
