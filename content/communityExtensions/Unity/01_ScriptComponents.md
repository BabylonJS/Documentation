---
title: Script Components
image:
description: The Unity Toolkit allows you to script your own components, allowing you to trigger game events, modify component properties over time and respond to user input in any way you like.
keywords: babylon.js, export, unity, script, component, script component, extension
further-reading:
video-overview:
video-content:
---

Game object behavior is controlled by the components that are attached to them. Although the toolkit's built-in components can be very versatile, you will soon find that you need to go beyond what they can provide to implement your own gameplay features. The toolkit allows you to create your own components using scripts. These allow you to trigger game events, modify component properties over time, and respond to user input in any way you like. The toolkit natively requires two programming languages:

- **TypeScript**, a language designed specifically for strongly typed JavaScript development. Required for Babylon Toolkit development;

- **C# (pronounced C-sharp)**, an industry-standard language similar to Java or C++. Required for editor script components only;

In addition to these, many other .NET languages can be used with the Unity Editor to prepare your Babylon scene content if they can compile a compatible DLL. Please refer to the [Unity Plugin](https://docs.unity3d.com/Manual/Plugins.html) documentation for details.

Learning the art of programming and the use of these particular languages is beyond the scope of this introduction. However, there are many books, tutorials and other resources for learning how to use and program **Unity Editor** inspector windows.

## Babylon Script Classes

Babylon script classes are referred to as **Backing Classes**. The backing class is the native runtime class that gets instantiated for the owned game object. The toolkit provides a set of script file templates for use in your project.

- **JavaScript File** - Empty **JavaScript** code file. To be used as you see fit.

- **TypeScript Class** - Generic **TypeScript** class file. To be used as you see fit.

- **Scene Controller** - Script component designed to be used as the **Main Scene** controller class.

- **Mesh Component** - A standard mesh component script to be used by **all** non **Light** and **Camera** game objects.

- **Light Component** - A standard light component script to be used on **Light** game objects **only**.

- **Camera Component** - A standard camera component script to be used on **Camera** game objects **only**.

- **Shader Controller** - Script component designed to subclass and control **Shader Material** properties.

- **Global Startup Script** - Inline **Global Application** code and startup event functions.

Unity does not support normal HTML JavaScript (`.js`) files. So rename any plain `.js` file extensions to `.bjs` to include them in your game project output.

## Creating Backing Classes

Unlike most other assets, scripts are usually created directly within Unity. You can create a new backing class script from the **Create** menu at the top left of the Project panel or by selecting **Assets > Create > Babylon > Babylon TypeScript** and then selecting the desired backing class script asset type from the main menu.

The new backing class script will be created in whichever folder you have selected in the Project panel. The new backing class script file’s name will be selected, prompting you to enter a new name.

![Creating Scripts](/img/exporters/unity/newscript.webp)

It is a good idea to enter the name of the new backing class script at this point rather than editing it later. You must **rename** the class initial text inside the file with your new script name.

## Anatomy Of A Backing Class

When you double-click a script Asset in Unity, it will be opened in a text editor. By default, Unity will use the default code editor, but you can select any code editor you like from the External Tools panel in Unity’s preferences (go to **Unity > Preferences**).

The contents of an example mesh component file will look something like this:

```javascript
    module PROJECT {
        export class NewMeshComponent extends BABYLON.MeshComponent {
            public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
                super(owner, scene, tick, propertyBag);
            }

            protected start() :void {
                // Start component function
            }

            protected update() :void {
                // Update render loop function
            }

            protected after() :void {
                // After render loop function
            }

            protected destroy() :void {
                // Destroy component function
            }
        }
    }
```

An editor script component makes its connection with the internal workings of the Babylon Toolkit scene manager by implementing a class that derives from the built-in class called **EditorScriptComponent**. You can think of a class as a kind of blueprint for creating a new component type that can be attached to game objects. Each time you attach a script component to a game object, it creates a new instance of the object defined by the blueprint. The name of the class is taken from the editor script component's **Babylon Class** property. The class names must match to allow the script component to be attached to a game object.

The main things to note, however, are the four functions defined inside the class. The **Update** function is the place to put code that handles frame updates for the game object. This might include movement, triggering actions, and responding to user input—basically anything that needs to be handled over time during gameplay. To enable the Update function to do its work, it is often useful to set up variables, read preferences, and make connections with other game objects before any game action takes place. The **Start** function is called by the scene manager before gameplay begins (i.e., before the Update function is called for the first time) and is an ideal place to do any initialization. The **After** function gets called after the update functions (including all other component updates). Finally, the **Destroy** function gets called when the game object is disposed.

**Note to beginner game developers:** You may not be aware that any gameplay logic should **not** be handled in the constructor function. This is because the construction of objects is handled by the scene manager parser and does not take place at the start of gameplay as you might expect. If you include **game loop** type logic in a constructor for a script component, it will interfere with the normal operation of the managed lifecycle and can cause major problems with the project. Use the constructor for internal property setup only.

## Editor Script Components (C#)

Editor script components are the primary way of attaching native Babylon classes to game objects and prefabs in the editor. They represent the design-time interface to your game object. You can create a new design-time editor script component from the **Create** menu at the top left of the Project panel or by selecting **Assets > Create > Babylon > Editor Script Component (C#)** from the main menu.

The main purpose of the editor script component is to assign the native Babylon backing class name in the component constructor and to provide design-time component properties to
the native backing class:

Example runtime backing class script file:

```javascript
    module PROJECT {
        export class TestMeshComponent extends BABYLON.MeshComponent {

            protected start() :void {
                // Start hello world example
                console.log(this.getProperty<string>("hello"));
            }
        }
    }
```

Example design time editor script component file:

```javascript
    /* Babylon Editor Script Component (C# UnityScript) */

    using System;
    using UnityEditor;
    using UnityEngine;
    using Unity3D2Babylon;

    namespace MyProject
    {
        public class TestScriptComponent : EditorScriptComponent
        {
            [Header("-Script Properties-")]

            [BabylonProperty]
            public string hello = "Hello World";

            protected TestScriptComponent()
            {
                this.babylonClass = "PROJECT.TestMeshComponent";
            }
        }
    }
```

**Custom Property Inspector Support**

A key to increasing the speed of game creation is to create custom editors for commonly used components. When you create a script in Unity, by default it inherits from MonoBehaviour, and therefore is a Component which can be placed on a game object. When placed on a game object, the Inspector displays a default interface for viewing and editing all public variables that can be shown - such as integers, floats, strings, Vector3’s, etc.

The code in **OnInspectorGUI** is executed whenever Unity displays the editor in the Inspector. You can put any GUI code in here - it works just like OnGUI does for games, but is run inside the Inspector. Editor defines the target property that you can use to access the object being inspected. Please refer to the [Unity Extending The Editor](https://docs.unity3d.com/Manual/ExtendingTheEditor.html) documentation for details.

Example custom property inspector editor script component file:

```csharp
    /* Babylon Editor Script Component (C# UnityScript) */

    using System;
    using UnityEditor;
    using UnityEngine;
    using Unity3D2Babylon;

    namespace MyProject
    {
        [Serializable]
        public class Person
        {
            public string first;
            public string last;
        }

        public class NewScriptComponent : EditorScriptComponent
        {
            [Header("-Script Properties-")]

            [BabylonProperty]
            public string hello = "Hello World";

            protected NewScriptComponent()
            {
                this.babylonClass = "BABYLON.SceneComponent";
                this.OnExportProperties = this.OnExportPropertiesHandler;
            }

            public void OnExportPropertiesHandler(SceneBuilder sceneBuilder, GameObject unityGameObject, Dictionary<string, object> propertyBag)
            {
                // Add Custom Property Bag Item
                propertyBag.Add("person", new Person { first = "Mackey", last = "Kinard" });
            }
        }

        [CustomEditor(typeof(NewScriptComponent)), CanEditMultipleObjects]
        public class NewScriptComponentEditor : Editor
        {
            public override void OnInspectorGUI()
            {
                // Draw Custom Inspector Properties
                DrawDefaultInspector();
                NewScriptComponent script = (NewScriptComponent)target;
            }
        }
    }
```

## Managed System Components

The toolkit provides a base set of Babylon Toolkit-managed framework script components for easy use in your projects.

## Default Scene Controller

The primary component to serve as the main entry point and controller class for the scene is the **Default Scene Controller**. The default scene controller component should be attached to an empty game object.

It is a good idea to attach all scene level script components (not required on a specific game object, like sound) to a main game object. You can attach the built-in default scene controller script component by selecting **Components > Babylon > System Components > Default Scene Controller** from the main menu.

![Default Scene Controller](/img/exporters/unity/controller.webp)

The attached default scene controller provides many properties to simplify scene configuration and reduce the amount of code required (if any) to load and manage the life cycle of your scene.

## Core System Components

The toolkit provides several built-in core script components. You can attach any of the toolkit's script components by selecting **Components > Babylon > System Components** from the main menu and choosing the desired component name.

### Light Scale

The light component is for a **Light** only. It scales the brightness and sets the mode of the light. The intensity of a light is multiplied by the light color. The value can be between 0 and 10. This allows you to create overly bright lights.

![Light Scale Component](/img/exporters/unity/lightscale.webp)

### Camera Rig

The camera rig component is for a **Camera** only. The rig enables custom render features. Cameras are the devices that capture and display the world to the player. By customizing and manipulating cameras, you can make the presentation of your game truly unique. You can have an unlimited number of cameras in a scene. They can be set to render in any order, in any place on the screen, or only in certain parts of the screen.

![Camera Rig Component](/img/exporters/unity/camerarig.webp)

### Audio Track

The audio track component plays back an audio clip in the scene. The sound engine offers ambient sound, spatialized sound, and directional sound. It can be created by code or by loading a `.babylon` file. It follows the simple and powerful philosophy of the rest of the engine, as you’re going to see. Supported sound formats depend on the browser, but usually include at least `.mp3` and `.wav`.

![Audio Track Component](/img/exporters/unity/audiotrack.webp)

### Socket Mesh

The socket mesh component attaches an empty mesh to a character. Commonly in games, you will want to attach an object to the bone of a character. This might be a weapon attached to a hand, or a hat attached to the head. For this purpose, the toolkit allows you to create **Sockets** which are attached to a bone of a skeleton. Socket meshes can then be translated, rotated, and scaled relative to the bone. Static Meshes and/or Skeletal Meshes can also be attached to sockets.

![Socket Mesh Component](/img/exporters/unity/socketmesh.webp)

### Mesh Details

The mesh details component enables several **Runtime** rendering properties to be set on a game object during the design phase. This is very useful for overriding visibility and collision details for the specified mesh game object.

![Mesh Details Component](/img/exporters/unity/meshdetails.webp)

### Physics State

The physics state component activates runtime physical simulation for game objects. To have convincing physical behaviour, an object in a game must accelerate correctly and be affected by collisions, gravity and other forces. The built-in physics engines provide components that handle the physical simulation for you. With just a few parameter settings, you can create objects that behave passively in a realistic way (ie, they will be moved by collisions and falls but will not start moving by themselves). By controlling the physics from scripts, you can give an object the dynamics of a vehicle, a machine, or even a piece of fabric.

![Physics State Component](/img/exporters/unity/physicsstate.webp)

### Level Of Detail

The level of detail component can help improve overall game performance. When a game object in the scene is a long way from the camera, the amount of detail that can be seen on it is greatly reduced. However, the same number of triangles will be used to render the object, even though the detail will not be noticed. An optimisation technique called Level Of Detail (LOD) rendering allows you to reduce the number of triangles rendered for an object as its distance from the camera increases. As long as your objects aren’t all close to the camera at the same time, LOD will reduce the load on the hardware and improve rendering performance. The toolkit also requires the **LOD Group** component to set up LOD rendering for an object.

![Level Detail Component](/img/exporters/unity/leveldetail.webp)

### Terrain Builder

The terrain builder component is for a **Terrain** only. The builder allows you to add vast landscapes to your games. At runtime, terrain rendering is highly optimized for efficiency, while in the editor a selection of tools is available to make terrains easy and quick to create. The toolkit also requires the **Terrain** component to set up terrain landscapes for your game project.

![Terrain Builder Component](/img/exporters/unity/terrainbuilder.webp)

### Animation State

The animation state component supports frame by frame skeletal animation posing. Animation states are the basic building blocks of an **Animation State Machine**. Each state contains an individual animation sequence (or blend tree) which will play while the character is in that state. When an event in the game triggers a state transition, the character will be left in a new state whose animation sequence will then take over.

![Animation State Component](/img/exporters/unity/animationstate.webp)

### Particle Systems

The particle system component provides particle effects. In a 3D game, most characters, props, and scenery elements are represented as meshes. Meshes and sprites are the ideal way to depict “solid” objects with a well-defined shape. There are other entities in games, however, that are fluid and intangible in nature and consequently difficult to portray using meshes or sprites. For effects like moving liquids, smoke, clouds, flames, and magic spells, a different approach to graphics known as particle systems can be used to capture the inherent fluidity and energy.

![Particle System Component](/img/exporters/unity/particlesystem.webp)

### Asset References

The asset references component attaches project files to the current scene for exportation. This is useful for exporting scene content that is **not** already associated with a script component or a shader material.

![Asset References Component](/img/exporters/unity/assetref.webp)

### Component Tags

The component tags support additional object tags. A tag is a reference word that you can assign to one or more game objects. For example, you might define “Player” tags for player-controlled characters and an “Enemy” tag for non-player-controlled characters. You might define items the player can collect in a scene with a “Collectable” tag.

Tags help you identify game objects for scripting purposes. They ensure you don’t need to manually add game objects to a script’s exposed properties using drag and drop, thereby saving time when you are using the same script code in multiple game objects. Tags are useful for triggers in Collider control scripts; they need to work out whether the player is interacting with an enemy, a prop, or a collectable, for example.

![Object Component Tags](/img/exporters/unity/tags.webp)

### Lens Flare Systems

The lens flare systems component simulates the effect of lights refracting inside the camera lens. It can be used to represent really bright lights or, more subtly, to add a bit more atmosphere to your scene.

![Lens Flare Component](/img/exporters/unity/lensflare.webp)

### Character Controller

The character controller component controls game object movement. The character in a first or third person game will often need some collision based physics so that it doesn’t fall through the floor or walk through walls. Usually, though, the character’s acceleration and movement will not be physically realistic, so it may be able to accelerate, brake and change direction almost instantly without being affected by momentum.

A character controller cannot walk through static colliders in a scene, and so will follow floors and be obstructed by walls. It can push physics body objects aside while moving but will not be accelerated by incoming collisions. This means that you can use the standard 3D colliders to create a scene around which the controller will walk but you are not limited by realistic physical behaviour on the character itself.

![Character Controller Component](/img/exporters/unity/charactercontrol.webp)

### Shadow Map Generator

The shadow map generator component is for a **Light** only. The generator enables dynamically generated shadows depending upon a light. This is the main object responsible for generating shadows in the framework.

![Shadow Map Component](/img/exporters/unity/shadowmap.webp)
