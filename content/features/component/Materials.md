# Materials
Materials give your meshes color and texture. Materials can be opaque or have different degrees of transparency. When you form one material in Babylon.js it can be used to cover as many meshes as you wish, the only requirement is a light to be seen by. Their reaction to light can be diffuse, specular, emissive or ambient.

Diffuse shows the color or texture under white light, the amount of light falling on a particular part lightening or darkening the shade. Specular highlights where the light is most intense. Emissive shows the color or texture as if the light were inside, so with no other lights the color or texture will be uniform all over. For ambient to work it must be set on both the scene and material and then the material also takes on the ambient color of the scene.

An example of the creation and use of a material is 

```javascript
var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

myMaterial.diffuseTexture = new BABYLON.Texture("URL", scene);
myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

mesh.material = myMaterial;
```

## Properties and Features.

### PointsCloud

Want to render a mesh with vertex points rather than facet triangles then use the _pointscloud_ option.

```javascript
var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
myMaterial.pointsCloud = true;
```

* [Playground Example - Points Cloud](https://www.babylonjs-playground.com/#PGY5FG)
* [Playground Example - Points Cloud with a Variety of Colors](https://www.babylonjs-playground.com/#PGY5FG#3)

### Transparency

Generally set using an _alpha_ value from 0, fully transparent to 1 opaque. 

```javascript
material.alpha = 0.5;
```

When using an image with transparent areas for a texture then you need to set the _hasAlpha_ property of the diffuseTexture to true and leave the _alpha_ on its default setting. In addition should you wish to place the texture around a mesh so that you can see through the front to the back then you will need to set _backFaceCulling_ to false. 

```javascript
material.diffuseTexture.hasAlpha = true;
material.backFaceCulling = false;
```

* [Playground Example Transparent Texture](https://www.babylonjs-playground.com/#2Z6EHT);

Do you have an image with a transparency gradient then Babylon.js can cater for this as well, using the _opacityTexture_ .

```javascript
var material = new BABYLON.StandardMaterial("mat", scene);
mat.opacityTexture = new BABYLON.Texture("URL GRADIENT IMAGE", scene);
```

* [Playground Example Opacity Texture](https://www.babylonjs-playground.com/#20OAV9#32);

Transparency can  adversely affect the drawing of overlapping meshes. To help the correct rendering of transparent overlapping meshes Babylon.js provides access to the depth buffer by enabling the _DepthRenderer_ object.

### Blending

Blending is the method of combining colors on screen. For example when one color is (r<sub>0</sub>, g<sub>0</sub>, b<sub>0</sub>) and another (r<sub>1</sub>, g<sub>1</sub>, b<sub>1</sub>) then the second color could just replace the first, or could be (r<sub>0</sub> + r<sub>1</sub>, g<sub>0</sub> + g<sub>1</sub>, b<sub>0</sub> + b<sub>1</sub>) or perhaps (r<sub>0</sub> - r<sub>1</sub>, g<sub>0</sub> - g<sub>1</sub>, b<sub>0</sub> - b<sub>1</sub>) or other combinations. 

Babylon.js gives a way to set the method of blending when one mesh overlaps another through the material property _alphaMode_ with five options.

```javascript
material.alpha = 0.9999;		// when material is opaque artificially set as alpha blended
material.alphaMode = BABYLON.Engine.ALPHA_COMBINE; //default option
```

* [Playground Example Blending Modes](https://www.babylonjs-playground.com/#1MSIXB#7)


### Tiling

Repeat you texture as tiles across a mesh or even offset your texture on a mesh, all possible.

```javascript
var material = new BABYLON.StandardMaterial("mat0", scene);
material.diffuseTexture = new BABYLON.Texture("URL TEXTURE", scene);
material.diffuseTexture.uScale = 2;
material1.diffuseTexture.vScale = 4;

material.diffuseTexture.uOffset = 0.25;
material.diffuseTexture.vOffset = 0.5;
```

* [Playground Example of Tiling and Offset](https://www.babylonjs-playground.com/#20OAV9#25)

### Wireframe

There are times when you want to see the underlying structure of the mesh putting

```javascript
material.wireframe = true;
```
does that.

* [Playground Example Wireframe](https://www.babylonjs-playground.com/#IUKB9V)

### More Than One Material on a Mesh

Possible? Of course it is. All meshes can use the [multi-material](/How_To/Multi_Materials) approach of dividing the mesh into submeshes and using a different color or texture on each sub-mesh.

* [Playground Example Multi-Mesh with Color](https://www.babylonjs-playground.com/#NZ4GG2)

Meshes that have distinct faces or surfaces such as a box or cylinder and are built using the BABYLON.MeshBuilder.Create&lt;Mesh&gt; method can have [color or texture applied to these faces individually]((/How_To/CreateBox_Per_Face_Textures_And_Colors). When using texture material one image file which is composed of multiple images forms the basis for the texture. This is done using arrays  _faceUV_ or _faceColors_.

* [Playground Example faceUV on Cylinder](https://www.babylonjs-playground.com/#VA2AC#1)

### Dynamic Texture

A dynamic texture allows you to have an active material that you can draw and write on. 

* [Playground Example Dynamic Texture](https://www.babylonjs-playground.com/#1282WV#14)

### 3D Surface Effects

Sometimes you want your material to appear more textured (more 3D than smooth) in which case bump mapping and parallax mapping are available.

* [Playground Example Bump Map](https://www.babylonjs-playground.com/#20OAV9#33)

The use of parallax mapping with bump mapping enhances the apparent depth of the texture.

* [Playground Example Parallax Mapping](https://www.babylonjs-playground.com/#JHHV3G)

### Reflection and Refraction

Reflection of these can be simulated in Babylon.js using a _reflectionTexture_ with cube, HDR cube, spherical and mirror textures or with Fresnel parameters. Refraction uses the _refractionTexture_ or again Fresnel parameters can be used.

* [Playground Example Reflection Texture in Mirror](https://www.babylonjs-playground.com/#1YAIO7#21)  
* [Playground Example Refraction Texture](https://www.babylonjs-playground.com/#22KZUW#15)  
* [Playground Example Fresenel Parameters](https://www.babylonjs-playground.com/#AQZJ4C)

### Procedural Textures

These are texture that you can have some control over by changing some parameters. Find out more from the Further Reading list.

* [Playground Example Procedural Textures](https://www.babylonjs-playground.com/#24C4KC#17)

### Texture Packer

A built in method to consolidate multiple textures into images sets.

* [Playground Example Texture Packer](https://www.babylonjs-playground.com/#G5BWAD#10)

### How Materials Work

Sometimes in order to use materials more effectively it is good to know what is happening under the Babylon.js hood. Have a look at how color is applied to the vertices of the facets that make up the mesh and their effects. Find out more how materials are cached and compiled and how to improve the user experience. All available from the links in Further Reading.

### Compressed Texture for GPU

There are special formats of textures which are optimized for access by graphics processors.  A .jpg can be very small on disk, but gets expanded by the CPU on its way to the GPU.  Retaining its compressed form is what gives these formats their advantages. These are relatively new and little known and there are issue. Please read more using the link in Further Reading.

### Depth Buffer

When rendering meshes the depth buffer is used to determine for any screen point the pixel of which material is displayed on screen taking into account which meshes are behind which for the current camera view. How the depth buffer is used during rendering can be changed by using the _DepthRenderer_ object or the logarithmic depth buffer.

### Shaders

A shader is code written for the GPU and is what finally renders your material onto the screen. Babylon.js deals with the shader code for you, all you need to do is to set the material and lighting. However should you wish to do so you can write your own shader to produce the effect you want. You can edit and try out any shader code at http://cyos.babylonjs.com/

A range of shaders including fire, water, lava and fur can be found in the materials library section of [Extensions](/extensions).

# Further Reading

## Basic - L1
[Materials 101](/babylon101/Materials)  
[Bumps, Opacity, Tiling textures](/How_To/More_Materials)  
[Multi Materials](/How_To/Multi_Materials)  
[Dynamic Textures](/How_To/DynamicTexture)  
[Individual Faces](/How_To/CreateBox_Per_Face_Textures_And_Colors)  
[Video Texture](/How_To/video_texture)

## Mid Level - L2
[Using Parallax Mapping](/How_To/Using_parallax_mapping)  
[Calculating UVs](/How_To/Custom#calculating-uvs)  

## More Advanced - L3
[Reflection and Refraction](/How_To/Reflect)  
[Fresnel Parameters](/How_To/How_to_use_FresnelParameters)  
[Procedural textures](/How_To/How_to_use_Procedural_Textures)  
[Transparency and Rendering](/resources/Transparency_and_How_Meshes_Are_Rendered)  
[DepthRenderer](/How_To/How_to_use_DepthRenderer_to_get_depth_values)  
[Blending](/How_To/How_to_use_Blend_Modes)  
[How Materials are Applied to Vertices](/resources/Facets)  
[How Materials Work](/resources/How_materials_work)  
[Multi-Platform Compressed Textures](/resources/Multi-Platform_Compressed_Textures)


[Introduction to Shaders](/resources/ShaderIntro)  
[How To Put Shader Code in Babylon.js](/How_To/Putting)  
[How To Use ShaderMaterial](/How_To/Shader_Material)  
[Example A Vertical Wave with Shader Code](/samples/Writing1)  
[Example Fireworks with Shader Code](/samples/Writing2)



