---
title: Node Material
image: /img/pageImages/nodeMaterial.jpg
description: The Node Material is a simple, highly customizable material that you can build yourself piece by piece. Combined with the powerful node-based editor, you can easily create stunning custom GPU shaders and FX for your Babylon.js scenes.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor
further-reading:
  - title: Dedicated NME Forum Examples
    url: https://forum.babylonjs.com/t/node-materials-examples/6048
  - title: 3 Tips For Getting Started Building Procedural Node Material Shaders
    url: https://babylonjs.medium.com/procedural-node-material-shaders-3-tips-for-getting-started-4089c1832dfc
  - title: Mesh shattering with baked physics
    url: https://babylonjs.medium.com/mesh-shattering-with-baked-physics-5b3f8f381743
  - title: Fighting Self-Doubt, with Water
    url: https://babylonjs.medium.com/fighting-self-doubt-with-water-3b1509218009
  - title: Creating the Babylon.js Node Material
    url: https://babylonjs.medium.com/creating-the-babylon-js-node-material-6893b3abe4df
  - /toolsAndResources/nme
video-overview:
video-content:
  - title: PBR Nodes in Nodes Materials Part 1
    url: https://youtu.be/CRg8P1Af1M0
  - title: Node-Based Procedural Textures
    url: https://youtu.be/qqMuuSM7GvI
  - title: Creating Procedural Node Materials Through Code
    url: https://youtu.be/GrmVObi6caQ
  - title: Node Material Post Processes
    url: https://youtu.be/QTuL5raapQQ
  - title: Node Material Editor Particles!!!!
    url: https://youtu.be/fZvZMXDoVp4
  - title: Interactive Hex Tile Series
    url: https://www.youtube.com/playlist?list=PLsaE__vWcRamMC5oJwhrSj3x3jT9TWOPB
  - title: Unraveling Advanced Anisotropic Reflections
    url: https://youtu.be/Zk0A5UzNLNw
  - title: Diving Into the Audio Engine Part 1
    url: https://youtu.be/lVfx6sf9zPY
  - title: Diving Into the Audio Engine Part 2
    url: https://youtu.be/0uxbFb-cVds
  - title: Shader Fun with Polar Coordinates
    url: https://youtu.be/n5WuGHmSZgk
  - title: The Power of Morph Targets
    url: https://youtu.be/QlCZAWW4TcI
  - title: Procedural Terrain using the Raw Texture feature
    url: https://youtu.be/YKqXcrWliww
  - title: Node Material Glow Effects
    url: https://youtu.be/5ZuM-WLqEPQ
  - title: Mystery Demo Tutorial Series
    url: https://www.youtube.com/playlist?list=PLsaE__vWcRam5eDcUlGHvylTaATXCAQnC
  - title: Happy Holidays Node Material Displacement Demo
    url: https://youtu.be/bnv58YH7lw0
  - title: Node Material Ink Shader Tutorial
    url: https://youtu.be/0re82mEd1n8
  - title: Node Material Editor Graph Updates
    url: https://youtu.be/uHjAoHnMwDo
  - title: Fun with Light Textures
    url: https://youtu.be/n2DLnMa21K0
  - title: Lighting in Node Material
    url: https://youtu.be/BU9BTUkdYDY
  - title: Node Material Toon Shader Video Series
    url: https://www.youtube.com/playlist?list=PLsaE__vWcRamJgV-PFPvFNgRZEjbu4Muj
  - title: Node Material Editor Step Node Switches
    url: https://youtu.be/FwtFroNMmxw
  - title: Using Your Materials in the Node Material Editor
    url: https://youtu.be/F0Lh73I_6Z8
  - title: Lights and Textures in the Node Material Editor
    url: https://youtu.be/fLXYhGhCejc
  - title: Working with the Vertex Shader in the Node Material Editor
    url: https://youtu.be/B5BO3nFc55s
  - title: Sneak peek at the powerful new Node Material Editor
    url: https://youtu.be/34uIGJH0ySU
---

## Node Material

The Node Material is a simple, highly customizable material that you can build yourself piece by piece. Combined with the powerful node-based editor, you can easily create stunning custom GPU shaders and FX for your Babylon.js scenes.

The Node Material allows you to avoid writing complicated shader language code, instead replacing it with simple processes of either using UI (the Node Material Editor) or by creating and connecting node blocks in your scene code (the Node Material blocks).

To get started, it's important to understand how the Node Material works under the hood, starting by learning how to create a Node Material using code.

### Creating a Node Material using code

#### Initial steps

If you are interested in learning how to create node materials through code, you might consider starting with the video below as it goes over 3 important tips to help you get started:

<Youtube id="GrmVObi6caQ"/>

To start using the Node Material, you just need to instantiate one:

```javascript
const nodeMaterial = new BABYLON.NodeMaterial("node material", scene, { emitComments: true });
```

Please note that the third parameter will contain optional values that will let you configure how the material will build its shader:

- `emitComments`: Set this value to true if you want the blocks to emit comments in the shader code
- `shaderLanguage`: By default, the node material will generate GLSL shaders but if you set that parameter to `BABYLON.ShaderLanguage.WGSL`, it will generate shaders for WebGPU (without needing to cross-compile them from GLSL to WGSL)

#### Adding blocks

Blocks can be added by just instantiating them:

```javascript
const morphTargets = new BABYLON.MorphTargetsBlock("morphTargets");
```

For input blocks, you can then define either their value or the source of the value:

```javascript
const timeInput = new BABYLON.InputBlock("time");
timeInput.value = 0;
```

or

```javascript
const viewProjectionInput = new BABYLON.InputBlock("viewProjection");
viewProjectionInput.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection);
```

System values can be:

- BABYLON.NodeMaterialSystemValues.World
- BABYLON.NodeMaterialSystemValues.View
- BABYLON.NodeMaterialSystemValues.WorldView
- BABYLON.NodeMaterialSystemValues.Projection
- BABYLON.NodeMaterialSystemValues.ViewProjection
- BABYLON.NodeMaterialSystemValues.WorldViewProjection
- BABYLON.NodeMaterialSystemValues.CameraPosition
- BABYLON.NodeMaterialSystemValues.FogColor
- BABYLON.NodeMaterialSystemValues.DeltaTime

Input blocks can also take their value from a mesh attribute:

```javascript
let positionInput = new BABYLON.InputBlock("position");
positionInput.setAsAttribute("position");
```

Attributes can be:

- position
- normal
- tangent
- uv
- uv2
- matricesIndices
- matricesWeights
- matricesIndicesExtra
- matricesWeightsExtra

When you manually set the value of an InputNode, you can flag it as `node.isConstant` to indicate that the value will not be dynamically updated and thus the node material will be able to optimize the block by not generating a uniform for this value.

The following functions will let you get information about your InputNode:

- `isSystemValue`
- `isAttribute`
- `isUniform`
- `isConstant`

When an InputNode is a uniform (eg. a manual value that will be sent to the shader) and not a constant, you can set `inputNode.visibleInInspector` to true so users will be able to visually control the value of the node using Babylon.js Inspector.

You can even customize the look and feel of the Inspector UI by defining `inputNode.min` and `inputNode.max` to get a slider instead of an input text box.

#### Connecting blocks

By default calling `block.connectTo(otherBlock)` will try to establish a connection by picking an output from the first block and connect it to an available input in the second one:

```javascript
const positionInput = new BABYLON.InputBlock("position");
positionInput.setAsAttribute("position");

const worldInput = new BABYLON.InputBlock("world");
worldInput.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World);

const worldPos = new BABYLON.TransformBlock("worldPos");
positionInput.connectTo(worldPos);
worldInput.connectTo(worldPos);
```

If you do not want to use the automatic connection you can then pick the output and the input you want to connect directly:

```javascript
worldInput.output.connectTo(boneBlock.world);
```

You can check if two connection points can connect with

```javascript
if (worldInput.output.canConnectTo(boneBlock.world)) {
    ...
}
```

The system will throw an exception if you try to connect two incompatible connection points.

When connected, two connection points can be disconnected with:

```javascript
worldInput.output.disconnectFrom(boneBlock.world);
```

#### Gettings blocks

Once a graph is built inside a NodeMaterial, you can use the following API to get a specific node by name:

```javascript
let block = nodeMaterial.getBlockByName("MyBlock");
```

You can also get a block using a predicate:

```javascript
let block = nodeMaterial.getBlockByPredicate((b) => b.getClassName() === "AddBlock" && b.name === "foo");
```

Or you can also use this API to get an InputNode and use it to setup its value if the node is set manual value:

```javascript
let block = nodeMaterial.getInputBlockByPredicate((b) => b.name === "foo");
block.value = 10;
```

Note that while this API generically works for all input blocks, not all input blocks have a "value" attribute. For example texture blocks would have block.texture instead of block.value. Be sure to check the [API documentation](/typedoc/classes/babylon.nodematerial) for detail.

You can access the list of InputBlocks with:

```javascript
nodeMaterial.getInputBlocks();
```

Or you can get all blocks registered with a node material with:

```javascript
nodeMaterial.attachedBlocks;
```

Be sure to also check out the full [API documentation.](/typedoc/classes/babylon.nodematerial)

#### Building the Node Material

Once setup, you can ask the Node Material to build its internal shaders (vertex and fragment) by calling `nodeMaterial.build(true)`. You can set the boolean parameter to true to get a log of the final shaders on the console.

The build function will throw an exception if the shaders cannot be compiled:

```javascript
try {
  nodeMaterial.build(true);
} catch (err) {
  console.log("Unable to compile because " + err);
}
```

Once successfully built, you can use the Node Material like any other materials:

```javascript
myMesh.material = nodeMaterial;
```

#### Example

Here is one of the simplest code using the Node Material:

```javascript
const nodeMaterial = new BABYLON.NodeMaterial("node material", scene, { emitComments: true });
const positionInput = new BABYLON.InputBlock("position");
positionInput.setAsAttribute("position");

const worldInput = new BABYLON.InputBlock("world");
worldInput.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World);

const worldPos = new BABYLON.TransformBlock("worldPos");
positionInput.connectTo(worldPos);
worldInput.connectTo(worldPos);

const viewProjectionInput = new BABYLON.InputBlock("viewProjection");
viewProjectionInput.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection);

const worldPosdMultipliedByViewProjection = new BABYLON.TransformBlock("worldPos * viewProjectionTransform");
worldPos.connectTo(worldPosdMultipliedByViewProjection);
viewProjectionInput.connectTo(worldPosdMultipliedByViewProjection);

const vertexOutput = new BABYLON.VertexOutputBlock("vertexOutput");
worldPosdMultipliedByViewProjection.connectTo(vertexOutput);

// Pixel
const pixelColor = new BABYLON.InputBlock("color");
pixelColor.value = new BABYLON.Color4(0.8, 0.8, 0.8, 1);

const fragmentOutput = new BABYLON.FragmentOutputBlock("fragmentOutput");
pixelColor.connectTo(fragmentOutput);

// Add to nodes
nodeMaterial.addOutputNode(vertexOutput);
nodeMaterial.addOutputNode(fragmentOutput);
```

Please note that this code is equivalent to:

```javascript
const nodeMaterial = new BABYLON.NodeMaterial("node material", scene, { emitComments: true });
nodeMaterial.setToDefault();
```

Here's an advanced and fantastic example of creating an impressive Node Material manually.
<Playground id="#GETMGI#2" title="Advanced Dissolve Node Material" description="Advanced Node Material shader created manually."/>

### Using the Node Material Editor

Now that you've learned how the system works and understand how you can use it to create complex shaders more quickly than learning a new shader language, you should probably know that it can actually get even easier!

The [Node Material Editor](/toolsAndResources/nme) is an incredibly powerful tool that allows you to create and connect blocks in a simple visual editor.

![NME](/img/how_to/Materials/nme.jpg)

To invoke the editor you can call `nodematerial.edit()` but this code must be called inside a user interaction (like a click event). You can also call it through the Inspector:

```javascript
scene.debugLayer.show();
scene.debugLayer.select(nodeMaterial);
```

When selected in the Inspector, you can find an edit button in the Node Material property pane.

You can also use a standalone version of the editor here: <NME id="" title="Node Material Editor" description="The starting basic template for creating Node Materials." image="/img/playgroundsAndNMEs/nmeDefault.jpg"/>

Learn more about the [Node Material Editor here](/toolsAndResources/nme).

### Using Node Material With WebGL and WebGPU

Node materials are now able to render with either the popular WebGL API or the newer [WebGPU API](/setup/support/webGPU) which allows node material to leverage a device's graphics processing unit (GPU). To define which API should be used by a node material, you can set up that option in the constructor or simply set the `nodeMaterial.shaderLanguage` parameter to `BABYLON.ShaderLanguage.WGSL`.

Inside the Node Material Editor, you have an option to choose which engine to use during creation time:
![Engine toggle for WebGL and WebGPU](/img/tools/nme/engineSwitch.jpg)

The assigned engine parameter will NOT be saved in the node material's json file allowing you to still choose the correct version at runtime.

### Recreating the StandardMaterial

As a training exercise and to show what is possible to do with the Node Material Editor, the `StandardMaterial` has been recreated in the NME:

- <NME id="#AT7YY5#6" title="Full Standard Material NME" description="A Node Material Editor setup of the full standard material." image="/img/playgroundsAndNMEs/NMEfullStandardMaterial.jpg"/>
- <NME id="#AT7YY5#7" title="Standard Material Without Alpha NME" description="A Node Material Editor setup of the standard material without alpha support." image="/img/playgroundsAndNMEs/NMEstandardMaterialNoAlpha.jpg"/>
- <Playground id="#M5VQE9#19" title="Playground of Standard Material and NME Standard Material" description="Playground to compare the existing `StandardMaterial` and the corresponding Node Material." image="/img/playgroundsAndNMEs/PGstandardMaterialNMEstandardMaterial.jpg" isMain={true} category="Node Material"/>

Note that the only difference between the full material and the material without alpha support is that nothing is wire to the `fragmentOutput.a` input. If you don't need alpha support, you should use the "non alpha" node material as alpha-based materials have some constraints:

- they don't write to the zbuffer and are only sorted among themselves, so some sorting rendering artifacts can arise
- they need the `transparencyShadow` property to be `true` for shadow rendering

Let's see how the material has been created and how to use it.

#### Main building frames

The material is divided into several frames, mirroring the main features of the standard material:

- Instances
- Morphs and bones
- Ambient
- Diffuse
- Specular
- Reflection
- Emissive
- Bump (normal map)
- Opacity
- Lightmap
- Vertex color
- Fog

In each of these frames, you generally find a boolean float node that enable/disable the feature, and possibly some other properties to fine-tune the feature. Most of these properties are **Constant** properties, meaning they won't consume a _uniform_ in the shaders and won't be visible in the Inspector / be updatable in javascript: you must change their value directly in the material (they correspond to the `#define` you can find in the standard material shader code).

Note that you won't find this enable/disable property in the **Instances**, **Morphs and bones** and **Fog** frames: they are always enabled. That's because they depend on the mesh geometry / settings (or on a scene setting for **Fog**): those frames will be a simple "pass-through" if the corresponding feature doesn't exist on the mesh / scene, so no need to explicitly disable it in that case.

#### Additional building frames

There are a number of additional frames that help organizing the graph more cleanly:

- Final normal. This frame takes the output from the **Bump** frame and builds the final world normal used in subsequent computations (**Reflection** and **Lights**). You can change the `TWOSIDEDLIGHTING` boolean if you want the lighting to be applied whatever the triangle side facing are.
- Final diffuse computation. It is the frame responsible for computing the final diffuse component, taking into account the ambient, emissive and vertex color components. Here you can modify the `LINKEMISSIVEWITHDIFFUSE` and `EMISSIVEASILLUMINATION` booleans to change the way the diffuse value is computed.
- Final color computation. Everything is brought together to compute the final rgb color: ambient (texture), specular, reflection and emissive.
- Final alpha computation. After the opacity (alpha) is generated from the **Opacity** frame, a number of additional computation is performed to produce the final alpha value. You can step in this computation by mean of two booleans, `REFLECTIONOVERALPHA` and `SPECULAROVERALPHA`.
- Premultiply alpha to color. This one does what its title says and is enabled by the `PREMULTIPLYALPHA` boolean.

#### Construction notes

The material itself is not so complicated as each feature is generally restricted to its own frame and has few connections with other frames. That helps to keep each building block manageable and easily understandable.

Below are a few things of note.

#### Working without a `if` statement

As you may know, there's no `if` statement / block in the node material editor, so one must be creative to overcome this. Luckily, the standard material does not use this statement heavily (as it's better to avoid it for performance sake), so it is easy enough to deal with it. Most of the time, it is something like `if boolean is true, use this value in subsequent computation, else use that other value instead`. A **Lerp** block is the tool to use:

```
Lerp(a, b, gradient)
```

`gradient` is the boolean: if it is 0.0, `a` is the output, if it is 1.0, `b` is the output. Then use the output in subsequent computation.

Example:

![Emissive](/img/how_to/Materials/nme_lerp.png)

If `EMISSIVE` is set to 0, the output is `vEmissiveColor`, else it is the color from the emissive map. In effect, the `EMISSIVE` boolean lets you choose to use either the constant `vEmissiveColor` color or the color from the texture map as the emissive color.

The **Lerp** block will also accept more than a numerical value for `gradient`. The `gradient` input also accepts textures - either single channel or RGB - to determine which output is passed for each pixel. A `gradient` pixel with value 0.0 passes the corresponding pixel from `a` where a value of 0.0 would pass the corresponding pixel from `b`. A value between 0.0 and 1.0 will pass a blend of the values of the corresponding pixel from `a` and `b` mixed at the ratio of the value in `gradient`. If the texture is a single channel texture, each of the RGB channels from `a` and `b` are mixed at the same amount. If the texture in `gradient` is an RGB texture, each of the RGB channels of `a` and `b` will be mixed at the ratio of the corresponding `gradient` channel. In other words, the red channel of `gradient` will determine the mix of the pixels in the red channels of `a` and `b`.

![Texture Blending](/img/tools/nme/lerpExample.jpg)

The **Lerp** node is often used for techniques like blending tiling textures to hide repeated patterns or to "splat" textures in specific areas of a mesh. This can also be helpful for creating terrain meshes where it is desireable to scatter patches of dirt or grass on a ground plane in a randomly generated procedural method.

- <Playground id="#KR6748" title="Blending Tiling Textures" description="Blending tiling textures to hide repeating elements." image="/img/playgroundsAndNMEs/tilingTextureBlend.jpg" isMain={true} category="Materials"/>

#### Discarding the fragment based on alpha cutoff value

This construct is meant to discard the fragment if alpha testing is enabled and if the alpha value is below some threshold value (cutoff value). It looks like this:

![Discard](/img/how_to/Materials/nme_discard.png)

As you can see, the `alphaCutOff` node is not directly connected to the `cutoff` input of **Discard** (the **Discard** block will discard the fragment if the `value` input is lower than the `cutoff` input). That's because we need to let the user enable or disable this feature.

What it does instead is comparing the alpha value from the diffuse texture to `ALPHATEST - 1 + alphaCutOff`, `ALPHATEST` being the boolean value that lets the user enable (1) or disable (0) the feature.

If `ALPHATEST = 1`, the computed value is `alphaCutOff`, which is the expected input for `Discard.cutoff` in that case (alpha testing is enabled).

If `ALPHATEST = 0`, the computed value is `-1 + alphaCutOff`. As `alphaCutOff` is a value between 0 and 1, `-1 + alphaCutOff` will always be lower or equal to 0. So, `Discard.cutoff` &lt;= 0 in that case, meaning the fragment will never be discarded (which is the expected result when alpha testing is disabled).

You could also have used `Lerp(0, alphaCutOff, ALPHATEST)` as the input for `Discard.cutoff`, but it's likely that the addition + subtraction used above is faster than a `Lerp` on GPUs (would need some benchmarking to be sure), even if it's by a small (negligible) margin.

#### Using loops

Loops are always a complicated discussion within a shader as they can easily kill the performance. With Babylon v8.0, we are introducing a new node named `Loop`. The goal of that node is to allow the user to aggregate a value through multiple iterations (think, for instance, about a texture blur).

To do so you will need to drop a `Loop" block and connect an input value. That value will be the initial value of the aggregated variable. Once computed that value will be available on the output port of the block.

To aggregate the value you will need to wire a `StorageRead` and `StorageWrite` block to the loopID port of the `Loop` block. These 2 blocks will give you access to the running value of the aggregated variable.

Here is an example where the loop is simply adding a shade of red to a black color 10 times:
<NME id="#N2ROVF" title="Node Material Editor Simple Loop Example" description="Using a loop block to accumlate a color" image="/img/playgroundsAndNMEs/simple-loop.png"/>

Of course you can do far more like a texture blur:
<NME id="#OXJ1ND" title="Node Material Editor Loop Example" description="Using a loop block to blur a texture" image="/img/playgroundsAndNMEs/texture-blur.png"/>

Please keep in mind that loops have to be used cautiously as they can add a lot of computations to your shaders.

#### Shader Promotion Optimization

The Node Material features a default performance optimization where some nodes in the fragment shader are "promoted" to being evaluated with the vertex shader. This optimization ensures the fastest possible shader evaluation possible. There may be times where this optimization does NOT provide the desired outcome when creating a Node Material. You can change this behavior by setting the "Target" property of any given node, to either "Fragment" or "Vertex." By default, this property is set to "Neutral" which will permit the optimization to occur. Setting this property to "Fragment" or "Vertex" will force the system to evaluate that node in that specific part of the shader.

![Emissive](/img/playgroundsAndNMEs/nmeNodePromotion.png)

### Loading from a file saved from the Node Material Editor

You can directly setup a Node Material from a file saved from the Node Material Editor.

Here is the code to use:

```javascript
let nodeMaterial = await BABYLON.NodeMaterial.ParseFromFileAsync("Name For Your Shader", "URL To Your Saved Shader", scene);
```

Here's an example of how to load a saved shader file and apply it to a mesh.

<Playground id="#APVSUF" title="Load a Saved Shader File" description="Load a saved shader file and apply it to the material of a mesh."/>

### Sharing unique URLs

When using the <NME id="" title="Node Material Editor" description="The starting basic template for creating Node Materials." image="/img/playgroundsAndNMEs/nmeDefault.jpg"/>, you can have an additional option to save your work using a unique URL (like the Playground for instance). You can then share these urls (which are immutable).

Example: <NME id="#2F999G" title="Node Material Editor Unique URL Example" description="Example Node Material Editor saved with a unique URL." image="/img/playgroundsAndNMEs/NMEsnippetServerSaveExample.jpg"/>

### Loading from a snippet (unique URL)

You can use the following code to load a saved node material from a unique URL:

```javascript
BABYLON.NodeMaterial.ParseFromSnippetAsync("2F999G", scene).then((nodeMaterial) => {
  sphere.material = nodeMaterial;
});
```

When using NME within the Playground, you have the opportunity to edit your material with the Inspector and let the Playground update your snipped id automatically (each time NME will save a new snippet id it will inform the playground to also change the id in your code).

And to begin with you can simply call this code to start a new Node Material from scratch:

```javascript
BABYLON.NodeMaterial.ParseFromSnippetAsync("_BLANK", scene).then((nodeMaterial) => {
  sphere.material = nodeMaterial;
});
```

Note:

- There is a use case where you may want to load a node material, but ignore any embedded or linked textures stored in the json. This could be where you are going to supply new textures in code and you don't want to incur the cost of loading the old textures or if you are reusing a node material from an old project where only the textures need to be updated. To do this, place this static property in your code before creating or loading your node materials:

```javascript
BABYLON.NodeMaterial.IgnoreTexturesAtLoadTime = true;
```

And then from there you could have used the Inspector to edit it (The inspector can replace the \_\_BLANK with the right id later on).

### Node material examples

Here are some node material examples that you can use "as is" or extend with the NME:

- <Playground id="#9B0DNU#36" title="Incredible NME Ocean Shader" description="Incredible NME Ocean Shader." isMain={true} category="Node Material"/>
- <NME id="#I4DJ9Z" title="GridMaterial Recreated in the Node Material Editor" description="Example Node Material Recreation of the GridMaterial." image="/img/playgroundsAndNMEs/NMEgridMaterial.jpg" isMain={true} category="Materials"/>
- <NME id="#YDGZCJ" title="'Mist' Post Process in the Node Material Editor" description="Example Node Material 'Mist' Post Process Effect." image="/img/playgroundsAndNMEs/NMEmistPostProcess.jpg"/>
- <NME id="#D0USYC" title="'Dissolve' Post Process in the Node Material Editor" description="Example Node Material 'Dissolve' Post Process Effect." image="/img/playgroundsAndNMEs/NMEdissolvePostProcess.jpg"/>
- <Playground id="#VJY6H3" title="Nine Patch with NME" description="Example Node Material for Nine Patch Texture Scaling" image="/img/playgroundsAndNMEs/ninePatchNME.jpg" isMain={true} category="Materials"/>
- <Playground id="#7ILX7T" title="Water Refraction with RTT" description="Render Target Texture used to simulate water refraction." image="/img/playgroundsAndNMEs/NMEwaterRefractionRTT.jpg" isMain={true} category="Materials"/>
- <Playground id="#4QH8JM" title="Pulse Wave Shader" description="A wave of color that washes over simple geometry similar to a radar ping." image="/img/playgroundsAndNMEs/pulseWave.jpg" isMain={true} category="Materials"/>
