---
title: Performance
image:
description: Dive into some deeper game creation methods and techniques.
keywords: guided learning, create a game, game, performance, merge, post process, optimization
further-reading:
    - title: Bonus Page About The Design Process, 3D Modeling and Art Assets
      url: /guidedLearning/createAGame/designArt
video-overview:
video-content:
---

## Summary

The purpose of this performance section is to specifically attack the number of draw calls being made. At the current state of the game, it is a little over 1000. After the changes listed below are made, it drops to about 460.

Initially, there were actually some other changes that were made that DRASTICALLY improved performance. The most impactful must have been the removal of all meshes casting shadows. It did a ton of draw calls because of how many different meshes were actually in the scene. When first inspecting the draw calls, there were about 8000 being made. This wasn't noticeable on PC local server, but it severely impacted mobile and web performance. BEWARE!!

You can check draw calls by using: [spector.js](https://spector.babylonjs.com/).

## Merging Meshes

### Character

Again, the more meshes you have, the more draw calls you'll have. My character mesh, although a "single mesh" in blender, was split into separate meshes when imported into babylon because I used separate materials for different colors. What I did to reduce this was to use a color palette texture material + UV mapping. This is actually the process I had used for the environment.

![character palette](/img/how_to/create-a-game/characteruv.png)

### Environment

The environment consisted of a lot of separate & duplicated meshes since it was the entire game world. I just went back into the blender file and tried to join as many of the meshes as possible into groups that made sense.

## Glow Layer

The glow layer really only needed to be used with the lanterns to give that extra glowy feel, so limiting what meshes are affected by the glow layer will reduce the amount of draw calls being made since it's only rendering the included meshes. I just added this to when I was [setting up my glow layer](/guidedLearning/createAGame/extraFeatures#glow-layer).

```javascript
this._environment._lanternObjs.forEach((lantern) => {
    gl.addIncludedOnlyMesh(lantern.mesh);
});
```

## Fade Transition Post Process

The fade transition is a post-process effect that's needed when we transition between scenes. Therefore, we really don't need it on at any other time. To apply this only when we transition, I just moved the creation of the post process and applications of the effect into the pointer observables. For example, in [goToStart]():

```javascript
Effect.RegisterShader("fade", "precision highp float;" + "varying vec2 vUV;" + "uniform sampler2D textureSampler; " + "uniform float fadeLevel; " + "void main(void){" + "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" + "baseColor.a = 1.0;" + "gl_FragColor = baseColor;" + "}");

let fadeLevel = 1.0;
this._transition = false;
startBtn.onPointerDownObservable.add(() => {
    //fade screen
    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
    postProcess.onApply = (effect) => {
        effect.setFloat("fadeLevel", fadeLevel);
    };
    this._transition = true;
    //...other stuff done when startBtn is pressed
});
```

## Lights

Before, when you would collide with the first lantern, and the first lantern after the sparkler went out, there would be a slight lag in the game. This was due to the shaders updating since we were dynamically creating lights.

The solution to this was to pre-create all lights with intensity 0 -- a constant cost. This led to a restructuring for the [Lantern class](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/lantern.ts#L17).

1. In the constructor, we want to remove the lightSphere mesh and instead create a pointLight with intensity 0.

```javascript
const light = new PointLight("lantern light", this.mesh.getAbsolutePosition(), this._scene);
light.intensity = 0;
light.radius = 2;
light.diffuse = new Color3(0.45, 0.56, 0.8);
this._light = light;
```

2. Rather than using the lightSphere to find nearby meshes, I decided to just assign the meshes to lights manually in blender. What I did was name empties with the name of the lantern plus "lights". Every mesh lit by a lantern would be a child of this empty. (Empties in blender translate to TransformNodes in babylon)
   ![lanterns in blender](/img/how_to/create-a-game/lanternlights.png)

3. \_findNearestMeshes would now would push the meshes belonging to the lantern's corresponding light.

```javascript
if (this.mesh.name.includes("14") || this.mesh.name.includes("15")) {
    light.includedOnlyMeshes.push(this._scene.getMeshByName("festivalPlatform1"));
} else if (this.mesh.name.includes("16") || this.mesh.name.includes("17")) {
    light.includedOnlyMeshes.push(this._scene.getMeshByName("festivalPlatform2"));
} else if (this.mesh.name.includes("18") || this.mesh.name.includes("19")) {
    light.includedOnlyMeshes.push(this._scene.getMeshByName("festivalPlatform3"));
} else if (this.mesh.name.includes("20") || this.mesh.name.includes("21")) {
    light.includedOnlyMeshes.push(this._scene.getMeshByName("festivalPlatform4"));
}
this._scene
    .getTransformNodeByName(this.mesh.name + "lights")
    .getChildMeshes()
    .forEach((m) => {
        light.includedOnlyMeshes.push(m);
    });
```

This became a little tricky in the festival area because there were 2 lanterns on a platform, so for these I had to manually check for the grouped lanterns on the platform. This is why the first part of the function has checks for lanterns 14-21.

## Further Reading

**Previous:** [Cross Platform - Mobile](/guidedLearning/createAGame/crossPlatform)  
**Next:** [Outro](/guidedLearning/createAGame/closing)  
**(BONUS):** [Design Process & 3D Modeling](/guidedLearning/createAGame/designArt)

## Resources

**Files Used:**

-   [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
-   [lantern.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/lantern.ts)
