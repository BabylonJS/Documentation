## How To Use TrailMesh

`TrailMesh` creates a new `Mesh` that trails another.

```javascript
var newTrail = new BABYLON.TrailMesh(name, generator, scene, diameter, length, autoStart);

newTrail.start();       //Starts the trailing mesh.
newTrail.stop();        //Stops the trailing mesh.
```

|variable| description|
|----------|-----------|
|name| The value used by scene.getMeshByName() to do a lookup.|
|generator| The mesh to generate a trail.|
|scene| The scene to add this mesh to.|
|diameter (optional)| Diameter of trailing mesh. Default is 1.|
|length (optional)| Length of trailing mesh. Default is 60.|
|autoStart (optional)| Automatically start trailing mesh. Default true.|

TrailMesh will be affected by all modifications to the generator mesh. Using `bakeCurrentTransformIntoVertices` on the generator after scaling (and before a position shift) will prevent the TrailMesh from scaling.

## Example Usage
```javascript
var alpha = Math.PI;
// Create a mesh for the trail to follow.
var cube = BABYLON.MeshBuilder.CreateBox('cube', {  }, scene);
cube.scaling.y = 2;
cube.bakeCurrentTransformIntoVertices();
cube.position.x = Math.sin(alpha)*10;
cube.position.z = Math.cos(alpha)*10;
cube.computeWorldMatrix(true);

var trail = new BABYLON.TrailMesh('new', cube, scene, .5, 60, true);

var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene);
sourceMat.emissiveColor = 
sourceMat.diffuseColor = new BABYLON.Color3.Red();
sourceMat.specularColor = new BABYLON.Color3.Black();

trail.material = sourceMat;

observer = scene.onBeforeRenderObservable.add(animate);
function animate() {
    alpha += Math.PI/120;
    cube.position.x = Math.sin(alpha)*10;
    cube.position.z = Math.cos(alpha)*10;
    cube.rotation.x = Math.PI*alpha/2;
    cube.rotation.y = alpha;
}
```

## Examples

- [Glowing orbs with trail](https://playground.babylonjs.com/#1F4UET#4)
