# Setup

The glTF loader files are located [here](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/loaders).

## Full Version

This loader supports both glTF 1.0 and 2.0 and will use the correct loader based on the glTF version string.

```html
<script src="babylon.js"></script>
<script src="babylon.glTFFileLoader.js"></script>
```

## Version 2 Only

This loader supports only glTF 2.0 and will fail to load glTF 1.0.

```html
<script src="babylon.js"></script>
<script src="babylon.glTF2FileLoader.js"></script>
```

## Version 1 Only

This loader supports only glTF 1.0 and will fail to load glTF 2.0.

```html
<script src="babylon.js"></script>
<script src="babylon.glTF1FileLoader.js"></script>
```

# Loading the Scene

Use one of the static function on the `SceneLoader` to load a glTF asset.
See [Load from any file type](/how_to/Load_From_Any_File_Type).

[Demo](https://www.babylonjs-playground.com/#WGZLGJ)

# API (Version 2)

## Properties and Methods

See the available [properties and methods](https://doc.babylonjs.com/api/classes/babylon.gltffileloader) from the API documentation.

## Extensions

See the available [extensions](https://doc.babylonjs.com/api/modules/babylon.gltf2.loader.extensions) from the API documentation.

# API (Version 1)

## Properties

### IncrementalLoading

Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders. Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled. Defaults to true.

```javascript
BABYLON.GLTFFileLoader.IncrementalLoading = false;
```

### HomogeneousCoordinates

Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters. Defaults to false.

```javascript
BABYLON.GLTFFileLoader.HomogeneousCoordinates = true;
```

## Extensions

[KHR_binary_glTF](https://github.com/KhronosGroup/glTF/tree/master/extensions/1.0/Khronos/KHR_binary_glTF)  
[KHR_materials_common](https://github.com/KhronosGroup/glTF/tree/master/extensions/1.0/Khronos/KHR_materials_common)  
