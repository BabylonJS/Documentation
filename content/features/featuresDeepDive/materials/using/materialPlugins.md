---
title: Material Plugins
image:
description: Create plugins to customize shaders of existing materials
keywords: diving deeper, materials, plugins, shader
further-reading:
video-overview:
video-content:
---

## Introduction

As of v5.0 Babylon includes a Material Plugin system, which allows customization of an existing material with custom shader code. This adds a lot of flexibility, since one can easily modify the behavior of existing materials with special effects without having to rewrite the entire shader code, in a simple and reusable way.

This is incredibly useful and powerful, since materials can be changed at runtime and have effects that were previously only possible with complex multi-pass renderings or postprocessing.

**Important note: this only works for Standard and PBR materials (and for materials that would subclass them)!**

## Basic example

Let's start with an example: suppose you want an object to be rendered in black and white. All you want is to change the end of its shader, converting the final fragment color to grayscale. To do that you create a material plugin modifying that part of the shader code.

```javascript
/**
 * Extend from MaterialPluginBase to create your plugin.
 */
class BlackAndWhitePluginMaterial extends BABYLON.MaterialPluginBase {
  constructor(material) {
    // the second parameter is the name of this plugin.
    // the third one is a priority, which lets you define the order multiple plugins are run. Lower numbers run first.
    // the fourth one is a list of defines used in the shader code.
    super(material, "BlackAndWhite", 200, { BLACKANDWHITE: false });

    // let's enable it by default
    this._enable(true);
  }

  // Also, you should always associate a define with your plugin because the list of defines (and their values)
  // is what triggers a recompilation of the shader: a shader is recompiled only if a value of a define changes.
  prepareDefines(defines, scene, mesh) {
    defines["BLACKANDWHITE"] = true;
  }

  getClassName() {
    return "BlackAndWhitePluginMaterial";
  }

  // This is used to inform the system which language is supported
  isCompatible(shaderLanguage) {
    switch (shaderLanguage) {
        case BABYLON.ShaderLanguage.GLSL:
        case BABYLON.ShaderLanguage.WGSL:
            return true;
        default:
            return false;
    }
  }

  getCustomCode(shaderType, shaderLanguage) {
      if (shaderType === "fragment") { 
        // we're adding this specific code at the end of the main() function
        if (shaderLanguage === BABYLON.ShaderLanguage.WGSL) {
            return {
                CUSTOM_FRAGMENT_MAIN_END: `
                            var luma = fragmentOutputs.color.r*0.299 + fragmentOutputs.color.g*0.587 + fragmentOutputs.color.b*0.114;
                            fragmentOutputs.color = vec4f(luma, luma, luma, 1.0);
                        `,
            };
        }
         
        return {
            CUSTOM_FRAGMENT_MAIN_END: `
                        float luma = gl_FragColor.r*0.299 + gl_FragColor.g*0.587 + gl_FragColor.b*0.114;
                        gl_FragColor = vec4(luma, luma, luma, 1.0);
                    `,
        };
    }
    // for other shader types we're not doing anything, return null
    return null;
  }
}
```

To actually use this plugin, you need to register it with a factory function. This factory can also associate the plugin instance to the material, so we can easily access it later.

```js
BABYLON.RegisterMaterialPlugin("BlackAndWhite", (material) => {
  material.blackandwhite = new BlackAndWhitePluginMaterial(material);
  return material.blackandwhite;
});
```

You can see the final code in action in the PlayGround: <Playground id="#GC63G5#90" engine="webgpu" title="Basic example" description="Basic material plugin example"/>

## More complex plugins

Sometimes, your material extension will need to get uniforms. This is also possible with the plugins, which can register defines, uniforms, samplers (textures) and attributes.

Let's take a look at a more involved example, which is not enabled by default but has proper enable/disable controls as well.

```js
class ColorifyPluginMaterial extends BABYLON.MaterialPluginBase {
  // any local variable definitions of the plugin instance.
  color = new BABYLON.Color3(1.0, 0.0, 0.0);

  // we can add an enabled flag to be able to toggle the plugin on and off.
  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(enabled) {
    if (this._isEnabled === enabled) {
      return;
    }
    this._isEnabled = enabled;
    // when it's changed, we need to mark the material as dirty so the shader is rebuilt.
    this.markAllDefinesAsDirty();
    this._enable(this._isEnabled);
  }

  _isEnabled = false;

  isCompatible(shaderLanguage) {
      switch (shaderLanguage) {
          case BABYLON.ShaderLanguage.GLSL:
          case BABYLON.ShaderLanguage.WGSL:
              return true;
          default:
              return false;
      }
  }

  constructor(material) {
    // the fourth parameter is a list of #defines in the [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) code
    super(material, "Colorify", 200, { COLORIFY: false });

    this._varColorName = material instanceof BABYLON.PBRBaseMaterial ? "finalColor" : "color";
  }

  // we use the define to enable or disable the plugin.
  prepareDefines(defines, scene, mesh) {
    defines.COLORIFY = this._isEnabled;
  }

  // here we can define any uniforms to be passed to the shader code.
  getUniforms(shaderLanguage) {
    if (shaderLanguage === BABYLON.ShaderLanguage.WGSL) {
      // For webgpu we only define the UBO with the correct type and size.
        return {
            "ubo": [
            { name: "myColor", size: 3, type: "vec3" },
            ]
        };
    }
    return {
      // first, define the UBO with the correct type and size.
      ubo: [{ name: "myColor", size: 3, type: "vec3" }],
      // now, on the fragment shader, add the uniform itself in case uniform buffers are not supported by the engine
      fragment: `#ifdef COLORIFY
                    uniform vec3 myColor;
                #endif`,
    };
  }

  // whenever a material is bound to a mesh, we need to update the uniforms.
  // so bind our uniform variable to the actual color we have in the instance.
  bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
    if (this._isEnabled) {
      uniformBuffer.updateColor3("myColor", this.color);
    }
  }

  getClassName() {
    return "ColorifyPluginMaterial";
  }

  getCustomCode(shaderType, shaderLanguage) {
    if (shaderLanguage === BABYLON.ShaderLanguage.WGSL) {
        return shaderType === "vertex" ? null : {
            "CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR": `
                #ifdef COLORIFY
                    ${this._varColorName} = vec4f(${this._varColorName}.rgb * uniforms.myColor, ${this._varColorName}.a);
                #endif
            `,

            "!diffuseBase\\+=info\\.diffuse\\*shadow;": `
                diffuseBase += info.diffuse*shadow;
                diffuseBase += vec3f(0., 0.2, 0.8);
            `,
        };
    }
    return shaderType === "vertex"
      ? null
      : {
          // this is just like before. Multiply the final shader color by
          // our color. Note that we have access to all shader variables:
          // we're effectively inserting a piece of code in the shader code.
          CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
                #ifdef COLORIFY
                    ${this._varColorName}.rgb *= myColor;
                #endif
            `,

          // we can even use regexes to replace arbitrary parts of the code.
          // if your key starts with '!' it's parsed as a Regex.
          "!diffuseBase\\+=info\\.diffuse\\*shadow;": `
                diffuseBase += info.diffuse*shadow;
                diffuseBase += vec3(0., 0.2, 0.8);
            `,
        };
  }
}
```

<Playground id="#P8B91Z#127" engine="webgpu" title="Using uniforms" description="Material plugin example with uniforms"/>

Here's another example which uses a sampler: <Playground id="#HBWKYN#86" engine="webgpu" title="Using sampler" description="Material plugin example with sampler"/>

And another one using a custom attribute this time: <Playground id="#HBWKYN#87" engine="webgpu" title="Using attribute" description="Material plugin example with attribute"/>

## Applying a plugin to a single material

Even though your plugins can be enabled/disabled as shown above, sometimes you need to apply a plugin to a single material. In this case, instead of calling `RegisterMaterialPlugin`, you can instantiate the plugin directly with the material that will be modified:

```js
const myPlugin = new BlackAndWhitePluginMaterial(material);
```

This is also useful for dynamic loading of plugins.

<Playground id="#22HT5Z#112" engine="webgpu" title="Single material" description="Material plugin applied to a single material"/>

## Implementing a complete and well designed plugin

The examples given above should be appropriate 90% of the time, but if you want to fully integrate into the framework or have additional requirements, you may need to do additional work.

A material plugin extends the `MaterialPluginBase` class and we have only implemented a few methods in the examples so far. Here are all the methods you can implement in a material plugin:
| Method | Description |
|--------|-------------|
|`isCompatible`|Implements this method if you are creating a plugin that can handle both GLSL and WGSL (recommended)|
|`isReadyForSubMesh`|Implements this method if you are using resources that may take some time to be ready (like textures). As long as the method returns `false`, the material won't be used to render the mesh|
|`bindForSubMesh`|This method will allow you to bind the uniforms and textures used by your plugin. Use the methods of the provided `uniformBuffer` to set these uniforms / textures|
|`hardBindForSubMesh`|This method is like `bindForSubMesh` but is called even if `mustRebind()` returns `false` (`bindForSubMesh` is only called if `mustRebind` returns `true`). `mustRebind()` is an internal method that returns `true` only if the system thinks the uniform parameters should be rebound. It has its own logic for deciding whether to return `true` or `false` and it may be different from your needs. Use `hardBindForSubMesh` in cases where `isReadyForSubMesh` is not called but you still need to bind some parameters|
|`dispose`|Implements this method if your plugin uses some resources that should be disposed when the plugin is no longer needed|
|`getCustomCode`|This is the method used to inject code in the vertex and fragment shaders. Look at the playgrounds on this page for examples of how to do this|
|`prepareDefines`|This allows you to set the defines used by (the shader code of) your plugin|
|`prepareDefinesBeforeAttributes`|This methods does the same thing as `prepareDefines` but is called before `MaterialHelper.PrepareDefinesForAttributes` is called. So, if you need some defines to exist when `MaterialHelper.PrepareDefinesForAttributes` is called, you should use `prepareDefinesBeforeAttributes` instead of `prepareDefines`|
|`hasTexture`|You should return `true` if you are using the texture passed as a parameter in your plugin. That will ensure that your plugin is properly notified when some properties of this texture change|
|`hasRenderTargetTextures`|You should return `true` if your plugin uses one or more render target texture(s) for its work. That will ensure that the texture(s) is/are rendered correctly in each frame (you also need to implement the `fillRenderTargetTextures` method)|
|`fillRenderTargetTextures`|Will be called if `hasRenderTargetTextures` returns `true`. You should add the render target texture(s) you are using into the array passed as a parameter|
|`getActiveTextures`|You should return all the textures you are using in your plugin (if any)|
|`getAnimatables`|You should return all the animatables you are using in your plugin (if any). Most of the time, these are the textures that have animations (`texture.animations && texture.animations.length > 0`)|
|`getSamplers`|You should return all the samplers (textures) you are using in your plugin (if any)|
|`getAttributes`|You should return all the attributes you are using in your plugin (if any)|
|`getUniformBuffersNames`|You should return the names of all the uniform buffers you are using in your plugin (if any)|
|`getUniforms`|You should return all the uniforms you are using in your plugin (if any). Look at the playgrounds on this page for examples of how to do this|
|`serialize` and `parse`|You should implement these methods if you want your plugin to be properly serialized and parsed. Note that you must also register your plugin class in the BABYLON class store by doing `BABYLON.RegisterClass("BABYLON.PLUGINNAME", PluginClass);`, with `PLUGINNAME` the name of your plugin (as returned by `getClassName()`) and `PluginClass` the name of your plugin class.|

Additional comments:
* if you want to use a texture in your plugin, you have to implement `getSamplers` and add its definition in the **CUSTOM_FRAGMENT_DEFINITIONS** block of code (**CUSTOM_VERTEX_DEFINITIONS** if you want to use the texture in the vertex shader):
```typescript
getSamplers(samplers) {
    samplers.push("texture");
}

getCustomCode(shaderType, shaderLanguage) {
    if (shaderType === "fragment") {
      if (shaderLanguage === BABYLON.ShaderLanguage.WGSL) {
        return {
          "CUSTOM_FRAGMENT_DEFINITIONS": `
              var myTextureSampler: sampler;
              var myTexture: texture_2d<f32>;
          `,

          "CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR": `
                color = vec4f(textureSample(myTexture, myTextureSampler, fragmentInputs.vDiffuseUV + uvOffset).rgb, color.a);
          `,
        }
      }
      return {
        "CUSTOM_FRAGMENT_DEFINITIONS": `
            uniform sampler2D myTexture;
        `,

        "CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR": `
              color.rgb = texture(myTexture, vDiffuseUV + uvOffset).rgb;
        `,
      }
    }
    return null
}
```
* if you want to use a custom attribute in your plugin, you have to implement `getAttributes` and add its definition in the **CUSTOM_VERTEX_DEFINITIONS** block of code:
```typescript
getSamplers(samplers) {
    samplers.push("arrayTex");
}

getAttributes(attributes) {
    attributes.push('texIndices');
}

getCustomCode(shaderType, shaderLanguage) {
  if (shaderLanguage === BABYLON.ShaderLanguage.WGSL) {
    if (shaderType === "vertex") return {
      "CUSTOM_VERTEX_DEFINITIONS": `
          attribute texIndices: f32;
          varying texIndex: f32;
      `,

      "CUSTOM_VERTEX_MAIN_BEGIN": `
          vertexOutputs.texIndex = input.texIndices;
      `,
    }
    if (shaderType === "fragment") return {
        "CUSTOM_FRAGMENT_DEFINITIONS": `
            uniform highp sampler2DArray arrayTex;
            varying texIndex: f32;
        `,

        "!baseColor\\=texture2D\\(diffuseSampler,vDiffuseUV\\+uvOffset\\);":
            `baseColor = texture(arrayTex, vec3(vDiffuseUV, texIndex));`,
    }
  }

  if (shaderType === "vertex") return {
      "CUSTOM_VERTEX_DEFINITIONS": `
          attribute float texIndices;
          varying float texIndex;
      `,

      "CUSTOM_VERTEX_MAIN_BEGIN": `
          texIndex = texIndices;
      `,
  }
  if (shaderType === "fragment") return {
      "CUSTOM_FRAGMENT_DEFINITIONS": `
          uniform highp sampler2DArray arrayTex;
          varying float texIndex;
      `,

      "!baseColor\\=texture2D\\(diffuseSampler,vDiffuseUV\\+uvOffset\\);":
          `baseColor = texture(arrayTex, vec3(vDiffuseUV, texIndex));`,
  }
  return null
}
```

## Caveats

- The code insertion point names are standard over all materials, but not all of them have all insertion points. In general you can expect to have
  `CUSTOM_VERTEX_DEFINITIONS`, `CUSTOM_VERTEX_MAIN_BEGIN` and `CUSTOM_VERTEX_MAIN_END` in vertex shaders, and `CUSTOM_FRAGMENT_DEFINITIONS`, `CUSTOM_FRAGMENT_MAIN_BEGIN` and `CUSTOM_FRAGMENT_MAIN_END` in fragment shaders. But other `#defines` might not be present.
- **There's no guarantee that using the shader point names / the regular expressions to update code / the variable names with a material plugin will work across Babylon.js versions**. We reserve the possibility to update our shader code in a way that would break backward compatibility with those features if we have to. In particular, the color variable name for `standard.fragment.fx` is `color`, while for `pbrMaterial.fragment.fx` it's `finalColor`. If you are writing a plugin targeting multiple materials take care in your code to use different variable names according to the plugin and keep track of Babylon potentially changing (and breaking!) things.
- `RegisterMaterialPlugin` only adds the plugin to material instantiated AFTER the registration. So it must be run before you add any meshes or create your materials or they won't have the plugin.
- You can register multiple plugins to the same material (or the entire scene). The `priority` field controls the order the plugins will be executed if they are all enabled.

## Material Plugin Examples

Here are some other examples of plugins:

<Playground id="#HCLC5W#41" title="Animate parameter" description="Using a class variable to animate a parameter for all instances"/>
<Playground id="#SYQW69#1077" title="Volumetric fog" description="Power plant with volumetric fog"/>
<Playground id="#IQPBS4#62" title="Grain" description="Grain (solves banding issues)"/>
<Playground id="#8WJTJG#19" title="Fog of War" description="Simple Fog of War effect"/>
<Playground id="#P8B91Z#102" title="Serialize and parse" description="Implements the methods to serialize and parse the plugin"/>

You can also take a look at Babylon's source code. The PBR material includes several complex plugins, such as the [Anisotropic plugin](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrAnisotropicConfiguration.ts), [sheen](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrSheenConfiguration.ts) and [subsurface](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrSubSurfaceConfiguration.ts), and the [detail map plugin applies to PBR and Standard materials](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/material.detailMapConfiguration.ts).
