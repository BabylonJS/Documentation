---
title: Supporting Fog With ShaderMaterial
image:
description: Learn how to support fog alongside the shader material in Babylon.js.
keywords: babylon.js, advanced, shader material, fog
further-reading:
video-overview:
video-content:
---

## How To Support Fog with ShaderMaterial

In order to support fog in your custom shaders, you will have to add some lines of code in your vertex and pixel shaders.

## Vertex shader

First, you need to make sure you are computing the world position in your vertex shader (it has to be named worldPos):

```
vec4 worldPos = world * p;
gl_Position = viewProjection * worldPos;
```

This means you have to declare these uniforms:

```
uniform mat4 world;    
uniform mat4 view;    
uniform mat4 viewProjection;
```

Please note the addition of view which is used by the fog functions. Then you need to import the fog functions:

```
#include<fogVertexDeclaration>
```

And call them:

```
#include<fogVertex>
```

Here is a full example of a working vertex shader:

```
BABYLON.Effect.ShadersStore["myVertexShader"] = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 world;    
uniform mat4 view;    
uniform mat4 viewProjection;
varying vec2 vUV;

#include<fogVertexDeclaration>

void main() {
    vec4 p = vec4(position, 1.);
    vec4 worldPos = world * p;
    gl_Position = viewProjection * worldPos;
    vUV = uv;

    #include<fogVertex>
}`
```

## Fragment shader

For the fragment you also need to import the fog functions:

```
#include<fogFragmentDeclaration>
```

Then used them:

```
#include<fogFragment>(color,gl_FragColor)
```

The full version will look like this:

```
BABYLON.Effect.ShadersStore['myFragmentShader'] = `
varying vec2 vUV;

uniform sampler2D tex;
#include<fogFragmentDeclaration>

vec2 uvPixelPerfect(vec2 uv) {
    vec2 res = vec2(textureSize(tex, 0));
    
    uv = uv * res;
    vec2 seam = floor(uv + 0.5);
    uv = seam + clamp((uv-seam) / fwidth(uv), -0.5, 0.5);
    return uv / res;
}

void main() {
    vec4 color = texture2D(tex,vUV);
    gl_FragColor = color;
    #include<fogFragment>(color,gl_FragColor)
}`
```

## Javascript

You then have to add the following code for the onBind callback of your ShaderMaterial:

```javascript
shaderMaterial.onBind = function () {
  const effect = shaderMaterial.getEffect();
  effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
  effect.setColor3("vFogColor", scene.fogColor);
};
```

And, you are done :)

Please find an example here: <Playground id="#11GAIH#17" title="Fog And Shader Material" description="Example of supporting fog with the shader material."/>
