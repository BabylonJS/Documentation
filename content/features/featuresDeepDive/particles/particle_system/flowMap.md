# Flow maps

Starting from Babylon.js v8.6, you can provide a flow map to control how your particles behave.
All particle systems support that feature.

Here is a complete example to try:

<Playground id="#5DM02T#7" title="Flow map" description="Complete example of a particle flow map."/>

# Definition

A flow map is a screen-aligned image that is used to control the direction and intensity of forces applied to particles based on their position on the screen, not in world space. 
This means the flow behaves consistently relative to the viewport, regardless of camera movement or rotation.

The flow map is a standard texture where each pixel encodes a 3D direction vector and strength using a Color4 format:

Red (R): X-component of the flow direction (0 → left, 1 → right, 0.5 → no movement)

Green (G): Y-component of the flow direction (0 → down, 1 → up, 0.5 → no movement)

Blue (B): Z-component of the flow direction (0 → front, 1 → back, 0.5 → no movement)

Alpha (A): flow strength (0 → no effect)

# Example

When used with a regular Particle system, the flow map will be stored as a UInt8 array:
```
    const flowMapUrl = "https://assets.babylonjs.com/textures/particleMotion_flowmap.png";
    particleSystem.flowMap = await BABYLON.FlowMap.FromUrlAsync(flowMapUrl);
```

You can control the overall impact of the flow map with `particleSystem.flowMapStrength`.

When used with GPU particle system, the flow map is a regular texture:
```
const flowMapUrl = "https://assets.babylonjs.com/textures/particleMotion_flowmap.png";
particleSystem.flowMap = new BABYLON.Texture(flowMapUrl);
```

Example using a GPU particle system:

<Playground id="#5DM02T#12" title="Flow map" description="Complete example of a GPU particle flow map."/>

