# An Introduction to The Solid Particle System

The Solid Particle System, SPS, is a single updatable mesh rendered with one draw call. It is built by combining multiple copies of one or more model meshes which become the particles of the system. Once the SPS is built it has the same properties as any other Babylon.js mesh, no more, no less. It can be scaled, rotated, translated, light, textured, etc.

As a system of particles it provides some methods to manage the particles. However, unlike the standard particle system, it provides no built in behaviors. It has no emitters, no particle physics, no particle recycler nor particle movement. You have to implement your own behaviors. 

Once you have a mesh model, or models, as a basis for the particles you follow these steps

- First, create your SPS with `new SolidParticleSystem(name, scene)`;
- then, add a number of particles to the SPS from a mesh model with `addShape(model, number)`;
- wedo this as many times as needed with any model;
- When done, build the SPS mesh with `buildMesh()`.

Your SPS is then ready to manage its particles by 

- initiating their positions, colors etc. with `initParticles()`;
- update the SPS and draw it with `setParticles()`.

When you want to animate the particles by changing their properties over time you need to
- define their individual behavior with`updateParticle(particle)`;
- call `setParticles()` within the render loop.

Let's create an example

```javascript
const SPS = new SolidParticleSystem("SPS", scene); // scene is required
const sphere = BABYLON.MeshBuilder.CreateSphere("s", {});
const poly = BABYLON.MeshBuilder.CreatePolyhedron("p", { type: 2 }, scene);
SPS.addShape(sphere, 20); // 20 spheres
SPS.addShape(poly, 120); // 120 polyhedrons
SPS.addShape(sphere, 80); // 80 other spheres
sphere.dispose(); //free memory
poly.dispose(); //free memory

const mesh = SPS.buildMesh(); // finally builds and displays the SPS mesh
```
At this stage all the particles are displayed at the origin so to separate them we need to initiate some properties. Access to the individual particles is through the *particles array* the length of which is given by *nbParticles*.

We setup the function to initiate the particles

```javascript
// initiate particles function
SPS.initParticles = () => {
    for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p];
        //Place particles at random positions with a cube
      	particle.position.x = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.y = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.z = BABYLON.Scalar.RandomRange(-50, 50);
    }
};
```

then call it to apply the initiation, followed by *setParticles* to actually reconfigure the SPS mesh geometry and vertex data

```javascript
//Update SPS mesh
SPS.initParticles();
SPS.setParticles();
```

A basic SPS https://www.babylonjs-playground.com/#GLZ1PX#1  
Colored Green https://www.babylonjs-playground.com/#GLZ1PX#2  
With Texture https://www.babylonjs-playground.com/#GLZ1PX#3

As well as position there is a number of properties you can set on a particle

 Property | Type | Default 
-----|-----|----- 
position | Vector3  | (0, 0, 0)  
rotation | Vector3  | (0, 0, 0)  
rotationQuaternion | Vector3  | undefined  
velocity | Vector3  | (0, 0, 0)  
color | Vector4  | (1, 1, 1, 1)  
scaling | Vector3  | (1, 1, 1)  
pivot | Vector3  | (0, 0, 0)  
uvs | Vector4  | (0,0, 1,1)  
isVisible | boolean  | true  
alive | boolean  | true  
translateFromPivot | boolean  | false  
parentId | integer,  | null    
props | any  | null |

We will look at the less obvious ones a little later in the section

Color individual particles https://www.babylonjs-playground.com/#GLZ1PX#4  
Texture individual particles https://www.babylonjs-playground.com/#GLZ1PX#5

While it can be useful to have an SPS that will not change, for example to represent city buildings or an asteroid field,

![Immutable](\img\how_to\Particles\sps1.png)  
there is much more you can do with an SPS.