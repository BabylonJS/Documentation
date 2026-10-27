---
title: Gaussian Splatting
image:
description: Learn how to use Gaussian Splatting.
keywords: diving deeper, meshes, gaussian, splatting, nerf
further-reading:
video-overview:
video-content:
---

## What is Gaussian Splatting?

Gaussian Splatting is a volume-rendering method. It's useful for capturing real-life data. Unlike other techniques such as photogrammetry, the end result consists of a point cloud in which each point is rendered as a semi-transparent ellipsoid projected onto a billboard. Gaussian Splatting is better suited to rendering reflective and transparent surfaces.

## Supported formats

Supported formats are:

- .PLY https://en.wikipedia.org/wiki/PLY_(file_format), including compressed PLY and PLY files storing properties as 16-bit (half-float) values
- .splat, which is a JavaScript typed-array serialized version of .PLY data
- Niantic Labs .spz format https://scaniverse.com/news/spz-gaussian-splat-open-source-file-format (including the version 4 format and spherical harmonics up to order 4)
- .SOG/SOGS Self-Organizing Gaussian https://github.com/fraunhoferhhi/Self-Organizing-Gaussians
- glTF files using the [KHR_gaussian_splatting](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_gaussian_splatting/README.md) extension
- Streamed SOG bundles described by a `lod-meta.json` file. See [Streaming large scenes with LOD](#streaming-large-scenes-with-lod-experimental)

**Note: Triangular meshes stored in .PLY are also supported and used by Triangular Splatting**

The .SPZ file import supports the flipY option to handle vertically flipped file outputs. This option is also available with the `updateData` method but not with other formats.

```javascript
const pit = await BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/hornedlizard.spz", scene, {pluginOptions:{splat:{flipY:true}}})
```

glTF files using the `KHR_gaussian_splatting` extension are loaded with the regular glTF loader. Each primitive tagged with the extension becomes a `GaussianSplattingMesh`. The rotation, scale, opacity and spherical harmonics attributes defined by the extension are supported.

<Playground id="#WSAFDA#0" title="Gaussian Splatting in glTF" description="Loading a glTF file using the KHR_gaussian_splatting extension."/>

### Loader options

Options are passed to the splat loader through `pluginOptions.splat`:

| Option | Description |
| --- | --- |
| `keepInRam` | Keeps the splat data in memory (`splatsData`) so it can be edited or downloaded later. |
| `flipY` | Flips the position and orientation of the splats vertically. |
| `disableAutoCameraLimits` | Prevents the camera limits stored in the file from being applied automatically. See [Safe orbit camera limits](#safe-orbit-camera-limits). |
| `gaussianSplattingMesh` | Loads the data in an existing mesh instead of creating a new one. |
| `needsRotationScaleTextures` | Generates the rotation and scale textures required by voxel-based IBL shadows when `keepInRam` is `false`. |
| `useSogTextures` | Uploads SOG files as raw GPU textures and dequantizes them in the shader. This skips the CPU decode and loads much faster. Requires WebGL2 or WebGPU. Defaults to `false`. |
| `spzLibraryUrl` | URL of the SPZ WebAssembly module. It is required for SPZ version 4 files and enables SPZ extensions such as antialiasing and safe-orbit camera limits metadata. Set it to `undefined` to force the built-in SPZ parser. |
| `deflateURL`, `fflate` | Location or instance of the [fflate](https://github.com/101arrowz/fflate) library used to inflate compressed files. |

```javascript
const result = await BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/scene.sog", scene, {
    pluginOptions: { splat: { useSogTextures: true, keepInRam: false } }
});
```

### Safe orbit camera limits

Some splat files carry recommended camera limits (minimum orbit radius and elevation range). When the active camera is an `ArcRotateCamera`, these limits are applied automatically at load time unless `disableAutoCameraLimits` is set. The parsed values are also stored on the mesh in `safeOrbitCameraLimits` (`null` when the file doesn't provide any), so they can be applied to any kind of camera. Elevation angles are expressed in radians from the horizontal plane, while an `ArcRotateCamera` `beta` angle is measured from the vertical axis:

```javascript
const limits = gaussianSplattingMesh.safeOrbitCameraLimits;
if (limits) {
    if (limits.radiusMin) {
        camera.lowerRadiusLimit = limits.radiusMin;
    }
    if (limits.elevationMinMax) {
        camera.lowerBetaLimit = Math.PI * 0.5 - limits.elevationMinMax[1];
        camera.upperBetaLimit = Math.PI * 0.5 - limits.elevationMinMax[0];
    }
}
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

Load the splat or PLY file asynchronously, like any other supported file format:

```javascript
BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/gs_Skull.splat", scene).then((result) =>{
    const gaussianSplattingMesh = result.meshes[0]; });
```

**Note: Gaussian splatting files do not have a standard for handedness or orientation. No space-change operation will occur. Some scenes might appear upside down or mirrored.**

<Playground id="#M05L0C#0" title="Nianticlabs .SPZ examples need a rotation." description="Nianticlabs .SPZ examples up is not the same as Babylon.js default."/>

## Updating data in Gaussian Splatting

Users can update or generate new splats with the `updateData` method.
The required values are the splat center position, size, orientation, and color.
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

## Updating and downloading Gaussian Splatting data

Access to the in-memory splat data allows you to modify loaded splats and download them afterward.
A simple call to `updateData` will make the change visible.

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

**Note: The user is responsible for checking the maximum part count that can be displayed by Gaussian Splatting.**

```javascript
const maxPartCount = BABYLON.GetGaussianSplattingMaxPartCount(scene.getEngine());
```

<Playground id="#PUWLG4#0" title="Manipulate Splats" description="Two Gaussian Splatting elements in a single scene."/>

Each part can have an independent visibility value through the `visibility` property, which influences each individual splat. This means the overall transparency of the Gaussian Splatting is greatly influenced by splat density and overdraw. A visibility of 0.1 may leave the Gaussian Splatting almost opaque if enough splats share the same pixel.

Added parts can be removed by index using the `removePart` method. Removing a part only marks its region as free. Call `compactAtlas()` to relocate the remaining parts and reclaim the memory of the removed ones. Several parts can be added at once with `addParts`.

```javascript
const part = compound.addPart(otherSplat);
// ...
compound.removePart(part.partIndex);
compound.compactAtlas();
```

<Playground id="#BTS11N#0" title="Parts visibility and suppression" description="Add parts, change their visibility and remove one of them."/>

A [streamed SOG](#streaming-large-scenes-with-lod-experimental) can also be a part of a compound mesh, see [Streaming as a part of a compound](#streaming-as-a-part-of-a-compound).

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

Other fragment preprocessors are:
 
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

## Debug rendering

Two material plugins help diagnose the on-screen footprint and overlap of Gaussian splats. Both work with `GaussianSplattingMaterial` on WebGL (GLSL) and WebGPU (WGSL); they are visualizations, not changes to the underlying splat data.

Both plugins start enabled when constructed. Create each once on the mesh's material, then enable only the visualization you want:

```javascript
const result = await BABYLON.ImportMeshAsync("https://assets.babylonjs.com/splats/hornedlizard.spz", scene);
const mesh = result.meshes.find((candidate) => candidate instanceof BABYLON.GaussianSplattingMesh);
if (!mesh || !(mesh.material instanceof BABYLON.GaussianSplattingMaterial)) {
    throw new Error("Expected a Gaussian splatting mesh with a Gaussian splatting material");
}

const material = mesh.material;
const size = new BABYLON.GaussianSplattingSizeMaterialPlugin(material);
size.isEnabled = false;
const overdraw = new BABYLON.GaussianSplattingOverdrawMaterialPlugin(material);
overdraw.isEnabled = false;

// Projected size
size.sizeScale = 16;
size.isEnabled = true;

// Switch to overdraw
size.isEnabled = false;
overdraw.intensity = 1 / 256;
overdraw.isEnabled = true;

// Restore normal rendering
overdraw.isEnabled = false;
```

### Projected splat size

`GaussianSplattingSizeMaterialPlugin` visualizes the longest diameter of each projected splat ellipse in **render-target pixels** (the same units as `minPixelSize`), not world-space size or ellipse area. Smaller splats appear whiter. `sizeScale` defaults to `16` pixels: a splat with a 16-pixel projected diameter is half-brightness. Increase `sizeScale` to brighten splats at a given size. Use it to spot splats whose screen-space footprint is too small or too large at the current camera distance and render resolution. This mode keeps the usual Gaussian alpha and blending; it is not a count of splats covering a pixel.

<Playground id="#8FOB3C#0" title="Gaussian splat projected size" description="Visualizes the projected sizes of splats in a horned lizard SPZ scene."/>

### Splat overdraw

`GaussianSplattingOverdrawMaterialPlugin` visualizes how many splats cover each pixel. Every surviving fragment inside the Gaussian footprint adds the same `intensity` to RGB, independent of its positive opacity, Gaussian falloff, or source color. Fully transparent or hidden splats do not contribute. `intensity` defaults to `1 / 256`, so on a black normalized render target about 256 overlapping fragments reach white; lower it for denser scenes to avoid saturation. This mode uses additive blending without depth writes (the depth test still applies). It is a coverage diagnostic, not a measure of final opacity.

Both `sizeScale` and `intensity` must be positive, finite numbers. Disabling overdraw restores the material's previous blending and depth-write settings.

<Playground id="#D4U720#1" title="Gaussian splat overdraw" description="Visualizes splat coverage in a horned lizard SPZ scene with a low per-fragment contribution."/>

### Inspector V2

In [Inspector V2](/toolsAndResources/inspectorv2), select a Gaussian splatting mesh and open **Gaussian Splatting → Debug Rendering**. Choose **Normal**, **Projected size**, or **Overdraw**, then adjust **Size Scale (pixels)** or **Overdraw Intensity** in the same section. The Inspector uses a temporary material for debug rendering. **Min Pixel Size** edits in the Inspector also update the original material, so they persist when you return to **Normal**. **Normal** and closing the Inspector restore the original material if it is still available; if it was disposed while debug rendering was active, the mesh is left without a material rather than receiving a replacement. Switching the selection away and back retains the chosen debug mode. If your original material already has app-attached debug plugins, **Normal** restores that material as-is rather than disabling those plugins.

## Rendering and sorting settings

Splats are blended with alpha, so they must be sorted from back to front relative to the camera. The sort runs in a worker (or on the GPU, see below) and is refreshed when the view changes. The following settings control quality and cost:

| Setting | Description |
| --- | --- |
| `GaussianSplattingMaterial.KernelSize` / `material.kernelSize` | Point spread function added to each splat (default `0.3`). SPZ files trained with antialiasing automatically use `0.1`. |
| `GaussianSplattingMaterial.Compensation` / `material.compensation` | Compensates the opacity of splats when the kernel size is applied (default `false`). |
| `GaussianSplattingMaterial.MinPixelSize` / `material.minPixelSize` | Discards splats whose projected size is smaller than this value in pixels (default `0`, disabled). Applied in real time. |
| `mesh.viewUpdateThreshold` | Cosine of the angle threshold above which the view dependent sort is refreshed (default `0.0001`). |
| `mesh.disableDepthSort` | Disables the depth sort entirely. |
| `GaussianSplattingMeshBase.UseCountingSort` | Uses a fast O(n) counting sort in the sort worker (default `true`). |
| `mesh.setSplatIndexRanges(ranges)` | Restricts rendering to ranges of splats. `renderedSplatCount` returns the number of splats currently rendered. |
| `GaussianSplattingMeshBase.ProgressiveUpdateAmount` | Number of 16384-splat batches after which the display is updated while loading. `0` waits for the whole asset. |

### GPU depth sorting (Experimental)

<Alert severity="warning">
GPU sorting is an experimental feature and is off by default. Its API may change in future releases.
</Alert>

On WebGPU with compute shader support, splats can be sorted on the GPU with a compute shader instead of the CPU worker. The sorted indices stay on the GPU, which avoids reading back and re-uploading them. GPU sorting is opt-in because the sort competes with rendering: on low-end GPUs, the asynchronous CPU worker can be faster while the camera is moving. Measure on your target hardware before enabling it.

Enable it before loading data, either for all meshes or for a single mesh:

```javascript
// All Gaussian Splatting meshes created afterwards
BABYLON.GaussianSplattingMeshBase.UseGpuSort = true;

// Or override for a specific mesh (null follows the static value)
mesh.useGpuSort = true;

// Optional: re-sort at most once every 2 frames when only the view changes
BABYLON.GaussianSplattingMeshBase.GpuSortMinFrameInterval = 2;
```

`GpuSortMinFrameInterval` (default `1`) trades a slightly stale order during camera motion for a lower GPU cost. Sorts caused by data changes, like new splats or parts, are not throttled.

The CPU worker is used instead of the GPU sort when:

- the engine is WebGL or Native, or WebGPU without compute shader support,
- the splat count exceeds the GPU sorter limit,
- the scene uses a custom render function (`scene.customRenderFunction`) other than the frame graph one,
- the mesh is a [streamed](#streaming-large-scenes-with-lod-experimental) Gaussian Splatting,
- point splatting is enabled, or depth sorting is disabled at runtime. A mesh does not come back to the GPU sort afterwards.

### Point splatting (WebGPU)

Point splatting is an opt-in WebGPU compute renderer based on [Gaussian point splatting](https://jorisar.nl/gaussian_point_splatting/). Instead of sorting and rasterizing overlapping splat quads, it samples random points from each Gaussian, keeps the nearest sample per pixel and progressively averages the result. The image starts noisy and converges while the view and the scene stay stable. Skipping the sort and the quad overdraw can substantially improve performance on large assets.

```javascript
mesh.pointSplattingRenderMode = true;       // use point splatting for color
mesh.pointSplattingDepthRenderMode = true;  // independently use point depth for the DepthRenderer
mesh.pointSplattingScale = 1;               // point density. Higher is denser and slower
mesh.pointSplattingRenderScale = "auto";    // or a fixed fraction of the full resolution
mesh.pointSplattingOcclusionCulling = false; // previous-frame Hi-Z culling

// Counters of the latest compute frame: { renderedFrameCount, accumulationVersion, pixelCycleLength }
console.log(mesh.pointSplattingProgress);
```

Both render modes are off by default. They are WebGPU only: enabling them on another engine logs a warning and keeps the classic rendering. The settings are serialized with the mesh. When using ES6 modules, import `@babylonjs/core/Meshes/GaussianSplatting/gaussianPointSplattingController`.

Point splatting supports compound meshes (part transforms, ranges and visibility), spherical harmonics, `GaussianSplattingDebugMaterialPlugin`, orthographic, reverse depth and logarithmic depth projections. Eligibility is evaluated at each draw and Babylon.js falls back to the classic path when needed, for example with:

- multiple active cameras or rig cameras, floating origin, clip planes,
- streamed parts or GPU-only splat data,
- materials other than the built-in `GaussianSplattingMaterial` (such as node materials), unsupported plugins, alpha test or opaque transparency modes, or wireframe and point fill modes.

Point color falls back independently from point depth: a color-only fallback doesn't disable point depth.

**Note: Each pixel is depth-tested as a whole against its latest sample. Where other geometry intersects the splats, occluded splats can bleed through and the result can flicker. Mostly opaque splats and non-intersecting geometry render correctly.**

<Playground id="#F39YWU#2" engine="webgpu" title="Gaussian Point Splatting" description="WebGPU point splatting rendering of a Gaussian Splatting."/>

## Debugging with the GaussianSplattingDebugger

`GaussianSplattingDebugger` applies debug rendering options to several Gaussian Splatting meshes at once, through a `GaussianSplattingDebugMaterialPlugin` attached to each mesh material. It has no rendering cost until an option is enabled. The mesh must already have its material, meaning the data was loaded at least once. See also [Debug rendering](#debug-rendering) for the projected size and overdraw visualizations.

```javascript
const gsDebugger = new BABYLON.GaussianSplattingDebugger();
gsDebugger.addMesh(gaussianSplattingMesh);

// Hide splats outside a world-space box
gsDebugger.clippingBox = { min: new BABYLON.Vector3(-2, -2, -2), max: new BABYLON.Vector3(2, 2, 2) };
// Discard splats by opacity or by projected size
gsDebugger.opacityCulling = { min: 0.1, max: 1 };
const sizeRange = BABYLON.GaussianSplattingDebugger.GetSplatSizeRange(gaussianSplattingMesh);
gsDebugger.sizeCulling = { min: sizeRange.min, max: sizeRange.max * 0.5 };
// Scale opacities, or render splats as flat disks
gsDebugger.opacityScale = 0.5;
gsDebugger.opacitySaturate = true;
// Toggle spherical harmonics bands independently
gsDebugger.shDc = true;
gsDebugger.shOrder1 = false;
gsDebugger.shOrder2 = false;
gsDebugger.shOrder3 = false;
gsDebugger.shOrder4 = false;
```

Meshes added later inherit the current settings. For compound meshes, `setPartOptions(mesh, partIndex, options)` overrides the options of a single part and `clearPartOptions(mesh, partIndex)` restores the global settings. Call `dispose()` to remove all plugins.

`GaussianSplattingSolidColorMaterialPlugin` replaces the color of each part of a compound mesh with a solid color. `updatePartColors` changes the colors and `isEnabled` toggles the override without recompiling the shader.

```javascript
const solidColor = new BABYLON.GaussianSplattingSolidColorMaterialPlugin(compoundMesh.material, [BABYLON.Color3.Red(), BABYLON.Color3.Green()]);
```

The Inspector also provides the debug visualizations for the selected Gaussian Splatting mesh, and live diagnostics for streamed scenes (rendered splats, resident budget and LOD 0 total).

<Playground id="#XSNFXP#21" title="Gaussian Splatting debug clipping box" description="Clipping a Gaussian Splatting with the debug material plugin."/>

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

When a `memoryBudgetMb` (or `maxResidentSplats`) is set and is smaller than the whole dataset, LOD files are streamed through a fixed-size work buffer and unreferenced files are evicted to stay within budget — this is what allows datasets far larger than a single buffer to be displayed. When left unset and the full size of the dataset is known, the work buffer is sized for the entire dataset and nothing is evicted. Scenes with a lot of files and unknown finer levels use a bounded default budget depending on the device (desktop or mobile).

The capacity is fixed when the stream is created: construct a new stream to use another limit. A requested limit lower than `minimumResidentSplats` (the size of the complete coarse layer, which always stays resident) is raised to that minimum with a warning. Memory figures are estimates of the combined CPU and GPU cost, not exact VRAM caps.

Large scenes (more than 32 referenced files) load their coarse layer first, and each coarse file becomes visible as soon as it is decoded, before the metadata of finer levels is requested. This reduces the time to first visible geometry.

### Limiting the number of rendered splats

By default, the LOD is selected from the distance to the camera, which doesn't limit the number of splats drawn. The optional `splatBudget` caps the total number of rendered splats, for a steady frame cost on laptops and phones. Detail is spent where it matters most: large and close splats stay sharp while small or distant ones drop detail. Pass `"auto"` for a default depending on the device (2.5M on desktop, 1.5M on iOS, 1M on other mobile devices), or leave it undefined to disable the cap.

```javascript
const stream = new BABYLON.GaussianSplattingStream("GaussianSplattingStream", metadata, rootUrl, scene, {
    splatBudget: 2_000_000,
});

// Can be changed at runtime
stream.splatBudget = 1_000_000;
console.log(stream.renderedSplatCount, stream.effectiveSplatBudget);
```

LOD selection and culling take all the active cameras into account (split views and multi-view), and the LOD is refreshed when the camera zooms, the canvas is resized or the splat moves, not only when the camera moves.

### Other streaming options

- `decodeSh` (default `true`) — decodes the spherical harmonics stored in the SOG files, for view-dependent lighting. Set it to `false` to render flat colors and save memory.
- `needsRotationScale` (default `false`) — decodes rotation and scale textures so the streamed splats can receive voxel-based IBL shadows.
- `lodBehindPenalty`, `lodRangeMin`, `lodRangeMax`, `lodCooldownFrames`, `lodUpdateInterval`, `lodUpdateDistance`, `maxDecodesPerFrame` — fine tuning of the LOD selection and of the work done per frame.
- `rangeResidency` (experimental) — keeps resident only the splat ranges that are selected, instead of whole source files.

### Streaming as a part of a compound

A streamed SOG can be a part of a `GaussianSplattingCompoundMesh`. Its splats are then depth-sorted and drawn in a single pass together with the static parts of the compound, instead of using a separate mesh, sort worker and draw call. `AddGaussianSplattingStreamPartAsync` returns the same proxy as `addPart` does for static parts, so it can be placed, hidden, picked or removed in the same way.

```javascript
const compound = new BABYLON.GaussianSplattingCompoundMesh("GSplatRoot", null, scene);

const proxyA = await BABYLON.AddGaussianSplattingStreamPartAsync(compound, "partA", metadataA, rootUrlA);
const proxyB = await BABYLON.AddGaussianSplattingStreamPartAsync(compound, "partB", metadataB, rootUrlB);
proxyB.position.x = 10;

// One budget shared by all the streamed parts of the compound, shared according to their demand
compound.splatBudget = 3_000_000;

// Remove a part and reclaim its memory
compound.removePart(proxyA.partIndex);
compound.compactAtlas();
```

**Note: The base layer is decoded on the GPU in the render loop. Start rendering (`engine.runRenderLoop`) before awaiting `AddGaussianSplattingStreamPartAsync`, otherwise the promise never resolves.** Use the synchronous `AddGaussianSplattingStreamPart` to add a part without waiting.

Hosted streams support several streamed parts, memory-budgeted eviction, spherical harmonics and voxel-based IBL shadows. They require WebGL2 or WebGPU.

<Playground id="#418POI#21" title="Streamed SOG parts in a compound" description="Two streamed SOG scenes and a static splat sorted together in one compound mesh."/>

### Useful properties and methods

- `maxDetailLod` — finest LOD any chunk may render (`0` = full detail). Raise it to trade detail for performance; changes apply in real time.
- `maxLodLevel` — coarsest LOD level index available in the scene (upper bound for `maxDetailLod`).
- `frustumCulling` — when `true` (default), off-screen chunks are biased to their coarsest LOD instead of full detail (they stay in the render set so they appear instantly when the camera turns).
- `splatBudget`, `effectiveSplatBudget`, `renderedSplatCount` — configured budget, budget actually in force (it reflects the shared budget when the stream is part of a compound), and number of splats currently rendered.
- `minimumResidentSplats`, `residentSplatBudget` — size of the coarse layer that always stays resident, and the resident capacity of the work buffer. `minimumResidentSplats` is `0` until the coarse metadata is loaded.
- `lod0SplatCount` — total splats of the finest LOD, as `{ status: "pending" | "available" | "unavailable", count? }`.
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