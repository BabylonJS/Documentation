---
title: Introduction to the Unity Toolkit
image: 
description: Introducing the features of the Unity Toolkit.
keywords: babylon.js, exporter, unity 
further-reading:
video-overview:
video-content:
---

## Exportation

The toolkit exports game objects that have a camera, light, or mesh component attached. The toolkit also provides built-in script components to support native Babylon engine features at design time. The toolkit's [Export Inspector](Exporter) window provides easy access to global export properties. Docking this window is recommended to enable the **Unity Editor** game development and export features.

**Camera Rigs**

Perspective and orthographic cameras are supported. The Camera Rig component supports detailed camera control, allowing easy camera type selection and specific runtime camera mode options. Please refer to the [Unity Camera](https://docs.unity3d.com/Manual/class-Camera.html) documentation for details.

**Scene Lighting**

The toolkit exports directional, point and spot lights. Realtime lights are standard lights that illuminate the scene at runtime. Mixed lights support baked lighting and require the [Subtractive](https://docs.unity3d.com/Manual/LightMode-Mixed-Subtractive.html) lightmapper mode.

Fully baked lighting (including all area lights) is used for lightmap shadow baking at design time and will **not** be included in the exported scene file. This allows detailed lightmap baking using as many baking lights as required to achieve the best shadow effects possible without using any of those baking light resources at runtime. Please refer to the [Unity Baked Lighting](https://docs.unity3d.com/Manual/LightMode-Baked.html) documentation for details.

**Scene Environment**

Skyboxes for the scene are primarily controlled via the [Unity Lighting Window](https://docs.unity3d.com/Manual/GlobalIllumination.html). The default scene controller **Skybox Options** allow more detailed settings at runtime. The toolkit supports native HDR, EXR, and DDS cubemaps. Please refer to the [Unity Skybox Rendering](https://docs.unity3d.com/Manual/class-Skybox.html) documentation for details.

**Default Color Space**

The preferred **Color Space** for realistic rendering is **Linear**. A significant advantage of using **Linear** color space is that the colors supplied to shaders within your scene brighten linearly as light intensities increase. This can be selected using the **Color Space** property in the **Edit>Project Settings>Player** settings panel.


## Getting Started

The [Project Setup](Projects) section outlines basic project setup, scene configuration, and runtime script compiler options. You can auto-detect the platform script compiler locations in the **Project Compiler Options** section on the main export panel. Check out the [Getting Started Video](http://www.babylontoolkit.com/videos/GettingStarted.mp4) to get started with **Babylon Toolkit** style game development.


## Toolkit Features
    
### Script Components

[Script Components](01_ScriptComponents) are the primary way of attaching native Babylon classes to game objects and prefabs in the editor.

The **Editor Script Components** are C# design-time components used to enter client properties. They are not intended to execute at runtime. They simply allow the use of design-time editor properties for your native Babylon client scripts. Each editor script specifies the native JavaScript or TypeScript backing class to use at runtime. Please refer to the [Unity Component](https://docs.unity3d.com/Manual/UsingComponents.html) documentation for details.

The client scripts are your native Babylon JavaScript or TypeScript classes that contain your game logic code. Each class has a **ready** function that is called once during the scene's execute-when-ready phase, a **start** function that is called once during the first frame, an **update** function that is called every frame, an **after** function that is called after the scene render phase, and a **destroy** function that is called on component disposal.

### Scene Manager

The [Scene Manager](02_SceneManager) application programming interface exposes a Unity-like scene component development pattern. This allows script components to be attached to game objects such as meshes, cameras, and lights. Each component type has a ready, start, update, after, and destroy function that will be called by the scene manager during its life cycle.

### Shader Materials

[Shader Materials](03_ShaderMaterials) are used to assign Unity standard and legacy shaders to native Babylon material classes. Custom shaders are supported if they follow the Unity shader property naming standard. The universal shader material component encapsulates both Unity design-time shader information and Babylon runtime shader information. Please refer to 
the [Unity Material Editor](https://docs.unity3d.com/Manual/Materials.html) documentation for details.

### Collision Meshes

[Collision Meshes](04_CollisionMeshes) are generated to provide simple collision for each component type (box, sphere, capsule, wheel, mesh, and terrain). This allows simple geometry to be used for physics collisions and mesh intersections instead of the original detailed geometry. Please refer to the [Unity Collider Components](https://docs.unity3d.com/Manual/CollidersOverview.html) documentation for details.

### Terrain Builder

[Terrain Builder](05_TerrainBuilder) options are used to export dynamic terrain geometry generation at export time. Up to 12 textures and normal maps may be used to paint terrains. Texture atlas maps are created to optimize multiple terrain splat textures. Terrain mesh colliders are supported to optimize runtime collision checking. Colliders can be segmented into up to 16 x 16 low-poly collision meshes that cover the original high-poly terrain surface.

The terrain builder supports custom terrain splatmap shaders to allow design-time editor access to the terrain render material. If no custom terrain splatmap material is selected, default options will be used. Please refer to the [Unity Terrain Settings](https://docs.unity3d.com/Manual/terrain-OtherSettings.html) documentation for details.

### Animation State

[Animation State](06_AnimationState) is supported for both transform and skeleton animations. Transform animations are used to animate the position, rotation, and scale of any light, camera, or mesh. Skeleton animations are used to animate the bones of a skeletal mesh. Legacy Animation controls are used to enable standard bone keyframe animations only. 

The newer standard Animator controls are used to enable the built-in Unity Mecanim humanoid animation rigging system. Please refer to the [Unity Animation Group](https://docs.unity3d.com/Manual/comp-AnimationGroup.html) documentation for details.

### Runtime Prefabs

[Runtime Prefabs](07_RuntimePrefabs) are used to allow client-side prefab instantiation. Game objects that are assigned to the **Babylon Prefab** layer are marked for client-side prefab usage and will not be enabled in the scene. The scene manager function **instantiate prefab** is used to create fully scripted components at runtime. The scene manager uses deep cloning with hierarchy.

### Static Batching

[Static Batching](08_StaticBatching) allows design-time mesh combining. Game objects that are assigned to the **Babylon Static** layer are marked for mesh optimization at scene export. Meshes will automatically be grouped by material, combined, baked, and serialized as a single mesh per material. Texture atlas materials are supported to improve multiple-texture rendering performance.

### Navigation Mesh

[Navigation Mesh](09_NavigationMesh) support is provided by [Babylon-Navigation-Mesh](https://github.com/wanadev/babylon-navigation-mesh), a pathfinding tool for AI agents. It uses the **A Star** and **Funnel** algorithms to calculate a path on a navigation mesh. The toolkit supports the Unity navigation mesh generation tools to produce and serialize the navigation mesh geometry into your scene. Please refer to the [Unity Navigation Mesh](https://docs.unity3d.com/Manual/Navigation.html) documentation for details.

### Windows Platform

The [Windows Platform](10_WindowsPlatform) toolset provides built-in support for developing hosted [Universal Windows Platform](https://docs.microsoft.com/en-us/windows/uwp/get-started/universal-application-platform-guide) applications that serve as self-contained web browser applications for your game projects. This allows native platform integration support for the **Windows Runtime Library**, including **Xbox Live Services**, for both **Windows 10 PC** and **Xbox One** game consoles.

### Babylon Art Tools

The [Babylon Art Tools](11_BabylonArtTools) included in the toolkit provide a number of art tools to help create optimized, game-ready assets.


## Exported Content

### Editor Script Components

The toolkit-provided abstract base class **Editor Script Component** is the only supported script component that will be exported. All other unsupported components will be ignored. The prebuilt toolkit components and your [Custom Script Components](01_ScriptComponents) are all derived from the base editor script component class and will be included in the exported scene.

Native JavaScript libraries (renamed to .bjs) that are included anywhere in the **Assets** folder will be packaged and included in your project script file. This allows easy packaging of third-party script packages. TypeScript definition files are supported by most IDEs and should also be included for autocomplete use in your game project development.

### Supported Unity Features

* **Scene**
 * Assets
 * Metadata
* **Cameras**
 * Name
 * Position
 * Target
 * FOV
 * LOD Groups
 * Clip Range Start
 * Clip Range End
 * Check Collisions
 * Gravity
 * Ellipsoid
 * Animations (Position)
* **Lights**
 * Type (Point, Directional, Spot)
 * Name
 * Position
 * Direction
 * Spot Angle
 * Intensity
 * Diffuse Color
 * Animations (Position)
 * Shadow Maps
 * Light Maps
* **Materials**
 * Name
 * Diffuse Color
 * Specular Color
 * Specular Power
 * Emissive Color
 * Alpha
 * Backface Culling
 * Diffuse Texture
 * Reflection Texture
 * Emissive Texture
 * Bump Texture
* **Physically Based Rendering**
 * Metallic Setup
 * Roughness Setup
 * Specular Setup
* **Multi-Materials**
 * Name
 * Child Materials
* **Textures**
 * Name
 * Associated File
 * Use Alpha
 * uOffset / voffset
 * uScale / uScale
* **Meshes**
 * Name
 * Geometry (Positions &amp; Normals)
 * Position
 * Rotation
 * Scaling
 * Texture Coordinates (2 Channels)
 * Check Collisions
 * Receive &amp; Cast Shadows
 * Animations (Position, Rotation, Scaling)
 * Skeletons (Shared Cloning)
* **Shaders**
 * Vertex Shaders
 * Fragment Shaders
 * Custom Shaders
* **Layers**
 * Custom Layers
 * Object Layers
 * Static Layers
 * Prefab Layers
 * Ignore Layers (Void)
* **Tagging**
 * Object Tag Name
 * Custom Tag Names
* **Terrains**
 * Multiple Terrains
 * Splatmap Textures
 * Tree Instances
 * Grass Patches (Under Construction)
 * Detail Prototypes (Under Construction)
* **Components**
 * Mesh Filter
 * Mesh Renderer
 * Skinned Mesh Renderer
* **Collisions**
 * Box Collider
 * Sphere Collider
 * Capsule Collider
 * Mesh Collider
 * Wheel Collider
 * Terrain Collider
* **Navigation**
 * Navigation Mesh
 * Nav Mesh Agent
 * Off Mesh Link
 * Nav Mesh Obstacle
* **Local Multiplayer**
 * Multiplayer Input 
 * Multiplayer Camera
* **Miscellaneous**
 * Tree Component
 * Terrain Component
 * Animator Component
 * Animation Component
