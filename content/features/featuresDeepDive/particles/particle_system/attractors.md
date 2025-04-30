# Attractors

Starting from Babylon.js v8.4, you can create add gravity attractors to your particle system.

**Note:** Attractors are NOT supported in GPU particles (WebGL 2 and WebGPU).

Here is a complete example to try:

<Playground id="#DEZ79M#40" title="Attractors" description="Complete example of attractors."/>

## How To Use Attractors

An attractor is a simple class that contains a position (Vector3) and a strength.

Setting the strengh to a negative value will create a repulsor.

```javascript
  // Attractor
  const attractor = new BABYLON.Attractor();
  attractor.strength = 2;
  attractor.position = new BABYLON.Vector3(0, 1, -1);        
  particleSystem.addAttractor(attractor);
```

You can change the position or the strengh of an attractor at any time.

To remove an attractor, simply call ```particleSystem.removeAttractor(attractor);```

Finally, if you want to get a **readonly** list of attractors attached to a particle system, you can simply use the ```particleSystem.attractors``` property.
