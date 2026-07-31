---
title: Creating A Texture Package
image: 
description: Learn how to create your own texture package in Babylon.js.
keywords: diving deeper, materials, advanced, textures, package
further-reading:
video-overview:
video-content:
---

Some complex scenes will require a large number of textures. A single material will often use three or more! To simplify the loading process, it can be convenient to package the textures from multiple materials into a series of images. The trade-off is that each texture will be scaled to a set size, which might cause some degradation, and there are also WebGL limits to take into consideration. The packer creates a set of "frames" for each unique material and its required texture channels. The result is one image for each channel used by the materials being packed. The process then modifies a target UV# from the meshes passed into the constructor so they match the frame of the texture sets. The system assumes textures have a 1:1 ratio (square).

Create a TexturePacker series by calling:

```javascript
let pack = new BABYLON.TexturePacker(name, targetMeshes, options, scene);
```

There are some limitations that you should consider. These include texture size limits, transparencies, and reflection/refraction materials. You can find more information here: <Playground id="#TQ408M" title="Creating A Texture Package" description="Simple example of creating a texture package." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage1.webp"/>

-   <Playground id="#TQ408M" title="Texture Packer Example 1" description="Simple example of using a texture packer in your scene." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage2.webp"/>

Create a TexturePacker by calling:

```javascript
let pack = new BABYLON.TexturePacker(name, targetMeshes, options, scene);
pack.processAsync().then(success).catch(error);
```

-   name:string, Name of the Texture Pack.
-   targetMeshes:`Array<AbstractMesh>`, Array of meshes to use as material sources.
-   options:any, Basic object with argument parameters.
-   scene:Scene, The scene that everything is scoped to.

The options argument has a few parameters you can use to tweak the result of the texture packing.

-   map:`Array<string>`, An array that contains the names of the channels to pack on the materials if they exist. `Default = [ 'ambientTexture', 'bumpTexture', 'diffuseTexture', 'emissiveTexture', 'lightmapTexture', 'opacityTexture', 'specularTexture' ]`
-   uvsIn:number, The target UV channel to use when creating the frames. `Default = BABYLON.VertexBuffer.UVKind`
-   uvsOut:number, The target UV channel to modify on the targetMeshes. `Default = BABYLON.VertexBuffer.UVKind`
-   layout:number, Defines the layout of the packer (LAYOUT_STRIP, LAYOUT_POWER2, LAYOUT_COLNUM). `Default = TexturePacker.LAYOUT_STRIP;`
-   colnum:number, If using LAYOUT_COLNUM, defines the number of columns to use. `Default = 8;`
-   frameSize:number, The base size of the frames before padding is added. `Default = 256;`
-   paddingMode:number, Defines the padding style of the packer (SUBUV_WRAP, SUBUV_EXTEND, SUBUV_COLOR). `Default = TexturePacker.SUBUV_WRAP;`
-   paddingColor:Color3|Color4, Custom color of the padding if paddingMode is SUBUV_COLOR. `Default = new Color4(0, 0, 0, 1.0);`
-   paddingRatio:number, Ratio of the amount of padding to add to the frames. `Default = 0.0115;`
-   fillBlanks:boolean, Toggle to fill blank cells when a material does not use that channel. `Default = true;`
-   customFillColor:string, css color string for what color to fill the blank frames. `Default = 'black';`
-   updateInputMeshes:boolean, Toggle to have the packer automatically update the input meshes to the new packer frames and channels. `Default = true;`
-   disposeSources:boolean, Toggle to dispose the source textures after they are packed. `Default = true;`

For PBR materials you will need to change the map to reflect the channels you want to target. The Environment map should be handled separately.

In order to ensure that the packing process does not block your thread, you will have to start the compilation process with

```javascript
pack.processAsync().then(success).catch(error);
```

All interactions with your pack should happen in the success callback of the returned promise. See the playgrounds below for examples.

-   <Playground id="#TQ408M#6" title="Texture Packer Example 2" description="Simple example of using a texture packer in your scene." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage2.webp"/>

Downloading the pack is simple! When initializing the package either through a JSON load or naturally through the above-mentioned constructor, a Promise object is created.
To ensure that the textures are all packed and ready to go, put any interactions with the texture pack inside the success callback of the `then` method.

```javascript

pack.processAsync().then(
    //Success
    ()=>{
        pack.download( type, ?quality);
    }
)
```

You can tell the downloader to switch between JPEG and PNG image types depending on whether you need an alpha channel. Because the images are stored as base64, you should avoid using PNG unless absolutely necessary. You can always download both types and then manually mix and match inside the JSON file.

-   <Playground id="#TQ408M#25" title="Texture Packer Download Example" description="Simple example of changing between jpeg and png depending on alpha channel." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage2.webp"/>

## Loading From JSON

Loading a downloaded package is easy! First, create a blank Texture Package.

```javascript
let pack = new BABYLON.TexturePacker("", [], {}, scene);
```

Then simply call the loadFromJSON method, passing the JSON file as a string and using the same success/error promise callback structure as `processAsync`.

```javascript
pack.updateFromJSON(jsonString).then(success).catch(error);
```

-   <Playground id="#TQ408M#9" title="Texture Packer Load Example" description="Simple example of using the texture packer loader in your scene." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage3.webp"/>
-   <Playground id="#96CDLA" title="PBR Texture Packer Load Example" description="Simple example of loading a PBR packed texture into your scene." image="/img/playgroundsAndNMEs/divingDeeperCreateTexturePackage4.webp"/>
