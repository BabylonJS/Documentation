# Compressed Textures for GPU

There are special formats of textures which are optimized for access by graphics processors.  They differ from formats whose primary mission is to hold / transmit image data for use on a CPU.  Examples of image formats are .JPG & .PNG.  Formats catering to GPUs may not be ones you are likely to have heard of.  The file extensions for some of them are also not well established.

# Advantages of Compressed Textures
Unlike image file formats, the data of compressed textures is passed to the graphics hardware in its compressed form.  A .JPG can be very small on disk, but gets expanded by the CPU on its way to the GPU.  Retaining its compressed form is what gives these formats their advantages.  They are:
*  They have a smaller RAM footprint.  This is most helpful for mobile devices which share memory between CPU and graphics cores.  Since textures are multi-dimensional, space requirements can escalate very fast for scenes with many large textures.  Higher-end mobile devices have been able to support up to 4k x 4k textures for some time.  These allow for scenes where the camera can approach things, like a highly detailed object without a repeating pattern, and not look blurry when very close.
*  More compressed image "blocks" can fit into the cache of the processor at any one time.  Caching / data access patterns are very important for high performance computing (HPC), which graphics is a form of.
*  Finally, they could lower battery usage, especially during loading.  Image formats need to be unpacked.  Back when .JPG was being designed, battery computers were mostly just luggables.  The problems being addressed were network speed & disk space.  Who cared then how much CPU was required for re-constituting as long as it was much faster than the network?  Further, mipmaps (ever smaller versions for each power of 2 less in dimensions) need to be generated for image types.  Mipmaps can be built into compressed texture formats.

# The Catch
There is more than one format for compressed textures.  Due to the low level implementation for them in hardware,  support for a given format cannot be added like a software driver update.  Support is manufactured right into the circuitry.  This is less of a  problem when building an iOS, Android, or DirectX targeted application.  For a BJS scene which should ideally be able to run on any device / browser, this is a big problem.  Having separate HTML pages for different devices is not really an acceptable solution.

# The Solution
Starting with Babylon.js v3.0, the compressed texture formats supported by a browser / device can be [detected](http://renderingpipeline.com/webgl-extension-viewer/).  This is done when ```var engine = new BABYLON.Engine(...);``` is encountered. So now your engine instance knows which compressed formats could be used here.  That does not solve that different devices will report different results though.

You can also use this [playground](https://www.babylonjs-playground.com/index.html#1SCH7H#5) to test which format is supported on your devices.

There is no getting around the fact that you need to provide multiple versions of each texture in different formats(more on that later).  The only way of doing that involves having different files for each of the variants obviously, but the naming structure must be formalized in order to programmatically substitute for the image format file described in a .babylon file.  The image format file of each texture still needs to be on the server as well, in cases when it needs to be used.

## Khronos Texture Container Format,  [.KTX](https://www.khronos.org/opengles/sdk/tools/KTX/) files
Now would be a good time to add the aside that due to the fact that this data is not directly used by CPU's and GPU's do not actually "read" files, there may or may not be an actual native file format for a given compression format.  Even for those that do have an associated file format, writing load code for each separately would be tedious and require support.

Enter compressed texture container files, which can handle multiple or even all texture types.  There are also a few container file formats as well (.DDS, .PVR, & .KTX).  Container files can also have all the mipmaps of a texture inside them.  BJS, implements this feature using KTX container files.  KTX is specifically designed for OpenGL, and forces all the arcane code to handle any format OpenGL supports onto the file encoder / generator, even future formats without us doing anything other than adding extension detection, like ASTC.

Here is a chart of all the current formats possible for WebGL, listed in the order chosen when hardware supports multiple formats  (tie breakers):

|Format|Extension|Description|Alpha Capable
|---|---|---|---
|ASTC|*-astc.ktx|Newly approved for WebGL, most powerful, cross-platform.  Implemented in many newer processors, but not exposed by any browsers yet.| Always
|DXT|*-dxt.ktx|Direct X, available primarily on Desktop Operating Systems.|Yes
|PVRTC|*-pvrtc.ktx|Proprietary.  Power VR chips (includes all Apple iOS processors).  Must be square.|Yes
|ETC2|*-etc2.ktx|ETC1 + alpha capable.  Required by WebGL 2 (or at least OpenGL ES 3, on which WebGL 2 is based).|Yes
|ATC|*-atc.ktx|Format originating at AMD.  No encoder which supports .KTX found at this time.|Yes
|ETC1|*etc1.ktx|Wide support among older mobile devices.  Need to fall back to images for .PNG files.|No

Once your engine instance is established, you need to indicate the compressed formats that you have put on the server from which it can pick from.  This should probably be done very early, as follows:

```javascript
// order & case do not matter
var available = ['-astc.ktx', '-dxt.ktx', '-pvrtc.ktx', '-etc2.ktx', '-etc1.ktx'];
var formatUsed = engine.setTextureFormatToUse(available);
```

# Generation using [PVRTexTool](https://community.imgtec.com/developers/powervr/tools/pvrtextool/)
The are multiple encoder programs for .KTX files (see .KTX link above).  Most also provide for batch processing, since many formats are very CPU intense.  PVRTexTool has been narrowed down for providing additional support.  It has a lot going for it, including both a GUI & command line interface for Windows, OSX, and Linux.  It is also the only encoder which does PVRTC format, which is needed on iOS.

If you are going to do the encoding on your own in the PVRTexTool GUI tool, there are a few things to keep in mind:
*  The texture must be encoded with the Y-axis flipped. ('Vertical Flipped' checkbox at bottom of Encode window)
*  PVRTC textures must be square for iOS.  ('Make Square' button in the Toolbox window using Resize tool)
*  ASTC support is dropped in from an [external program](https://github.com/ARM-software/astc-encoder/tree/master/Binary) from ARM that you put on the path.  (See PVRTexTool [manual](http://cdn.imgtec.com/sdk-documentation/PVRTexTool.User+Manual.pdf), section 1.2.1)
*  DXT support is done with 'BCx' names.  (Better UI design for WebGL has been [requested](https://community.imgtec.com/forums/topic/could-webgl-be-added-as-an-encoding-groupapi/).)
*  Indicating to generate mipmaps should really be done as well. (checkbox to the left of 'Vertical Flipped')
*  Always use a Linear-RGB encoding type.
*  Not sure a power of 2 size is absolutely required, but scripts below size up to the next power of 2 size.

## DOS batch scripts for PVRTexTool
There are 2 batch scripts in the [BJS repo](https://github.com/BabylonJS/Babylon.js/tree/master/Tools/CompressedTextured).  They both require that PVRTexToolCLI.exe, be put on the execution path just as the ASTC drop-in was.  Doing both at the same time, and locating these 2 .BAT files in the same place seems like a good thing to do.

### make-ktx-batch.bat
This script goes through the current directory, and writes a ```ktx-batch.bat``` file there.  When you then call ```ktx-batch.bat```, it will make an ASTC, DXT, PVRTC, ETC2, and ETC1 file for each .JPG and .PNG in the directory. Note that a .PNG extension is an indicator to use an alpha capable sub-type.  ETC1 does not support alpha, so the .PNG will be used as a fall back, if ETC1 ends up being chosen.

There is a single argument which indicates the quality of the texture. Specify D for developer level, Q for production quality.  Tip: unless you are testing if this fixes hanging issues on mobile devices, you could just delay enabling this till all your textures get finalized.  Also, do not rely on the results you get from using D on a desktop.  DXT does not really have variable quality.

### ktx-files.bat
This script will create the 5 variations of a image file.  It can run for a very long time for Q setting.  The ASTC type will use 100% of all your cores, so your system can be pretty unusable.  Good to kick it off at the end of day.  Also, due to running time, it will skip any files already existing.  To re-do files, delete the existing versions first.

To recap (in a command shell):
```dos
cd my-directory-with-images
make-ktx-batch Q
ktx-batch
```

## Node.js script for PVRTexTool
This is a script that generates PVRTC, ETC1, ETC2, ASTC textures from png and jpg files. It can run on node or as a gulp task. Also it can be configured to generate all texture types or specific ones. More information about how to install and configure the script can be found [here](https://www.npmjs.com/package/babylonjs-texture-generator).

## Basis file format

Another way to store compressed image textures is throught the .basis file format

See: https://github.com/BinomialLLC/basis_universal

Basis Universal is a "supercompressed" GPU texture and texture video compression system that outputs a highly compressed intermediate file format (.basis) that can be quickly transcoded to a wide variety of GPU texture compression formats: PVRTC1 4bpp RGB, BC7 mode 6 RGB, BC1-5, ETC1, and ETC2. We will be adding ASTC RGB or RGBA, BC7 mode 4/5 RGBA, and PVRTC1 4bpp RGBA next. Basis files support non-uniform texture arrays, so cubemaps, volume textures, texture arrays, mipmap levels, video sequences, or arbitrary texture "tiles" can be stored in a single file. The compressor is able to exploit color and pattern correlations across the entire file, so multiple images with mipmaps can be stored very efficiently in a single file.

Basic example https://playground.babylonjs.com/#4RN0VF
Basis vs png example scene https://playground.babylonjs.com/#E4VDDW
