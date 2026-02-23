# Attractors

Starting from Babylon.js v8.4, you can add gravity attractors to your particle system.

**Note:** Attractors are not supported with `GPUParticleSystem`.

Here is a complete example to try:

<Playground id="#DEZ79M#76" title="Attractors" description="Complete example of attractors."/>

## How To Use Attractors

An attractor is a simple class that contains a position (`Vector3`) and a strength.

Setting the strength to a negative value will create a repulsor.

```javascript
  // Attractor
  const attractor = new BABYLON.Attractor();
  attractor.strength = 2;
  attractor.position = new BABYLON.Vector3(0, 1, -1);        
  particleSystem.addAttractor(attractor);
```

You can change the position or the strength of an attractor at any time.

To remove an attractor, simply call `particleSystem.removeAttractor(attractor)`.

Finally, if you want to get a **readonly** list of attractors attached to a particle system, you can use the `particleSystem.attractors` property.
