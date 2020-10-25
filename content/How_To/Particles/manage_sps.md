# Managing the SPS

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

Tetra fountain color and texture not updated https://www.babylonjs-playground.com/#GLZ1PX#10

  



