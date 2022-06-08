---
title: Creating A Texture Package
image: 
description: Learn how to create your own texture package in Babylon.js.
keywords: diving deeper, materials, advanced, textures, package
further-reading:
video-overview:
video-content:
---

Some complex scenes will require a large amount of textures. A single material will often use three or more! To simplify the loading process it can be convenient to package the textures from multiple materials into a series of images. The trade-off will be that each texture will be scaled to a set size and might cause some desegregation, there are also WebGL limits to take into consideration as well. The packer will create a set of "frames" for each unique material and its required texture channels. The result produces one image for each channel that is used by the materials that are being packed. The process then modifies a target UV# from the meshes passed into the constructor, making them match the frame of the texture sets. The system assumes textures are 1:1 ratio (square).

Create a TexturePacker series by calling:

```javascript
let pack = new BABYLON.TexturePacker(name, targetMeshes, options, scene);
```

There are some limitations that you should consider. These include texture size limits, transparencies, and refection/refraction materials. You can find more information here: <Playground id="#TQ408M" title="Creating A Texture Package" description="Simple example of creating a texture package." image="/img/playgroundsAndNMEs/features/divingDeeperCreateTexturePackage1.jpg"/>

-   <Playground id="#TQ408M" title="Texture Packer Example 1" description="Simple example of using a texture packer in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCreateTexturePackage2.jpg"/>

Create a TexturePacker by calling:

```javascript
let pack = new BABYLON.TexturePacker(name, targetMeshes, options, scene);
pack.processAsync().then(success).catch(error);
```

-   name:string, Name of the Texture Pack.
-   targetMeshes:`Array<AbstractMesh>`, Array of meshes to use as material sources.
-   options:any, Basic object with argument parameters
-   scene:Scene, The scene that everything is scoped to.

The options argument has a few parameters you can use to tweak the result of the texture packing.

-   map:`Array<string>`, An array that contains the names of the channels to pack on the materials if they exist. `Default = [ 'ambientTexture', 'bumpTexture', 'diffuseTexture', 'emissiveTexture', 'lightmapTexture', 'opacityTexture', 'specularTexture' ]`
-   uvsIn:number, The target UV channel to use when creating the frames. `Default = BABYLON.VertexBuffer.UVKind`
-   uvsOut:number, The target UV channel to modify on the targetMeshes. `Default = BABYLON.VertexBuffer.UVKind`
-   layout:number, Defines the layout of the packer(LAYOUT_STRIP, LAYOUT_POWER2, LAYOUT_COLNUM). `Default = TexturePacker.LAYOUT_STRIP;`
-   colnum:number, If using LAYOUT_COLNUM will define the number of columns to use. `Default = 8;`
-   frameSize:number, The base size of the frames before padding is added. `Default = 256;`
-   paddingMode:number, Defines the padding style of the packer (SUBUV_WRAP, SUBUV_EXTEND, SUBUV_COLOR). `Default = TexturePacker.SUBUV_WRAP;`
-   paddingColor:Color3|Color4, Custom color of the padding if paddingMode SUBUV_COLOR. `Default = new Color4(0, 0, 0, 1.0);`
-   paddingRatio:number, Ratio of the amount of padding to add to the frames. `Default = 0.0115;`
-   fillBlanks:boolean, Toggle to full blank cell when a material does not use that channel. `Default = true;`
-   customFillColor:string, css color string for what color to fill the blank frames. `Default = 'black';`
-   updateInputMeshes:boolean, Toggle to have the packer automatically update the input meshes to the new packer frames and channels. `Default = true;`
-   disposeSources:boolean, Toggle to dispose the source textures after they are packed. `Default = true;`

For PBR materials you will need to change the map to reflect the channels you want to target. The Environment map should be handled separately.

In order to ensure that the packing process does not lock your thread you will have to start the compilation process with

```javascript
pack.processAsync().then(success).catch(error);
```

Having all interactions with your pack happening in the success callback on the returned promise. See the below playgrounds for examples.

-   <Playground id="#TQ408M#6" title="Texture Packer Example 2" description="Simple example of using a texture packer in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCreateTexturePackage2.jpg"/>

Downloading the pack is simple! When initializing the package through both a JSON load or naturally like in the above mentioned constructor, a Promise Object is created.
In order to assure that the textures are all packed and ready to go we call any interactions with the texture pack inside the success callback of the `then` method.

```javascript

pack.processAsync().then(
    //Success
    ()=>{
        pack.download( type, ?quality);
    }
)
```

You can tell the downloaded to change between jpeg and png image types depending on if you need an alpha channel. Due to the fact that the images are stored as base64 you should avoid using png unless absolutely necessary. You can always download both types and then manually mix and match inside the JSON file.

-   <Playground id="#TQ408M#25" title="Texture Packer Download Example" description="Simple example of changing between jpeg and png depending on alpha channel." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage2.jpg"/>

## Loading From JSON

To load from a downloaded package is easy! First create a blank Texture Package.

```javascript
let pack = new BABYLON.TexturePacker("", [], {}, scene);
```

Then simply call the loadFromJSON method, with JSON file as a string and then the same success/error promise callback structure as the processAsync.

```javascript
pack.updateFromJSON(jsonString).then(success).catch(error);
```

-   <Playground id="#TQ408M#9" title="Texture Packer Load Example" description="Simple example of using the texture packer loader in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCreateTexturePackage3.jpg"/>
-   <Playground id="#96CDLA" title="PBR Texture Packer Load Example" description="Simple example of loading a PBR packed texture into your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCreateTexturePackage4.jpg"/>
