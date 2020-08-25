# How to use Reflection probes
![Reflection Probes example](/img/reflectionProbe.jpg)

Reflection probes are used to dynamically generate cube maps that can the be used as reflection textures for instance.

Here is how to use them:

```
var probe = new BABYLON.ReflectionProbe("main", 512, scene);
probe.renderList.push(yellowSphere);
probe.renderList.push(greenSphere);	
probe.renderList.push(blueSphere);	
probe.renderList.push(mirror);	

mainMaterial.reflectionTexture = probe.cubeTexture;
```

As you can see, you have to define which meshes will be rendered by the reflection probe.

**You have to be cautious with reflection probes as they need to actually generate 6 textures per frame (One per face).**

You can change the update rate (on every frame by default) with this code:

```
probe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;	
// or
probe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;	
// or
probe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYTWOFRAMES;
// or
probe.refreshRate = 3;
```

To get the best possible rendering, you also need to move your probe at the center of the mesh which should use the generated cube map.
(Internally the probe will generate a ghost camera at the specific position and will then render the faces from there). You have two options to achieve this:

```
probe.attachToMesh(root);
// or
probe.position = new BABYLON.Vector3(0, 1, 0);
```

If you want to try it, just click [here]( https://www.babylonjs-playground.com/#KA93U#243)

## Probes and PBR

If you want to achieve the highest quality for your PBR materials using probes for realtime reflections, the engine needs additionnal processing to achieve the right glossiness / roughness effect.
Getting it right is really simple, first setup a probe on your mesh with a PBR material, as described in the previous paragraph. Then you need to enable this flag on your material :

```
mainMaterial.reflectionTexture = probe.cubeTexture;
mainMaterial.realTimeFiltering = true;
```

This flag will ensure your PBR material is correctly rendered with the probe. However, this flag involves more GPU processing for your materials, so be sure to use it wisely. In order to keep performance under control, you can set the quality of the filtering process of your material :

```
mainMaterial.realTimeFilteringQuality = BABYLON.Constants.TEXTURE_FILTERING_QUALITY_MEDIUM;
```

Default is `TEXTURE_FILTERING_QUALITY_LOW`. Try with different qualities and see what's the best performance / quality tradeoff for your scene.

[Here](https://playground.babylonjs.com/#FEEK7G#116) is a playground example with a reflection probe and PBR material.
