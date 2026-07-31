---
title: Using Physics
image: 
description: Understanding how to create and edit physics in a Babylon.JS Editor project
keywords: editor, physics
further-reading:
video-overview:
video-content:
---

## Introduction
The Editor allows you to set up and edit physics impostors for meshes in the scene using the inspector. All physics engines are supported:
* `CannonJS`
* `OimoJS`
* `AmmoJS`

By default, physics is enabled in the project and uses `CannonJS`.

## Setting up physics
By selecting a mesh or mesh instance (basically any object extending `AbstractMesh`) in the scene, the inspector is updated to show the object's properties. For meshes and mesh instances, some properties related to physics are located in the section named `Physics`. By default, all unconfigured meshes have no impostor (`NoImpostor`).

At the moment, the available impostors are:
* `BoxImpostor`
* `SphereImpostor`
* `CylinderImpostor`

When you select a new impostor, the tool is updated to show the common properties, which are:
* `Mass`
* `Restitution`
* `Friction`

A documentation for all these options is [available here](/features/featuresDeepDive/physics/usingPhysicsEngine#options).

Once these properties are configured, physics cannot be previewed in the Editor. To preview the result, run the project to see the physics effect and adjust the properties if needed by clicking the `Play` button in the tools toolbar.

In the following example, the box and ground already have an impostor set to `BoxImpostor` where the box has a mass of 1 and the ground has a mass of 0 (to stay static).

![SettingPhysics](/img/extensions/Editor/UsingPhysics/setting_physics.webp)

## Changing gravity
When selecting the scene in the scene graph, there are 2 editable gravity properties:
* Collisions gravity
* Physics gravity

Depending on the desired effect, both gravity values can be different. In the `Physics` section of the scene inspector, the gravity applied by the physics engine can be customized:

![SettingGravity](/img/extensions/Editor/UsingPhysics/setting_gravity.webp)

## Choosing physics engine
Using the inspector, the scene's properties allow you to change the physics engine used by the project. By default, `CannonJS` is used and can be replaced by OimoJS or AmmoJS. Changing the physics engine can be done without having to reset or redefine the existing impostors.

![SettingEngine](/img/extensions/Editor/UsingPhysics/setting_engine.webp)

Once the desired physics engine is selected, the project must be updated as well. By default, the project templates use `CannonJS`, and the library is imported in the `index.html` file. If you use `OimoJS`, for example, this import must be replaced with one that imports `OimoJS`. The default template looks like:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Babylon.js Generated Template</title>

        <!-- Loads the game -->
        <script src="./dist/bundle.js" type="text/javascript"></script>

        <!-- Loads the physics engine "CannonJS" -->
        <script src="./node_modules/cannon/build/cannon.js" type="text/javascript"></script>

        ...
    </head>

    <body>
        ...
    </body>

</html>
```

In other words, for this example, the `CannonJS` import should be replaced to load the `Oimo.js` file from a CDN or the corresponding file in `node_modules`:

```html
<script src="https://cdn.babylonjs.com/Oimo.js" type="text/javascript"></script>
```

Or using `AmmoJS`:

```html
<script src="https://cdn.babylonjs.com/ammo.js" type="text/javascript"></script>
```

For example, with `AmmoJS` this becomes:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Babylon.js Generated Template</title>

        <!-- Loads the game -->
        <script src="./dist/bundle.js" type="text/javascript"></script>

        <!-- Loads the physics engine "AmmoJS" -->
        <script src="https://cdn.babylonjs.com/ammo.js" type="text/javascript"></script>

        ...
    </head>

    <body>
        ...
    </body>

</html>
```
