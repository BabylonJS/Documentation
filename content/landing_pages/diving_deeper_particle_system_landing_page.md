# Particles System
The particle system uses small 2D sprites which may be animated and always face the camera to simulate effects such as smoke or abstract visual forms such as glitter and faery dust. The clouds of particles produced can be controlled with a wide range of properties including size, life time and emission rates, region and power. Gravity can also be added to the particles. 

![Particles](/img/features/particle0.png)  

From Babylon.js V3.2, where the browser supports WebGL2, GPU particles are available. These make full use of the GPU though there are some restrictions in its use. When WebGL2 is not available the *GPUParticleSystem* will fall back to the *ParticleSystem* automatically.