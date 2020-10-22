# Managing SPS and Its Particles

## Managing the SPS
The SPS mesh when built has all the properties and methods that you can apply to any mesh. In addition there are useful properties you can use with the SPS. Some you should have met already.

Property | Type | Use 
-----|-----|----- 
SPS.particles | particle[] | iterate over this array in *initParticles()*
SPS.nbParticles | number | total number of particles in the SPS
SPS.billboard | Boolean | turns particles towards camera; false by default
SPS.counter | number | for your own usage, its not set by the SPS

When working with JavaScript you can add your own properties like _capacity_ or _rate_ if needed.

When you don't need your SPS any longer, you can dispose it to free the memory with
```javascript
SPS.dispose();
SPS = null; // tells the GC the reference can be cleaned up also
```

When you are not going to use some particle features you can set other properties of the SPS to *false* disable them.  You can always enable them again with *true*. This improve the performance of the scene as no attempt will be made to update these properties.

Property | Type | Default | Use 
----- | ----- | ----- | ----- | -----
SPS.computeParticleRotation | Boolean | true | allows or prevents computing particle.rotation
SPS.computeParticleTexture | Boolean | true | allows or prevents computing particle.uvs
SPS.computeParticleColor | Boolean | true | allows or prevents from computing particle.color
SPS.computeParticleVertex | Boolean | false | allows or prevents calling the custom updateParticleVertex() function

These properties affect the *SPS.setParticles()* process only. You can change them between calls to *SPS.setParticles()*.  For example setting *SPS.computeParticleColor* to false after the first call to *SPS.setParticles()* allows particle colors set during *initParticles()* to be applied but prevents any call to updating colors in subsequent calls to *SPS.setParticles()*. When *SPS.setParticles()* is inside the render loop this can be very beneficial.

Tetra Fountain color and texture not updated https://www.babylonjs-playground.com/#GLZ1PX#10
  

## Managing Particles
### Properties
There are many properties you can set on a particle

Property | Type | Default 
-----|-----|----- 
position | Vector3  | (0, 0, 0)  
rotation | Vector3  | (0, 0, 0)  
rotationQuaternion | Vector3  | undefined  
velocity | Vector3  | (0, 0, 0)  
color | Vector4  | (1, 1, 1, 1)  
scaling | Vector3  | (1, 1, 1)  
pivot | Vector3  | (0, 0, 0)  
uvs | Vector4  | (0, 0, 1, 1)  
isVisible | boolean  | true  
alive | boolean  | true  
translateFromPivot | boolean  | false  
parentId | integer,  | null    
props | any  | null |


and two you can read:  
 - *idx* - which allows you to read the index of the particle in the SPS particles array;
 - *idxInShape* - which allows you to read the index of the particle relative to the shape (model mesh) added to the SPS

For example, after
```javascript
SPS.addShape(model1, 1000);
SPS.addShape(model2, 500);

particle = SPS.particles[1200]
```
You have  *particle.idx = 1200* whereas *particle.idxInShape = 200*

Useful for applying different properties to different shapes.

When you set a particle rotation quaternion, its rotation property will then be ignored.  

All positions are expressed in the SPS mesh's *local space*.   

Setting the *pivot* vector value to a particle applies it as a translation to the particle in its local space. Any rotation is always computed around the local space origin. By default, the particle is translated, then rotated, then translated back to its original location unless you set the particle property *translateFromPivot* to *true* (default *false*). In this case, it's simply translated, then rotated and left at the translated location. 

In the simple case of 1 dimension let a particle be at positionX with a pivot at pivotX. The center of transformation depends whether *translateFromPivot* is true or not. When false it is at the point = positionX + pivotX, and when true it is the point = positionX. The distance of the point from the pivot is then  pivotX.

Illustration of pivot particle, 1D pivot placement; change data on lines 23 - 25 to see effect https://www.babylonjs-playground.com/#GLZ1PX#11
Pivot particle set in 3D, rotation and scaling applied - 1000 tetrahedron satellites orbiting around 1000 rotating boxes.  https://playground.babylonjs.com/#LXXL6Y#1  
  
Please note also that, even a particle is invisible (_isVisible_ set to _false_), its other property values can be updated and *updateParticle()* is called for every particle whether it is visible or not.

When you set your SPS in billboard mode, you should only set a *rotation.z* value. Putting *SPS.billboard = true*  makes all the particles face the camera and their _x_ and _y_ rotation values will be ignored. This is rather useful if you display only plane particles. However, if you deal only with 2D particles you should consider to use the particle system or one of the various sprite managers which are more performant in 2D computation. In order to display the SPS in billboard mode, you need to call *SPS.setParticles()* within the scene render loop.

Here is an example with plane particles in billboard mode : https://www.babylonjs-playground.com/#WCDZS#7  
The same but with plane particle rotations and no billboard mode : https://www.babylonjs-playground.com/#WCDZS#1  
The same with solid particles, boxes and tetrahedrons : https://www.babylonjs-playground.com/#WCDZS#2  
Another one with colors and rotations : https://www.babylonjs-playground.com/#2FPT1A#9

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

### Methods
To manage the behavior of particles you use the mandatory method *setParticles* along with some non mandatory custom functions. The *setParticles* method is necessary to update and display the mesh built by the SPS.

The non mandatory custom functions

- **`initParticles()`** : lets you set all the initial particle properties. You must iterate over all the particles by using the `SPS.nbParticles` property.
- **`recycleParticle(particle)`** : lets you set a particle to be recycled. It is called per particle.
- **`updateParticle(particle)`** : lets you set the particle properties. This function is called per particle by `SPS.setParticles()`.
- **`beforeUpdateParticles()`** : lets you make things within the call to `SPS.setParticles()` just before iterating over all the particles.
- **`afterUpdateParticles()`** : lets you make things within the call to `SPS.setParticles()` just after the iteration over all the particles is done.
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


