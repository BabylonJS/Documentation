---
title: Multi-Platform Compressed Textures
image:
description: Learn all about multi-platform compressed textures in Babylon.js.
keywords: babylon.js, advanced, compressed, textures
further-reading:
video-overview:
video-content:
---

## Compressed Textures for GPU

There are special texture formats optimized for use by graphics processors. They differ from formats whose primary purpose is to hold / transmit image data for use on a CPU. Examples of image formats are .JPG and .PNG. GPU-targeted formats may not be ones you are likely to have heard of. The file extensions for some of them are also not well established.

## Advantages of Compressed Textures

Unlike image file formats, the data in compressed textures is passed to the graphics hardware in its compressed form. A .JPG can be very small on disk, but it gets expanded by the CPU on its way to the GPU. Retaining the compressed form is what gives these formats their advantages. They are:

- They have a smaller RAM footprint. This is most helpful for mobile devices that share memory between CPU and graphics cores. Since textures are multi-dimensional, space requirements can escalate very quickly for scenes with many large textures. Higher-end mobile devices have been able to support up to 4k x 4k textures for some time. These allow for scenes where the camera can approach things, like a highly detailed object without a repeating pattern, without looking blurry when very close.
- More compressed image "blocks" can fit into the processor cache at any one time. Caching / data access patterns are very important for high-performance computing (HPC), and graphics is a form of it.
- Finally, they can lower battery usage, especially during loading. Image formats need to be unpacked. Back when .JPG was designed, battery-powered computers were mostly just luggables. The problems being addressed were network speed and disk space. Who cared then how much CPU was required for reconstituting an image, as long as it was much faster than the network? Further, mipmaps (ever smaller versions for each power of 2 less in dimensions) need to be generated for image types. Mipmaps can be built into compressed texture formats.

## The Catch

There is more than one format for compressed textures. Due to their low-level hardware implementation, support for a given format cannot be added like a software driver update. Support is built right into the circuitry. This is less of a problem when building an iOS-, Android-, or DirectX-targeted application. For a BJS scene that should ideally run on any device / browser, this is a big problem. Having separate HTML pages for different devices is not really an acceptable solution.

## The Solution

Starting with Babylon.js v3.0, the compressed texture formats supported by a browser / device can be [detected](http://renderingpipeline.com/webgl-extension-viewer/). This is done when `const engine = new BABYLON.Engine(...);` is encountered. So now your engine instance knows which compressed formats could be used here. That does not solve that different devices will report different results though.

You can also use this playground: <Playground id="#1SCH7H#5" title="Compressed Textures Example" description="Simple example of multi-platform compressed textures."/> to test which format is supported on your devices.

There is no getting around the fact that you need to provide multiple versions of each texture in different formats (more on that later). The only way to do that is to have different files for each variant, obviously, but the naming structure must be formalized so the image format file described in a .babylon file can be substituted programmatically. The image format file for each texture still needs to be on the server as well, in cases where it needs to be used.

### Khronos Texture Container Format, [.KTX](https://www.khronos.org/opengles/sdk/tools/KTX/) files

Now would be a good time to add the aside that, because this data is not directly used by CPUs and GPUs do not actually "read" files, there may or may not be an actual native file format for a given compression format. Even for those that do have an associated file format, writing separate load code for each would be tedious and would require support.

Enter compressed texture container files, which can handle multiple or even all texture types. There are a few container file formats as well (.DDS, .PVR, and .KTX). Container files can also have all the mipmaps of a texture inside them. BJS implements this feature using KTX container files. KTX is specifically designed for OpenGL and pushes all the arcane code needed to handle any format OpenGL supports onto the file encoder / generator, even for future formats, without us doing anything other than adding extension detection, like ASTC.

Here is a chart of all the formats currently possible for WebGL, listed in the order chosen when hardware supports multiple formats (tie breakers):

| Format | Extension    | Description                                                                                                                         | Alpha Capable |
| ------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| ASTC   | \*-astc.ktx  | Newly approved for WebGL, most powerful, cross-platform. Implemented in many newer processors, but not exposed by any browsers yet. | Always        |
| DXT    | \*-dxt.ktx   | Direct X, available primarily on Desktop Operating Systems.                                                                         | Yes           |
| PVRTC  | \*-pvrtc.ktx | Proprietary. Power VR chips (includes all Apple iOS processors). Must be square.                                                    | Yes           |
| ETC2   | \*-etc2.ktx  | ETC1 + alpha capable. Required by WebGL 2 (or at least OpenGL ES 3, on which WebGL 2 is based).                                     | Yes           |
| ATC    | \*-atc.ktx   | Format originating at AMD. No encoder which supports .KTX found at this time.                                                       | Yes           |
| ETC1   | \*etc1.ktx   | Wide support among older mobile devices. Need to fall back to images for .PNG files.                                                | No            |

Once your engine instance is established, you need to indicate the compressed formats that you have put on the server from which it can pick from. This should probably be done very early, as follows:

```javascript
// order & case do not matter
const available = ["-astc.ktx", "-dxt.ktx", "-pvrtc.ktx", "-etc2.ktx", "-etc1.ktx"];
const formatUsed = engine.setTextureFormatToUse(available);
```

## Generation using [PVRTexTool](https://developer.imaginationtech.com/pvrtextool/)

There are multiple encoder programs for .KTX files (see .KTX link above). Most also provide for batch processing, since many formats are very CPU intense. PVRTexTool has been narrowed down for providing additional support. It has a lot going for it, including both a GUI & command line interface for Windows, OSX, and Linux. It is also the only encoder which does PVRTC format, which is needed on iOS.

If you are going to do the encoding on your own in the PVRTexTool GUI tool, there are a few things to keep in mind:

- The texture must be encoded with the Y-axis flipped. ('Vertical Flipped' checkbox at bottom of Encode window)
- PVRTC textures must be square for iOS. ('Make Square' button in the Toolbox window using Resize tool)
- ASTC support is dropped in from an [external program](https://github.com/ARM-software/astc-encoder) from ARM that you put on the path. (See PVRTexTool [manual](http://cdn.imgtec.com/sdk-documentation/PVRTexTool.User+Manual.pdf), section 1.2.1)
- DXT support is done with 'BCx' names. (Better UI design for WebGL has been [requested](https://community.imgtec.com/forums/topic/could-webgl-be-added-as-an-encoding-groupapi/).)
- Indicating to generate mipmaps should really be done as well. (checkbox to the left of 'Vertical Flipped')
- Always use a Linear-RGB encoding type.
- Not sure a power of 2 size is absolutely required, but scripts below size up to the next power of 2 size.

### DOS batch scripts for PVRTexTool

There are 2 batch scripts in the [BJS repo](https://github.com/BabylonJS/Babylon.js/tree/master/Tools/CompressedTextured). They both require PVRTexToolCLI.exe to be put on the execution path, just as the ASTC drop-in was. Doing both at the same time, and locating these 2 .BAT files in the same place, seems like a good idea.

#### make-ktx-batch.bat

This script goes through the current directory and writes a `ktx-batch.bat` file there. When you then call `ktx-batch.bat`, it will make an ASTC, DXT, PVRTC, ETC2, and ETC1 file for each .JPG and .PNG in the directory. Note that a .PNG extension indicates that an alpha-capable subtype should be used. ETC1 does not support alpha, so the .PNG will be used as a fallback if ETC1 ends up being chosen.

There is a single argument that indicates the quality of the texture. Specify D for developer-level quality, Q for production quality. Tip: unless you are testing whether this fixes hanging issues on mobile devices, you could delay enabling this until all your textures are finalized. Also, do not rely on the results you get from using D on a desktop. DXT does not really have variable quality.

#### ktx-files.bat

This script will create the 5 variations of an image file. It can run for a very long time for the Q setting. The ASTC type will use 100% of all your cores, so your system can become pretty unusable. It's a good idea to kick it off at the end of the day. Also, due to the running time, it will skip any files that already exist. To redo files, delete the existing versions first.

To recap (in a command shell):

```dos
cd my-directory-with-images
make-ktx-batch Q
ktx-batch
```

### Node.js script for PVRTexTool

This is a script that generates PVRTC, ETC1, ETC2, and ASTC textures from PNG and JPG files. It can run on Node.js. It can also be configured to generate all texture types or specific ones. More information about how to install and configure the script can be found [here](https://www.npmjs.com/package/babylonjs-texture-generator).

### Basis file format

Another way to store compressed image textures is through the .basis file format.

See: https://github.com/BinomialLLC/basis_universal

Basis Universal is a "supercompressed" GPU texture and texture video compression system that outputs a highly compressed intermediate file format (.basis) that can be quickly transcoded to a wide variety of GPU texture compression formats: PVRTC1 4bpp RGB, BC7 mode 6 RGB, BC1-5, ETC1, and ETC2. We will be adding ASTC RGB or RGBA, BC7 mode 4/5 RGBA, and PVRTC1 4bpp RGBA next. Basis files support non-uniform texture arrays, so cubemaps, volume textures, texture arrays, mipmap levels, video sequences, or arbitrary texture "tiles" can be stored in a single file. The compressor is able to exploit color and pattern correlations across the entire file, so multiple images with mipmaps can be stored very efficiently in a single file.

Basic example: <Playground id="#4RN0VF" title="Basic Example of Basis Textures" description="Simple example of using .basis compressed textures in your scene."/>
Basis vs png example scene: <Playground id="#e4vddw#27" title="Basis Texture vs. png Texture" description="Simple example of .png vs basis compressed textures."/>
