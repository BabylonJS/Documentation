---
title: Putting Shader Code Into Babylon.js
image:
description: Dive deep into the inner workings of how Babylon.js handles shaders.
keywords: babylon.js, advanced, shaders
further-reading:
  - title: Introduction To Shaders inBabylon.js
    url: /features/featuresDeepDive/materials/shaders/introToShaders
  - title: ShaderMaterial Object
    url: /features/featuresDeepDive/materials/shaders/introToShaders
video-overview:
video-content:
---

## Putting Shader Code inBabylon.js

Here are four ways of putting shader code into your scene:

1. Use [BabylonJS Create Your Own Shader (CYOS)](https://www.babylonjs.com/cyos/) and download a zip file;
2. Write the Vertex and Fragment Shader Code into &ltscript&gt tags
3. Write, save and import a Vertex and Fragment Shader file of type .fx into your code;
4. Use the shaderBuilder extension ofBabylon.js.

Methods 1, 2 and 3 use [BABYLON.ShaderMaterial](/features/featuresDeepDive/materials/shaders/shaderMaterial) to pass data to the shaders.

## Babylon.js CYOS Download

This site allows you to write code for a Vertex Shader and a Fragment Shader and see the results on a variety of meshes.
Downloading a zip file produces a folder containing and index.html file and some image files for texture.

![CYOS Screen](/img/how_to/Shaders/cyos1.jpg)

The _index.html_ file contains the shader code in the correct format to apply as a material.

Within the HTML page the shader code becomes (in Javascript)

```javascript
BABYLON.Effect.ShadersStore["customVertexShader"] =
  "\r\n" +
  "precision highp float;\r\n" +
  "// Attributes\r\n" +
  "attribute vec3 position;\r\n" +
  "attribute vec2 uv;\r\n" +
  "// Uniforms\r\n" +
  "uniform mat4 worldViewProjection;\r\n" +
  "// Varying\r\n" +
  "varying vec2 vUV;\r\n" +
  "void main(void) {\r\n" +
  "    gl_Position = worldViewProjection * vec4(position, 1.0);\r\n" +
  "    vUV = uv;\r\n" +
  "}\r\n";

BABYLON.Effect.ShadersStore["customFragmentShader"] = "\r\n" + "precision highp float;\r\n" + "varying vec2 vUV;\r\n" + "uniform sampler2D textureSampler;\r\n" + "void main(void) {\r\n" + "    gl_FragColor = texture2D(textureSampler, vUV);\r\n" + "}\r\n";
```

the Javascript code to use the shader as a material is

```javascript
var shaderMaterial = new BABYLON.ShaderMaterial(
  "shader",
  scene,
  {
    vertex: "custom",
    fragment: "custom",
  },
  {
    attributes: ["position", "normal", "uv"],
    uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
  },
);
```

and the Javascript code to set a texture to the material is

```javascript
var mainTexture = new BABYLON.Texture("amiga.jpg", scene);
shaderMaterial.setTexture("textureSampler", mainTexture);
```

and to use the material on a mesh is

```javascript
mesh.material = shaderMaterial;
```

Extracting the appropriate sections of Javascript code allows you to transfer them to your own scenes.

[Guide Example From CYOS Zip](https://babylonjsguide.github.io/examples/cyoszip.html)

This method can easily be used in the Playground.

<Playground id="#1OH09K#131" title="Playground Example From CYOS" description="Playground Example From CYOS"/>

## Shader Code in &lt;script&gt; Tags

In the _index.html_ file the Javascript code for the shaders is

```javascript
<script type="application/vertexShader" id="vertexShaderCode">
    #ifdef GL_ES
        precision highp float;
    #endif

    // Attributes
    attribute vec3 position;
    attribute vec2 uv;

    // Uniforms
    uniform mat4 worldViewProjection;

    // Normal
    varying vec2 vUV;

    void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);

    vUV = uv;
    }
</script>

<script type="application/fragmentShader" id="fragmentShaderCode">
    #ifdef GL_ES
        precision mediump float;
    #endif

    varying vec2 vUV;

    uniform sampler2D textureSampler;

    void main(void) {
        gl_FragColor = texture2D(textureSampler, vUV);
    }
</script>
```

the Javascript code to use the shader as a material becomes

```javascript
var shaderMaterial = new BABYLON.ShaderMaterial(
  "shader",
  scene,
  {
    vertexElement: "vertexShaderCode",
    fragmentElement: "fragmentShaderCode",
  },
  {
    attributes: ["position", "normal", "uv"],
    uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
  },
);
```

[Guide Example From Script](https://babylonjsguide.github.io/examples/scriptcode.html)

## Shader Code in fx Files

Save your code in two files, one for the Vertex Shader and one for the Fragment Shader.

These files **must** be in the same folder as your index.html page and the names of the files **must** follow this format

COMMON_NAME.vertex.fx

COMMON_NAME.fragment.fx

The Javascript code to use the shader as material becomes

```javascript
var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./COMMON_NAME", {
  attributes: ["position", "normal", "uv"],
  uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
});
```

**Note**: `./` is necessary before the `COMMON_NAME`

It is also possible to access the fx files from an URL by giving the full address of the URL,
provide CORS is enabled for them.

[Guide Example From Import](https://babylonjsguide.github.io/examples/importcode.html)

## Shader Includes

When building shaders sometimes you have parts of your code that will be reused between multiple shaders. This is usually things like reused uniforms, functions, structs etc. A powerful method that users have at their disposal is to accomplish this task is the

```javascript
BABYLON.Effect.IncludesShadersStore["includeName"] = "...";
```

Already loaded in the includes are all the common shader elements for babylons StandardMaterial, PBR Materials, ProceduralTextures and more. See the github [https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Shaders/ShadersInclude](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Shaders/ShadersInclude) for a complete list of shader includes packaged with BJS.

Additionally you can add anything you want to the IncludesShadersStore pre or post compilation of the scene. To access these includes simply call:

```glsl
#include<includeName>
```

In the appropriate section of your shader code to have them injected into your shader when it is compiled [see example](https://www.babylonjs-playground.com/#0MAYNY).

## Shader Builder

This is an extension toBabylon.js. Copy and save the [source code](https://github.com/BabylonJS/Extensions/blob/master/ShaderBuilder/Babylonx.ShaderBuilder.js) for the extension and add as

```javascript
<script src="Babylonx.ShaderBuilder.js"></script>
```

The Shader Builder engine needs to be initialised

```javascript
BABYLONX.ShaderBuilder.InitializeEngine();
```

The format for writing a ShaderBuilder is **fluent coding** and it deals with attributes andBabylon.js uniforms automatically.  
An example for the shader code used in 1 to 3 above would be

```javascript
mesh.material = new BABYLONX.ShaderBuilder().Map({ path: "textures/amiga.jpg" }).BuildMaterial(scene);
```

[Guide Example using ShaderBuilder](https://babylonjsguide.github.io/examples/basiccodeSB.html)

This method can be used in the Playground. However it does require the loading of the ShaderBuilder Javascript file and an `onLoad`
function before it can be called.

<Playground id="#NCY1Q#36" title="Playground Example Using ShaderBuilder" description="Playground example using shaderbuilder."/>
