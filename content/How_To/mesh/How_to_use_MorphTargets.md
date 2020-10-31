# Morph targets

Morph targets are a new feature introduced with Babylon.js v3.0.

![Morph Target Before and After](/img/how_to/morphtargets.jpg)

# Basics
Meshes can be deformed by using morph targets. A morph target must be built from a mesh with the **EXACT** same number of vertices as the original mesh.
Morph targets are used by the GPU to create the final geometry by applying the following formula:

final mesh = original mesh + sum((morph targets - original mesh) * morph targets influences)

For instance, you can use morph targets to simulate the opening of a mouth. The initial mesh has a closed mouth. The morph target can be the same mesh but with an opened mouth. Then by changing the influence of the morph target (from 0 to 1) you can display either a closed or an opened mouth or a mix of both.

You can find live examples here: 
* [Playground Example Animated](https://www.babylonjs-playground.com/#HPV2TZ#8)  

The following two examples are best seen in the full Playground where sliders can be used to change the influencers
* [Playground Example With Standard Material](https://www.babylonjs-playground.com/#HPV2TZ#2)   
* [Playground Example With PBR Material](https://www.babylonjs-playground.com/#HPV2TZ#4) 

# How to Use Morph Targets
To use morph targets, you first have to create a `MorphTargetManager` and affect it to a mesh:

```
var manager = new BABYLON.MorphTargetManager();
sphere.morphTargetManager = manager;
```

Then you can create `MorphTarget` either with the `FromMesh` static function:

```
var target = BABYLON.MorphTarget.FromMesh(sphereTarget, "target", 0.25);
```

or simply by creating a target and specifying positions and normals:

```
var target = new BABYLON.MorphTarget(name, influence);
target.setPositions(...);
target.setNormals(...);
```

Once done, you can specify the influence of a specific target with `target.influence = 0.25`

Targets with influence = 0 are disabled.

Here is a complete example with 4 targets:

```
var scramble = function(data) {
    for (index = 0; index < data.length; index ++) {
        data[index] += 0.1 * Math.random();
    }
}

// Main sphere
var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

// Let's create some targets
var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
sphere2.setEnabled(false);
sphere2.updateMeshPositions(scramble);

var sphere3 = BABYLON.Mesh.CreateSphere("sphere3", 16, 2, scene);
sphere3.setEnabled(false);

sphere3.scaling = new BABYLON.Vector3(2.1, 3.5, 1.0);
sphere3.bakeCurrentTransformIntoVertices();

var sphere4 = BABYLON.Mesh.CreateSphere("sphere4", 16, 2, scene);
sphere4.setEnabled(false);
sphere4.updateMeshPositions(scramble);

var sphere5 = BABYLON.Mesh.CreateSphere("sphere5", 16, 2, scene);
sphere5.setEnabled(false);

sphere5.scaling = new BABYLON.Vector3(1.0, 0.1, 1.0);
sphere5.bakeCurrentTransformIntoVertices();    

// Create a manager and affect it to the sphere
var manager = new BABYLON.MorphTargetManager();
sphere.morphTargetManager = manager;

// Add the targets
var target0 = BABYLON.MorphTarget.FromMesh(sphere2, "sphere2", 0.25);
manager.addTarget(target0);

var target1 = BABYLON.MorphTarget.FromMesh(sphere3, "sphere3", 0.25);
manager.addTarget(target1);

var target2 = BABYLON.MorphTarget.FromMesh(sphere4, "sphere4", 0.25);
manager.addTarget(target2);   

var target3 = BABYLON.MorphTarget.FromMesh(sphere5, "sphere5", 0.25);
manager.addTarget(target3);      
```

At any time, you can remove a target with `manager.removeTarget(target)`

# How to access morph targets in a glTF file
You can access a morph target influence on a mesh in a glTF file through the [morphTargetManager](https://doc.babylonjs.com/api/classes/babylon.morphtargetmanager#gettarget) which is automatically created for a loaded glTF file containing morph targets. You can see how many influences are present on the mesh by writing to the console.

```
console.log(mesh.morphTargetManager);
```

If you want to view or change the value of a morph target influence, it can be accessed by getting the influence from the array in the morphTargetManager by key value.

```
myInfluence = mesh.morphTargetManager.getTarget(key);
```
See the following example for a full playground using morph targets from a glTF file.
- [Playground using morph targets from a glTF file](https://playground.babylonjs.com/#9CLJEF).

# List of morphable properties

You can morph the following mesh attributes:
- position
- normal (can be turned of by calling `manager.enableNormalMorphing = false`)
- tangents (can be turned of by calling `manager.enableTangentMorphing = false`)
- uvs (can be turned of by calling `manager.enableUVMorphing = false`)

# Limitations

* Please be aware that most of the browsers are limited to 16 attributes per mesh. Adding a single morph target to a mesh add up to 4 new attributes (position + normal + tangents + uvs). This could quickly go beyond the max attributes limitation.
* All targets within a same manager must have the same vertices count
* A mesh and its MorphTargetManager must have the same vertices count


