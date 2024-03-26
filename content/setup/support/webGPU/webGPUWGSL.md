---
title: Writing shaders for WebGPU in WGSL
image: 
description: Explain how to use WGSL in shaders when using the WebGPU engine
keywords: babylon.js, shader, WebGPU, WGSL
further-reading:
video-overview:
video-content:
---

Currently, all shaders used by **Babylon.js** are written in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) and are converted to [WGSL](https://gpuweb.github.io/gpuweb/wgsl/) (the only shader language that WebGPU knows about) by some special tools.

So, even in WebGPU, if you use a `CustomMaterial` or a `PBRCustomMaterial` to inject some custom shader code, you must write it in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language).

If you want to write shader code in the WGSL language, you can either write a [compute shader](/features/featuresDeepDive/materials/shaders/computeShader) or use the [ShaderMaterial](/typedoc/classes/babylon.shadermaterial) class to wrap a vertex/fragment shader. The latter is the subject of this page.

## Using ShaderMaterial to write WGSL code
You can use the `ShaderMaterial` class to write WGSL code in much the same way you use it to write [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) but with some small differences.

Note: if you use the "color" attribute in your shader code, don't add it to the **attributes** property passed to the `ShaderMaterial` constructor! This attribute will be automatically added if a vertex buffer named "color" is attached to the mesh. If you add "color" to the **attributes** array, you will get an error like "Attribute shader location (1) is used more than once".

### Setting the right shader language
You must set the `shaderLanguage` property to `BABYLON.ShaderLanguage.WGSL` in the `options` parameter you pass to the constructor.
For eg:
```javascript
const mat = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "myShader",
        fragment: "myShader",
    },
    {
        attributes: ["position", "uv", "normal"],
        uniformBuffers: ["Scene", "Mesh"],
        shaderLanguage: BABYLON.ShaderLanguage.WGSL,
    }
);
```

### Using the WGSL shader store
If using the shader store, you must put your WGSL code in `BABYLON.ShaderStore.ShadersStoreWGSL` instead of `BABYLON.ShaderStore.ShadersStore`.

For eg:
```javascript
BABYLON.ShaderStore.ShadersStoreWGSL["myShaderVertexShader"]=`   
    #include<sceneUboDeclaration>
    #include<meshUboDeclaration>
    ...
`;

BABYLON.ShaderStore.ShadersStoreWGSL["myShaderFragmentShader"]=`
    varying vPositionW : vec3<f32>;
    varying vUV : vec2<f32>;
    ...
`;
```

### Declaration of the entry points
You must also declare the entry point for the vertex and fragment shader in a special way.

Vertex:
```glsl
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    ...
}

```
Fragment:
```glsl
@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    ...
}
```

### Using pre-defined uniforms
To use the pre-defined uniforms of the scene (`view`, `viewProjection`, `projection`, `vEyePosition`) and mesh (`world`, `visibility`), you must include the appropriate file(s) in the shader code:
```glsl
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
```
and add the uniform buffer name(s) to the `uniformBuffers` option of the `ShaderMaterial` class constructor:
```javascript
const mat = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "myShader",
        fragment: "myShader",
    },
    {
        attributes: ["position", "uv", "normal"],
        uniformBuffers: ["Scene", "Mesh"],
        shaderLanguage: BABYLON.ShaderLanguage.WGSL,
    }
);
```

In the WGSL code, you access a uniform by prefixing its name by `scene.` or `mesh.` for the scene or mesh uniforms, respectively:
```glsl
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position, 1.0);
}    
```

## Special syntax used in WGSL code
Unlike computational shaders that use ordinary WGSL code, the shader code you write for `ShaderMaterial` must use special syntax to work with the existing workflow. To make it easier for developers, the declaration of variables is the same as that used in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language):
* declaring a varying variable:
```glsl
varying varName : varType;
```
* declaring an attribute variable:
```glsl
attribute varName : varType;
```
* declaring a uniform variable:
```glsl
uniform varName : varType;
```

Contrary to [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language), the inputs and outputs of the vertex/fragment shader are not declared as separate global variables internally, but are defined in some structures which are managed by the engine for you. However, it means that you need a special syntax to access these variables. Here is the mapping between the [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) syntax and the WGSL syntax:
* In the vertex shader:
  * an attribute must be referenced by `vertexInputs.attributeName`
  * `gl_VertexID` => `vertexInputs.vertexIndex`
  * `gl_InstanceID` => `vertexInputs.instanceIndex`
  * a varying must be referenced by `vertexOutputs.varName`
  * `gl_Position` => `vertexOutputs.position`
* In the fragment shader:
  * a varying must be referenced by `fragmentInputs.varName`
  * `gl_FragCoord` => `fragmentInputs.position`
  * `gl_FrontFacing` => `fragmentInputs.frontFacing`
  * `gl_FragColor` => `fragmentOutputs.color`
  * `gl_FragDepth` => `fragmentOutputs.fragDepth`

Notes:
* When using the `uniform varName : varType` syntax, you access the variable by doing `uniforms.varName`, not simply `varName`. The variables declared that way can be set from the javascript code by using the regular methods of the `ShaderMaterial` class (`setFloat`, `setInt`, etc) as with [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
* `varType` must use a WGSL syntax, not [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)! For eg: `varying vUV : vec2<f32>;`
* you must **NOT** add the `@group(X) @binding(Y)` decoration! The system will add them automatically

## Using new objects available in WGSL
You can use the standard WGSL syntax to declare:
* custom uniform buffers:
```glsl
struct MyUBO {
    scale: f32,
};

var<uniform> myUBO: MyUBO;
```
* storage textures:
```glsl
var storageTexture : texture_storage_2d<rgba8unorm,write>;
```
* storage buffers:
```glsl
struct Buffer {
    items: array<f32>,
};
var<storage,read_write> storageBuffer : Buffer;
```
* external textures:
```glsl
var videoTexture : texture_external;
```

Again, you must **NOT** add the `@group(X) @binding(Y)` decoration! The system will add them automatically.

On the javascript side, you have the corresponding methods to set a value to these variables:
* uniform buffer: `setUniformBuffer(name, buffer)`
* storage texture: same method than for regular textures (`setTexture(name, texture)`)
* storage buffer: `setStorageBuffer(name, buffer)`
* external texture: `setExternalTexture(name, buffer)`

## Examples
This playground is a basic example of using WGSL in a `ShaderMaterial`: <Playground id="#6GFJNR#178" image="/img/playgroundsAndNMEs/pg-6GFJNR-164.png" engine="webgpu" title="Basic example of WGSL with ShaderMaterial" description="Demonstrate how to write WGSL code with the ShaderMaterial class"/>

As when using [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language), `ShaderMaterial` supports morphs, bones and instancing in WGSL. You will need to add the appropriate includes in your code to support these features. See how it is done in this playground (this example also demonstrates how to use a storage texture and a storage buffer): <Playground id="#8RU8Q3#155" image="/img/playgroundsAndNMEs/pg-8RU8Q3-126.png" engine="webgpu" title="Advanced usage of the ShaderMaterial class" description="Demonstrate how to write WGSL code with the ShaderMaterial class to support bones, morphs and instances"/>

You can also use the new in 5.0 baked vertex animation feature as well as clip planes. See: <Playground id="#8RU8Q3#156" image="/img/playgroundsAndNMEs/pg-8RU8Q3-106.png" engine="webgpu" title="Using BVA and clip planes in WGSL" description="Demonstrate how to write WGSL code with the ShaderMaterial class to support baked vertex animations and clip planes"/>

WebGPU uses a special texture object for fast video playback (an "external texture"). Our [VideoTexture](/typedoc/classes/babylon.videotexture) class takes advantage of this, but if you want to do it yourself, this playground shows how to use the `ShaderMaterial` class to implement video playback with `texture_external`: <Playground id="#6GFJNR#179" image="/img/playgroundsAndNMEs/pg-6GFJNR-163.png" engine="webgpu" title="Video playing with the ShaderMaterial class" description="Demonstrate how to play videos using external texture in WGSL"/>
