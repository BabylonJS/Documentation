# Flow Maps

Starting from Babylon.js v8.6, you can provide a flow map to control how your particles behave.
All particle systems support this feature.

Here is a complete example to try:

<Playground id="#DEZ79M#77" title="Flow Map" description="Complete example of a particle flow map."/>

## Definition

A flow map is a screen-aligned image that is used to control the direction and intensity of forces applied to particles based on their position on the screen, not in world space.

This means the flow behaves consistently relative to the viewport, regardless of camera movement or rotation. Because we are speaking of directions derived from a screen-aligned image, we will present directions in relation to the screen, such as screen-left or screen-up.

The flow map is a standard texture where each pixel encodes a 3D direction vector and strength using a `Color4` format (assuming the camera is pointing towards Z):

* Red (R): X-component of the flow direction (0 → screen-right, 1 → screen-left, 0.5 → no movement)
* Green (G): Y-component of the flow direction (0 → screen-down, 1 → screen-up, 0.5 → no movement)
* Blue (B): Z-component of the flow direction (0 → toward the screen, 1 → away from the screen, 0.5 → no movement)
* Alpha (A): Flow strength (0 → no effect)

## Example

When used with a regular particle system, the flow map will be stored as a `UInt8` array:

```javascript
    const flowMapUrl = "https://assets.babylonjs.com/textures/particleMotion_flowmap.png";
    particleSystem.flowMap = await BABYLON.FlowMap.FromUrlAsync(flowMapUrl);
```

You can control the overall impact of the flow map with `particleSystem.flowMapStrength`.

When used with a GPU particle system, the flow map is a regular texture:

```javascript
const flowMapUrl = "https://assets.babylonjs.com/textures/particleMotion_flowmap.png";
particleSystem.flowMap = new BABYLON.Texture(flowMapUrl);
```

Examples using various flow maps for both CPU and GPU particle systems:

* <Playground id = "#2TXXS1" title="Sample CPU Flow Maps" description="Varied examples of flow maps demonstrating particle influences" image="/img/playgroundsAndNMEs/flowMapExamples.jpg"/>
* <Playground id = "#PPC2EI#7" title="Sample CPU Flow Map with NPE" description="Examples of flow map demonstrating particle influences and NPE" image="/img/playgroundsAndNMEs/flowMapExamples.jpg"/>
* <Playground id="#5DM02T#12" title="GPU Flow map" description="Complete example of a GPU particle flow map."/>
* <Playground id="#DEZ79M#77" title="Another Flow Map with NPE" description="Another Flow Map example that also showcases NPE."/>
