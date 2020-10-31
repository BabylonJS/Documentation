# Managing SPS Particles
# Properties

There are many properties you can set on a particle

Property | Type | Default 
-----|-----|----- 
position | Vector3  | (0, 0, 0)  
rotation | Vector3  | (0, 0, 0)  
rotationQuaternion | Quaternion  | undefined  
velocity | Vector3  | (0, 0, 0)  
color | Color4  | (1, 1, 1, 1)  
scaling | Vector3  | (1, 1, 1)  
pivot | Vector3  | (0, 0, 0)  
uvs | Vector4  | (0, 0, 1, 1)  
isVisible | boolean  | true  
alive | boolean  | true  
translateFromPivot | boolean  | false  
parentId | integer,  | null    
props | any  | null |


and three you can read:  
 - *idx* - which allows you to read the index of the particle in the SPS particles array;
 - *idxInShape* - which allows you to read the index of the particle relative to the shape (model mesh) added to the SPS;
 - *shapeId* - a number reference to the model added

For example, after
```javascript
SPS.addShape(model1, 1000);
SPS.addShape(model2, 500);

particle = SPS.particles[1200]
```
In the above example 
1. the particle with *particle.idx = 745* will have *particle.idxInShape = 745* and *particle.shapeId = 0*.
2. the particle with *particle.idx = 1200* will have *particle.idxInShape = 200* and *particle.shapeId = 1*.

These can be useful for applying different properties to different shapes.

When you set a particle rotation quaternion, its rotation property will then be ignored.  

All positions are expressed in the SPS mesh's *local space*. 

Please note also that, even a particle is invisible (_isVisible_ set to _false_), its other property values can be updated and *updateParticle()* is called for every particle whether it is visible or not.

## Pivot
Setting the *pivot* vector value to a particle applies it as a translation to the particle in its local space. Any rotation is always computed around the local space origin. By default, the particle is translated, then rotated, then translated back to its original location unless you set the particle property *translateFromPivot* to *true* (default *false*). In this case, it's simply translated, then rotated and left at the translated location. 

In the simple case of 1 dimension let a particle be at positionX with a pivot at pivotX. The center of transformation depends whether *translateFromPivot* is true or not. When false it is at the point = positionX + pivotX, and when true it is the point = positionX. The distance of the point from the pivot is then  pivotX.

Illustration of pivot particle, 1D pivot placement; change data on lines 23 - 25 to see effect https://www.babylonjs-playground.com/#GLZ1PX#11  
Pivot particle set in 3D, rotation and scaling applied - 1000 tetrahedron satellites orbiting around 1000 rotating boxes.  https://playground.babylonjs.com/#LXXL6Y#1  
  

## Billboard
When you set your SPS in billboard mode, you should only set a *rotation.z* value. Putting *SPS.billboard = true*  makes all the particles face the camera and their _x_ and _y_ rotation values will be ignored. This is rather useful if you display only plane particles. However, if you deal only with 2D particles you should consider to use the particle system or one of the various sprite managers which are more performant in 2D computation. In order to display the SPS in billboard mode, you need to call *SPS.setParticles()* within the scene render loop.

Here is an example with plane particles in billboard mode : https://www.babylonjs-playground.com/#WCDZS#7  
The same but with plane particle rotations and no billboard mode : https://www.babylonjs-playground.com/#WCDZS#1  
The same with solid particles, boxes and tetrahedrons : https://www.babylonjs-playground.com/#WCDZS#2  
Another one with colors and rotations : https://www.babylonjs-playground.com/#2FPT1A#9

## Color
When setting a particle color all vertices of the particle are set to that color and will blend nicely with any material colors if applied.   

On creation the vertex colors of the particle are the vertex colors of the model added. When the model has vertices using a range of colors, a box with different face colors for example, these colors are preserved by the particle. However setting the color of a particle will result in a single color for that particle. When the model mesh has no colors the the particle color is set to white.

In *initParticle* and *updateParticle* you can use, for example

```javascript
particle.color.r = red; //number from 0 to 1
particle.color.g = green; //number from 0 to 1
particle.color.b = blue; //number from 0 to 1
particle.color.a = alpha; //number from 0 to 1
```

Note: There is another way of setting the initial state of the particles that you will learn about when you read the next page on immutable SPS. This is done by an option property *positionFunction* when adding a shape.  When this method is used particle colors are null and so a new Color4 object must be created to set *particle.color*, following this form 

```javascript
particle.color = new BABYLON.Color4(0.25, 0.333, 0.67, 0.88);
```

When you want to set an alpha value, don't forget to enable the alpha channel for vertex colors

```javascript
SPS.mesh.hasVertexAlpha = true;
```

## UVS
On the next page we will look at how SPS can be configured to use multi-materials. For now we just consider the use of one material with one texture. The image file you use should contain all the textures you want to apply to the particles. When the model mesh you are adding to the SPS is one that is using the material per face technique then the correct uv values will be applied automatically when the model is added as a shape. 

To apply a texture from a region of the image file you specify its lower left and upper right coordinates as fractions of the whole image. Taking the lower left coordinates of (0, 0) and the upper left as (1, 1) will apply the whole image as a material. The *uv* property of a particle is a vector4 and for the whole image you would use a uv of (0, 0, 1, 1).

When you want apply a smaller region given by lower left (0.2, 0.1) and upper right as (0.6, 0.3) you just set the *uvs* property like this

```javascript
particle.uvs.x = 0.2; // left lower corner : 20% image width
particle.uvs.y = 0.1; // left lower corner : 10% image height
particle.uvs.z = 0.6; // right upper corner : 60% image width
particle.uvs.w = 0.3; // right upper corner : 30% image width
```

This can be used both by all the custom functions the *positionFunction* and *updateParticle()*, whichever you are using.

Unlike for the colors, the model UVs are saved whatever the model had per face UVs or not.  
This allows to use not only a texture atlas for the particles, but also a texture atlas for the model then inside the particle atlas because you use only one texture in final.


Model is a box with per face material, particles are direct copies of the model https://www.babylonjs-playground.com/#GLZ1PX#12
Model is a box with per face material, particles have uvs changed https://www.babylonjs-playground.com/#GLZ1PX#13


Like for any other mesh, you can also enable the texture transparency with :

```javascript
SPS.mesh.material.diffuseTexture.hasAlpha = true;
```

Or even use the alpha channel of the texture image :

```javascript
SPS.mesh.material.useAlphaFromDiffuseTexture = true;
```

Color and UVs example : https://www.babylonjs-playground.com/#WCDZS#8  
Texture with alpha : https://www.babylonjs-playground.com/#GLZ1PX#14

## Parenting

Each particle can be given another particle as a parent. The parent must be created before the current particle, this means the parent has to have a lower index Id (`particle.idx`) than the current particle. So the first particle in the pool (`idx = 0`) cannot have a parent. To give a parent to a particle, just set its property `.parentId` to the parent index Id value.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
}
```

To un-parent a particle, just set `.parentId` back to `null`, the default value.  
When a particle has got a parent, its position and rotation are then expressed in its parent local space.

In the following code the previous particle becomes the parent of the current one. The particle position and rotation are expressed in the previous particle space, this one being already rotated and translated from the yet previous particle. Etc.
```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; 
  particle.rotation.z = 0.01;
  particle.position.x = 1.0;
}
```
A bluish box rotating around its pivot parented to a sliding red box https://www.babylonjs-playground.com/#GLZ1PX#16
A third box added the last two rotating about the previous one https://www.babylonjs-playground.com/#GLZ1PX#15
A chain of 7 boxes each parented to the previous one https://www.babylonjs-playground.com/#GLZ1PX#17  
2000 boxes parented per 20 segment stems : https://playground.babylonjs.com/#V7V1RS


## Custom Properties
In JavaScript, you can obviously also create your own properties like _acceleration: Vector3_ or _age_, in *initParticles()* for instance.  

```javascript
SPS.initParticles = function() {
  for (var p = 0; p < SPS.nbParticles; p++) {
    particles[p].age = Math.random() * 20;
  }
};
```
Using TypeScript (or JavaScript), you can associate your own properties to each particle with the property *props* typed *any* and *null* by default :
```javascript
particle.props = {myProp1: val1, myProp2: val2};
```


# Methods
To manage the behavior of particles you use the mandatory method *setParticles* along with some non mandatory custom functions. The *setParticles* method is necessary to update and display the mesh built by the SPS.

The non mandatory custom functions

- **_initParticles()_** : lets you set all the initial particle properties. You must iterate over all the particles by using the _SPS.nbParticles_ property.
- **_recycleParticle(particle)_** : lets you set a particle to be recycled. It is called per particle.
- **_updateParticle(particle)_** : lets you set the particle properties. This function is called per particle by _SPS.setParticles()_.
- **_beforeUpdateParticles()_** : lets you make things within the call to _SPS.setParticles()_ just before iterating over all the particles.
- **_afterUpdateParticles()_** : lets you make things within the call to _SPS.setParticles()_ just after the iteration over all the particles is done.
-

The following pseudo-code schema will show you their application.

```javascript
var particles: SolidParticles[] = [array of SolidParticle objects];
function setParticles() {
    beforeUpdateParticles();
    for (var p = 0; p < nbParticles; p++) {
        updateParticles(particles[p]);
    }
    updateTheWholeMesh();
    afterUpdateParticles();
}
```

When needed you would call *recycleParticle(particle)* in your own *updateParticle(particle)* function for instance

```javascript
SPS.updateParticle = function(particle) {
    particle.velocity--;
    if (particle.velocity < 0) {
        particle.alive = false;
        SPS.recycleParticle(particle); // call to your own recycle function
    }
};
```
