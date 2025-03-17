---
title: Creating New Blocks
image:
description: Learn how to get started with Smart Filters
keywords: video, babylon.js, sfe, smart, filter, effect, block, custom
further-reading:
video-overview:
video-content:
---

## Overview

There are two ways you can make and use blocks for Smart Filters:

1. With annotated GLSL code
1. With TypeScript + GLSL code

|                                                                                                             | Annotated GLSL | TS + GLSL |
| ----------------------------------------------------------------------------------------------------------- | -------------- | --------- |
| Can use block in your own project                                                                           | Yes            | Yes       |
| Can contribute block to @babylonjs/smart-filters-blocks                                                     | Yes            | Yes       |
| Can load directly in the Smart Filters Editor (SFE)                                                         | Yes            | No        |
| Can do custom logic in your bind function <br/>(e.g. math or packing multiple inputs into a single uniform) | No             | Yes       |

## Using Annotated GLSL Code

This approach doesn't support custom vertex shaders or custom binding logic, but is the easiest to get started with and you can load these blocks directly into the [Smart Filters Editor](https://sfe.babylonjs.com).

### Naming Convention

The Smart Filters core comes with a build tool to convert these annotated GLSL files into TypeScript classes. If you plan to use your block in a package, such as @babylonjs/smart-filters-blocks or your own project which will use these tools, you should follow this naming convention:

`blackAndWhiteBlock.block.glsl`

### Getting Started

The easiest process for creating a custom block using annotated GLSL code is to:

1. Author the file in the editor of your choice
1. Open the [Smart Filters Editor](https://sfe.babylonjs.com)
1. Click "Add" under "Custom Blocks" then select your GLSL file
1. Watch the console UI at the bottom of the editor for any errors
1. Drag your block into the Smart Filter and wire it up
1. To see changes, just modify your GLSL file, click "Add" under "Custom Blocks" again, and select it
   - Your new block definition will be loaded and the current Smart Filter rebuilt, so you'll see your changes immediately

### Sample

```annotated-GLSL
// { "smartFilterBlockType": "SerializedTintBlock" }

uniform sampler2D input;
// { "default": { "r": 1, "g": 0, "b": 0 } }
uniform vec3 tint;
// { "default": 0.25 }
uniform float amount;

vec4 mainImage(vec2 vUV) { // main
    vec4 color = texture2D(input, vUV);
    vec3 tinted = mix(color.rgb, tint, amount);
    return vec4(tinted, color.a);
}
```

### Annotation Requirements

1. The file must start with a // comment containing a serialized JSON object of type `GlslHeader`
   - The smartFilterBlockType property is required
   - See [shaderConverter.ts](https://github.com/BabylonJS/SmartFilters/blob/main/packages/core/src/utils/buildTools/shaderConverter.ts) for the full object definition
1. There must be a single main function which takes in a vec2 named vUV and returns a vec4, and it must have a comment on its line like this:
   `// main`
1. Functions must be declared with the open curly brace on the same line as the function name
1. Any uniforms which should have the same value across all instances of the same block should have a comment on its line like this:
   `// single`
1. Uniforms can have metadata, such as a default value if no connection is made to their corresponding connection point
   - In the line immediately above the uniform declaration, start with a // comment followed by a JSON object
   - The supported metadata is described in the `UniformMetadataProperties` type in [shaderConverter.ts](https://github.com/BabylonJS/SmartFilters/blob/main/packages/core/src/utils/buildTools/shaderConverter.ts)

### Using Your Block

#### In the Smart Filters Editor

1. You can use it right away in the [Smart Filters Editor](https://sfe.babylonjs.com) by clicking "Add" in "Custom Blocks"

#### Contributing it to the Smart Filters block library

1. Clone [BabylonJS/SmartFilters](https://github.com/BabylonJS/SmartFilters)
1. Add your .glsl file to the appropriate path in packages/blocks/src/blocks
1. Ensure it has a namespace defined in the `GlslHeader` which matches the path
1. The build will create a blackAndWhiteBlock.block.ts file from your blackAndWhiteBlock.block.glsl file
1. Ensure that auto generated blackAndWhiteBlock.block.ts file is exported from the appropriate index.ts files
1. To test your block, either:
   - Run `npm run start:sfe` to launch a local build of the Smart Filter Editor with your block available in it
   - Edit one of the built in Smart Filter graphs in `packages/demo/src/configuration/smartFilters/hardCoded` to use your new block programmatically, then run `npm start`
1. Create a Pull Request

#### In Your Own Project (Build Time Deserialization)

When you have the blocks available at build time, it's advantageous to deserialize them then so the work doesn't have to be done at runtime. Also, you get the benefit of property accessors for input connection points.

1. See _Configuring Your Build_ below
1. Your annotated GLSL (e.g. blackAndWhiteBlock.block.glsl) is converted into a TypeScript class by the build (e.g. blackAndWhiteBlock.block.ts)
1. You can then import that class and use it in your Smart Filters:

```typescript
import { BlackAndWhiteBlock } from "./blackAndWhiteBlock.block.js";

const block = new BlackAndWhiteBlock(smartFilter, "B&W Block");
```

#### In Your Own Project (Runtime Deserialization)

Runtime deserialization is easier, and necessary if you need to consume blocks not available at build time, but it is slower at runtime when loading the block for the first time.

Here's how it is done:

```typescript
const blockDefinition = importCustomBlockDefinition(serializedAnnotatedGlsl);
const block = CustomShaderBlock.Create(smartFilter, "Name Of This Instance", blockDefinition);
// Access the block inputs connection points via block.inputs and the output connection point via .output
```

## Using TypeScript + GLSL Code

Use this approach if you need a custom vertex shader, custom binding logic, or don't have a need to load the block implementation dynamically at runtime in your application.

### Naming Convention

The Smart Filters core comes with a build tool to convert your GLSL files into TypeScript files which export a `ShaderProgram` your TypeScript block class can use. If you plan to use your block in a package, such as @babylonjs/smart-filters-blocks or your own project which will use these tools, you should follow this naming convention:

`compositionBlock.fragment.glsl`

### Adding to the Babylon Blocks Library

1. Clone [BabylonJS/SmartFilters](https://github.com/BabylonJS/SmartFilters)
1. Run `npm install`
1. Now you'll create a TypeScript and glsl file for your block
   - See compositionBlock.ts and compositionBlock.fragment.glsl as examples
1. Note that the TypeScript file imports a compositionBlock.fragment.js file which the build auto-generates from the .glsl file
1. Add an entry to [builtInBlockRegistrations.ts](https://github.com/BabylonJS/SmartFilters/blob/main/packages/blocks/src/registration/builtInBlockRegistrations.ts)
1. To use and test your block, either:
   - Run `npm run start:sfe` to launch a local build of the Smart Filter Editor with your block available in it
   - Edit one of the built in Smart Filter graphs in [configuration/smartFilters](https://github.com/BabylonJS/SmartFilters/tree/main/packages/demo/src/configuration/smartFilters/hardCoded) to use your new block programmatically, then run `npm start`

### Adding to Your Own Project

1. See _Configuring Your Build_ below
1. You'll create a TypeScript file for your block (e.g. compositionBlock.ts) as well as a fragment shader file (e.g. compositionBlock.fragment.glsl)
1. You'll import the ShaderProgram and uniforms list from the file that buildShader.js creates at build time (e.g. compositionBlock.fragment.js) like this:

```typescript
import { uniforms, shaderProgram } from "./compositionBlock.fragment.js";
```

### Block Design Requirements

1. The main fragment shader function must take in `vec2 vUV` (the name must match)
1. You can choose if you want your shader block to be disableable
   - Disableable means that it will have a disabled input connection point, and will automatically pass the main input texture through to the output if the block is disabled
   - This is helpful in applications which may allow the user to turn on and off many effects, since this allows effects to be disabled instantly without a need to build a new Smart Filter runtime
   - There are different disable strategies you can choose to get the best shader performance, based on the details of your block (see `BlockDisableStrategy` in [disableableShaderBlock.ts](https://github.com/BabylonJS/SmartFilters/blob/main/packages/core/src/blockFoundation/disableableShaderBlock.ts))
   - You must specify a main input when creating a disableable shader block
     - In your fragment shader, you must put `// main` on the line that declares the uniform to be treated as the main input texture
   - If you choose the manual strategy, your fragment shader must check a uniform named `disabled` which the system will add for you, and if true, just return texture2D(your_main_input_texture, vUV)
1. Uniform names must match connection point names
1. The ShaderBinding.bind() function must not assume texture inputs will be defined
   - If the Smart Filter has been optimized, texture inputs may be replaced with return values from other blocks instead of texture uniforms
   - For example, don't have logic that branches based on if the texture input was defined

### Configuring Your Build

If you plan to include your new block in your own project, and want to deserialize them at build time instead of runtime for the best performance, you can use build tools supplied by the Smart Filters core.

1. As part of your build, you'll need to run a tool called `buildShaders.js` and pass a path to your blocks and the name of the Smart Filters package as parameters. Use scripts similar to these in your package.json (update ./src/blocks to the path where your block files can be found):

```package.json
"build": "npm run build:runTools && npm run build:blocks",
"build:runTools": "node ./node_modules/@babylonjs/smart-filters/dist/utils/buildTools/buildShaders.js ./src/blocks @babylonjs/smart-filters",
"build:blocks": "tsc -p ./tsconfig.build.json",
```

2. You can also use the provided watchShaders.js file for your watch mode (see the block library's [package.json scripts](https://github.com/BabylonJS/SmartFilters/blob/main/packages/blocks/package.json) as an example)
   - Note you'll need to reference the js utilities in your node_modules folder - the block library uses a relative path reference since it is in the same mono repo as the Smart Filters core
1. Add these lines to your `.gitignore` file so that these auto generated files aren't committed to your repo:

```text
**/*.fragment.ts
**/*.block.ts
```

1. If you use VSCode, we suggest you add this to your `.vscode/settings.json` file so that these auto generated files don't appear in your editor:

```json
"files.exclude": {
    "**/*.fragment.ts": true,
    "**/*.block.ts": true
},
```
