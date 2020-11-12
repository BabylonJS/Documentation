---
title: Shader Material
image: 
description: Learn about the shader material in Babylon.js.
keywords: babylon.js, advanced, shader material
further-reading:
    - title: Introduction To Shaders in BabylonJS
      url: /advanced_topics/introToShaders
    - title: How To Put Shader Code in BabylonJS
      url: /advanced_topics/introToShaders/shaderCodeInBjs
video-overview:
video-content:
---

## ShaderMaterial

The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh. This returned material effects how the mesh will look based on the code in the shaders.

It is called by 

```javascript
var myShaderMaterial = new BABYLON.ShaderMaterial(name, scene, route, options);
```

- `name`: a string, naming the shader
- `scene`: the scene in which the shader is to be used
- `route`: the route to the shader code in one of three ways:
    1. object: `{ vertex: "custom", fragment: "custom" }`, used with `BABYLON.Effect.ShadersStore["customVertexShader"]` and `BABYLON.Effect.ShadersStore["customFragmentShader"]`
    2. object: `{ vertexElement: "vertexShaderCode", fragmentElement: "fragmentShaderCode" }`, used with shader code in `<script>` tags
    3. object: `{ vertexSource: "vertex shader code string", fragmentSource: "fragment shader code string" }` using with strings containing the shaders code
    4. string: `"./COMMON_NAME"`, used with external files *COMMON\_NAME.vertex.fx* and *COMMON\_NAME.fragment.fx* in *index.html* folder.

- `options`: object containing attributes and uniforms arrays containing their names as strings.

An example:

```javascript
var myShaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./COMMON_NAME",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction" ],
        defines: ["MyDefine"]
        needAlphaBlending: true,
        needAlphaTesting: true
});
```
**Note**: that's the exhaustive list of available attributes, uniforms.

Any attribute in the Vertex Shader code **must** appear in the `attributes` array.

The uniform `worldViewProjection` **must** be declared in the Vertex Shader as type `mat4` and **must** be in the `uniforms` array.

Attributes and uniforms named in the arrays and not used in the shader code are ignored.

if your shader code contains #define values, you can specify the ones you want to activate in the `defines` array.

Uniforms assigned to textures in the shader code need not appear in the uniforms array, all other uniforms must be present.

Textures are passed, for example, as 

```javascript
var amigaTexture = new BABYLON.Texture("amiga.jpg", scene);
myShaderMaterial.setTexture("textureSampler", amigaTexture);
```

where `textureSampler` has been declared as a uniform of type `sampler2D` in the shader code.

Other uniforms are passed, for example, as

```javascript
myShaderMaterial.setFloat("time", 0);
myShaderMaterial.setVector3("direction", BABYLON.Vector3.Zero());
```

the set method depending on the type passed.

## Troubleshoot

In some specific cases when you use post-processes, you might notice a slightly brighter color output than what you implemented in your shader.

Read [this](/how_to/Image_Processing) if you want to know how to fix it.