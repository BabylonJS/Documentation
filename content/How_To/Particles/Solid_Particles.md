# Solid Particle System (SPS)

## Introduction



## Basic Usage

### SPS Creation

First you create an empty SPS and you add particles to it with the `addShape(mesh, nb)` method as many times you need.  
Its underlying mesh name will be the SPS name.

Then you build the mesh.  
Example :

```javascript
var SPS = new SolidParticleSystem("SPS", scene);
var sphere = BABYLON.MeshBuilder.CreateSphere("s", {}, scene);
var poly = BABYLON.MeshBuilder.CreatePolyhedron("p", { type: 2 }, scene);
SPS.addShape(sphere, 20); // 20 spheres
SPS.addShape(poly, 120); // 120 polyhedrons
SPS.addShape(sphere, 80); // 80 other spheres
sphere.dispose();
poly.dispose();

var mesh = SPS.buildMesh(); // finally builds and displays the real mesh
```

Now your SPS is visible as it is just built.  
If just want to create immutable things (not moving, not rotating, not changing their colors, etc) set somewhere in your scene, you would probably stop here.

However the SPS is ready to get a behavior.  
Once the behavior will be given (or not), you actually display the particles at their current updated positions with current properties with :

```javascript
SPS.billboard = true; // or false by default
SPS.setParticles();
```

`SPS.billboard` is a boolean (default _false_). If set to _true_, all the particles will face the cam and their _x_ and _y_ rotation values will be ignored.  
This is rather useful if you display only plane particles. However, if you deal only with 2D particles you should consider to use the [BJS Particle System](/babylon101/particles) or the [Sprite Manager](/babylon101/sprites) which are more performant in 2D computation.  
In order to display the SPS in billboard mode, you need to call `SPS.setParticles()` within the `scene.registerBeforeRender()` function.

Here is an example with plane particles in billboard mode : https://www.babylonjs-playground.com/#WCDZS#7  
The same but with plane particle rotations and no billboard mode : https://www.babylonjs-playground.com/#WCDZS#1  
The same with solid particles, boxes and tetrahedrons : https://www.babylonjs-playground.com/#WCDZS#2  
Another one with colors and rotations : https://www.babylonjs-playground.com/#2FPT1A#9

### Particle Management

The `setParticles()` function can be used in the BJS render loop.  
It is mandatory to use this function to update and display the mesh.

You can give your SPS a behavior by setting some custom functions :

- **`initParticles()`** : lets you set all the initial particle properties. You must iterate over all the particles by using the `SPS.nbParticles` property. The usage of this function is not mandatory.
- **`recycleParticle(particle)`** : lets you set a particle to be recycled. It is called per particle. The usage of this function is not mandatory.
- **`updateParticle(particle)`** : lets you set the particle properties. This function is called per particle by `SPS.setParticles()`. The usage of this function is not mandatory.
- **`beforeUpdateParticles()`** : lets you make things within the call to `SPS.setParticles()` just before iterating over all the particles. The usage of this function is not mandatory.
- **`afterUpdateParticles()`** : lets you make things within the call to `SPS.setParticles()` just after the iteration over all the particles is done. The usage of this function is not mandatory.
-

So to better understand how it works, here is a pseudo-code schema :

```javascript
var particles: SolidParticles[] = [array of SolidParticle objects];
function setParticles() {
    beforeUpdateParticles();                 // custom function
    for (var p = 0; p < nbParticles; p++) {
        updateParticles(particles[p]);         // custom function
    }
    updateTheWholeMesh();                   // does the WebGL work
    afterUpdateParticles();                 // custom function
}
```

So you could call `recycleParticle(particle)` in your own `updateParticle(particle)è function for instance :

```javascript
SPS.updateParticle = function(particle) {
  particle.velocity--;
  if (particle.velocity < 0) {
    particle.alive = false;
    SPS.recycleParticle(particle); // call to your own recycle function
  }
};
```

The particle properties that can be set are :

- **`position`** : Vector3 default = (0, 0, 0)
- **`rotation`** : Vector3 default = (0, 0, 0)
- **`rotationQuaternion`** : Vector3 default = undefined
- **`velocity`** : Vector3 default = (0, 0, 0)
- **`color`** : Vector4 default = (1, 1, 1, 1)
- **`scaling`** : Vector3 default = (1, 1, 1)
- **`pivot`** : Vector3 default = (0, 0, 0)
- **`uvs`** : Vector(4) default = (0,0, 1,1)
- **`isVisible`** : boolean default = true
- **`alive`** : boolean default = true
- **`translateFromPivot`** : boolean default = false
- **`parentId`** : integer, default = null  
- **`props`**: any, default = null

If you set a particle rotation quaternion, its rotation property will then be ignored.  
If you set your SPS in billboard mode, you should only set a `rotation.z` value.

Please note that all positions are expressed in the mesh **local space** and not in the World space.  
The particle `pivot` vector is the translation applied to the particle in its local space just before it is rotated. The rotation is always computed around the local space origin. This property is used like a translation matrix that you would apply to some mesh pivot matrix. By default, the particle is translated, then rotated, then translated back to its original location unless you set the particle property `.translateFromPivot` to `true` (default `false`). In this case, it's simply translated, then rotated and left at the translated location.  
Example : https://playground.babylonjs.com/#LXXL6Y#1  
1000 tetrahedron satellites orbiting around 1000 rotating boxes.  
Please note also that, even a particle is invisible (_isVisible_ set to _false_), its other property values can be updated and `updateParticle()` is called for every particle whatever it is visible or not.

In JavaScript, you can obviously also create your own properties like _acceleration: Vector3_ or _age_, in `initParticles()` for instance.  

```javascript
SPS.initParticles = function() {
  for (var p = 0; p < SPS.nbParticles; p++) {
    particles[p].age = Math.random() * 20;
  }
};
```
If you use TypeScript (or JavaScript), you can associate your own properties to each particle with the property `props` typed `any` and `null` by default :
```javascript
particle.props = {myProp1: val1, myProp2: val2};
```

You may also access to some read-only properties :

- **`idx`** : particle index
- **`shapeId`** : shape model ID

Actually each time you call the `SPS.addShape()` method, the related newly created particle set shapeID is returned.

```javascript
var plane = BABYLON.MeshBuilder.CreatePlane("", {}, scene);
var quadsID = SPS.addShape(plane, 20);
```

This is usefull if you want to apply a given behavior to some particle types only.  
<br/>

### SPS Management

You have access to some SPS properties :

- **`SPS.particles`** : this is the array containing all the particles. You should iterate over this array in `initParticles()` function for instance.
- **`SPS.nbParticles`** : this is number of particles in the SPS.
- **`SPS.counter`** : this is a counter for your own usage. It's not set by any SPS default functions.

Here again, you can add your own properties like _capacity_ or _rate_ if needed.

If you don't need some given features (ex : particle colors), you can disable/enable them at any time (disabling a feature will improve the performance) :

```javascript
SPS.computeParticleRotation = false; // prevents from computing particle.rotation
SPS.computeParticleTexture = false; // prevents from computing particle.uvs
SPS.computeParticleColor = false; // prevents from computing particle.color
SPS.computeParticleVertex = false; // prevents from calling the custom updateParticleVertex() function
```

All these properties, except `SPS.computeParticleVertex`, are enabled set to _true_ by default. These affect the `SPS.setParticles()` process only.  
If these properties are set to _false_, they don't prevent from using the related feature (ie : the particles can still have a color even if `SPS.computeParticleColor` is set to _false_), they just prevent from updating the value of the particle property on the next `setParticle()` call.  
Example : if your particles have colors, you can set their colors wihtin the `initParticles()` call and you can call then once the `setParticles()` method to set these colors. If you need to animate them later on and these colors don't change, just set then `SPS.computeParticleColor` to _false_ once before runing the render loop which will call `setParticles()` each frame.  
If you are familiar with how BJS works, you could compare the SPS and its mesh creation to some classical BJS mesh creation (vertex and indice settings) and the particle management to the World Matrix computation (rotation, scaling, positioning).

Note you can also use the standard BJS mesh _freezeXXX()_ methods if the SPS mesh is immobile or if the normals aren't needed :

```javascript
SPS.mesh.freezeWorldMatrix(); // prevents from re-computing the World Matrix each frame
SPS.mesh.freezeNormals(); // prevents from re-computing the normals each frame
```

If you don't need your SPS any longer, you can dispose it to free the memory

```javascript
SPS.dispose();
SPS = null; // tells the GC the reference can be cleaned up also
```

## Summary

The SPS is behavior-agnostic. This means it doesn't know how the particles will move, rotate, if they have a mass, if there are forces, etc. You have to see it like a big mesh that you can create (`buildMesh`) from many shape models, some BJS existing meshes, (`addShape`) that will be its solid particles. It provides some methods to access then and to manage these solid particles.

So the initial stuff to do is to create the SPS, then to add as many shapes you need and at last to build the SPS mesh.

Once you've done it, you need to manage your solid particles.

The way to fix the particle status and then to display them at this status is to call `SPS.setParticles()`.  
Each time you call `setParticles()` the particles are rendered at their current status. Easy, isn't it ?

So three steps :

- SPS and its mesh creation
- compute your particle behavior
- call setParticles() to update the mesh and draw it

Just remember that, once the mesh is build, only **`setParticles()`** does then the job : updates the mesh VBO and draws it.

To help you to update each particle status, `setParticle()` will call for each particle `SPS.updateParticle(particle)`.  
This function doesn't do anything by default, so it is the place were you can implement your particle behavior, with physics if you want. It is passed each particle object in turn, which you can set its initial properties (position, rotation, rotationQuaternion, scaling, color, uvs, velocity) or add and set your own if your logic needs it (age ? mass ? etc).  
So `updateParticle()` just changes the particle data, not the mesh itself. The `setParticles()` process updates the mesh. Fortunately, `setParticles()` calls `updateParticle(particle)` for you.

If you want to set an initial status, different from the live behavior that you would implement in `SPS.updateParticle(particle)`, you can use `SPS.initParticles()`.  
This function doesn't do anything, you have to implement it.  
It doesn't draw the mesh, it just changes the particle initial status that will be taken in account by the next `SPS.setParticle()` call.
The same thing with `SPS.recycleParticle(particle)` what is not called automatically and that you have to implement by your own and to call when you need.

Remember finally that there are also some other means to deal with particles in BJS like the [Particle System](/babylon101/particles) or the [Sprite Manager](/babylon101/sprites) :

The Particle System is the most performant in terms of speed and of particle quantity.  
The particles are 2D quads, have all the same texture and colour. They ever face the screen, so they can have only a z-axis rotation. They aren't z-sorted and aren't pickable.  
This sytem provides a behavior : emitter, recycler, updater and many particle properties to manage their individual status (position, rotation, lifetime, size, etc).

The Sprite Manager is intended to manage sprites. They can be used as particles if needed as the Manager is also very performant.  
The sprites are 2D quads always facing the screen, so they have only a z-axis rotation also. You can adjust from a given texture a different image per sprite and update it at will (sprite atlas). The sprites are z-sorted and are pickable.  
The Manager doesn't provide a behavior but you can access to many properties to set each sprite status.

The SPS is a BJS mesh.  
Its particles are just parts of this big mesh. They can be planar, from a simple triangle to any planar polygon, or/and 3D solid. They face the screen only in `billboard` mode (maybe you should use the SPS in billboard mode only if the two previous means don't yet fit your needs as they are more performant for 2D). You can merge 2D and 3D particles in the same SPS and give them rotation in the space. Each particle can have its own color (vertex color) and own image from a single common texture. They are z-sorted and alpha-blended like any other BJS mesh. They are also pickable. They even have normals and reflect the light. Actually, all the features accessible to a mesh are accessible to the SPS.  
The SPS provides no behavior but only methods to access and to set each particle.

About transparency and mesh rendering, you could read this [documentation](/resources/Transparency_and_How_Meshes_Are_Rendered).

In order to have only one draw call to the GPU, these three systems use only one material/texture for all their particles.  
<br/>
<br/>

## Advanced Features

### Create an immutable SPS

You may have to create many similar objects in your scene that won't change afterwards : buildings in the distance, asteroids, scraps, etc. It may thus be useful to use the SPS to set only one mesh in your scene, so one draw call for the rendering.  
Example : https://www.babylonjs-playground.com/#2FPT1A#5

You can achieve this by two different ways.

- You can just build your SPS as explained before and then call just once `setParticles()`, before and outside the render loop, to set your particles where and how you need.  
  This method is quite simple. Though, in order to allow you to set the final particle locations, the SPS mesh is built as `updatable` by default. This means its vertex buffer isn't passed once for all to the GPU, but is cached, waiting for a hypothetical further change.  
  So this is a simple solution if you don't have many draw calls to handle for the other really moving or changing meshes of your scene.  
  Remember also that, if you need to display your SPS in billboard mode, this is the only way to do it and you'll have to call `setParticles()` in the render loop also even if the particles don't move.

- Else you can build your mesh as non _updatable_.  
  Actually the SPS contructor expects a parameter `updatable` what is _true_ by default.  
  So, to build a non-updatable mesh, just call explicitly :

```javascript
var SPS = new SolidParticleSystem(name, scene, { updatable: false });
```

As the mesh can't be updated now, `setParticles()` won't have any effect any longer : don't call it, you'll spare some CPU. Actually the `particles` array is not even populated !  
No particle management function called **after** `SPS.buildMesh()` will then have any effect.  
Note that the particles won't move but you can still move, scale or rotate the whole mesh.

So how to set the initial particle positions, colors, uvs, scales, and so on if the mesh can't be updated ?

To achieve this, you need to change the mesh at construction time, when adding the shapes.  
You will have to define your own function to set these particle (what don't exist at this time) properties by modifying the way the shapes are added.  
Actually, you can pass to `SPS.addShape()` an exra parameter which is your particle setting function.  
This parameter is an object with the property `positionFunction` to what you will assign your custom function.

```javascript
SPS.addShape(mesh, nb, { positionFunction: myCustomFunction });
```

Your own function will be called, for a given shape, as many times as the wanted number of particles for this shape. It will be passed two parameters : a _particle_ object and its current position in the total number wanted for this shape.  
So your function must have this kind of signature :

```javascript
var myBuilder = function(particle, i, s) {
  // particle is the current copy of the shape, the i-th one in the SPS and the s-th one in its shape
};
```

This _particle_ object has the following properties :

| property           | type       | default                                                     |
| ------------------ | ---------- | ----------------------------------------------------------- |
| position           | Vector3    | (0,0,0)                                                     |
| rotation           | Vector3    | (0,0,0)                                                     |
| rotationQuaternion | Quaternion | null, if _rotationQuaternion_ is set, _rotation_ is ignored |
| scaling            | Vector3    | (1,1,1)                                                     |
| pivot              | Vector3    | (0,0,0)                                                     |
| color              | Color4     | null                                                        |
| uvs                | Vector4    | (0,0,1,1)                                                   |

You can also read the current particle `shapeId` value with the property
- **`shapeId`** : integer  
The expected usage is thus for instance :  

```javascript
var myBuilder = function(particle, i, s) {
  // particle is the current particle
  // i is its global index in the SPS
  // s is its index in its shape, so here from 0 to 149
  particle.rotation.y = s / 150;
  particle.position.x = s - 150;
  particle.uvs = new BABYLON.Vector4(0, 0, 0.33, 0.33); // first image from an atlas
  particle.scaling.y = Math.random() + 1;
}
var box = BABYLON.MeshBuilder.CreateBox('b', {}, scene);
var SPS = new BABYLON.SolidParticleSystem('SPS', scene);
SPS.addShape(box, 150, {positionFunction: myBuilder)}; // myBuilder will be called for each of the 150 boxes
var mesh = SPS.buildMesh();
```

In this former example, each box particle will have its own rotation, position, scaling and uvs set once for all at construction time. As the mesh is not updatable, the particles are then not manageable with `setParticles()`.  
You've got here a real immutable mesh. You can still translate it, rotate it, scale it globally as any other mesh until you freeze its World Matrix.  
Example : a town with 80 000 buildings https://www.babylonjs-playground.com/#2FPT1A#36

Note that this feature (modifying the mesh at construction time) is not directly related to the mesh `updatable` parameter. This means you can use it even with a default _updatable_ mesh although it is easier to set the particles the classical war with `setParticles()`.

**Going further in immutable SPS**  
You've just seen how to modify for ever the SPS mesh at creation time in order to set the particles to your own initial positions, rotations, colors, etc by using the `positionFunction` property with your custom function.  
You can also modify the shape of each particle in the SPS mesh at creation time the same way.  
You will then to use the `vertexPosition` property, just like you used the `positionFunction` property, by defining your own function to set each vertex of each particle from its original value.  
Your function will be then be called once by `SPS.buildMesh()` for each vertex of each particle object as defined in the former part.

```javascript
var myVertexFunction = function(particle, vertex, i) {
  // particle : the current particle
  // vertex : the current vertex, a Vector3
  // i : index of the vertex in the particle shape
  vertex.x *= Math.random() + 1;
};
SPS.addShape(box, 150, { vertexFunction: myVertexFunction }); // the 150 boxes will have their vertices moved randomly
SPS.buildMesh();
```

Of course you can use the both properties together :

```javascript
SPS.addShape(box, 150, {
  vertexFunction: myVertexFunction,
  positionFunction: myPositionFunction
});
```

Example with asteroids : https://www.babylonjs-playground.com/#2FPT1A#2

Note that you can also create some immutable objects rendered with only one draw call by using either `MergeMesh()` ([tutorial](/How_To/How_to_Merge_Meshes)), etheir [Instances](/How_To/How_to_use_Instances).
<br/>
<br/>

### Start and End indexes for setParticles()

If you manage a big SPS with dozens of thousands particles, you may want, for performance reasons, not to compute all the new status of all the particles each frame. `setParticles()` expects three optional parameters to help you to choose what to compute or not : `start`, `end`, `update`

| parameter | definition                                                                        | default value   |
| --------- | --------------------------------------------------------------------------------- | --------------- |
| start     | _(number)_ the index from where to start to iterate in the `particles` array      | 0               |
| stop      | _(number)_ the index (included) where to stop to iterate in the `particles` array | nbParticles - 1 |
| update    | _(boolean)_ to force the SPS mesh vertex buffer to be updated                     | true            |

If you pass a `end` value greater than `nbParticles` - 1, the iteration will stop anyway at `nbParticles` - 1 to prevent you from trying to access to undefined elements.

Example 1 : you may want to update your 10K particle mesh only every three frames

- frame 1 : `setParticles(0, 3300, false)` computes everything for particles from 0 to 3300 and doesn't update the mesh.
- frame 2 : `setParticles(3301, 6600, false)` computes everything for particles from 3301 to 6600 and doesn't update the mesh.
- frame 3 : `setParticles(6601, 9999, true)` computes everything for particles from 6601 to 9999 and finally updates the mesh.  
  10,000 boxes updated per bunch of 3500 here : https://www.babylonjs-playground.com/#2V1C4Z#12

Example 2 : you could keep, say, the first 5000 particles as unused ones and compute the particle behavior only for the 5000 lasts in your global pool.

### Colors and UVs

In the SPS, you can set a color or/and a different image per particle.

#### Colors

The colors are the Vertex colors, the color related to the vertices themselves. This means that, if you also use a colored material, the vertex colors and the material colors will mix nicely.  
Unless you want to change the particle color, the particle will be given at creation the vertex color of their model if any. If the model has different vertex color per face (example : [a box with different face colors](/How_To/CreateBox_Per_Face_Textures_And_Colors)), these colors are saved and all the particles built with this model will look like the model.  
However, if you change the color of particle, the particle is then given this lone color. In other words, you can only set one single color for each particle (no more face color).  
The particle colors are `BJS Color4` object.  
You can set them with the `particle.color` property. Please note that if you want to set this property at SPS creation time with the `positionFunction` parameter (`new SolidParticleSystem("name", {positionFunction: myColorSettings}`), the particle colors are initially `null`, since if you want to set it within the `updateParticle(particle)` method the particle colors are either the model colors if any, either white `Color4(1, 1, 1, 1)`.  
So, in `positionFunction()` :

```javascript
particle.color = new BABYLON.Color4(red, green, blue, alpha);
```

and in `updateParticle()` :

```javascript
// in order to not allocate new objects per particle each call
particle.color.r = red;
particle.color.g = green;
particle.color.b = blue;
particle.color.a = alpha;
```

If you want to set an alpha value, don't forget to enable the alpha channel for vertex colors :

```javascript
SPS.mesh.hasVertexAlpha = true;
```

#### UVs

The SPS uses only one material, so only one texture.  
However you can choose, per particle, which part of the texture you want to apply to this particle with the `uvs` particle property.  
This property is a `Vector4` and is initially set to (0, 0, 1, 1) for each particle (or to initial UVs values if the model had UVs per face), meaning the whole texture image, from its left lower corner (0, 0) to its right upper corner, is to be applied to each particle.  
If you want apply just a portion of the texture, located at, say, 20% from the image width, 10% from its height for the left lower corner, and 60% from its width and 30% from this height for the right upper corner, you just set the `uvs` property like this :

```javascript
particle.uvs.x = 0.2; // left lower corner : 20% image width
particle.uvs.y = 0.1; // left lower corner : 10% image height
particle.uvs.z = 0.6; // right upper corner : 60% image width
particle.uvs.w = 0.3; // right upper corner : 30% image width
```

This can be used as well either in the `positionFunction` call at SPS creation time, either in `updateParticle()`.

Unlike for the colors, the model UVs are saved whatever the model had per face UVs or not.  
This allows to use not only a texture atlas for the particles, but also a texture atlas for the model then inside the particle atlas because you use only one texture in final.

Explanation :

https://www.babylonjs-playground.com/#ICZEXW#82  
This example show the standard usage of the box per face texture as described here : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors  
Note that, in this example, we set 4 sprites per face, not 1, just because we will use the same texture for particles then. In a real case, we would probably first use a texture for the model, then put this texture in a bigger one.  
Now let's create a SPS, let's add particles from this box model and let's set each particle some `.uvs` values : half the widht and height size of the initial uvs value.  
https://www.babylonjs-playground.com/#ICZEXW#81  
As we can check, each particle is still given a different texture per face.

Like for any other mesh, you can also enable the texture transparency with :

```javascript
SPS.mesh.material.diffuseTexture.hasAlpha = true;
```

Or even use the alpha channel of the texture image :

```javascript
SPS.mesh.material.useAlphaFromDiffuseTexture = true;
```

Please read this [documentation](/resources/Transparency_and_How_Meshes_Are_Rendered) for transparency concerns.

Color and UVs example : https://www.babylonjs-playground.com/#WCDZS#8  
Texture with alpha : https://www.babylonjs-playground.com/#WCDZS#9

<br/>

### Particle parenting

Each particle can be given another particle as a parent.  
The parent is required to be created before the current particle, this means the parent has to have a lower index Id (`particle.idx`) than the current particle. So the first particle in the pool (`idx = 0`) can't have a parent. To give a parent to a particle, just set its property `.parentId` to the parent index Id value.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
}
```

To un-parent a particle, just set `.parentId` back to `null` what is the default value.  
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

Examples :  
A green box rotating around its pivot parented to a sliding red box : https://playground.babylonjs.com/#KS9V2E  
2000 boxes parented per 20 segment stems : https://playground.babylonjs.com/#V7V1RS

##### Note

In a standard SPS, the particle index `particle.idx` and the particle identifier `particle.id` have the same value.  
In an expandable SPS (see below), when particles are removed only the particle identifier `particle.id` keeps unchanged whereas the particle index may change.  
So, when using an expandable SPS, make sure to set a particle parent with the parent identifier and make sure that this parent still exists.

```javascript
if (otherParticle) {
  particle.parentId = otherParticle.id; // not otherParticle.idx
}
```

<br/>

### Update Each Particle Shape

- `SPS.updateParticleVertex()` _usage_ :  
  It happens before particle scaling, rotation and translation and it allows to update the vertex coordinates, color and UV of each particle.  
  This function will be called for each vertex of each particle and it will be passed the current particle, the current vertex and its current index in the particle shape.  
  The vertex is a SolidParticleVertex object, so you can access or set its properties :
  ```javascript
  vertex.position: Vector3 (x, y, z)
  vertex.color: Color4 (r, g, b, a)
  vertex.uv: Vector2 (x, y)
  ```

```javascript
SPS.computeParticleVertex = true; // false by default for performance reason
SPS.updateParticleVertex = function(particle, vertex, v) {
  // particle : the current particle object
  // vertex : the current vertex, a solidParticleVertex object
  // the index of the current vertex in the particle shape
  // example :
  if (particle.shapeID == 1) {
    vertex.position.x *= Math.random() + 1;
    vertex.position.y *= Math.random() + 1;
    vertex.position.z *= Math.random() + 1;
    vertex.color.r = Math.abs(Math.sin(v));
    vertex.color.g = 1 - vertex.color.r
    vertex.uv.x = particle.idx + v;
    vertex.uv.y = vertex.uv.x;
  }

};
```

Note well that this vertex update is not stored (the particle shape isn't modified) but just computed in the next call to `setParticles()`. So there is no value accumulation : the vertex coordinates, colors or UVs are always the initial ones when entering this function.  
Note also that the shape reference for each particle is the original shape of the mesh model you passed in `addShape()`, even if you had passed also a custom `vertexFunction` (see in the part : "Going furhter in immutable SPS").  
The good news is that the very same function can be use for `SPS.updateParticleVertex` and for the custom `vertexFunction` expected by `addShape()`.  
So to better understand how it works, here is another global pseudo-code schema :

```javascript
var particles: SolidParticles[] = [array of SolidParticle objects];
function setParticles() {
    beforeUpdateParticles();                 // your custom function
    for (var p = 0; p < nbParticles; p++) {
      var particle = particles[p];
      updateParticles(particle);             // your custom position function
      for(var v = 0; particle.vertices.length; v++) {
        var vertex = particle.vertices[v];
        updateParticleVertex(particle, vertex, v);   // your ustom vertex function
        computeAllTheVertexStuff();
      }
    }
    updateTheWholeMesh();                   // does the WebGL work
    afterUpdateParticles();                 // your ustom function
}
```

Example : https://www.babylonjs-playground.com/#1X7SUN#11    
or dancing glow-worms : https://www.babylonjs-playground.com/#1X7SUN#12  

### Pickable Particles

You can set your particles as pickable with the parameter `isPickable` (default _false_) when creating your SPS :

```javascript
var SPS = new BABYLON.SolidParticleSystem("SPS", scene, { isPickable: true });
```

This will set the underlying mesh as pickable and populate two arrays called `SPS.pickedParticles` and `SPS.pickebBySubMesh`. So, don't set your SPS as pickable if you don't need it to be, this will save much memory.  
In order to retrieve the particle picking data from these arrays, use the method `SPS.pickedParticle(pickingInfo)` that returns an object with these properties :

- `idx` : the picked particle idx
- `faceId` : the face index of the picked particle (counted within this particle)

Example :

```javascript
var SPS = new BABYLON.SolidParticleSystem("SPS", scene, { isPickable: true });
// add shapes, build the mesh, init particles, etc
SPS.setParticles(); // initial SPS draw
SPS.refreshVisibleSize(); // force the BBox recomputation
scene.onPointerDown = function(evt, pickResult) {
  var meshFaceId = pickResult.faceId; // get the mesh picked face
  if (meshFaceId == -1) {
    return;
  } // return if nothing picked
  var picked = SPS.pickedParticle(pickResult); // get the picked particle data : idx and faceId
  var idx = picked.idx;                         
  var p = SPS.particles[idx];                   // get the actual picked particle
  p.color.r = 1; // turn it red
  p.color.b = 0;
  p.color.g = 0;
  p.velocity.y = -1; // drop it
  SPS.setParticles();
};
```

The SPS pickability is directly related to the size of its bounding box (please read 'SPS Visibility' part). So, in order to make sure your particles will be pickable, don't forget to force, at least once, the bounding box size recomputation once the particles are set in the space with `setParticles()`.  
Pickable particle example (no SPS update in the render loop) : https://www.babylonjs-playground.com/#2FPT1A#351    
Pickable particle example (particle rotation) : https://www.babylonjs-playground.com/#2FPT1A#352  

### Digest a Mesh

There is another way than adding shapes of meshes used as models to populate the SPS : you can directly "digest" a mesh.  
To digest a mesh means that the SPS will decompose this mesh geometry and use all its facets to generate the particles. So, by default, a digested mesh generates as many particles as the mesh number of facets.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.digest(model);
model.dispose();
SPS.buildMesh();
```

Note that in this case, all the generated particles have their property "position" set with some values and no more to (0, 0, 0).  
This method is obviously compatible with `addShape()` and you can even call it several times with the same model, or different models, in the same SPS.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.addShape(boxModel, 50);
SPS.digest(model);
SPS.addShape(sphereModel, 20);
SPS.digest(model, { number: 10 });
model.dispose();
sphereModel.dispose();
boxModel.dispose();
SPS.buildMesh();
```

This method accepts three optional parameters : `facetNb`, `delta` and `number`

- `facetNb` is the number of the mesh facets required to build each particle. By default, the value is set to 1, this means each particle will just be a triangle (a mesh facet). Set to 2 and you'll probably get quads instead.  
  The number of generated particles depends then on the mesh initial number of facets and on the `faceNb` value.  
  This parameter is overriden if the parameter `number` is set.
- `delta` (default 0), used with `facetNb`, allows to generate each particle with a random size between _facetNb_ and _facetNb + delta_ facets.
- `number` is the wanted number of particles. `digest()` divides then the mesh into `number` particles of the same size in term of the number of facets used per particle.  
  If `number` is greater than the total number of mesh facets, then this total number is used for the value of `number`.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.digest(model, { facetNb: 10 }); // 10 facets per particle whatever their final number
SPS.digest(model, { number: 200 }); // 200 particles whatever their final size
SPS.digest(model, { facetNb: 10, delta: 30 }); // between 10 and 40 facets per particle, randomly, whatever their final number
model.dispose();
SPS.buildMesh();
```

Example (click on the torus knot) : https://www.babylonjs-playground.com/#HDHQN

### SPS Visibility

To render the meshes on the screen, BJS uses their bounding box (BBox) : if the BBox is in the frustum, then the mesh is selected to be rendered on the screen. This method is really performant as it avoids to make the GPU compute things that wouldn't be visible. The BBox of each mesh is recomputed when its World Martix is updated.  
When you create a SPS, unless you use the `positionFunction` at creation time, all its particles are set by default at the position (0, 0, 0). So the size of the SPS mesh is initially the size of its biggest particle, so it is for its BBox.  
If you animate your particles without updating the SPS mesh World Matrix (ex : the whole SPS doesn't move, rotate or scale), its BBox may keep far more little than the current space occupied by the moving particles. So, if this little BBox gets out of the screen (cam rotation for instance), the whole SPS can then disappear at once !

In order to manage the SPS visibility, you have some ways : the methods `SPS.refreshVisibleSize()` or `SPS.setVisibilityBox(size)` and the properties `SPS.isAlwaysVisible` (default _false_),`SPS.computeBoundingBox` (default _false_) or `SPS.isVisibilityBoxLocked` (default _false_)

- `SPS.refreshVisibleSize()` : updates the SPS mesh BBox size on demand. This is an intensive computation, so it's better not to use it in the render loop each frame. You could call it once the mesh has reached its maximum size for instance. This the method to use if you have a SPS located its in own space somewhere in your scene, like a particle explosion, a fountain, etc. Remember when using this method that it iterates over each mesh vertices. So if your mesh has 20K vertices what is usual with a SPS, it needs 20K iterations.

- `SPS.isAlwaysVisible` : if _true_, forces the SPS mesh to be computed by the GPU even if its BBox is not visible. This property is to use when the player evolves inside the SPS (maze, asteroid field) or if the SPS is always bigger than the visible part on the screen. Note that setting it to _true_ doesn't recompute the BBox size, so if you need for some reason (pickability, collisions, etc) to update the BBox, you have to call also at least once `SPS.refreshVisibleSize()`.

- `SPS.computeBoundingBox` (default _false_) : if set to true, the next calls to `setParticles()` will compute the mesh bounding bow within the same loop than the particle computations. This means this is much more faster than calling `refreshVisibleSize()` and you can use it in the render loop.  
  The reason `refreshVisibleSize()` and `SPS.computeBoundingBox` exist together is that `refreshVisibleSize()` can be called at any time and doesn't require to call `setParticles()` whereas `SPS.computeBoundingBox` is taken in account for the BBox computation only from a call of `setParticles()`.  
  Note that `SPS.computeBoundingBox` can be set to _true_ or _false_ at any time and will affect only the next calls of `setParticles()`.

- `SPS.setVisibilityBox(size)` : sets a fixed size to the SPS Mesh BBox whatever its own real size. This may be useful when you know in advance the limits that the visible particles won't overrange. Note that setting a value doesn't prevent any further BBox recomputation.

- `SPS.isVisibilityBoxLocked` : if _true_, the SPS mesh BBox won't be computed any longer until it is reset to _false_.

So what method to use ?  
It depends on your needs.  
If your SPS is ever everywhere around the camera environment like an asteroid field, you may use `SPS.isAlwaysVisible`.  
If you need a variable visibility or the pickability, you'll need to set at least once the bounding box.  
So if your SPS stays within some fixed bounds that you don't know the values, you may use `SPS.refreshVisibleSize()` at least once when the SPS has reached these limits and then lock the visibility box.  
If the SPS keeps within some known limits, then it is better to use `SPS.setVisibilityBox(size)` with the right value and then to lock the visibility box.  
At last, if you still need pickability or variable visibility, and don't know how your SPS will evolve, then you might set `SPS.computeBoundingBox` to true.

### Transparency Concerns

As you know, the SPS is a standard mesh.

Applying the transparency to a standard mesh leads to well-known issues, not when visualizing other opaque or transparent meshes through this current transparent mesh, but when visualizing some parts of this transparent mesh through itself.  
Indeed, when passing the mesh geometry to the GPU, this one draws the mesh in the order the mesh facets are sorted in the `indices` array : first triangle, second one then, etc ... whatever the position of the camera.  
The shader only respects the geometry order and this geometry is fixed.

As the SPS is a standard mesh, it has the same issue when dealing with transparent particles (rotate the camera) : https://playground.babylonjs.com/#EPBTB7#3

A parameter allows to sort the internal mesh geometry live according to the current camera position : https://playground.babylonjs.com/#EPBTB7#2

It sorts the SPS particles only, not all the facets, for performance reasons.

To enable it, just create your SPS with the parameter `enableDepthSort` to `true`. By default, each next call to `setParticles()` will then sort the particles according to the camera global position.

If for some reasons (immobile camera and sps), you want to stop (or reactivate) the sort on the next calls to `setParticles()`, just set the property `sps.depthSortParticles` to `false` (or `true` to reactivate it) .

Note well that is better to not enable the particle depth sort and the [facet depth sort](//doc.babylonjs.com/how_to/how_to_use_facetdata#facet-depth-sort) in the same time, else the sort process wil be executed twice with no final gain.  
So just choose what kind of sorting you need : at particle level (faster) or at facet level (more accurate).

Note also that the particle sort **can't work** with the MultiMaterials.

```javascript
// create a particle depth sort enabled SPS
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  enableDepthSort: true
});

// then later, only do ...
sps.setParticles(); // and the particle are depth sorted each call

// We can skip the sorting at any time (or reactive it) : sps and camera not moving anymore
sps.depthSortParticles = false; // true by default when enableDepthSort is set to true
```

**Notes :**

- This feature is CPU intensive, so call `setParticles()` with `depthSortParticles` set to true only when needed.
- This feature requires the SPS to be updatable, so it can't work with an immutable SPS.
- This features needs to sort all the particles from the pool, so it won't lead to weird results if you call `setParticles(start, end)` on some particles only.

### Particle Intersections

The SPS is physics agnostic. This means you need to implement your own particle behavior if you want to animate them.  
For this, you may need to check if the solid particles intersect or not other ones or other meshes in the scene. Example : you would know if your particles collide against an obstacle and then make them bounce back.  
The SPS provides a simple way to deal with particle intersections. As this feature consumes more memory and CPU, it's disabled by default.  
Enable it explicitly with the parameter `particleIntersection` when creating your SPS :

```javascript
var SPS = new SolidParticleSystem("sps", scene, { particleIntersection: true });
```

Then you can simply call the method `intersectsMesh(<SolidParticle | AbstractMesh>target)` of any solid particle to check if this particle intersects the _target_.  
It just will return true or false if the particle intersects or not the target.

```javascript
// for instance, in your SPS.updateParticle(p) function : particle / particle
if (p.intersectsMesh(otherParticle)) { // change p velocity vector }
```

You can pass the method `intersectsMesh()` either a solid particle object, either a standard BJS mesh. Both work the same.

```javascript
// for instance, in your SPS.updateParticle(p) function : particle / mesh
if (p.intersectsMesh(anyMesh)) { // change p velocity vector }
```

Beware that invisible solid particles can still intersect, exactly like meshes do. So it's up to you to test the particle visibility (`isVisible`), if you want to exclude it from an intersection computation.

If you prefer, you can even use the `AbstractMesh` method `intersectsMesh()` and pass it a solid particle.

```javascript
// for instance, in your SPS.updateParticle(p) function : mesh / particle
if (someMesh.intersectsMesh(p)) { // change p velocity vector }
```

Under the hood, when creating a SPS with `particleIntersection`, a bounding box and a bouding sphere are given to each solid particle.  
For performance reasons, the particle intersections are always computed the fastest way, it is to say with Axis Aligned Bounding Boxes (AABB). [More Details on Intersection Collisions](/babylon101/Intersect_Collisions_-_mesh)

If you use the `AbstractMesh` `intersectsMesh()` method, what allows to force OBB computation (precise mode), only the mesh bounding box will be rotated, not the particle one, so the intersection detection will be just a bit better than in AABB mode.  
The precise mode has a CPU significant cost, so it's not recommended to use it with solid particles.

```javascript
// for instance, in your SPS.updateParticle(p) function : precise mode, mesh / particle
if (someMesh.intersectsMesh(p, true)) { // change p velocity vector }
```

Example : https://www.babylonjs-playground.com/#10RCC9

For a SPS having thousands of particles, computing the bounding box for each particle each frame is still a heavy CPU operation. So, if you need more performance and if you don't mind about the intersection accurary, you may choose to limit the computation to the particle bounding sphere only (a bounding box requires 8 iterations per particle, one for each box vertex) by using the optional boolean parameter `boundingSphereOnly` (default _false_) at SPS creation.

```javascript
var SPS = new SolidParticleSystem("sps", scene, {
  particleIntersection: true,
  boundingSphereOnly: true
});
```

Example : https://www.babylonjs-playground.com/#2BXZC#2

As you may know, a mesh -so a solid particle- is inside its bounding box and its bounding box is inside its bounding sphere. So the bounding sphere is bigger than the bounding box, what is bigger than the mesh.  
If your particles look like some some tiny spherical objects and if you use the `boundingSphereOnly` mode, you would probably like to tweak the bounding sphere to make it closer to the embedded particle.  
You can then use the parameter `bSphereRadiusFactor`, a float number that is multiplied by the current bounding sphere radius.  
Imagine that your particle is a spherical shape with a radius of R. Its bounding sphere radius is then by default : R \* sqrt(3). So if you multiply the bounding sphere radius by 1 / sqrt(3), the bounding sphere will get the same radius than the particle one and both will exactly match.

```javascript
var SPS = new SolidParticleSystem("sps", scene, {
  particleIntersection: true,
  boundingSphereOnly: true,
  bSphereRadiusFactor: 1 / Math.sqrt(3)
});
```

Example : https://www.babylonjs-playground.com/#29F0EG#2

At last, in case you are using the `boundingSphereOnly` mode, just remember that the particle bounding box isn't computed, only its bouding sphere, so don't test the intersection from a **mesh** object :

```javascript
// boundingSphereOnly case :
mesh.intersectsMesh(particle); // won't give the right result
particle.intersectsMesh(mesh); // will give the right bounding sphere intersection
```

### Particle In Frustum

When the SPS is enabled to manage particle intersections, each particle is given a bounding box and a bouding sphere.  
You can then check whether a particle intersects the camera frustum with the method `particle.isInFrustum(frustumPlanes, [cullingStrategy])` like you would do with meshes.

```javascript
scene.updateTransformMatrix(); // force the plane computation once
var frustumPlanes = scene.frustumPlanes;
// then in some loop ...
if (!particle.isInFrustum(frustumePlanes)) {
  p.alive = false;
}
```

Contrary to the meshes, you can't use `.isInFrustum()` to cull particles that wouldn't be rendered, because all the particles are always rendered, meaning passed to the GPU (even the invisible ones). You can only use this test to customize the process applied to the particles.  
Example : you would want to not compute the particles outside the frustum to gain some performance.  
The test done by `isInFrustum()` has also its own CPU cost, so it's probably not a good idea to run it on thousand particles each frame.  
Actually, it's up to you to choose if the test is worth it for your own need.  
Let's imagine a case where each particle computation is really intensive (example : when using `computeParticleVertex`). In this case, the frustum test could be faster than the particle computation, so it would be interesting to use it to disable the particle computation for particles outside the frustum.  
In this following example, the computation charge is directly related to the number of vertices and shouldn't change whatever the camera direction. But, as we disable the particles outside the frustum, if you rotate the camera to isolate one or two worms in the camera field, you can check the performance gain  
https://www.babylonjs-playground.com/#BKX11Q#2    
Note : the default culling strategy used in the particle frustum test is the fastest (`BoundingSphereOnly`).  
You can change it at will for each particle by using the same values than the static properties `CULLINGSTRATEGY_XXX` ones of the `AbstractMesh` class.

### Create an expandable SPS

Until now, the SPS that you've created has a fixed number of particles once for all because it's the most performant way to use it.  
In some cases, it may be useful to add or to remove some particles from the SPS after its creation, because they are newly needed or not needed any longer for the rest of the time.  
In this case, you can create an expandable SPS with the optional parameter `expandable: true` (default `false`).

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
```

#### Adding particles

If you want to add some more particles to the existing ones, then just use again the method `addShape()` as many times as necessary. Then call `buildMesh()` to rebuild the SPS geometry with these newly added particles.

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 100); // adds 100 particles from model1
sps.buildMesh();

// ... further in the code, when needed
sps.addShape(model2, 100); // adds 100 new particles from model2
sps.addShape(model3, 200); // and 200 particles from model3
sps.buildMesh(); // updates the SPS mesh geometry from the last particle additions
sps.setParticles();
```

Example : https://playground.babylonjs.com/#X1T859  
Each mouse click adds 20 new depth sorted particles.

#### Removing particles

If you want to remove some particles from the SPS, then use the method `removeParticles(start, end)` where `start` and `end` are the starting and ending indexes of the particles.  
This method returns an array populated with the removed particles.

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1000); // adds 1000 particles from model1
sps.buildMesh();

// ... further in the code, when needed
var removed1 = sps.removeParticles(700, 999); // removes the last 300 particles
var removed2 = sps.removeParticles(0, 9); // removes the first 10
sps.buildMesh(); // update the SPS mesh geometry from the last particle additions
sps.setParticles();
```

Example : https://playground.babylonjs.com/#0MXVDK
Each click removes the 2 first and last 100 particles.  
**Important note :** the SPS must contain at least one particle to work, so never empty it completely !

#### Storable particles

You may want to create new particles and not to insert them in the SPS on its creation but later. You may also want to keep aside removed particles to put them back in the system later.  
So when creating new particles, you can specify to store them aside from the SPS with the optional parameter `storage: []` of the method `addShape()`.

```javascript
var stock = []; // the array to store the particles
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1); // the SPS needs at least one particle
sps.addShape(model1, 100, { storage: stock }); // stores 100 particles from model1 in the stock array
sps.buildMesh();
```

This SPS contains only one particle. The 100 others are stored in an external array.

If you want now to restore these particles, or some previously removed ones, just use the method `insertParticlesFromArray(array)`.

```javascript
var stock = []; // the array to store the particles in
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1000); // the SPS contains 1000 particles
sps.addShape(model1, 100, { storage: stock }); // 100 others are stored aside
sps.buildMesh();

// ... later in the code
var removed = sps.removeParticles(0, 99); // the 100 first particles are removed and stored in another array
sps.buildMesh();

// ... later again in the code : let's restore the misssing particles
sps.insertParticlesFromArray(removed); // restores the previously removed particles
sps.insertParticlesFromArray(stock); // restores the previously created particles
sps.buildMesh();
sps.setParticles();
```

Each time that you call `insertParticlesFromArray()`, the stored particle objects aren't just referenced in the SPS, they are cloned and the clones are reindexed and given a new identifier.  
This means that you can modify or get rid of the storage array or their contained particle objects with no effect and no risk for the SPS working.  
Example : https://playground.babylonjs.com/#HL9PPA
Each click removes 100 particles of a given shape and restore 100 particles of another shape in turn.  
100 particles are stored aside at the SPS creation.

#### Notes :

- When you remove particles, the remaining ones are reindexed, meaning that their `particle.idx` value can change. The particle identifier `particle.id` keeps unchanged. If a particle is given a parent and if this parent is removed, then the particle `parent` property value is set to `null`.
- Adding or removing particles will create a new VertexData object, so a new VBO buffer, each time `buildMesh()` is called.  
  This can trigger the Garbage Collector activity at some unwanted moment, so it's not a good idea to add or remove particles each frame.  
  Moreover, using an expandable SPS uses more memory than a fixed one because all the dynamic extensible arrays are saved under the hood along the SPS life.

### Different Materials

The SPS renders all the particles in a single draw call because you've used only one material, or none what means a default material under the hood, so far.  
Sometimes yet, you may want to use several materials in order to render some glowing particles with the glow layer, some others with a bump texture and some others with a colored standard material for instance. In this case, you may accept that the draw call number is higher but you wish it keeps at its possible minimum.  
The SPS supports the MultiMaterials and provides a mechanism to keep the draw call number to a minimum value. You can use them by different ways.

#### Simple way

The simplest way to set different materials to the particles is to set a different material to each model used to create the particles and to ask the SPS to use these materials at construction time with the optional paramater `useModelMaterial` set to `true` (default `false`).

```javascript
// model1, model2 and model3 are meshes with already set materials at this step
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  useModelMaterial: true
});
sps.addShape(model1, 300);
sps.addShape(model2, 300);
sps.addShape(model3, 300);
sps.buildMesh();
```

This enables the multimaterial support, then copies the model geometries and creates automatically the SPS multimaterial from the model materials, with the following rule :

- if several models share the same material, this material is used only once in the SPS : particles are sorted in this purpose to minimize the draw call numbers,
- if a model has no material, a standard material is created,
- if another following model has also no material, the first rule applies : the newly created standard material is shared among the particles depicting all the models with no material.  
  Example : https://playground.babylonjs.com/#RCUHJA

You can obviously notice that this method associates the model materials to the particles on the particle shape basis : all the particles of a given shape share the same material.  
You can still change this behavior by assignig some materials on the particle basis by setting the particle property `.materialIndex` value to the wanted material index. The material index is simply the index of the shape material in the order the shape are created : 0 for the first shape, 1 for the second one, and so on. If set, it overwrites the assigned shape material index.  
This can be done at creation time in a `positionFunction` of an immutable SPS for instance.

```javascript
var initParticle = function(particle, i) {
  particle.position.x = areaSize * (Math.random() - 0.5);
  particle.position.y = areaSize * (Math.random() - 0.5);
  particle.position.z = areaSize * (Math.random() - 0.5);
  // above a given altitude, it's given the material 1
  // whatever the initial shape material
  if (particle.position.y > areaSize * 0.1) {
    particle.materialIndex = 1;
  }
};
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  useModelMaterial: true,
  updatable: false
});
sps.addShape(model1, 300, { positionFunction: initFunction });
sps.addShape(model2, 300, { positionFunction: initFunction });
sps.addShape(model3, 300, { positionFunction: initFunction });
sps.buildMesh();
```

Example : https://playground.babylonjs.com/#RCUHJA#2

This method can be used to build non-updatable meshes with MultiMaterials by assembling shapes of different materials even when knowing nothing about indices nor vertices as it's required to define a MultiMaterial object by hands : https://doc.babylonjs.com/how_to/multi_materials

#### Intermediate way

When you set the SPS `useModelMaterial` property to `true`, this enables the support for MultiMaterial.  
You can also enable this support by just setting the property `enableMultiMaterial` to `true`.  
In this case, the difference is that the support is enabled but the model materials aren't copied at construction time.

You may want then to use your own set of materials instead of the model ones.
So, whatever the SPS is immutable or not and whatever you're using `enableMultiMaterial` or `useModelMaterial`, you can pass your own materials to the SPS once it's build with the method `sps.setMultiMaterials(arrayOfMaterials)`.

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  enableMultiMaterial: true,
  updatable: false
});
sps.addShape(model1, 300, { positionFunction: initFunction });
sps.addShape(model2, 300, { positionFunction: initFunction });
sps.addShape(model3, 300, { positionFunction: initFunction });
sps.buildMesh();

// mat0, mat1, mat2 are Material objects
sps.setMultiMaterial([mat0, mat1, mat2]);

// ... later in the code, swap mat0 and mat1
sps.setMultiMaterial([mat1, mat0, mat2]);
```

This method can be called as many times as needed once the SPS mesh is built.  
It recomputes the underlying MultiMaterial object and the SPS geometry in order to group the particles by materials, so it's probably not a good idea to call it each frame in the render loop.  
Example : https://playground.babylonjs.com/#RCUHJA#3

#### Advanced way

Until now, you've essentially set the particle `materialIndex` values at construction time and they haven't changed then, only the materials themselves have changed.  
You can still change the particle `materialIndex` values at any time, for instance in a call to `sps.updateParticle()` from `sps.setParticles()` like you would do to change the particle positions or rotations, or in a call to any other function of your own at some moment.  
The difference with the other particle properties (positon, rotation, etc) is that `setParticles()` doesn't compute the materials at all.  
Indeed `setParticles()` is designed to be called each frame in the render loop and to make sure to keep the garbage collector activity to its minimum by allocating nothing.  
Applying the changes of `materialIndex` values requires to sort again all the particles, to recompute the whole SPS geometry and moreover to recreate new SubMesh objects from the SPS mesh.  
Therefore a dedicated method is provided `sps.computeSubMeshes()`. This method is to be called manually after each change of particle `materialIndex` values for them to be taken in account at once.  
Like `setMultiMaterials()`, it's probably not a good idea to call it each frame in the render loop.

```javascript
// updatable SPS creation
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  enableMultiMaterial: true
});
sps.addShape(model1, 300);
sps.addShape(model2, 300);
sps.addShape(model3, 300);
sps.buildMesh();

// mat0, mat1, mat2 are Material objects
sps.setMultiMaterial([mat0, mat1, mat2]);

// the particle materialIndex are set in the call to updateParticle
// while the mesh and the multimaterial are already built
sps.updateParticle = initFunction;
sps.setParticles(); // updates the particle positions
sps.computeSubMeshes(); // actually computes the submeshes and materials
```

Examples :
https://playground.babylonjs.com/#RCUHJA#4  
In this second example the particles above a given altitude are given the next material in turn every 15 frames.  
https://playground.babylonjs.com/#RCUHJA#7

If you still really want to call `computeSubMeshes()` each time you call `setParticles()` because your particle materials are updated at this same frequency, you can then set the property `sps.autoUpdateSubMeshes` to `true` (default `false`). In this case, no more need for calling `sps.computeSubMeshes()` by hands as `setParticles()` will do it for you internally.

```javascript
sps.autoUpdateSubMeshes = true;
sps.setParticles(); // updates the particle material indexes AND recomputes the subMeshes
```

Example : https://playground.babylonjs.com/#RCUHJA#8

In the case you want to make your own MultiMaterial object by hands, then set it to the SPS mesh material property and call `sps.computeSubMeshes()` to internally build the needed SubMesh objects.

```javascript
var multimat = new BABYLON.MultiMaterial("multi", scene);
multimat.subMaterials.push(material0);
multimat.subMaterials.push(material1);
multimat.subMaterials.push(material2);

sps.mesh.material = multimat;
sps.computeSubMeshes();
```

**Note 1 :** By default, the particle `materialIndex` value is `null`.  
When enabling the MultiMaterial in the SPS, this value is set to zero for every particle until it's overwritten by the user or automatically set to some model material index by `useModelMaterial`.  
**Note 2 :** The particle depth sort doesn't work with the MultiMaterial support because particles can't be sorted by their distances to the camera and by materials in the same time. So if you enable both modes, it won't crash but it will get to some weird visible results.  
**Note 3 :** The SPS MultiMaterial support works also with an expandable SPS, meaning you can add/store/remove particles with different materials. When calling `sps.buildMesh()` again, everything is then recomputed automatically.

### Garbage Collector Concerns

In Javascript, the Garbage Collector is usually your friend : it takes care about cleaning up all the not any longer needed variables you could have declared and thus it sets the memory free.  
However, it can sometimes become an awkward friend because it can start its cleaning just while you are displaying a very smooth animation, so it takes the CPU for itself and leaves to you only those nice lags on the screen.  
In order to avoid unpredictable GC pauses, it's best to avoid allocating new objects in loops that execute often, where particles are created or updated.  
For example, `updateParticle()` and `updateParticleVertex()` are often called each frame for each particle or each particle vertex. Now imagine that you have a SPS with 30 000 particles. Suppose you write code like this to add a particle acceleration :

```javascript
SPS.updateParticle = function(particle) {
  var accel = new BABYLON.Vector3(0, 0.5, 0);
  particle.velocity = particle.velocity.add(accel);
  // ...
};
```

Code like the above would create two new `Vector3` objects each call, or 60 000 new objects over the course of the update. And although modern JS engines are quite good at cleaning up short-lived objects, it's best not to unnecessarily strain the GC this way.  
Instead, make your update loops reuse variables that were declared outside the loop, and don't call any methods inside the loop that create new objects:

```javascript
var accel = new BABYLON.Vector3(0, 0.5, 0);
SPS.updateParticle = function(particle) {
  particle.velocity.addInPlace(accel);
  // ...
};
```

SPS also has a `vars` property, which is an object that you can use to store any variables you want to reuse. Any variables you store there will share the SPS' lifecycle, and get cleaned up when you dispose it:

```javascript
SPS.vars.tempVector = new BABYLON.Vector3(0, 0, 0);
// ...
SPS.dispose(); // cleans explicitly all your SPS.vars !
```

A good JS practice for the compiler is to **never** change the variable type once it has been set :

```javascript
SPS.vars.myFloat = 0.01; // just keep setting float values to myFloat afterwards
SPS.vars.myInt = 5; // just keep setting integer values to myInt afterwards
SPS.vars.myString = "foo"; // just keep setting string values to myString afterwards
```

Example : From this [article](http://gamedevelopment.tutsplus.com/How_To/the-three-simple-rules-of-flocking-behaviors-alignment-cohesion-and-separation--gamedev-3444), here is an implementation of a simple particle IA called "flocking" what a behavior of association, then cohesion and separation. This example uses `SPS.vars` to allocate the memory used for results only once instead of in-function temporary variables.  
 https://www.babylonjs-playground.com/#2FPT1A#35

### Rebuild the mesh

if a mesh, changed at creation time with `positionFunction` or `vertexFunction` has been then modified with `setParticles()`, it can be rebuild by reapplying the internally stored `positionFunction` or `vertexFunction` functions.  
Note that only the function are stored, not their results. This means that if one of your function produces different results each call (using `Math.random()` for instance), you won't get back the same SPS mesh shape but another computed shape.

```javascript
SPS.rebuildMesh();
```

Except in some very specific cases, you might not need to use this function.

# Further Reading

## Basic - L1

[Particles Overview](/features/Particles)

[Particles 101](/babylon101/particles)

[How to Create Animated Particles](/how_to/Animate)  
[How to Use Sub Emitters](/how_to/Sub_Emitters)

[Points Cloud Particle System](/How_To/point_Cloud_Particles)

## Intermediate - L2

[How to Customize the Particle System](/how_to/Customise)
