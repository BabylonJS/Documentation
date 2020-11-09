---
title: Cloning With the Solid Particle System
image: 
description: Learn how to clone using the solid particle system in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, mesh transformation, transformation, cloning, SPS
further-reading:
video-overview:
video-content:
---

## Using the Solid Particle System to Copy Meshes
There is more to the Solid Particle System (SPS) than just producing multiple copies of a mesh and these are considered in full in the Particles section. The SPS places multiple copies of a mesh all together into just one mesh. This means that instead of multiple draw calls there is just one draw call for the single mesh.

The SPS is a single updatable mesh with the same properties as any other Babylon.js  mesh.

In order to produce multiple copies of a mesh you follow this script

Example :
```javascript
SPS = new BABYLON.SolidParticleSystem("SPS", scene);  //create the SPS
const tetra = BABYLON.MeshBuilder.CreatePolyhedron("tetra", {}); //create the mesh
SPS.addShape(tetra, 1500);      // add as many copies as you want to the SPS
tetra.dispose(); //ddispose of the original mesh
const spsMesh = SPS.buildMesh();  //builds the SPS mesh

//Set the function to intialise the particle properties
SPS.initParticles = () => {
    for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p]  
        particle.position.x = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.y = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.z = BABYLON.Scalar.RandomRange(-50, 50);
    
        const scale = BABYLON.Scalar.RandomRange(0.5, 1.5);;
        particle.scale.x = scale;
        particle.scale.y = scale;
        particle.scale.z = scale;

	        particle.rotation.x = BABYLON.Scalar.RandomRange(0, Math.PI);
	        particle.rotation.y = BABYLON.Scalar.RandomRange(0, Math.PI);
	        particle.rotation.z = BABYLON.Scalar.RandomRange(0, Math.PI);
    }
} ;


SPS.initParticles(); //call the initialising function
SPS.setParticles(); //apply the properties and display the mesh
```

## Example
Copying a tetrahedron: <Playground id="#GKUCQP" title="Copying a Tetrahedron" description="Simple example of copying a tetrahdedron." image="/img/playgroundsAndNMEs/PGNMEProceduralTexture.jpg"/>