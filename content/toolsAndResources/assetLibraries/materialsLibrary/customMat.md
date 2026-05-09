---
title: Custom Materials
image:
description: The Babylon.js materials library includes CustomMaterial and PBRCustomMaterial for injecting GLSL code into standard and PBR material shaders.
keywords: library, materials, materials library, custom material, pbr custom material, shaders
further-reading:
video-overview:
video-content:
---

## Custom materials

Custom materials let you keep Babylon.js material features while injecting small pieces of GLSL into specific parts of the generated shader.

- `CustomMaterial` extends `StandardMaterial`.
- `PBRCustomMaterial` extends `PBRMaterial`.

Use them when you want to add a focused shader effect without rewriting a full `ShaderMaterial`. For larger reusable material extensions, a material plugin is usually easier to maintain, but custom materials are useful for quick shader customization and prototyping.

## Playground examples

This example uses `CustomMaterial` to add uniforms, displace vertices, change the diffuse color, and adjust the final fragment color:

PG: <Playground id="#QF2QWZ#0" title="CustomMaterial shader injection" description="CustomMaterial example with uniforms, vertex displacement, diffuse color injection, and final color adjustment."/>

This example uses `PBRCustomMaterial` to keep PBR lighting, metallic and roughness behavior while changing the albedo and final fragment color:

PG: <Playground id="#W0OF0A#0" title="PBRCustomMaterial albedo injection" description="PBRCustomMaterial example that keeps PBR lighting while customizing albedo and final fragment color."/>

## Using custom materials

Custom materials are part of the materials library, so they are not included in the main _babylon.js_ file.

For a script reference, include the materials library after Babylon.js:

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
```

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

For ES modules, import the classes from `@babylonjs/materials`:

```javascript
import { CustomMaterial } from "@babylonjs/materials/custom/customMaterial";
import { PBRCustomMaterial } from "@babylonjs/materials/custom/pbrCustomMaterial";
```

## CustomMaterial

`CustomMaterial` starts from `StandardMaterial`. The material keeps standard material properties such as diffuse color, specular color, textures, alpha, lights, fog, and shadows, then applies your injected shader code at the hook points you choose.

```javascript
var material = new BABYLON.CustomMaterial("custom", scene);
material.diffuseColor = BABYLON.Color3.White();
material.AddUniform("stripeScale", "float", 8.0);
material.AddUniform("warmColor", "vec3", new BABYLON.Color3(1.0, 0.5, 0.08));
material.AddUniform("coolColor", "vec3", new BABYLON.Color3(0.03, 0.2, 0.75));

material.Fragment_Definitions(`
    float bandedGradient(float value, float scale) {
        return smoothstep(0.25, 0.75, 0.5 + 0.5 * sin(value * scale));
    }
`);

material.Fragment_Custom_Diffuse(`
    float bands = bandedGradient(vPositionW.y, stripeScale);
    result = mix(coolColor, warmColor, bands);
`);
```

`Fragment_Custom_Diffuse` runs after the standard material has computed its diffuse color. In that hook, `result` is a helper alias for the material's internal `diffuseColor` variable.

## PBRCustomMaterial

`PBRCustomMaterial` starts from `PBRMaterial`. It keeps PBR features such as metallic, roughness, image-based lighting, reflection, and environment response, then lets you inject shader code into the PBR shader.

```javascript
var material = new BABYLON.PBRCustomMaterial("custom-pbr", scene);
material.albedoColor = new BABYLON.Color3(0.9, 0.78, 0.55);
material.metallic = 0.85;
material.roughness = 0.28;
material.AddUniform("stripeScale", "float", 6.0);
material.AddUniform("accentColor", "vec3", new BABYLON.Color3(0.03, 0.55, 1.0));

material.Fragment_Custom_Albedo(`
    float stripe = smoothstep(0.35, 0.75, 0.5 + 0.5 * sin(vPositionW.y * stripeScale));
    result = mix(surfaceAlbedo, accentColor, stripe * 0.65);
`);

material.Fragment_Before_FragColor(`
    finalColor.rgb = mix(finalColor.rgb, vec3(0.05, 0.12, 0.22), 0.12);
`);
```

`Fragment_Custom_Albedo` runs after the PBR material has computed its surface albedo. In that hook, `result` is a helper alias for `surfaceAlbedo`.

## Adding uniforms

Use `AddUniform(name, kind, value)` when your shader code needs a custom uniform:

```javascript
material.AddUniform("tint", "vec3", new BABYLON.Color3(0.2, 0.8, 1.0));
material.AddUniform("scale", "float", 4.0);
material.AddUniform("maskTexture", "sampler2D", new BABYLON.Texture("textures/mask.png", scene));
```

The `kind` string is the GLSL type that will be declared in the shader, such as `float`, `vec2`, `vec3`, `vec4`, `mat4`, or `sampler2D`.

## Shader hook points

These hooks are available on both `CustomMaterial` and `PBRCustomMaterial`:

| Method | Where the code is injected |
| --- | --- |
| `Fragment_Begin(shaderPart)` | At the beginning of the fragment shader main function. |
| `Fragment_Definitions(shaderPart)` | Before the fragment shader main function. Use this for helper functions and varying declarations. |
| `Fragment_MainBegin(shaderPart)` | Near the start of the fragment shader main function. |
| `Fragment_Custom_Alpha(shaderPart)` | Where the shader updates alpha. In this hook, `result` maps to `alpha`. |
| `Fragment_Before_FragColor(shaderPart)` | Just before the final fragment color is written. |
| `Vertex_Begin(shaderPart)` | At the beginning of the vertex shader main function. |
| `Vertex_Definitions(shaderPart)` | Before the vertex shader main function. Use this for helper functions and varying declarations. |
| `Vertex_MainBegin(shaderPart)` | Near the start of the vertex shader main function. |
| `Vertex_Before_PositionUpdated(shaderPart)` | After `positionUpdated` is available and before the final position update. In this hook, `result` maps to `positionUpdated`. |
| `Vertex_Before_NormalUpdated(shaderPart)` | After `normalUpdated` is available and before the final normal update. In this hook, `result` maps to `normalUpdated`. |

`CustomMaterial` also supports:

| Method | Where the code is injected |
| --- | --- |
| `Fragment_Custom_Diffuse(shaderPart)` | After the standard material diffuse color is computed. In this hook, `result` maps to `diffuseColor`. |

`PBRCustomMaterial` also supports:

| Method | Where the code is injected |
| --- | --- |
| `Fragment_Custom_Albedo(shaderPart)` | After the PBR surface albedo is computed. In this hook, `result` maps to `surfaceAlbedo`. |
| `Fragment_Custom_MetallicRoughness(shaderPart)` | During metallic and roughness computation. |
| `Fragment_Custom_MicroSurface(shaderPart)` | During microsurface computation. |
| `Fragment_Before_FinalColorComposition(shaderPart)` | Before final color composition. |

## Notes

The injected shader code is GLSL, including when the scene runs in WebGPU mode.

If you define a varying to pass data from vertex shader code to fragment shader code, declare it in both `Vertex_Definitions` and `Fragment_Definitions`.

Use `AddUniform` for uniforms instead of declaring `uniform` values manually in `Fragment_Definitions` or `Vertex_Definitions`, because custom material uniforms must also be registered with the material.
