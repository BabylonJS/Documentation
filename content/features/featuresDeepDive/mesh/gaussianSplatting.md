---
title: Gaussian Splatting
image:
description: Learn how use Gaussian Splatting.
keywords: diving deeper, meshes, gaussian, splatting, nerf
further-reading:
video-overview:
video-content:
---

## What is Gaussian Splatting?

Gaussian Splatting is a volume rendering method. It's useful to capture real-life data. The difference with other technics like photogrammetry is the end result consists in a point cloud with each point rendered as a semi transparent ellipsoid projected onto a billboard. Gaussian Splatting is more suitable for rendering reflective and transparent surfaces.

## Supported formats

Supported formats are :

- .PLY https://en.wikipedia.org/wiki/PLY_(file_format)
- .splat that is Javascript types serialized version of .PLY datas
- Niantic Labs .spz format https://scaniverse.com/news/spz-gaussian-splat-open-source-file-format
- .SOG/SOGS Self-Organizing Gaussian https://github.com/fraunhoferhhi/Self-Organizing-Gaussians

## Loading a Gaussian Splatting

Load asynchronously the splat or PLY file like any other supported file format:

```javascript
BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/gs_Skull.splat", scene).then((result) =>{
    const gaussianSplattingMesh = result.meshes[0]; });
```

**Note: Gaussian splatting files do not have a standard on handness or orientation. No space change operation will happen. Some scene might appear updside down or mirrored.**

<Playground id="#M05L0C#5" title="Nianticlabs .SPZ examples need a rotation." description="Nianticlabs .SPZ examples up is not the same as Babylon.js default."/>

## Updating datas of a Gaussian Splatting

User can update or generate new Splats with the `updateData`method.
Mandatory values are splat center position, size, orientation and color.
The following example updates the Gaussian Splatting with 1 single splat.

```javascript
var gs = new BABYLON.GaussianSplattingMesh("GS", undefined, scene, true);

// size of a single splat, in bytes
const rowLength = 32;

// chunck size of splats
const splatCount = 1;

const uBuffer = new Uint8Array(splatCount * rowLength);
const fBuffer = new Float32Array(uBuffer.buffer);

// center position
fBuffer[0] = 0; // x
fBuffer[1] = 0; // y
fBuffer[2] = 0; // z

// size
fBuffer[3 + 0] = 0.1;
fBuffer[3 + 1] = 0.1;
fBuffer[3 + 2] = 0.1;

// orientation quaternion. Values are remapped from -1..1 to 0..255. 128 is 0. 255 is 1
uBuffer[28 + 1] = 128; 
uBuffer[28 + 2] = 128;
uBuffer[28 + 3] = 128;
uBuffer[28 + 0] = 255;

// color
uBuffer[24 + 0] = 128;
uBuffer[24 + 1] = 128;
uBuffer[24 + 2] = 128;
uBuffer[24 + 3] = 255;
gs.updateData(uBuffer);
```

## Updating and downloading datas of a Gaussian Splatting

An access to the kept in memory splats data allows to modify loaded splats and download it after.
A simple call to `updateData` will show the change.

```javascript
function modifyMesh(gs) {
    // Get GS data
    const arrayBuffer = gs.splatsData;
    // Make a float32 access. A splat is 32bytes (8floats)
    var positions = new Float32Array(arrayBuffer);
    // Do a change to the first 30000 splats
    for (let i = 0; i < 30000; i++) {
        // Translate splats a little. GS shown here is upside down
        positions[i * 8 + 1] -= 2.0;
    }
    // Make that change visible
    gs.updateData(arrayBuffer);
    // Create a blob with array buffer and download it. It can be used directly with the sandbox
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    BABYLON.Tools.DownloadBlob(blob, "newGSplat.splat");
}
```

<Playground id="#CID4NN#203" title="Simple Example of Gaussian Splatting" description="Simple example of setting a Gaussian Splatting."/>

<Playground id="#45KYTJ#61" title="Loading and displaying different Gaussian Splatting scenes" description="Loading and displaying different Gaussian Splatting scenes."/>

<Playground id="#EILZ5L#3" title="10000 splats updated" description="Creating and updating a Gaussian Splatting made of 10000 individual splats"/>

<Playground id="#RKKCHG#0" title="Download and modify a GS" description="Download a Gaussian Splatting and modify a bunch splats. Then, downloads it."/>

<Playground id="#QA2662#12" title="SOG Gaussian splats" description="SOG Gaussian splats with Spherical Harmonics."/>

## File format conversion

SplatTransform is a CLI tool for converting and editing Gaussian splats: https://github.com/playcanvas/splat-transform

Check the project page for features and file import/export formats.