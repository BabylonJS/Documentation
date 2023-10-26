---
title: Shader Material
image:
description: Learn about the shader material in Babylon.js.
keywords: babylon.js, advanced, shader material
further-reading:
  - title: Introduction To Shaders in Babylon.js
    url: /features/featuresDeepDive/materials/shaders/introToShaders
  - title: How To Put Shader Code in Babylon.js
    url: /features/featuresDeepDive/materials/shaders/shaderCodeInBjs
video-overview:
video-content:
---

## ShaderMaterial

The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh. This returned material effects how the mesh will look based on the code in the shaders.

It is called by

```javascript
const myShaderMaterial = new BABYLON.ShaderMaterial(name, scene, route, options);
```

- `name`: A string, naming the shader
- `scene`: The scene in which the shader is to be used
- `route`: The route to the shader code. It can be any one of these:

  1. object: `{ vertex: "custom", fragment: "custom" }`, used with `BABYLON.Effect.ShadersStore["customVertexShader"]` and `BABYLON.Effect.ShadersStore["customFragmentShader"]`.
  2. object: `{ vertexElement: "vertexShaderCode", fragmentElement: "fragmentShaderCode" }`, used with shader code in `<script>` tags.
  3. object: `{ vertexSource: "vertex shader code string", fragmentSource: "fragment shader code string" }` using with strings containing the shader code.
  4. string: `"./COMMON_NAME"`, used with external files _COMMON_NAME.vertex.fx_ and _COMMON_NAME.fragment.fx_, accessible through a file server (local or remote).

- `options`: Object containing attributes and uniforms arrays containing their names as strings.

An example:

```javascript
const myShaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./COMMON_NAME",
{
  attributes: ["position", "normal", "uv"],
  uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction" ],
  samplers: ["textureSampler"],
  defines: ["MyDefine"]
  needAlphaBlending: true,
  needAlphaTesting: true
});
```

- Any attribute in the Vertex Shader code **must** appear in the `attributes` array.
- The uniform `worldViewProjection` **must** be declared in the Vertex Shader as type `mat4` and **must** be in the `uniforms` array, if it is to be used.
- Attributes and uniforms named in the arrays and not used in the shader code are ignored.
- If your shader code contains #define values, you can specify the ones you want to activate in the `defines` array.
- Uniforms assigned to textures in the shader code must be present in the samplers array, all other uniforms must be present in the uniforms array.

<Playground id="#5T8G3I" title="Simplest Shader Material" description="Most basic example of ShaderMaterial" isMain={true} category="Materials" />

<Playground id="#2TGH43" title="Accessing a shader code file from Github" description="Showing how to refer to shader files stored in a Github repository" />

An example of passing a texture:

```javascript
const myShaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./COMMON_NAME", {
  "attributes": ["position", "uv"],
  "uniforms": ["worldViewProjection"],
  "samplers": ["textureSampler"]
});
const amigaTexture = new BABYLON.Texture("amiga.jpg", scene);
myShaderMaterial.setTexture("textureSampler", amigaTexture);
```

<Playground id="#D8IDR8" title="Passing a texture sampler to a shader" description="Demonstrating how to pass a texture sampler to a shader" />

Other uniforms are passed, for example, as

```javascript
myShaderMaterial.setFloat("time", 0);
myShaderMaterial.setVector3("direction", BABYLON.Vector3.Zero());
```

where the set method's name is dependant on type.

<Playground id="#5T8G3I#16" title="Passing and updating a Color3 uniform to a shader" description="Demonstrating how to pass a Color3 uniform to a shader" isMain={true} category="Materials" />

## Troubleshoot

When working with shaders, it is very useful to have a debug tool which can show the values passed to the shaders. To that goal, you can use the Babylon Spector.js tool: https://github.com/BabylonJS/Spector.js, which works for any shader code, not just Babylon.js.

In some specific cases when you use post-processes, you might notice a slightly brighter color output than what you implemented in your shader. Read [this](/features/featuresDeepDive/materials/shaders/image_processing) if you want to know how to fix it.
