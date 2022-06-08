---
title: Material Plugins
image:
description: Create plugins to customize shaders of existing materials
keywords: diving deeper, materials, plugins, shader
further-reading:
video-overview:
video-content:
---

# Material

As of v5.0 Babylon includes a Material Plugin system, which allows customization of an existing material with custom shader code. This adds a lot of flexibility, since one can easily modify the behavior of existing materials with special effects without having to rewrite the entire shader code, in a simple and reusable way.

This is incredibly useful and powerful, since materials can be changed at runtime and have effects that were previously only possible with complex multi-pass renderings or postprocessing.

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

  getCustomCode(shaderType) {
    if (shaderType === "fragment") {
      // we're adding this specific code at the end of the main() function
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

You can see the final code in action in the PlayGround: <Playground id="#GC63G5#16" title="Basic material plugin example" />

## More complex plugins

Sometimes your plugins will need to get uniforms. This is also possible with the plugins, which can register defines and uniforms.

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

  constructor(material) {
    // the fourth parameter is a list of #defines in the GLSL code
    super(material, "Colorify", 200, { COLORIFY: false });

    this._varColorName = material instanceof BABYLON.PBRBaseMaterial ? "finalColor" : "color";
  }

  // we use the define to enable or disable the plugin.
  prepareDefines(defines, scene, mesh) {
    defines.COLORIFY = this._isEnabled;
  }

  // here we can define any uniforms to be passed to the shader code.
  getUniforms() {
    return {
      // first, define the UBO with the correct type and size.
      ubo: [{ name: "myColor", size: 3, type: "vec3" }],
      // now, on the fragment shader, add the uniform itself.
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

  getCustomCode(shaderType) {
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

<Playground id="#P8B91Z#35" title="Material plugin example with uniforms"/>

## Applying a plugin to a single material

Even though your plugins can be enabled/disabled as shown above, sometimes you need to apply a plugin to a single material. In this case, instead of calling `RegisterMaterialPlugin`, you can instantiate the plugin directly with the material that will be modified:

```js
const myPlugin = new BlackAndWhitePluginMaterial(material);
```

This is also useful for dynamic loading of plugins.

<Playground id="#22HT5Z#15" title="Material plugin applied to a single material"/>

## Caveats

- The code insertion point names are standard over all materials, but not all of them have all insertion points. In general you can expect to have
  `CUSTOM_VERTEX_DEFINITIONS`, `CUSTOM_VERTEX_MAIN_BEGIN` and `CUSTOM_VERTEX_MAIN_END` in vertex shaders, and `CUSTOM_FRAGMENT_DEFINITIONS`, `CUSTOM_FRAGMENT_MAIN_BEGIN` and `CUSTOM_FRAGMENT_MAIN_END` in fragment shaders. But other `#defines` might not be present.
- There's no guarantee that using the shader point names / the regular expressions to update code / the variable names with a material plugin will work across Babylon.js versions. We reserve the possibility to update our shader code in a way that would break backward compatibility with those features if we have to. In particular, the color variable name for `standard.fragment.fx` is `color`, while for `pbrMaterial.fragment.fx` it's `finalColor`. If you are writing a plugin targeting multiple materials take care in your code to use different variable names according to the plugin and keep track of Babylon potentially changing (and breaking!) things.
- `RegisterMaterialPlugin` only adds the plugin to material instantiated AFTER the registration. So it must be run before you add any meshes or create your materials or they won't have the plugin.
- You can register multiple plugins to the same material (or the entire scene). The `priority` field controls the order the plugins will be executed if they are all enabled.

## Material Plugin Examples

Here are some other examples of plugins:

<Playground id="#HCLC5W#41" title="Using a class variable to animate a parameter for all instances"/>
<Playground id="#SYQW69#1077" title="Power plant with volumetric fog"/>
<Playground id="#IQPBS4#62" title="Grain (solves banding issues)"/>

You can also take a look at Babylon's source code. The PBR material includes several complex plugins, such as the [Anisotropic plugin](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrAnisotropicConfiguration.ts), [sheen](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrSheenConfiguration.ts) and [subsurface](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/PBR/pbrSubSurfaceConfiguration.ts), and the [detail map plugin applies to PBR and Standard materials](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Materials/material.detailMapConfiguration.ts).
