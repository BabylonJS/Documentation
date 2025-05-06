---
title: Lanterns
image:
description: Dive into some deeper game creation methods and techniques.
keywords: guided learning, create a game, game, light, multiple lights, texture, collisions
further-reading:
video-overview:
video-content:
---

## Summary

The lanterns in my game have a few different components. In this section, I'll be going over the mesh itself, texture swapping, collisions, and lights.

## Lantern Mesh

The lanterns are duplicates of a single mesh. If a mesh is interactable, it's best to clone it as often as possible if you're going to be using multiple instances. I followed the [Demystifying Animation Groups](https://www.youtube.com/watch?v=BSqxoQ-at24) to learn how to clone the meshes.

In [\_loadAsset](https://github.com/BabylonJS/SummerFestival/blob/master/src/environment.ts#L100), after we've imported our environment, we'll want to also import our single lantern mesh.

```javascript
//loads lantern mesh
const res = await ImportMeshAsync("./models/lantern.glb", this._scene);
```

Then, we extract the mesh from the root, and remove the root. [The coordinate system guide for 3DMax](/features/featuresDeepDive/Exporters/3DSMax_to_glTF#left-to-right-handed-coordinate-system) explains why we have this root node when we import the glTF. Since we want to clone just the mesh, we'll need to remove the root.

```javascript
//extract the actual lantern mesh from the root of the mesh that's imported, dispose of the root
let lantern = res.meshes[0].getChildren()[0];
lantern.parent = null;
res.meshes[0].dispose();
```

Then we add this to the object we're returning to the load function.

```javascript
return {
    //..envrionment meshes
    lantern: lantern as Mesh,
}
```

### Creating Lanterns

Once we've gotten the result of our import (_assets_), the [load](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/environment.ts#L30) function is in charge of setting up all of the lanterns in the scene.

```javascript
assets.lantern.isVisible = false; //original mesh is not visible
//transform node to hold all lanterns
const lanternHolder = new TransformNode("lanternHolder", this._scene);
```

From our assets, we want to make our lantern invisible. This original mesh's only purpose is to be cloned to create our other meshes. Then we want to create a transform node to hold all of our lanterns. I did this just to have them organized together. It makes navigating through the inspector a lot easier when trying to debug.

Then we loop through however many lanterns we want to create, for the game I made 22 lanterns. For each pass through the for loop, we want to:

1. Create a clone of our mesh, set it to visible, and then add it to our transform node.

```javascript
//Mesh Cloning
let lanternInstance = assets.lantern.clone("lantern" + i); //bring in imported lantern mesh & make clones
lanternInstance.isVisible = true;
lanternInstance.setParent(lanternHolder);
```

2. Create our lantern and add it to our array of lantern objects.

```javascript
//Create the new lantern object
let newLantern = new Lantern(
  this._lightmtl,
  lanternInstance,
  this._scene,
  assets.env
    .getChildTransformNodes(false)
    .find((m) => m.name === "lantern " + i)
    .getAbsolutePosition(),
  animGroupClone,
);
this._lanternObjs.push(newLantern);
```

**\_lanternObjects** should be instantiated as an empty array in the environment constructor.

Once we've gone through and created all of our lanterns, we can dispose of the original lantern mesh

```javascript
assets.lantern.dispose();
```

## Lantern Class

So, what exactly does creating a new lantern do? I've created a Lantern class in **lantern.ts**. This will store the information for each lantern instance.

In order to create a lantern, we need:

1. The material we're going to swap to when lit
2. A mesh
3. The scene it belongs to
4. A position

In the [constructor](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/tutorial/oldLantern.ts#L18) of our lantern, we want to set all of these up.

```javascript
constructor(lightmtl: PBRMetallicRoughnessMaterial, mesh: Mesh, scene: Scene, position: Vector3, animationGroups?: AnimationGroup) {
    this._scene = scene;
    this._lightmtl = lightmtl;

    //create the lantern's sphere of illumination
    const lightSphere = MeshBuilder.CreateSphere("illum", {segments: 4, diameter:20}, this._scene);
    lightSphere.scaling.y = 2;
    lightSphere.setAbsolutePosition(position);
    lightSphere.parent = this.mesh;
    lightSphere.isVisible = false;
    lightSphere.isPickable = false;
    this._lightSphere = lightSphere;

    //load the lantern mesh
    this._loadLantern(mesh, position);
}
```

- **lightSphere** is an invisible mesh that will be used later to calculate what meshes are affected by the lantern's light.
- [\_loadLantern](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/tutorial/oldLantern.ts#L41) takes care of setting the mesh and position of our lantern. We need to set the absolute position instead of local position because this is an imported glTF.

```javascript
this.mesh = mesh;
this.mesh.scaling = new Vector3(0.8, 0.8, 0.8);
this.mesh.setAbsolutePosition(position);
this.mesh.isPickable = false;
```

I didn't want the player to be able to jump on the lantern, so I set isPickable to false (default is true). And since I didnt want the player to collide(physically) with the lantern, I kept checkCollisions to false (which is the default value). This way, the player can easily navigate through lanterns while still having a way to check that we've intersected with them.

### Collisions

The final setup part of our lanterns is calling [checkLanterns](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/environment.ts#L133) in [\_initializeGameAsync](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/app.ts#L929).

The first thing we'll need to do is set up an actionManager inside of the Player Constructor

```javascript
//--COLLISIONS--
this.mesh.actionManager = new ActionManager(this.scene);
```

This function has 2 main purposes:

1. Light the first lantern. It's pre-lit to allow the player to not get stuck if they haven't found the next lantern in time. They can return to this lantern to re-light their sparkler.

```javascript
if (!this._lanternObjs[0].isLit) {
  this._lanternObjs[0].setEmissiveTexture();
}
```

2. Set up the intersection triggers for each lantern with the player. Using `ActionManger.OnIntersectionEnterTrigger`, we're watching for 1 of 2 things when the player intersects with a lantern:
   1. The lantern is unlit and the player sparkler is lit:
   ```javascript
   //if the lantern is not lit, light it up & reset sparkler timer
   if (!lantern.isLit && player.sparkLit) {
     player.lanternsLit += 1; //increment the lantern count
     lantern.setEmissiveTexture(); //"light up" the lantern
     //reset the sparkler
     player.sparkReset = true;
     player.sparkLit = true;
   }
   ```
   2. The lantern is already lit:
   ```javascript
   //if the lantern is lit already, reset the sparkler
   else if (lantern.isLit) {
       player.sparkReset = true;
       player.sparkLit = true;
   }
   ```

### Setting Emissive Texture

The [\_setEmissiveTexture](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/tutorial/oldLantern.ts#L48) function handles everything that's involved in "lighting" the lantern.

1. We need to know that the lantern is now lit.

```javascript
this.isLit = true;
```

2. Swap the texture to make the lantern visually look like it's been lit.

```javascript
this.mesh.material = this._lightmtl;
```

#### Texture Swapping

This is a super simple process that involves making a material that has a texture of what the lantern looks like when "lit".  
![unlit lantern](/img/how_to/create-a-game/unlit.png) ![lit lantern](/img/how_to/create-a-game/lit.png)

I generated this texture in Blender, just giving the mesh an emissive coloring and then baking that into a .png.

```javascript
//create emissive material for when lantern is lit
const lightmtl = new PBRMetallicRoughnessMaterial("lantern mesh light", this._scene);
lightmtl.emissiveTexture = new Texture("/textures/litLantern.png", this._scene, true, false);
lightmtl.emissiveColor = new Color3(0.8784313725490196, 0.7568627450980392, 0.6235294117647059);
this._lightmtl = lightmtl;
```

This texture is then used to make a new material that we'll be swapping once \_setEmissiveTexture is called. This material is created in the Environment constructor, then passed into the [lantern constructor](#creating-lanterns).

Here is we create a new folder for textures in the public folder.

3. Dynamically create a point light where the lantern is in order to light up the surroundings.

```javascript
const light = new PointLight("lantern light", this.mesh.getAbsolutePosition(), this._scene);
light.intensity = 30;
light.radius = 2;
light.diffuse = new Color3(0.45, 0.56, 0.8);
this._findNearestMeshes(light);
```

#### Multiple Lights

The most important part of this is the fact that there is a default cap on the number of lights a material can have. This is for performance reasons. If you have a ton of lights, it'll slow everything down. However, it's possible to get good performance if we use small lights and limit the amount of meshes the light affects. This is what [\_findNearestMeshes](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/tutorial/oldLantern.ts#L67) does.

```javascript
this._scene
  .getMeshByName("__root__")
  .getChildMeshes()
  .forEach((m) => {
    if (this._lightSphere.intersectsMesh(m)) {
      light.includedOnlyMeshes.push(m);
    }
  });
//get rid of the sphere
this._lightSphere.dispose();
```

This goes through the entire scene, looks for what the lightSphere intersects with and pushes those meshes to the list of what our light affects. I was able to achieve this by referring to what was done in this

PG: <Playground id="#WJWSNL" title="Lanterns Playground" description="Playground Creation and Positioning of Multiple Lights."/>

**Note: the implementation for the lights here is what I had before making adjustments during the performance phase. If you'd like to see the final version, take a look at the [performance](/guidedLearning/createAGame/performance#lights) section.**

Now, when you run the game and collide with the lanterns, you should see their materials change (except the first one since that one is pre-lit)!

## Resources

**Files Used:**

- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
- [environment.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/environment.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)
- [lantern.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/oldLantern.ts)

**Follow Along:**

- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/lanterns/app.ts)
- [environment.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/lanterns/environment.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/lanterns/characterController.ts)
- [lantern.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/lanterns/lantern.ts)
- [lantern mesh](https://github.com/BabylonJS/SummerFestival/blob/master/public/models/lantern.glb)
- [lit lantern texture](https://github.com/BabylonJS/SummerFestival/blob/master/public/textures/litLantern.png)
