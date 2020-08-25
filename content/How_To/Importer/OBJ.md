# OBJ File Import

To use it, you just have to reference the loader file:

```
<script src="babylon.js"></script>
<script src="babylon.objFileLoader.js"></script>
```
You can find it [here](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview release/loaders)


If you are using ES6 imports via NPM, you need to reference with side-effects:
```
import 'babylonjs-loaders'
```

You can read more about [NPM support](/features/npm_support)

### Load
See [how to load from any file type](/how_to/Load_From_Any_File_Type)
Babylon.js will know how to load the obj file and its mtl file automatically: 

## Good things to know
* Your model doesn't have to be triangulated, as this loader will do it automatically.
* A Babylon.Mesh will be created for each object/group
* The obj model should be exported with -Z axis forward, and Y axis upward to be compatible with Babylon.js

![Axis](/img/how_to/import-obj/axys.jpg)

* By default, due to optimization in the code for loading time, UVs problems can appear, like this :

![Batman UVs problem](/img/how_to/import-obj/uv-issue.jpg)

If you meet this problem, set the variable:
```
BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
```
Then, you'll have a better texture, but with a longer loading.

![Batman UVs ok](/img/how_to/import-obj/uv-fixed.jpg)

Depending on the modeling program you export your OBJ files from, textures may appear distorted or inverted. As a workaround, you can modify your imported model's UV coordinate scale via setting the variable:
```
BABYLON.OBJFileLoader.UV_SCALE = new BABYLON.Vector2(xValue, yValue)
```

Although not part of Wavefront OBJ file format, some OBJ files include vertex colors. If you are loading such a file and want vertices with colors, set the variable:
```
BABYLON.OBJFileLoader.IMPORT_VERTEX_COLORS = true;
```

If you have an OBJ file without normals or wish to have them calculated for you, set the variable:
```
BABYLON.OBJFileLoader.COMPUTE_NORMALS = true;
```

To have your imported model inverted on the y-axis, set the variable:
```
BABYLON.OBJFileLoader.INVERT_Y = true;
```

To invert your imported textures on the y-axis, set the variable:
```
BABYLON.OBJFileLoader.INVERT_TEXTURE_Y = true;
```

By default if a MTL file cannot be loaded (missing/error) it will silently fail.  The model will still be loaded, but if you want to enforce a stricter loading of materials you can use onSuccess() and onError() callbacks accordingly.  Set the variable:
```
BABYLON.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;
```

If a MTL is defined in your OBJ and you wish to have it ignored, set the variable:
```
BABYLON.OBJFileLoader.SKIP_MATERIALS = true;
```

## Supported
* Object/group
* Geometric vertex
    * colors
* Faces
    * triangles
    * quads
    * polygons
* Colors
    * diffuseColor
    * ambientColor
    * specularColor
    * specularPower
    * alpha
* Textures
    * ambientTexture
    * diffuseTexture
    * specularTexture
    * bumpTexture
    * opacityTexture
* Multimaterial
	* For each material defined in the same mesh, it creates a new BABYLON.Mesh.
	* The name of the created BABYLON.Mesh follows this syntax: meshName_mmX 
	* X is the nth BABYLON.Mesh created with this method

## Not supported currently
* Smoothing groups (s parameter in OBJ file)
* Illumination (illum parameter in MTL file)
* The differents options for loading textures in MTL file.
* A good description about MTL files and their options can be found here: http://paulbourke.net/dataformats/mtl/
