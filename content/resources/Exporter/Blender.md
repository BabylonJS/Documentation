# Blender to Babylon.js exporter

The Blender export plugin can be found on [github repository](https://github.com/BabylonJS/BlenderExporter). We assume your using the last version.

Note that v6 is for Blender 2.8 (currently in beta), v5 for Blender 2.79b or below can be found in the `deprecated` folder.

An extension named [Tower of Babel](https://github.com/BabylonJS/Extensions/tree/master/QueuedInterpolation/Blender) can also be used as exporter. It exports JavaScript modules with in-line geometry and simplifies the loading process. See its readme or that of the [QueuedInterpolation](https://github.com/BabylonJS/Extensions/tree/master/QueuedInterpolation) extension, which it is part of, to know more about its functionalities, and access its proper documentation.

## Installation

This add-on use the standard Blender installation procedure:

- Download the [last version from github](https://github.com/BabylonJS/BlenderExporter) (_Blender2Babylon-X.X.zip_, you don't need to unzip).
- In Blender, go to `File` menu > `User Preferences`.
- Switch to the `Add-ons` tab.
- (optionnal) If you already have an old version installed, search for *Babylon.js* into the filter, expand infos of BabylonJS add-on and click `Remove` button.
- Click the `Install from File...` button at the bottom.
- Select the zip file and click the `Install Add-on from File...` button.
- Check the box to enable it.
- Click `Save User Settings` to enable it at every Blender launch.

![blender user preferences](img/exporters/blender/Blender2BabylonJS-installation.png)

## Features:

### Scene

![Blender scene properties panel](img/exporters/blender/scene/scene-properties-panel.png)

| Blender | [BJS equivalent](/api/classes/babylon.scene) |
| --- | --- |
| Scene</br>![scene](img/exporters/blender/scene/scene.png) | <ul><li>Camera: set scene activeCamera</li></ul> |
| Exporter panel</br>![exporter-scene-options](img/exporters/blender/scene/exporter-scene-options.png) | <ul><li>`Export`: <ul><li>`All`: all the file will be exported</li><li>`Selected`: only selection will be exported</li><li>`Layers`: hidden layers will not be exported</li></ul></li><li>`Max Decimal Precision`: how values are rounded during export</li></ul> |

---

### World

![Blender world properties panel](img/exporters/blender/world/world-properties-panel.png)

#### Blender Render

| Blender | [BJS equivalent](/api/classes/babylon.scene) |
|---|---|
| World</br>![world-br](img/exporters/blender/world/blender-render/world.png) | <ul><li>Horizon Color: scene clearColor</li><li>Ambient Color: scene ambientColor</li></ul> |
| Exporter panel</br>![mist](img/exporters/blender/world/blender-render/mist.png) | <ul><li>Mist: when Blender Render Mist is enabled, you have access to Fog Mode & Fog Density parameters</li></ul> |

---

### Object

![Blender object properties panel](img/exporters/blender/object/object-properties-panel.png)

| Blender | BJS equivalent |
| --- | --- |
| ![header](img/exporters/blender/object/header.png) | <ul><li>object name will be exported as it is</li></ul>|
| Transform</br>![transform](img/exporters/blender/object/transform.png) | <ul><li>Position</li><li>Rotation<ul><li>XYZ Euler</li><li>Quaternion</li></ul></li><li>Scale<ul><li>do not forget to apply Scale before exporting: 'Ctrl' + 'A' > 'Scale'</li></ul></li></ul>|
| Relations</br>![relations](img/exporters/blender/object/relations.png) | <ul><li>parenting is supported</li></ul>|

---

### Constraints

![Blender constraints properties panel](img/exporters/blender/constraints/constraints-properties-panel.png)

| Blender | BJS equivalent |
| --- | --- |
| ![constraints](img/exporters/blender/constraints/constraints.png) | <ul><li>Track To: useful when using ArcRotate camera [(tip)](//doc.babylonjs.com/exporters/blender_tips#arcrotate)</li></ul>|

---

### Cameras

![Blender cameras properties panel](img/exporters/blender/cameras/cameras-properties-panel.png)

| Blender | [BJS equivalent](/api/classes/babylon.camera) |
|---|---|
| Lens</br>![lens](img/exporters/blender/cameras/lens.png) | <ul><li>Field of View: fov</li><li>Clipping: minZ & maxZ</li> |
| Exporter panel</br>![exporter-cameras-options](img/exporters/blender/cameras/exporter-cameras-options.png) | <ul><li>Camera Type, choose between:<ul><li>Arc Rotate [(tip)](//doc.babylonjs.com/exporters/blender_tips#arcrotate)</li><li>Device Orientation</li><li>Follow</li><li>Gamepad</li><li>Touch</li><li>Universal</li><li>Virtual Joysticks</li><li>VR Dev Orientation Free</li><li>Web VR Free</li></ul></li></ul> |

---

### Lights

![Blender lights properties panel](img/exporters/blender/lights/lights-properties-panel.png)

| Blender | [BJS equivalent](/api/classes/babylon.light) |
|---|---|
| Lamp</br>![lamp](img/exporters/blender/lights/lamp.png) | <ul><li>Sun as Directionnal, Area as Point, other named like in BJS</li><li>This Layer Only: [includedOnlyMeshes](/api/classes/babylon.light#includedonlymeshes-abstractmesh-classes-3-0-abstractmesh-)</li><li>when Sphere is checked, Distance value is exported as range</li></ul> |
| Spot Shape</br>(only available when light type is Spot)</br>![spot-shape](img/exporters/blender/lights/spot-shape.png) | <ul><li>Size: Angle</li><li>Blend: value &#42; 2 = exponent</li></ul> |
| Exporter panel</br>![exporter-lights-options](img/exporters/blender/lights/exporter-lights-options.png) | <ul><li>Shadow Map (only for directional lights):<ul><li>None</li><li>Standard</li><li>Poisson</li><li>ESM</li><li>Blur ESM</li></ul></li></ul> |

### Meshes

![Blender meshes properties panel](img/exporters/blender/meshes/meshes-properties-panel.png)

| Blender | [BJS equivalent](/api/classes/babylon.mesh) |
|---|---|
| Normals</br>![normals](img/exporters/blender/meshes/normals.png) | Auto Smooth is often use by Blender users, but is not supported.</br> Use an edge split modifier instead, see [tip](//doc.babylonjs.com/exporters/blender_tips#smooth-shading). |
| UV Maps</br>![uv-maps](img/exporters/blender/meshes/uv-maps.png) | <ul><li>UVMap: coordinatesIndex</li><li>limited to 2 channels</li></ul> |
| Vertex Colors</br>![vertex-colors](img/exporters/blender/meshes/vertex-colors.png) | <ul><li>if multiples layers exist, they will be merge</li></ul> |
| Exporter panel</br>![exporter-meshes-options](img/exporters/blender/meshes/exporter-meshes-options.png) | <ul><li>**Tags**: allow using [scene.getMeshesByTags()](//doc.babylonjs.com/api/classes/babylon.scene#getmeshesbytags)</li><li>**Materials**:<ul><li>**Name Space**: automatically add a suffix to the mesh materials. Default is Blender filename.</li></ul></li><li>**Procedural Textures / Cycles Baking**: texture baking settings when using procedural textures (Blender Render) or Cycles</li></ul> |

---

### Materials

![Blender materials properties panel](img/exporters/blender/materials/materials-properties-panel.png)

#### General

* as you can notice in BJS mesh panel, materials will be suffixed by *.babylon* filename,
* other options can be found on this mesh panel, like max simultaneous lights, texture size for baking, etc,
* texture baking will be automatic when:
    * cycles render is the current render engine,
    * procedural textures are used.

#### Blender Render

| Blender | [BJS equivalent](/api/classes/babylon.standardmaterial) |
|---|---|
| ![header](img/exporters/blender/materials/header.png) | <ul><li>multi-materials are supported</li></ul> |
| Diffuse</br>![diffuse](img/exporters/blender/materials/diffuse.png) | <ul><li>color intensity is multiplied by intensity value</li></ul>|
| Specular</br>![specular](img/exporters/blender/materials/specular.png) | <ul><li>color intensity is multiplied by intensity value</li><li>Hardness: specularPower</li></ul> |
| Shading</br>![shading](img/exporters/blender/materials/shading.png) | <ul><li>Emit: diffuse color \* value</li><li>Ambient: diffuse color \* value</li></ul> |
| Transparency</br>![transparency](img/exporters/blender/materials/transparency.png) | <ul><li>when enabled, set alpha value under *Z Transparency*</li></ul> |

##### Specials

* you can temporary switch to Blender Game to gain access to some materials settings:

![blender-game](img/exporters/blender/materials/blender-game.png)

| Blender | [BJS equivalent](/api/classes/babylon.standardmaterial) |
|---|---|
| Game Settings</br>![game-settings](img/exporters/blender/materials/game-settings.png) | <ul><li>Backface culling: true by default</li><li>Face Orientation:<ul><li>Normal</li><li>Billboard</li></ul></li></ul> |

#### Cycles Render

| Blender | BJS equivalent |
|---|---|
| Node Editor</br>![cycles node](img/exporters/blender/materials/cycles-node01.png) | Exporter will do automatic baking, and try to detect some nodes:</br> <ul><li>Diffuse BSDF</li><li>Ambient Occlusion</li></ul> |

---

### Textures

![Blender textures properties panel](img/exporters/blender/textures/textures-properties-panel.png)

#### General

* Blender can handle packed images, even if their isn't source file on disk, but you have to unpack all before export,
* about automatic baking, see [Materials](//doc.babylonjs.com/exporters/blender#materials).

#### Blender Render

| Blender | BJS equivalent |
|---|---|
| ![header](img/exporters/blender/textures/header.png) | <ul><li>multiple textures can be assigned<ul><li>if two textures are assigned to the same Influence (see below), automatic baking will be used</li></ul></li><li>this name is only used in Blender</li></ul> |
| Texture Type</br>![type-image](img/exporters/blender/textures/type-image.png) | <ul><li>as seen above, this name is only used in Blender<li><li>texture type:<ul><li>for image file, choose *Image or Movie*</li><li>for procedural textures, choose any one but *voxel data*, *point density*, *ocean*</li></ul></li></ul> |
| Image</br>![image](img/exporters/blender/textures/image.png) | <ul><li>texture filename will be texture name in BJS</li></ul> |
| Image Sampling</br>![image-sampling](img/exporters/blender/textures/image-sampling.png) | <ul><li>Use Alpha: hasAlpha</li></ul> |
| Image Mapping</br>![image-mapping](img/exporters/blender/textures/image-mapping.png) | <ul><li>Extension: choosing *Clip* will set Wrap value to 0</li></ul> |
| Mapping</br>![mapping](img/exporters/blender/textures/mapping.png) | <ul><li>Coordinates: choosing between <ul><li>UV: [EXPLICIT_MODE](/api/classes/babylon.texture#static-explicit_mode-number)</li><li>Reflection: by setting *Projection* to *Sphere*, you gain access to spheremaps through [SPHERICAL_MODE](/api/classes/babylon.texture#static-spherical_mode-number)</li></ul></li><li>Offset X and Y: [uOffset](/api/classes/babylon.texture#uoffset-number) and [vOffset](/api/classes/babylon.texture#voffset-number)</li><li>Size X and Y: [uScale](/api/classes/babylon.texture#uscale-number) and [vScale](/api/classes/babylon.texture#vscale-number)</li></ul> |
| Influence</br>![influence](img/exporters/blender/textures/influence.png) | Be sure to enable only one influence by texture, to avoid automatic baking. |

---

## Animation

(*Note: this part is under construction. You can also check [this forum thread](http://www.html5gamedevs.com/topic/36596-blender-exporter-doc-needs-feedback/) where some informations are centralised before it is written here.*)

### Commons & Good practices

- you should export one *.babylon* file per animated object to make your life easier (once in BJS, but also to handle the timeline in Blender). See [tip](//doc.babylonjs.com/exporters/blender_tips#Animation) for a basic workflow.
- be sure, before starting animation in Blender, that your objects have their transformations applied! (3DView > Object > Apply)

### Classic Animations

You will find an example on this [.zip archive](//doc.babylonjs.com/examples/blender/animations/babylon-format.zip). 3D sources files are on `sources` folder, BJS app is on `BJS` folder.

In `sources`, we have our master scene, with only static objects (on the layer 1), and just for us to see it, we have the logo linked on the layer 6. When exporting, take care to have only layer 1 active, as we have checked in the [scene panel](//doc.babylonjs.com/resources/blender#scene) *Export only selected layers*.

Once exported, you can see in `BJS/index.html` that we create our main scene using this `.babylon`: line 36

```html
BABYLON.SceneLoader.Load("", "01.master-static-scene.babylon", engine, function (scene) {

});
```

Same way for out animated object in `sources/02.classic-animation.blend`: layer 1 is for our object, layer 6 is just for us to see the main scene in our *.blend*. *Export only selected layers* is used to help us exporting only the first layer to babylon.

Once exported, we can import our meshes inside the onSuccess of our Loader above. Check on `BJS/index.html`, line 64:

```html
BABYLON.SceneLoader.ImportMesh("", "", "02.classic-animation.babylon", scene, function (importedMeshes){

});
```

Now, you already have a basic scene with animations autoplaying in it.

### Armatures

- you can use any Blender rotation mode you want, the animation will be kind of baked during the export

---

## Try it out!

Once your scene is exported, you have multiple solutions to test it:

- quick check it into the [sandbox](http://sandbox.babylonjs.com/)
- edit the file through the [editor](http://editor.babylonjs.com/)
- use the [viewer](//doc.babylonjs.com/extensions/the_babylon_viewer)
- script your own app using the [loader](/how_to/load_from_any_file_type)

### Example

#### Simple scene

Let's say you have exported your first scene. In this example we will use [blend files of the BJS logo](https://github.com/BabylonJS/MeshesLibrary/tree/master/BabylonJS-logo/v3):

- export the babylon into a folder
- create a file named *index.html*, and copy the code above:

```html
<!doctype html>
<html>
<head>
    <title>Default .babylon loading scene</title>
	<meta charset="UTF-8">
    <!-- this link to the preview online version of BJS -->
    <script src="https://preview.babylonjs.com/babylon.js"></script>
    <!-- this is needed for BJS to load scene files -->
    <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>
    <style>
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: OpenSans, tahoma, arial, sans-serif;
            color:white;
        }

        #canvas {
            width: 100%;
            height: 100%;
            touch-action: none;
        }
    </style>
</head>

<body>
    <canvas id="canvas"></canvas>
    <script type="text/javascript">
        var canvas = document.getElementById("canvas");
        var engine = new BABYLON.Engine(canvas, true);

        // here the doc for Load function: //doc.babylonjs.com/api/classes/babylon.sceneloader#load
        BABYLON.SceneLoader.Load("", "babylonJS_logo_v3.babylon", engine, function (scene) {

            //as this .babylon example hasn't camera in it, we have to create one
            var camera = new BABYLON.ArcRotateCamera("Camera", 1, 1, 4, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, false);

			scene.clearColor = new BABYLON.Color3(1, 1, 1);
			scene.ambientColor = new BABYLON.Color3.White;

            engine.runRenderLoop(function() {
                scene.render();
            });

            window.addEventListener("resize", function () {
                engine.resize();
            });
        });
    </script>
</body>
</html>

```

![babylon default folder example](img/exporters/blender/babylon/babylon-BJS-default-folder-structure.png)

- double-click on the *index.html* file... profit!
  - some browsers may not want loading the scene, for some security issues (e.g.: Chrome). In this case, you have to open the html file through a webserver (local or not), or try into another browser (e.g.: Firefox, Edge).

![blender babylon scene loaded in BJS](img/exporters/blender/babylon/babylon-loaded.png)

#### Animated object
