---
title: Creating Procedural Textures
image:
description: Learn how to create your own procedural textures in Babylon.js.
keywords: diving deeper, materials, advanced, textures, procedural, procedural textures
further-reading:
video-overview:
video-content:
---

## Using a Files-Based Custom Procedural Texture

To use a files-based custom procedural texture, you need to create a folder containing at least 2 files:

- config.json
- custom.fragment.fx

The config file is a JavaScript Simple Object Notation file containing 4 elements. Here is an example:

```javascript
    {
     "animate": false,
     "refreshrate": 0,
     "uniforms": [
      {
          "type": "float",
          "name": "dirtAmplifier",
          "value": "6.0"
      }
  ],
     "sampler2Ds": [
      {
          "sample2Dname": "dirt",
          "textureRelativeUrl": "textures/dirt.jpg"
      },
      {
          "sample2Dname": "grass",
          "textureRelativeUrl": "textures/grass.png"
      }
     ]
    }
```

The **animate** property indicates if a time value should be created and increased each time the fragment shader code is executed.

The **refreshrate** property is set to 0 if you want the texture to render only once. If set to 1, it will render every frame; if set to 2, every two frames; and so on.

**Uniforms** are the values that will be passed from the JavaScript code to the shader code. By setting them this way, you can allow the custom texture user to modify these values at runtime to customize the texture.

Uniforms can be of type:

- **float** (parameters : value)
- **Vector2** (parameters: x, y)
- **Vector3** (parameters: x, y, z)
- **Color3** (parameters: r, g, b)
- **Color4** (parameters: r, g, b, a)

**Textures2D** are 2D image files that are passed to the shader code as **sampler2D** variables. They can be read by the shader code and be used to create the final pixel color. You only need to provide a name and the relative path inside the folder.

The **custom.fragment.fx** file contains the [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) code. The purpose of this wiki article is not to teach you how to create a fragment shader or how it works. You simply need to know that the code in your main function will be called once for each pixel to be created in the texture. In this main function, you only know the coordinates of the current pixel in the final texture.

Here is a simple example that sets all pixels to a specific gray.

```javascript
    #ifdef GL_ES
    precision highp float;
    #endif

    void main(void) {
     vec3 color = vec3(0.9, 0.9, 0.9);
     gl_FragColor = vec4(color, 1.0);
    }
```

Gl_FragColor is the variable in which you put the color you want the pixel to have.
Here is a more complex example that uses 2 samplers and mixes their colors equally.

```javascript
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec2 vPosition;
    varying vec2 vUV;

    uniform sampler2D grass;
    uniform sampler2D dirt;

    void main(void) {
     vec3 color = mix(texture2D(dirt, vUV).xyz, texture2D(grass, vUV).xyz, 0.5);
     gl_FragColor = vec4(color, 1.0);
    }
```

To use this custom texture, you need to make your folder available to your Babylon.js HTML/JavaScript files and use a **CustomProceduralTexture** class instead of a standard one. The only difference is that you specify a new parameter: the relative path to the folder containing the custom texture. Babylon.js will automatically read the config.json and custom.fragment.fx files and load everything for you.

```javascript
const texture = new BABYLON.CustomProceduralTexture("texture", "./pathtotexture", 1024, scene);
```

## Using a ShaderStore for Shader Storage

You can also use the ShaderStore to write a shader inline and use it in a CustomProceduralTexture.
This can be done easily using the **BABYLON.Effect.ShaderStore** array:

```javascript
BABYLON.Effect.ShadersStore["LinesPixelShader"] = "#ifdef GL_ES\n" + "precision highp float;\n" + "#endif\n\n" + "varying vec2 vUV; \n" + "void main(void) {\n" + " gl_FragColor = vec4(vUV.x,vUV.y,-vUV.x, 1.0);\n" + "}\n" + "";
```

Note that your shader name should be suffixed with **PixelShader**, as the Procedural Texture shader is always a pixel shader. Babylon.js will automatically understand that it is a pixel shader.

To use this shader, you just have to create a CustomProceduralTexture and put the name of your shader in the store instead of the path to the files.

```javascript
const customProcText = new BABYLON.CustomProceduralTexture("customtext", "Lines", 1024, scene);
```

## Using a DOM Element for Shader Storage

Finally, you can also use **DOM Elements** to store your shader. You just have to create a script tag in your HTML file like this:

```html
<script type="application/pixelShader" id="LinesPixelShader">
  #ifdef GL_ES
  precision highp float;
  #endif
  varying vec2 vUV;
  void main(void) {
       gl_FragColor = vec4(vUV.x,vUV.y,-vUV.x, 1.0);
  }
</script>
```

To use it, you just have to create a simple object containing one property which is named **fragmentElement** and contains the id identifying the script DOM element.

```javascript
const linesShader = { fragmentElement: "LinesPixelShader" };
const customProcText = new BABYLON.CustomProceduralTexture("customtext", linesShader, 1024, scene);
```

## Using Node Material to generate procedural texture

You can use NodeMaterial to generate the shaders for your procedural texture.
The code to generate it is very simple:

```javascript
BABYLON.NodeMaterial.ParseFromSnippetAsync("#A7A3UB#1", scene).then((nodeMaterial) => {
  const proceduralTexture = nodeMaterial.createProceduralTexture(256);
});
```

Example: <Playground id="#8S19ZC#1" title="Node Material Procedural Texture Example 1" description="Simple example of creating a procedural texture using the node material editor."/>

More here: [Creating Procedural Textures](/features/featuresDeepDive/materials/node_material/nodeMaterial#creating-procedural-textures)

<Youtube id="qqMuuSM7GvI"/>

**Note:** When using ShaderStore or a DOM element shader for custom procedural textures, the config.json file is no longer needed. You can simply use setFloat or setVector3 (and so on), and setTexture on the CustomProceduralTexture will provide values and Sampler2D variables to the shader code.

Feel free to play with this scene here: <Playground id="#24C4KC#51" title="Node Material Procedural Texture Example 2" description="Simple example of creating a procedural texture using the node material editor." image="/img/playgroundsAndNMEs/divingDeeperCreateProceduralTexture2.webp"/>
