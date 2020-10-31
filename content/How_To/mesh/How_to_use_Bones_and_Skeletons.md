# Bones and Skeletons

Babylon.js supports bones animations for your meshes.

![Bones](/img/how_to/bones-skeletons/bones.jpg)

Basically a skeleton (```BABYLON.Skeleton```) contains a hierarchy of bones (```BABYLON.Bone```). A bone is defined by a name, a parent (can be null) and a transformation matrix.

Here are the constructors:

- `BABYLON.Skeleton` = function (name, id, scene)
- `BABYLON.Bone` = function (name, skeleton, parentBone, matrix)

Inside a skeleton, bones can be found inside the ```skeleton.bones``` array.

A bone can contain animations to animate its ```matrix``` property.

A bone must have its inverted absolute transform matrix set. If you are importing a skeleton this might already be computed. But if you are creating your own skeleton programatically you need to do this in your code.

The easiest way to do it is: 

```javascript
skeleton.returnToRest();
```

# Preparing mesh

A skeleton can be applied to a mesh through the ```mesh.skeleton``` property.

You should note that babylon.js supports up to **4 bones influences per vertex**.

The mesh must also have additional vertices data:
* _Matrices weights_: 4 floats to weight bones matrices  
(```mesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matricesWeights, false)```)
* _Matrices indices_: 4 floats to index bones matrices  
(```mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, floatIndices, false)```)

The final matrix applied to each vertex is computed as follows:

```javascript
finalMatrix = worldMatrix * (bonesMatrices[index0] * weight0 + bonesMatrices[index1] * weight1 + bonesMatrices[index2] * weight2 + bonesMatrices[index3] * weight3)
```

On low-end hardware, the maximum bones influences per vertex is reduced to 3.

By default the system will try to store the bone matrices into a texture to save shader uniforms. If you still want to use shader uniforms, you can call:

```javascript
skeleton.useTextureToStoreBoneMatrices = false;
```

# Loading bones

Skeletons and bones can be loaded from .babylon files.

Here is a sample of how to load a boned mesh and how to launch skeleton animation:

```javascript
BABYLON.SceneLoader.ImportMesh("him", "Scenes/Dude/", "Dude.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    var dude = newMeshes[0];

    dude.rotation.y = Math.PI;
    dude.position = new BABYLON.Vector3(0, 0, -80);

    scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);
});
```

A complete running example can be found [on this playground](https://www.babylonjs-playground.com/#92Y727)

# Cloning bones

Bones and skeletons can be cloned (This is the case with the rabbits in the previous link).

Here is a sample of how to load and clone a mesh and its skeleton:

```javascript
BABYLON.SceneLoader.ImportMesh("Rabbit", "Scenes/Rabbit/", "Rabbit.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    var rabbit = newMeshes[1];

    rabbit.scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);
    shadowGenerator.getShadowMap().renderList.push(rabbit);

    var rabbit2 = rabbit.clone("rabbit2");
    var rabbit3 = rabbit.clone("rabbit2");

    rabbit2.position = new BABYLON.Vector3(-50, 0, -20);
    rabbit2.skeleton = rabbit.skeleton.clone("clonedSkeleton");

    rabbit3.position = new BABYLON.Vector3(50, 0, -20);
    rabbit3.skeleton = rabbit.skeleton.clone("clonedSkeleton2");

    scene.beginAnimation(skeletons[0], 0, 100, true, 0.8);
    scene.beginAnimation(rabbit2.skeleton, 73, 100, true, 0.8);
    scene.beginAnimation(rabbit3.skeleton, 0, 72, true, 0.8);
});
```
# Cloning Complex Models
More complex models, such as the Dude, contain submeshes. When cloning you must iterate and clone the submeshes as well. Here is an example of how to clone a more complex model:

```javascript
BABYLON.SceneLoader.ImportMesh("him", "Dude/", "dude.babylon", scene, function (newMeshes, particleSystems, skeletons) {

    newMeshes[0].position = new BABYLON.Vector3(0, 0, 5);  // The original dude
    scene.beginAnimation(skeletons[0], 0, 120, 1.0, true);

    dudes = [];

    for (i = 0; i < 10; i++) { // 10 clones
        var xrand = Math.floor(Math.random() * 501) - 250;
        var zrand = Math.floor(Math.random() * 501) - 250;

        var c = [];

        for (j = 1; j < newMeshes.length; j++) {
            c[j] = newMeshes[j].clone("c" + j);
            c[j].position = new BABYLON.Vector3(xrand, 0, zrand);
            c[j].skeleton = newMeshes[j].skeleton.clone();
            scene.beginAnimation(c[j].skeleton, 0, 120, 1.0, true);
        }
        dudes[i] = c;
    }
}
```

# Picking a mesh attached to a skeleton

Because bones are computed by the GPU, the CPU has no clue where the mesh's vertices are. So picking a mesh with a skeleton will only work on the bind pose which could be sub-optimal.

You can decide to call `mesh.refreshBoundingInfo(true)` to force the CPU to update its local version of the mesh so that you can pick it correctly:

```javascript
mesh.refreshBoundingInfo(true);
var pickResult = scene.pick(scene.pointerX, scene.pointerY);
```

Please keep in mind that this operation is using the CPU so it has to be used wisely as it could impact performance.

# Attaching a mesh to a specific bone

Starting with babylon.js v2.2, you can now attach a mesh to a bone (like a sword in the hand of your character for instance). To do so, just specify on which bone with the following code:

```javascript
sword.attachToBone(skeleton.bones[34], character);
```

Please note that you also need to specify on which mesh the bone is currently applied.
You can find a sample [on this playground](https://www.babylonjs-playground.com/#11BH6Z#18)

# Rotating, Positioning, and Scaling bones

Starting with babylon.js v2.5, you can easily position, rotate, and scale bones.

Bones can be rotated and positioned in local space and world space.  To move a bone in world space, you must pass BABYLON.Space.WORLD and the mesh to the method.  If a space isn't passed to the method, then the bone is moved in local space (relative to the parent bone).


## Rotating

To rotate a bone around an axis, use the rotate function:

```javascript
bone.rotate(axis, angle, BABYLON.Space.WORLD, mesh);
```
* rotate world space [demo](https://www.babylonjs-playground.com/#D4ZZ8#2)
* rotate local space [demo](https://www.babylonjs-playground.com/#D4ZZ8#4)

setAxisAngle, setYawPitchRoll, setRotation, or setRotationMatrix are used to rotate a bone to a specific rotation.

```javascript
bone.setAxisAngle(axis, angle, BABYLON.Space.WORLD, mesh);
```
* setAxisAngle world space [demo 1](https://www.babylonjs-playground.com/#D4ZZ8#8)
* setAxisAngle world space [demo 2](https://www.babylonjs-playground.com/#D4ZZ8#9)
* setAxisAngle local space [demo 1](https://www.babylonjs-playground.com/#D4ZZ8#10)
* setAxisAngle local space [demo 2](https://www.babylonjs-playground.com/#D4ZZ8#11)

```javascript
bone.setYawPitchRoll(yaw, pitch, roll, BABYLON.Space.WORLD, mesh);
```
[demo](https://www.babylonjs-playground.com/#I6RJJ#56)

```javascript
bone.setRotation(rotation, BABYLON.Space.WORLD, mesh);
```
[demo](https://www.babylonjs-playground.com/#I6RJJ#60)

```javascript
bone.setRotationQuaternion(quat, BABYLON.Space.WORLD, mesh);
```
[demo](https://www.babylonjs-playground.com/#I6RJJ#61)

```javascript
bone.setRotationMatrix(rotMat, BABYLON.Space.WORLD, mesh);
```
[demo](https://www.babylonjs-playground.com/#I6RJJ#57)


Use getRotation or getRotationToRef to get the Vector3 rotation of a bone.

```javascript
var rotation = bone.getRotation(BABYLON.Space.WORLD, mesh);
```

```javascript
var rotation = BABYLON.Vector3.Zero();

bone.getRotationToRef(BABYLON.Space.WORLD, mesh, rotation);
```
[demo](https://www.babylonjs-playground.com/#1EVNNB#12)

Use getRotationQuaternion or getRotationQuaternionToRef to get the Quaternion rotation of a bone.

```javascript
var rotationQuaternion = bone.getRotationQuaternion(BABYLON.Space.WORLD, mesh);
```

```javascript
var rotationQuaternion = BABYLON.Vector3.Zero();

bone.getRotationQuaternionToRef(BABYLON.Space.WORLD, mesh, rotationQuaternion);
```
[demo](https://www.babylonjs-playground.com/#1EVNNB#11)

You can also use `bone.rotation` to set and get local space rotation quaternion.

## Positioning

To change the position of a bone, you can rotate the parent bone, or you can leave the parent where it is and directly modify the position of the bone.

One way to do this is by translating the bone from its current position.
```javascript
bone.translate(x, y, z, BABYLON.Space.WORLD, mesh);
```
[demo](https://www.babylonjs-playground.com/#1BZJVJ#32)

If you need to set the bone to a specific location, use setPosition.

```javascript
bone.setPosition(pos, BABYLON.Space.WORLD, mesh);
```
* [demo 1](https://www.babylonjs-playground.com/#1BZJVJ#33)
* [demo 2](https://www.babylonjs-playground.com/#1BZJVJ#34)

To get the position of a bone, use getPosition or getPositionToRef.
```javascript
var pos = bone.getPosition(BABYLON.Space.WORLD, mesh);
```

```javascript
var pos = BABYLON.Vector3.Zero();

bone.getPositionToRef(BABYLON.Space.WORLD, mesh, pos);
```
[demo](https://www.babylonjs-playground.com/#1EVNNB#14)

You can also use `bone.position` to set and get local space position.

## Scaling

You can scale a bone on the local x, y, z axes of the bone (it is a cumulative effect).
```javascript
bone.scale(scaleX, scaleY, scaleZ);
```
[demo](https://www.babylonjs-playground.com/#1EVNNB#9)

The last parameter of scale is scaleChildren.  Set scaleChildren to true if you want the scale to affect all the children / descendants of the bone. By default this parameter is off.
[demo](https://www.babylonjs-playground.com/#1BZJVJ#117)

scale is called on every frame, because the character's animation resets the scale of the bones.

The setScale function can be used to directly set a bone to a certain scale vector value.
```javascript
bone.setScale(scaleVector);
```
[demo](https://www.babylonjs-playground.com/#D9U0UW#1) 

Use getScale or getScaleToRef to get the current scale of a bone.

```javascript
var scale = bone.getScale();
```

```javascript
var scale = BABYLON.Vector.Zero();
bone.getScaleToRef(scale);
```

You can also use `bone.scaling` to set and get local space scaling.

# Bone Controllers

Babylon.js v2.5 also introduced Bone controllers.

## BoneLookController

The BoneLookController class is used to make a bone look toward a point in space.

With some bones, you will need to adjust the yaw, pitch, roll to get the bone to look in the right direction.

```javascript
var target = BABYLON.MeshBuilder.createSphere();
var lookCtrl = new BABYLON.BoneLookController(characterMesh, headBone, target.position, {adjustYaw:Math.PI*.5, adjustPitch:Math.PI*.5, adjustRoll:Math.PI});

scene.registerBeforeRender(function(){

   lookCtrl.update();

});
```
[demo](https://www.babylonjs-playground.com/#1B1PUZ#15)


## BoneIKController

Inverse Kinematics (IK) is used to rotate a chain of bones so that the end of the first bone is at or closest to a target point.  It's often used to rotate the limbs of a character.

The BoneIKController class is modeled after Blender's IK Bone Constraint, but is currently limited to 2 bones.

To use the BoneIKController, you must first create a target mesh and a pole target mesh.

```javascript
var target = BABYLON.MeshBuilder.CreateSphere('', { diameter: 5 }, scene);
var poleTarget = BABYLON.MeshBuilder.CreateSphere('', {diameter: 2.5}, scene);
```

The bones will reach for the target mesh and the position of the pole target will determine how the joint between the bones will bend.

You most likely will want to parent your character to the pole target mesh so that it will move relative to the character.

```javascript
poleTarget.parent = characterMesh;
```

The BoneIKController constructor takes the mesh of the character, the bone that will be closest to the target, the target, and an options param.  The currently list of options are:

targetMesh,
poleTargetMesh,
poleTargetBone,
poleTargetLocalOffset,
poleAngle,
bendAxis,
maxAngle

```javascript
var ikCtrl = new BABYLON.BoneIKController(characterMesh, forearmBone, {targetMesh:target, poleTargetMesh:poleTarget, poleAngle:Math.PI});
```

To use the controller, simply call the controller's update function before the scene is rendered.

```javascript
scene.registerBeforeRender(function(){
   ikCtrl.update();
});
```
[demo](https://www.babylonjs-playground.com/#1EVNNB#15)

If you used a mesh for a target, you can hide it by setting enabled to false.

```javascript
target.setEnabled(false);
poleTarget.setEnabled(false);
```

# Performance considerations

Bones are computed using shaders by default. This allows better performance. But on low end devices, shaders could be limited and not able to process bones. You can in this case ask Babylon.js to compute bones using CPU by setting `mesh.computeBonesUsingShaders = false`.

# Debugging

Starting with Babylon.js v4.0, you can use the Inspector to turn [skeleton viewer](https://doc.babylonjs.com/features/playground_debuglayer#bones-viewer) on and off.

## Debugging Extras

Starting with Babylon.js v4.2, you have a few more options to debug a skeleton with.  We now have incorporated additional bone views, to help visualize the position of the bones which are accessible through the same means as explained in the above sections' Inspector link. Additionally two new methods have been added to construct ShaderMaterials for both a skeleton map and assigned bone weights.

### New Viewer Info

There are some requirements to take into consideration when trying to use the view modes for the skeleton viewer. First the SkeletonViewer class accepts a new constructor argument of options that will dictate the visual look of the debug mesh. Through this new argument there a bunch of new options to configure the outcome. Note that this is not a required parameter and if omitted then the debug mesh will use classic lines system.

There are some differences in with the new views from how the old lines view functioned. With the old method, for each bone per frame the points are updated and the line system is redrawn with its buffer being updated (all of which happens on the CPU). The new views are a unified mesh that match the matrices of the skeleton system. There is some impact at creation time to properly create the buffers, but once that is done it offers more performance and less impact as it is handled after inception by the GPU. Keep in mind to make sure your skeleton has proper restPose Matrices bound and updated, otherwise the debug mesh will fail to position itself correctly.

```javascript
let skeletonView = new BABYLON.Debug.SkeletonViewer(
            skeleton,   //Target Skeleton
            mesh,       //That skeletons Attached Mesh or a Node with the same globalMatrix
            scene,      //The Scene scope
            false,      //autoUpdateBoneMatrices?
            (mesh.renderingGroupId > 0 )?mesh.renderingGroupId+1:1,  // renderingGroupId
            options     //Configuration Options
        );
```

To configure some of how the parsing happens you can change these values. Also take note that the options for the display modes lives here as well.
```javascript
let options {
   pauseAnimations?: boolean, //True or False flag to pause the animations while trying to construct the debugMesh. Default: True
   returnToRest?: boolean, //Flag to force the skeleton back into its restPose before constructing the debugMesh. Default: False
   computeBonesUsingShaders?: boolean, //Tell the debugMesh to use or not use the GPU for its calculations, if you ever want to do picking on the mesh this will need to be False. Default: True
   useAllBones?: boolean, //Visualize all bones or skip the ones with no influence. 
   displayMode?: number //A value that controls which display mode to use. (SkeletonViewer.DISPLAY_LINES = 0, SkeletonViewer.DISPLAY_SPHERES = 1, SkeletonViewer.DISPLAY_SPHERE_AND_SPURS = 2). Default = 0.
   displayOptions?: any //The visual parameters for the debugMeshes.
};
```

In order to configure the new views display options, we have these new parameters.
```javascript
let displayModeOptions {
   sphereBaseSize? : number, //The size of the sphere when scaled by the sphereScaleUnit after determining the longest bone in the system. Default = 0.15
   sphereScaleUnit? : number, //The number that is used to determine the ratio of the spheres scale in relation to the longest bone in the system.  Defaults to 2, with general assumptions that 1 scene unit is treated as 1 meter (you can assume what ever scene unit though).
   sphereFactor? : number, //A scalar that makes the spheres get smaller the farther away from the root bone they are. Default = 0.865
   midStep? : number, //The number that represents where the bones 'spur' will be at its maximum thickness. Default = 0.235
   midStepFactor? : number, //The ratio of how thick the bone should be in relation to its length. Default = 0.155
   showLocalAxes? : boolean, //Flag to display te bones local axes as line systems. Default = False
   localAxesSize? : number, //Size of the local Axes. Default = 0.075
};
```

[Demo](https://playground.babylonjs.com/#BCU1XR#1616)

### Debug Shader Usage

Sometimes you will need to actually see whart parts of your mesh a certain bone is influencing. When this need arises we've got you covered with some nifty new ShaderMaterials! 

#### SkeletonMap Shader

The first one, which is a color map of the entire skeleton, is called a SkeletonMap. This will show you a unique color for each bone and visual feedback of how all of their influences interact. It's static method and when creating one, it expects two parameters, options and scene.

```javascript
let mapShader = BABYLON.Debug.SkeletonViewer.CreateSkeletonMapShader( options, scene);
```

Inside the options you must pass a skeleton key and value. A secondary optional argument for generating the color gradient for the bones is called as colorMap.

```javascript
let options = {
   skeleton : BABYLON.Skeleton,
   colorMap? : any[]
};
```

In order to leverage the color map you will need to pass in an array of objects with this format:
```javascript
let colorMapItem = {
   color : BABYLON.Color3, //The Color to use
   location : number // Where on the gradient it is. Between 0-1
};
```
This array is expected to have the items arranged with their location value in ascending order.
[Demo](https://playground.babylonjs.com/#BCU1XR#1618)

#### BoneWeight Shader

The second of the two will show more specific data on a per bone basis.

```javascript
let boneWeightShader = BABYLON.Debug.SkeletonViewer.CreateBoneWeightShader( options, scene);
```

Inside the options you must pass a skeleton key and value. Optional arguments are for color control and the starting selected bone.

```javascript
let options = {
   skeleton : BABYLON.Skeleton,
   colorBase? : BABYLON.Color3, //The color when a bone has 0 influence. Default = Black
   colorZero? : BABYLON.Color3, //The color when a bone has > 0 influence < 0.25. Default = Blue
   colorQuarter? : BABYLON.Color3, //The color when a bone has >= 0.25 influence < 0.5. Default = Green
   colorHalf? : BABYLON.Color3, //The color when a bone has >= 0.5 influence < 0.75. Default = Yellow
   colorFull? : BABYLON.Color3, //The color when a bone has >= 0.75 influence <= 1. Default = Red
   targetBoneIndex?: number //The bone._index value that you wish to display. Default = 0
};
```

The bone that is to be displayed is controlled by setting a uniform on the shader.
```javascript
boneWeightShader.setFloat(targetBoneIndex, index)
```

[Demo](https://www.babylonjs-playground.com/#1BZJVJ#395)
