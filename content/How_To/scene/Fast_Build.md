---
title: Scene
image: 
description: Learn how to quickly build a world in a "scene" within Babylon.js.
keywords: diving deeper, scene
further-reading:
video-overview:
video-content:
---


## How To Fast Build a World

There are a number of helpers that, once you to have put models into a scene, add cameras, light and environment that adjust to the models automatically allowing you to quickly view them. You can then make adjustments as you need.

For beginners to Babylon.js these two sections [Fastest Build](/how_to/fast_build#fastest-build) and [Import and Fastest Build](/how_to/fast_build#import-and-fastest-build) will quickly give you a viewable world and are a good way of getting a look at models. As such they are level 1 material. It is worth considering working through Babylon101 and parts of the level 1 material in order to make the other information and details on this page more understandable.

## Helpers

The following is a list of the methods of the `scene` object that help in fast building a world, with a link to their API description:

* [createDefaultCameraOrLight](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultcameraorlight);
* [createDefaultCamera](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultcamera);
* [createDefaultLight](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultlight);
* [createDefaultEnvironment](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultenvironment);
* [createDefaultSkybox](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultskybox);


## Fastest Build

To build a world very quickly just use `createDefaultCameraOrLight` along with `createDefaultEnvironment` as in this example

```javascript
scene.createDefaultCameraOrLight(true, true, true);
scene.createDefaultEnvironment();
```
<Playground id="#MJNICE" title="The Quickest Way To Build A World" description="Simple example of creating a world with createDefaultEnviornment." image=""/>

You can see how the camera automatically adjusts by adding a second box and re-positioning it

<Playground id="#MJNICE#3" title="Fast Build With Camera Adjust" description="Simple example of building a world quickly and adjusting the camera." image=""/>

More information about these methods, including details about parameters, can be found in the individual sections below.


## Create Default Camera or Light

As can be seen in the _Fastest Build_ section the helper, `createDefaultCameraOrLight` creates both a camera and a light in one line.  The three parameters it can take are the same as for the `createDefaultCamera` method, the second parameter also refers to the light and replaces any existing camera or light when true. The approach to accessing the camera or light is the same as for the individual methods.

## Create Default Camera

The `createDefaultCamera` takes three boolean parameters, all set to _false_ by default. They are 

- createArcRotateCamera: creates a free camera by default and an arc rotate camera when _true_;
- replace: when _true_ the created camera will replace the existing active one;
- attachCameraControls: when _true_ attaches control to the canvas.

This code will create an arc rotate camera, replace any existing camera and attach the camera control to the canvas

```javascript
scene.createDefaultCamera(true, true, true)
```

<Playground id="#MJNICE#4" title="Camera Helper Example (no light)" description="Simple example of the camera helper with no light." image=""/>
<Playground id="#MJNICE#5" title="Camera Helper Example" description="Simple example of the camera helper." image=""/>

For a free camera 

```javascript
scene.createDefaultCamera(false, true, true)
```
<Playground id="#MJNICE#6" title="Camera Helper Example (Free Camera)" description="Simple example of the camera helper with a free camera." image=""/>

The camera will adjust depending on the size and position of each mesh in the world.

<Playground id="#MJNICE#7" title="Camera Helper Adjusting" description="Simple example of the camera helper and adjusting to a large box." image=""/>

### Accessing the Camera

Since creating the camera this way makes the helper created camera the active camera the simplest way to access it is using

```javascript
scene.createDefaultCamera(true, true, true);

var helperCamera = scene.activeCamera;
```

<Playground id="#MJNICE#11" title="Camera Helper With Active Camera Changes" description="Simple example of the camera helper and making changes to the active camera." image=""/>

An alternative way to access the helper created camera immediately after creating it is, since it will be the last one in the `scene.cameras` array, to use

```javascript
scene.createDefaultCamera(true, true, true);

var helperCamera = scene.cameras[scene.cameras.length - 1];

//OR

var helperCamera = scene.cameras.pop();
scene.cameras.push(helperCamera);
```

<Playground id="#MJNICE#8" title="Camera Helper With Radius and Angle Changes" description="Simple example of the camera helper and making changes to the camera radius and angles." image=""/>

## Create Default Light

The `createDefaultLight` takes just one boolean parameters, set to _false_ by default: 

- replace: when _true_ the created light will replace all the existing ones; when _false_ and there are no existing lights a hemispherical light is created; when _false_ and lights already exist, no change is made to the scene.

When this method is used before the creation of any other lights then it is usually sufficient to use

```javascript
scene.createDefaultLight();
```
### Accessing the Light

Provided you access the helper created light immediately after creating it, it will be the last one in the `scene.lights` array.

You can obtain it using

```javascript
scene.createDefaultLight();

var helperLight = scene.lights[scene.lights.length - 1];

//OR

var helperLight = scene.lights.pop();
scene.lights.push(helperLight);
```

<Playground id="#MJNICE#9" title="Light Helper With Direction and Color Change" description="Simple example of the light helper and changing the light's color and direction." image=""/>

## Create Default Environment

The simple code

```javascript
scene.createDefaultEnvironment()
```

adds a skybox and ground to the scene, sets a wide range of environmental parameters and returns an [environmental helper](//doc.babylonjs.com/api/classes/babylon.environmenthelper) to the scene.

You will also find below a helper for [just a skybox](/how_to/fast_build#create-default-skybox).

When you look at the following playground

<Playground id="#MJNICE" title="Playground Fast Build" description="Simple example of creating the default enviornment in the playground." image=""/>

it is not obvious that a skybox and ground have been added. The defaults have been set so as to be really subtle and help give a grounding feeling to the objects

Moving the camera further out shows that the skybox is constructed.

<Playground id="#MJNICE#1" title="Skybox Example" description="Simple example showing how to create a skybox." image=""/>

You can also see the skybox and ground by using the options parameter and setting different values for the skybox texture and the ground color.

<Playground id="#MJNICE#10" title="Skybox and Ground Changes" description="Simple example of creating a skybox and ground and changing their properties." image=""/>

### Options Parameters
As you can see in the above playground the `createDefaultEnvironment` method takes an options parameter. The full range of environmental helper options properties are available from the [API](//doc.babylonjs.com/api/interfaces/babylon.ienvironmenthelperoptions)

So, for example

to prevent the creation of the skybox:
```javascript
var helper = scene.createDefaultEnvironment({
    createSkybox: false
});
```
to enable ground reflection:
```javascript
var helper = scene.createDefaultEnvironment({
    enableGroundMirror: true
});
```
when you see z-fighting with the ground, modify the `groundYBias` to a larger number:
```javascript
var helper = scene.createDefaultEnvironment({
    groundYBias: 0.01
});
```

### Applicable Methods

Since the `createDefaultEnvironment` method returns an `environmentalHelper` object then all the properties and methods of this object (as in the [API](//doc.babylonjs.com/api/classes/babylon.environmenthelper)) are available. 

So, for example if the environment color is not your favorite choice you can modify it after creation

```javascript
var helper = scene.createDefaultEnvironment();
helper.setMainColor(BABYLON.Color3.Teal());
```

<Playground id="#MJNICE#12" title="Changing The Main Color" description="Simple example of changing the scene's main color." image=""/>

or for instance should you wish to dispose of the ground after creation of the environment use
```javascript
var helper = scene.createDefaultEnvironment();
helper.ground.dispose();
```

or how about changing the options parameters
```javascript
var helper = scene.createDefaultEnvironment();
var options = {
    skyboxTexture: new BABYLON.CubeTexture("/textures/skybox", scene)
}
helper.updateOptions(options);
```

<Playground id="#MJNICE#13" title="Changing Scene Options" description="Simple example showcasing how to change options of the scene." image=""/>

### Environmental Helper

NOTE: The environment helper relies exclusively on the [BackgroundMaterial](/How_To/BackgroundMaterial) to be as efficient as possible.

## Create Default Skybox

The `createDefaultSkybox` method can be used when you do not want to create a full environment. The [parameters](//doc.babylonjs.com/api/classes/babylon.scene#createdefaultskybox) used determine how the skybox is created.

for example 

```javascript
var texture = new BABYLON.CubeTexture("/assets/textures/SpecularHDR.dds", scene);
scene.createDefaultSkybox(texture, true, 100);
```

In this case the first two parameters used give the texture for the skybox and specify that [a PBRMaterial](/how_to/physically_based_rendering) is to be used (second parameter, _true_) as opposed to a standard material (second parameter, _false_ - default value).

The third parameter defines the scale of your skybox (this value depends on the scale of your scene), the default value is _1000_.

<Playground id="#MJNICE#14" title="Skybox Scale Example" description="Simple example showing how to scale a skybox in the playground." image=""/>


## Import and Fastest Build

To import models and build a world very quickly just use `createDefaultCameraOrLight` along with `createDefaultEnvironment` as in this example

<Playground id="#MJNICE#15" title="Importing Models and Quickly Building A World" description="Simple example showcasing how to import models and quickly build a world." image=""/>

The camera adjusts its position automatically to make the world viewable depending on the scale and position of the models. More information on importing models with the scene helpers follows below.

## Importing Models for Your World

Since the `createDefault...` helpers take into account any models in the scene they can only be applied after the model is loaded and so are placed in the callback function. For example

```javascript
BABYLON.SceneLoader.Append("https://www.babylonjs.com/Assets/DamagedHelmet/glTF/", "DamagedHelmet.gltf", scene, function (meshes) {
    scene.createDefaultCameraOrLight(true, true, true);
    scene.createDefaultEnvironment();       
});
```

There is then a problem. When creating a scene Babylon.js checks for a camera. When importing models, the existence of a camera will be checked for before the model has finished loading and so the scene will fail.

The solution is to replace the `createScene` function with the `delayCreateScene` function. Whether in a playground or in your own project this is a direct replacement.

**NOTE:** Other [scene loader](/how_to/load_from_any_file_type) methods are available.

### Using Scene Helpers with Import

All the helper methods described earlier on this page behave in exactly the same way when importing models. Just remember to call them within the scene loader callback.

### Import Playground Examples

<Playground id="#10D6YT#33" title="Simple Import and Main Color Change" description="Simple example of importing a scene and changing the main color." image=""/>
<Playground id="#10D6YT#35" title="Importing Blur, Reflections, and Shadow" description="Simple example showing how to import blur, reflections, and shadows." image=""/>