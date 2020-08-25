# Points Cloud Particle System (PCS)

A PCS is a single updatable mesh with the the `PointsCloud` property of its material set to `true`. The point particles are simply the vertices of the mesh. As a mesh a PCS has most of the properties of a mesh, The exceptions are those related to its material which is already set and cannot be changed and also anything related to its vertex normals and indices as it does not have any set.
 
As a particle system the PCS provides some methods to manage the particles. However it is behavior agnostic. This means it has no emitter, no particle physics, no particle recycler. You have to implement your own behavior.  

Particles can be added to a PCS with a function or using an existing mesh as a model, where particles are randomly evenly distributed on either the surface of the model or inside the model. 

The expected usage is: 
* First, create your PCS with `new PointsCloudSystem()`.
* Then, add particles in the PCS, using one of `addPoints(number, function)`, `addSurfacePoints(mesh, number, method)` or `addVolumePoints(mesh, number, method)`.  
* Redo the additions as many times as needed. Each addition creates a new group of particles identified by `particle.groupID`.  
* When done, build the PCS mesh with `buildMeshAsync()`.
* Changes to particle properties can be achieved with the `initParticles()` or `updateParticle(particle)` methods and a call to `setParticles`.
* Particle animation can be accomplished by defining their individual behavior in `updateParticle(particle)` and calling `setParticles()` within the render loop.

## Limitations
The way the PCS is created using vertex points with a pre-applied material with `PointsCloud` set to true means that:
1. Particles cannot be destroyed and particles off screen are still enabled;
2. Transparency does not work on individual particles. 

## PCS Creation
To create an empty PCS requires three parameters; its name, the size for every particle and the scene, for example

```javascript
var pcs= new BABYLON.PointsCloudSystem("pcs", 5, scene); 
```

After creating the PCS there are a number of options for adding particles

### Add Points

By default point particles are randomly added within a unit cube.

```javascript
pcs.addPoints(10000);
```
will add 10000 points.

* [Playground Example - Add Points Default](https://www.babylonjs-playground.com/#UI95UC)

You can use your own function as a second parameter to set particle properties such as position and color. This function must have this kind of signature:

```javascript
var myFunc = function(particle, i, s) {
  // particle is the current particle, the i-th one in the PCS and the s-th one in its group
};
```
For example using i;

```javascript
var myfunc = function(particle, i, s) {
        particle.position = new BABYLON.Vector3(0.5 + 0.25 * Math.random(), i / 5000, 0.25 * Math.random());
        particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random() )
}
    pcs.addPoints(10000, myfunc);
    pcs.addPoints(10000, myfunc);
```

will produce a tall block of points whose heights cover the full range of 20000 points. Whereas using s,

```javascript
var myfunc = function(particle, i, s) {
        particle.position = new BABYLON.Vector3(0.5 + 0.25 * Math.random(), s / 5000, 0.25 * Math.random());
        particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random() )
}
    pcs.addPoints(10000, myfunc);
    pcs.addPoints(10000, myfunc);
```

will produce a denser block of points whose heights only cover a range of 10000 points, as you can see in the picture below.

![use of i or s](/img/how_to/particles/points1.jpg)


In addition the use of `particle.groupId` can have an effect on all particles within a group. For example 

```javascript
var myfunc = function(particle, i, s) {
        particle.position = new BABYLON.Vector3(particle.groupId * 0.5 + 0.25 * Math.random(), i / 5000, 0.25 * Math.random());
        particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random() )
}
    pcs.addPoints(10000, myfunc);
    pcs.addPoints(10000, myfunc);
```
will displace the second group of points along the x axis.

![use groupId](/img/how_to/particles/points2.jpg)
 
* [Playground Example - Pass a Function](https://www.babylonjs-playground.com/#UI95UC#1)

### Add Surface / Volume Points

You are able to take a mesh such as this one as a model

<img src = "/img/how_to/particles/points3.jpg" width = "25%">

and convert it to particle points on its surface or within its volume

<img src = "/img/how_to/particles/points4.jpg" width = "40%">

The points are evenly randomly distributed based on the size of the individual triangular facets of the mesh model. The density of points is the same for all facets. 

For both the surface and the volume the default is that the points are randomly colored. For example the following are equivalents for the two surface and two volume additions. 

```javascript
pcs.addSurfacePoints(model, 10000);
pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Random);

pcs.addVolumePoints(model, 10000);
pcs.addVolumePoints(model, 10000, BABYLON.PointColor.Random);
```

**Note:** additional calculations in `addVolumePoint` means that it takes longer than `addSurfacePoints` for the same number of points. For a large number of points this can be noticeable.

There are four available methods for coloring the points.

| Method| Effect |
| ---- | ---- |
| BABYLON.PointColor.Random | Colors are assigned randomly to each point, default method .|
| BABYLON.PointColor.Stated | This method requires two extra parameters, the base color to use, default white, plus a range from 0 to 1 to randomize both the shade and tone of the stated color. A value of 0, default, gives no variation and 1 the largest variation.|
| BABYLON.PointColor.Color | When the model has a texture material applied the color of each point is determined by the texture color of a matching point on a facet. When the material used has color but no texture then the material color is used. When the model has no material applied random coloring is used.|
| BABYLON.PointColor.UV | The model uv values for each facet corner are used to determine the uv values for the points. An emissive texture can be applied to the pcs.mesh.material to color the PCS mesh|

For example:

```javascript
pcs.addSurfacePoints(box, 1000, BABYLON.PointColor. Stated, new BABYLON.Color3(1, 0, 0), 0.5);
pcs.addVolumePoints(box, 10000, BABYLON.PointColor.Color);
pcs.addSurfacePoints(box, 100000, BABYLON.PointColor.UV);
```

**Note:**  Using `BABYLON.PointColor.UV` can be limiting. Several models can be added to the PCS. These models may all have different textures. However only one emissive texture can be applied to a PCS mesh. In this case a separate PCS mesh is needed for each model. This is not a restriction when using `BABYLON.PointColor.Color`.

**Imported Models and Multiple Textures**
In some cases (for example PBRMaterial) more than one texture can be applied to a model. In which case adding surface or volume points with `BABYLON.PointColor.Color` will, by default, use the first in the model's texture array. Though often it is, the first texture may not be the color map, for example it may be a normal map. To specify which texture to use its position in the texture array can be added as a second parameter. 
```javascript
pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Color, 1);

pcs.addVolumePoints(model, 10000, BABYLON.PointColor.Color, 3);
```
Of course when you import a model you may not know how many child meshes the model is made up off nor the order of textures for each mesh. Using the [inspector](/how_to/debug_layer) you can check the loaded textures and see if their names give you a clue. If not then use trial and error from 0 to the number of textures. Alternatively you can check out meshes and textures once loaded along the lines of

```javascript
BABYLON.SceneLoader.ImportMesh("", "location", "file", scene, function (meshes) {
  var n = meshes.length;
  var p;
  var t;
  for (var i = 0; i < n; i++) {
    if (meshes[i].material !== null) {
      console.log("Mesh", i)
      t = meshes[i].material.getActiveTextures();
      p = t.length;
      for (var j = 0; j < p; j++) {
        console.log("Texture", j, "Name", t[j].name)
      }
    }
  }
});
```

**Examples**

* [Playground Example - Surface Random](https://www.babylonjs-playground.com/#UI95UC#2)
* [Playground Example - Surface Stated](https://www.babylonjs-playground.com/#UI95UC#3)
* [Playground Example - Surface Color from Mesh Color](https://www.babylonjs-playground.com/#UI95UC#4)
* [Playground Example - Surface Color from Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#5)
* [Playground Example - Surface UV from Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#6)
* [Playground Example - Surface Color from Imported Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#28)
* [Playground Example - Volume Random](https://www.babylonjs-playground.com/#UI95UC#7)
* [Playground Example - Volume Stated](https://www.babylonjs-playground.com/#UI95UC#8)
* [Playground Example - Volume Color from Mesh Color](https://www.babylonjs-playground.com/#UI95UC#9)
* [Playground Example - Volume Color from Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#10)
* [Playground Example - Volume UV from Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#11)
* [Playground Example - Volume Color from Imported Mesh Texture](https://www.babylonjs-playground.com/#UI95UC#29)

### Building the Mesh

The PCS mesh cannot be built until all relevant data is collected. Since this can involve ensuring that the material, applied to a model used in adding surface or volume points, is fully loaded, building the mesh is an asynchronous process.

For example when a mesh model is used in determining the points the model cannot be disposed of until the process of PCS construction is completed. This is achieved by, for example

```javascript
pcs.addSurfacePoints(box, 10000, BABYLON.PointColor.Color);
pcs.addPoints(10000, myFunc);
pcs.buildMeshAsync().then(() => box.dispose());
```

If you never want the particle properties of your PCS to change, ie you want it to be immutable then you need do no more. Alternatively you can set the PCS as immutable on creation by setting the updatable option. (Currently updatable is the only item in the option list that is available but the option list is open for future expansions)

```javascript
var pcs= new BABYLON.PointsCloudSystem("pcs", 5, scene, {updatable: false}); 
```

After making updatable false the following methods will no longer have any effect, `initParticles()`, `updateParticle(particle)` and `setParticles()`.

## Particle Management

### Particle Properties

Once the PCS mesh is built, unless immutable, it can respond to changes in the properties of each particle. Existing properties are shown in the table below.

| Property | Type | Default |
| ---- | ---- | ----|
| position | Vector3 | (0, 0, 0) |
| rotation | Vector3 | (0, 0, 0) |
| rotationQuaternion | Vector3 | undefined |
| velocity | Vector3 | (0, 0, 0) |
| color | Vector4 | (1, 1, 1, 1) |
| pivot | Vector3  | (0, 0, 0) |
| uvs | Vector2  | (0,0) |
| translateFromPivot | boolean |false |
| parentId | integer | null |
| idx | integer (read only) | index of particle |
| groupId | integer (read only) | group number for a particle |


If you set a particle rotation quaternion, its rotation property will then be ignored.

New properties can be initialised.

**Note:** Since point particles **_always_** face the camera setting the rotation of a particle only has any effect in two cases:

1. The rotation of a particle parent will rotate its children about itself;
2. A pivot is set for the particle.



### Initialising Particles

Using `addPoints` particle properties can be set in the passed function. The `addSurfacePoints` and `addVolumePoints` methods obviously set the position and color properties  of the particles but you may still want to set the initial values of other particle properties.

This can be done using `initParticles`. With this you must iterate over all the particles by using the `nbParticles` property and follow a call to this function with a call to `setParticles`. For example

```javascript
pcs.initParticles = function() {
   for (var p = 0; p < pcs.nbParticles; p++) {
       pcs.particles[p].velocity = BABYLON.Vector3.Zero();
       pcs.particles[p].acceleration = pcs.particles[p].position.scale(0.01);
   }
}

pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Color);
pcs.buildMeshAsync().then(() => {
  model.dispose()
  pcs.initParticles();
  pcs.setParticles();
});
```

### Updating Particles

When any appropriate particle properties are initiated the the `updateParticles` method can be used. Unlike `initParticles` the function is called by `setParticles` and already passes a particle as an argument.  The method `setParticles` will only execute after the PCS mesh has been built and so may safely be placed inside a render loop to produce an animation. For example

```javascript
pcs.updateParticle = function(particle) {
  particle.velocity.addInPlace(particle.acceleration);
  particle.position.addInPlace(particle.velocity);
}

scene.registerBeforeRender(() => {
  pcs.setParticles();
});
```

**Note:** All particle positions are expressed in the *local space* of the PCS mesh. 

The particle `pivot` vector is also in *local space* of the PCS mesh. By default rotations around a pivot are calculated by translating the particle to the pivot point, then rotating it and then the inverse translation applied. By setting the particle method `translateFromPivot` to `true` (default `false`) rotations will only be calculated using the initial translation followed by the rotation leaving the particle at the translated location.  

* [Playground Example - Simple Animation](https://www.babylonjs-playground.com/#UI95UC#12)

In the following playground the particle pivots in the top PCS are set relative to the particle position and in the lower one are set in the same place.
* [Playground Example - Pivot Animation](https://www.babylonjs-playground.com/#UI95UC#14)

In this playground the only difference is that the lower PCS has `translateFromPivot` set to `true`.
* [Playground Example - Pivot Animation](https://www.babylonjs-playground.com/#UI95UC#15)

This playground animates the mesh not the particles.
* [Playground Example - Immutable Animation](https://www.babylonjs-playground.com/#UI95UC#16)

This playground loads meshes from a file, converts to particles and animates
* [Playground Example - Loaded Mesh Animation](https://www.babylonjs-playground.com/#UI95UC#17)

### UVs

While setting and changing particle colors is straightforward doing this for UVs is a little more complex. Using `BABYLON.PointColor.UV` as a parameter within `addSurfacepoints` or `addVolumePoints` will set the UVs automatically for you based on the passed mesh.

You can also set the uv value for each particle using the passed function for `addPoints`. To make sense of the texture as the image used the uv values should relate in some way to the positional values for each particle. To then apply the texture with these uvs both the emissiveColor and emissiveTexture for the PCS mesh material must be set after the mesh is built.

**Note:** Only use emissive.

For example

```javascript
var myfunc = function(particle) { 
    var x = Math.random();
    var y = Math.random();
    var z = 0;
    particle.position = new BABYLON.Vector3(x, y, z);
    //Relate uv values to positional values
    particle.uv.x = x;
    particle.uv.y = y; 
    }
    pcs.addPoints(5000, myfunc);

    pcs.buildMeshAsync().then(() => {
      pcs.mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
      pcs.mesh.material.emissiveTexture = myTexture;
    });
```

It is possible to use a texture atlas but you need to customize and calculate the more complex relationship between positional and uv values.

* [Playground Example - UV with Add Points](https://www.babylonjs-playground.com/#UI95UC#23)
* [Playground Example - UV with Texture Atlas](https://www.babylonjs-playground.com/#UI95UC#24)

### Recycling Particles

You can write your own code to recycle particles using `recycleParticle` which can be called from within `updateParticle`. For example,

```javascript
pcs.recycleParticle = function(particle) {
    particle.position = BABYLON.Vector3.Zero();
    particle.velocity = BABYLON.Vector3.Zero();
    particle.heightLim = 4 + 0.5 * Math.random();
}

pcs.updateParticle = function(particle) {
    if (particle.position.y > particle.heightLim) {
      this.recycleParticle(particle);
    }
    particle.velocity.addInPlace(particle.acceleration);
    particle.position.addInPlace(particle.velocity);
}
```

* [Playground Example - Recycle Animation](https://www.babylonjs-playground.com/#UI95UC#19)

### Particle Parenting  

Each particle can be given another particle as a parent.  
The parent must be created before the child particle. This means the parent has to have a lower index Id (`particle.idx`) than the current particle. So the first particle in the pool (`idx = 0`) can't have a parent. To give a parent to a particle, just set its property `parentId` to the parent index Id value. 

```javascript
if (particle.idx > 0) {
    particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
}
```
To un-parent a particle, just set `.parentId` back to `null` which is the default value.  

When a particle has got a parent, its position and rotation are then expressed in its parent local space.  
```javascript
if (particle.idx > 0) {
    particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
    // the particle position and rotation are expressed in the previous particle space, this one being already 
    // rotated and translated from the yet previous particle. Etc.
    particle.rotation.z = 0.01;
    particle.position.x = 1.0;
}
```
 * [Playground Example - Parent Animation](https://www.babylonjs-playground.com/#UI95UC#18)

### Particle Intersections
     
The PCS provides a simple way to deal with intersections between a particle and other meshes. As this feature consumes more memory and CPU do not include it unless necessary.

To use it call the method `intersectsMesh(target)` (target is a mesh) for any particle to check if this particle intersects the _target_.  
It just will return true or false depending whether the particle intersects the target or not.    
  
```javascript
if (particle.intersectsMesh(anyMesh)) { 
  // change properties of particle
}
```
By default the check is carried out on the (AABB) bounding box of the mesh. When you wish to use the bounding sphere of the mesh add the parameter true.
```javascript
if (particle.intersectsMesh(mesh, true) {
    // change properties of particle
}; 
```

* [Playground Example - Recycle Particle Collision](https://www.babylonjs-playground.com/#UI95UC#20)
* [Playground Example - Mesh Collides into Cloud](https://www.babylonjs-playground.com/#UI95UC#21)

## PCS Management

As you can see above the `setParticles()` function is used in the BabylonJS render loop to provide behavior to the PCS.  

Available custom functions of PCS are:

| Function | Usage |
| ---- | ---- |
| initParticles() | sets the initial particle properties. |
| updateParticle(particle) | sets the particle properties. This function is called per particle by `PCS.setParticles()` |
| recycleParticle(particle) | re-sets the particle properties. This function is called conditionally per particle by `PCS.updateParticles()` |
| beforeUpdateParticles() | lets you do things within the call to `PCS.setParticles()` just before iterating over all the particles. |
| afterUpdateParticles() | lets you do things within the call to `PCS.setParticles()`  just after the iteration over all the particles is done. |

The pseudo-code for `setParticles` is

```javascript
function setParticles() {
  beforeUpdateParticles();
  for (var p = 0; p < nbParticles; p++) {
        updateParticles(particles[p]);
  }
  afterUpdateParticles();
}
```

The particle properties that can be set are :

Available properties of PCS are

| Property | Usage | Default |
| ---- | ---- |
| particles | An array containing all the particles. You iterate over this array in `initParticles()` function for instance. |  |
| nbParticles | The number of particles in the PCS. | |
| counter | A counter for your own usage | 0 |
| computeParticleRotation | Allows ( default) or prevents `setParticle` computing particle.rotation |true |
| computeParticleTexture | Allows ( default) or prevents `setParticle` computing particle.uvs | true | 
| computeParticleColor | Allows ( default) or prevents `setParticle` computing particle.color | true |
| computeBoundingBox | Allows or prevents (default) `setParticle` computing the PCS mesh bounding box | false |

The particle properties of color, uvs and rotation are set either during the addition phase or by using `initParticles` and then `setParticles`. Updating particle properties requires the use of `updateParticle` which is called by `setParticles`. Setting the **_compute_** properties to false prevents `setParticles()` from updating the value of the relevant particle property when it is called. Setting one or more of these to false can increase fps, especially with repeated call to `setParticles` within the render loop.

If you don't need your PCS any longer, you can dispose it to free the memory
```javascript
PCS.dispose();
PCS = null    // tells the garbage collector the reference can be also cleaned up
```

### Start and End Indexes for setParticles()
For performance reasons you may not want to compute the properties of all  the particles each frame. There are three optional parameters for `setParticles()` that you can use to choose a range of particles to compute or not : `start`, `end`, `update`  

Parameter|Definition|Default
---------|----------|-------------
start|_(number)_ the index from where to start to iterate in the `particles` array|0
stop|_(number)_ the index (included) where to stop to iterate in the<br>`particles` array|nbParticles - 1
update|_(boolean)_ to force the PCS mesh vertex buffer to be updated|true

If you pass a `end` value greater than `nbParticles` - 1, the iteration will stop at `nbParticles` - 1 to prevent you from trying to access to undefined elements.

Example 1 : to only update 10000 particles mesh every three frames  
* frame 1 : `setParticles(0, 3300, false)` computes everything for particles from 0 to 3300 and doesn't update the mesh.
* frame 2 : `setParticles(3301, 6600, false)` computes everything for particles from 3301 to 6600 and doesn't update the mesh.
* frame 3 : `setParticles(6601, 9999, true)` computes everything for particles from 6601 to 9999 and finally updates the mesh. 

In this playground change _invSpeed_ (line 29) to change speed.
* [Playground Example - Start and End For Animation Speed](https://www.babylonjs-playground.com/#UI95UC#25)

Example 2 : you could keep, say, the first 5000 particles as unused ones and compute the particle behavior only for the last 5000 in your global pool -  `setParticles(5000, 9999, true)` computes everything for particles from 5000 to 9999 and updates the mesh.  

* [Playground Example - Start and End For Part Animation](https://www.babylonjs-playground.com/#UI95UC#26)

## Hints and Tips 
A PCS can iterate over a very large number of particles during a call to `updateParticle` and it would be nice to avoid any apparent pauses in scene generation. The JavaScript Garbage Collector can start its cleaning in the middle of what you want to be a very smooth animation and produce lags. One possibility of lessening these is avoid creating new objects in the loops that execute often, where particles are created or updated.  

For example, consider a PCS with, say, 30000 particles where you change their velocities

```javascript
pcs.updateParticle = function(particle) {
    var accel = new BABYLON.Vector3(0, 0.5, 0);
    particle.velocity = particle.velocity.add(accel);
    // ...
}
```
will create two new `Vector3` objects each call, or 60 000 new objects over the course of the update.  

Instead, make your update loops reuse variables that are declared outside the loop, and don't call any methods inside the loop that create new objects, for example

```javascript
var accel = new BABYLON.Vector3(0, 0.5, 0);
pcs.updateParticle = function(particle) {
    particle.velocity.addInPlace(accel);
    // ...
}
```
A PCS also has a `vars` property, which is an object that you can use to store any variables you want to reuse. Any variables you store there will share the PCS lifecycle, and get cleaned up when you dispose it:

```javascript
pcs.vars.tempVector = new BABYLON.Vector3(0, 0, 0);
// ...
pcs.dispose();  // cleans explicitly all your PCS.vars !
```  

## Further Reading

### Basic - L1

[Particles Overview](/features/Particles)  

[Particles 101](/babylon101/particles)  

[How to Create Animated Particles](/how_to/Animate)  
[How to Use Sub Emitters](/how_to/Sub_Emitters)

[Solid Particle System](/How_To/Solid_Particles)

### Intermediate - L2
[How to Customize the Particle System](/how_to/Customise)


