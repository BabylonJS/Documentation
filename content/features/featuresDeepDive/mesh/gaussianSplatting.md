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

**Note: Triangular meshes stored in .PLY are also supported and used by Triangular Splatting**

The .SPZ file import supports the flipY option to handle vertically flipped file outputs. This option is also available with the `updateData` method but not with other formats.

```javascript
const pit = await BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/hornedlizard.spz", scene, {pluginOptions:{splat:{flipY:true}}})
```

## Triangular Splatting

Triangular splatting produces opaque geometry that can be used like a regular mesh. By default, triangulated geometry is lit. To Make the TriSplat mesh to be rendered correctly, it must use only the vertex color. Apply the following material to get the expected rendering:

```javascript
const material = new BABYLON.StandardMaterial("unlitVertexColorMat", scene);
material.disableLighting = true;              
material.emissiveColor = new BABYLON.Color3(1, 1, 1);
material.diffuseColor = new BABYLON.Color3(1, 1, 1);
material.backFaceCulling = false;
plyTriangularSplatmesh.material = material;
```

## Loading a Gaussian Splatting

Load asynchronously the splat or PLY file like any other supported file format:

```javascript
BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/gs_Skull.splat", scene).then((result) =>{
    const gaussianSplattingMesh = result.meshes[0]; });
```

**Note: Gaussian splatting files do not have a standard on handness or orientation. No space change operation will happen. Some scene might appear updside down or mirrored.**

<Playground id="#M05L0C#0" title="Nianticlabs .SPZ examples need a rotation." description="Nianticlabs .SPZ examples up is not the same as Babylon.js default."/>

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
    gs.updateData(arrayBuffer, undefined, { flipY: false });
    // Create a blob with array buffer and download it. It can be used directly with the sandbox
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    BABYLON.Tools.DownloadBlob(blob, "newGSplat.splat");
}
```

<Playground id="#CID4NN#203" title="Simple Example of Gaussian Splatting" description="Simple example of setting a Gaussian Splatting."/>

<Playground id="#45KYTJ#123" title="Loading and displaying different Gaussian Splatting scenes" description="Loading and displaying different Gaussian Splatting scenes."/>

<Playground id="#EILZ5L#27" title="10000 splats updated" description="Creating and updating a Gaussian Splatting made of 10000 individual splats"/>

<Playground id="#RKKCHG#15" title="Download and modify a GS" description="Download a Gaussian Splatting and modify a bunch splats. Then, downloads it."/>

<Playground id="#QA2662#12" title="SOG Gaussian splats" description="SOG Gaussian splats with Spherical Harmonics."/>

## Shadows

Gaussian splatting supports shadow casting. Because they are rendered using alpha blending, the shadow generator needs to have transparency shadow enabled:

```javascript
var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
light.shadowMaxZ = 10;
light.shadowMinZ = 1;
shadowGenerator.useContactHardeningShadow = true;
shadowGenerator.setDarkness(0.2);
shadowGenerator.setTransparencyShadow(true); // This call is necessary to render GS
```

<Playground id="#OE54M5#15" title="Spotlight shadow" description="Gaussian Splatting cast shadows from a spotlight light source."/>

## Parts and Scene construction

It is possible to combine multiple Gaussian Splatting assets into a single scene while maintaining a global splat sorting order.

To enable this workflow:

- Create an empty Gaussian Splatting container :
    Initialize an empty Gaussian Splatting object that will act as the root container for the scene.
- Populate the container :
    Add content to this container, either procedurally generated or loaded from external assets.
- Add parts to the main mesh :
    Each Gaussian Splatting component is attached to the main mesh using the addPart method.

The addPart method returns a mesh instance, which can then be independently transformed or otherwise manipulated (e.g., positioning, scaling, animation) while still participating in the global splat sorting.

**Note: User is responsible to check the maximum part count that can be displayed but a Gaussian Splatting.**

```javascript
const maxPartCount = BABYLON.GetGaussianSplattingMaxPartCount(scene.getEngine());
```

<Playground id="#PUWLG4#0" title="Manipulate Splats" description="Two Gaussian Splatting elements in a single scene."/>

Each part can have an independent visibility value through the `visibility` property, which influences each individual splat. This means the overall transparency of the Gaussian Splatting is greatly influenced by splat density and overdraw. A visibility of 0.1 may leave the Gaussian Splatting almost opaque if enough splats share the same pixel.

Added parts can be removed by index using the `removePart` method.

<Playground id="#BTS11N#0" title="Parts visibility and suppression" description="Add parts, change their visibility and remove one of them."/>

## Picking

Gaussian Splatting does not have triangle geometry, so standard ray-based picking falls back to bounding volume intersection. For accurate picking, Gaussian Splatting uses GPU picking. Individual parts added with `addPart` return proxy meshes that can be included in the `GPUPicker` picking list. This allows each part to be selected and manipulated independently.

```javascript
const gpuPicker = new BABYLON.GPUPicker();
gpuPicker.setPickingList([part1, part2, otherMeshes]);

scene.onPointerDown = async (evt) => {
    const pickResult = await gpuPicker.pickAsync(evt.offsetX, evt.offsetY);
    if (pickResult) {
        console.log("Picked:", pickResult.mesh.name);
    }
};
```

<Playground id="#3LNCE6#36" title="Picking Gaussian Splatting Parts" description="GPU picking with individual Gaussian Splatting parts and gizmo manipulation."/>

## Material Plugin

`GaussianSplattingMaterial` supports the Babylon.js material plugin system via `MaterialPluginBase`. However, there are some important differences compared to standard material plugins.

The following example can be used as a reference for a custom fragment shader extension:

```javascript
class GSPlugin extends BABYLON.MaterialPluginBase {
    constructor(material) {
        super(material, 'GSPlugin', 200);

        this._enable(true);
        this._material.onCompiled = (effect) => console.log(effect.fragmentSourceCode);
    }

    getCustomCode(shaderType) {
        if (shaderType === 'fragment') {
            return {
                CUSTOM_FRAGMENT_MAIN_END: `gl_FragColor = vec4(opacity, 0.0, 0.0, 0.05);`,
                CUSTOM_FRAGMENT_DEFINITIONS: `uniform float opacity;`
            };
        }
        return null;
    }

    getClassName() {
        return 'GSPlugin';
    }


    getUniforms() {
        return {
            externalUniforms: ['opacity'],
        };
    }

    bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
        const effect = subMesh.effect;
        if (!effect) {
            return;
        }
        effect.setFloat('opacity', 1.);
    }
}

var gsMat = new BABYLON.GaussianSplattingMaterial('GSMat', scene);
new GsPlugin(gsMat);
gs.material = gsMat;
gsMat.setSourceMesh(gs);
```

Other fragment preprocessors are : 
 
- CUSTOM_FRAGMENT_DEFINITIONS
- CUSTOM_FRAGMENT_MAIN_BEGIN
- CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
- CUSTOM_FRAGMENT_MAIN_END

Vertex preprocessors are:

- CUSTOM_VERTEX_DEFINITIONS
- CUSTOM_VERTEX_MAIN_BEGIN
- CUSTOM_VERTEX_UPDATE
- CUSTOM_VERTEX_MAIN_END

<Playground id="#CQH0FN#9" title="Gaussian Splatting Material Plugin" description="Demonstrates a working material plugin on a GaussianSplattingMaterial and how custom uniforms differ from standard materials."/>

## Streaming large scenes with LOD (Experimental)

<Alert severity="warning">
LOD streaming is an experimental feature. Its API (the `GaussianSplattingStream` class, its options and properties) may change in future releases.
</Alert>

Very large Gaussian Splatting captures (hundreds of millions of splats, several gigabytes) do not fit in memory and cannot be rendered at full detail everywhere at once. Babylon.js can stream such scenes from a PlayCanvas-style **streamed SOG** bundle described by a `lod-meta.json` file: the scene is split into a spatial octree of chunks, each available at several levels of detail (LOD). Only the LODs needed for the current point of view are downloaded, GPU-decoded and rendered, and far/off-screen chunks use coarser levels.

The coarsest LOD of every chunk is streamed first as a permanent base layer, so the whole scene becomes visible quickly with no holes; finer LODs then stream in on demand as the camera approaches, and a chunk only switches to a finer level once its data is ready, so transitions never flash or leave gaps.

### Loading a streamed SOG

Point any of the standard loaders at the `lod-meta.json` file. A node named `GaussianSplattingStream` is created automatically:

```javascript
BABYLON.AppendSceneAsync("https://example.com/myScene/lod-meta.json", scene);
```

`GaussianSplattingStream` extends `GaussianSplattingMesh`, so it integrates with sorting, shadows and the rest of the Gaussian Splatting pipeline. It works on both WebGL2 and WebGPU.

### Tuning options

To control LOD behaviour and memory usage, construct the stream directly from the parsed metadata instead of relying on the loader defaults:

```javascript
const rootUrl = "https://example.com/myScene/";
const metadata = await (await fetch(rootUrl + "lod-meta.json")).json();

const stream = new BABYLON.GaussianSplattingStream("GaussianSplattingStream", metadata, rootUrl, scene, {
    // Memory eviction / true streaming: cap resident splats so the scene can exceed
    // what fits in a single full-dataset buffer. Unreferenced chunks are evicted once
    // they have not been rendered for `evictionCooldownFrames` frames.
    memoryBudgetMb: 512,        // GPU budget for resident splats (MB)
    // maxResidentSplats: 4_000_000, // alternative: budget expressed as a splat count
    evictionCooldownFrames: 100,

    // LOD selection (distance-based, PlayCanvas-compatible defaults)
    lodBaseDistance: 5,         // distance of the first LOD transition
    lodMultiplier: 3,           // geometric ratio between successive transitions
    maxDetailLod: 0,            // 0 = allow full detail; higher = coarser maximum detail

    // Download manager (concurrency cap, retries and queuing)
    maxConcurrentDownloads: 2,
    maxDownloadRetries: 2,
});

await stream.whenSettledAsync();
```

When a `memoryBudgetMb` (or `maxResidentSplats`) is set and is smaller than the whole dataset, LOD files are streamed through a fixed-size work buffer and unreferenced files are evicted to stay within budget — this is what allows datasets far larger than a single buffer to be displayed. When left unset, the work buffer is sized for the entire dataset and nothing is evicted.

### Useful properties and methods

- `maxDetailLod` — finest LOD any chunk may render (`0` = full detail). Raise it to trade detail for performance; changes apply in real time.
- `maxLodLevel` — coarsest LOD level index available in the scene (upper bound for `maxDetailLod`).
- `frustumCulling` — when `true` (default), off-screen chunks are biased to their coarsest LOD instead of full detail (they stay in the render set so they appear instantly when the camera turns).
- `evaluateOptimalLods(camera)` — forces a re-evaluation of the per-chunk target LODs for a given camera.
- `debugDisplay` / `debugLodSource` — draw a wireframe box per chunk, colored by LOD level, to visualize streaming.
- `whenSettledAsync(stableFrames = 3)` — returns a promise that resolves once every chunk reachable from the **current** camera position has finished downloading, decoding and depth-sorting, and the result has been rendered. This is intended for deterministic automated testing and screenshot/image comparison. Keep the camera still while awaiting it (a moving camera keeps changing the target LODs, so the scene never settles). If no render loop is running yet (for example when awaited inside an async `createScene`), it drives rendering itself so it never deadlocks.

<Playground id="#418POI#12" title="Streamed SOG with LOD" description="Loads a large scene from a lod-meta.json streamed SOG bundle and waits for it to settle."/>

### Generating a streamed SOG with splat-transform

A `lod-meta.json` bundle is produced from a single `.ply` capture with [SplatTransform](https://github.com/playcanvas/splat-transform), PlayCanvas' CLI tool. Install it, then write a `lod-meta.json` output (the `.lod-meta.json` extension triggers multi-LOD streaming output):

```bash
npm install -g @playcanvas/splat-transform

# Generate a multi-LOD streamed SOG bundle (writes lod-meta.json plus the SOG chunk files)
splat-transform input.ply output/lod-meta.json

# Tune chunking: approximate Gaussians per chunk (in thousands) and chunk extent (in meters)
splat-transform input.ply -C 512 -X 16 output/lod-meta.json
```

The output folder contains `lod-meta.json` alongside the SOG chunk files it references. Host the whole folder and point Babylon.js at the `lod-meta.json` URL. See PlayCanvas' [Generating Streamed SOG](https://developer.playcanvas.com/user-manual/splat-transform/#generating-lod-format) guide for an end-to-end walkthrough and the full option list.

## File format conversion

SplatTransform is a CLI tool for converting and editing Gaussian splats: https://github.com/playcanvas/splat-transform

Check the project page for features and file import/export formats.