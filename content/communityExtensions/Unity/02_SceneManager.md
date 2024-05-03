---
title: Scene Manager
image:
description: The Unity Toolkit provides runtime life cycle management for game objects.
keywords: babylon.js, extension, export, unity, manger, scene manager
further-reading:
video-overview:
video-content:
---

The babylon scene manager extension provides runtime life cycle management for game objects. The extension supports a scene component application programming interface to enable the usage of **modern game mechanics** to ease web browser game development and provide a **native game editor style development** experience simular to native [Unity](https://www.unity3d.com/) and [Unreal Engine](https://www.unrealengine.com/) game development.

## Babylon Scene Manager

The [Scene Manager](https://github.com/BabylonJS/Extensions/tree/master/SceneManager) is packaged with latest toolkit extension but is available on Github for download and customization. You can preview the latest stable [TypeScript Definitions](https://github.com/BabylonJS/UnityExporter/blob/master/Manager/babylon.manager.d.ts) file. To use a custom build you must copy your new output files to your project's **Assets > Babylon > Library** folder as:

- **babylon.manager.bjs** - Scene manager compiled javascript output file renamed to .bjs extension

- **babylon.manager.d.ts** - Scene manager application programming interface script definition file

## Babylon Scene Controller

The scene controller script is designed to be used as the main entry point and logic controller for the specified scene. The scene controller exposes and addition lifecycle function called **Ready** that gets called during the scene loading **Execute When Ready** stage. This is the ideal place for main scene setup code that runs **before** the game render loop is started. The scene controller is a subclass of **BABYLON.MeshComponent** and should be used on a single empty game object in the scene.

Example scene controller script file:

```javascript
    module PROJECT {
        export class NewSceneController extends BABYLON.MeshComponent {
            public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
                super(owner, scene, tick, propertyBag);
            }

            protected ready() :void {
                // Scene execute when ready
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

## Babylon Scene Components

Managed scene components provide modern game mechanic helper functions to ease web game development. Some notable toolkit managed scene component examples:

**GetProperty** - Gets a property from the attached editor script component.

```javascript
    module PROJECT {
        export class TestMeshComponent extends BABYLON.MeshComponent {

            protected start() :void {
                const hello:string = this.getProperty("hello", "Default Value");
                console.log("Echo Hello: " + hello);
            }
        }
    }
```

**GetComponent** - Get a reference to another component attached to the owner object.

```javascript
    module PROJECT {
        export class TestMeshComponent extends BABYLON.MeshComponent {

            protected start() :void {
                const animator:BABYLON.AnimationState = this.getComponent("BABYLON.AnimationState");
                if (animator) console.log("Echo Owner: " + animator.owned.name);
            }
        }
    }
```

**GetUserInput** - Get the **local multiplayer** user input from the scene manager for the specified input axis.

```javascript
    module PROJECT {
        export class TestMeshComponent extends BABYLON.MeshComponent {

            protected update() :void {
                const vertical:number = this.manager.getUserInput(BABYLON.UserInputAxis.Vertical, BABYLON.PlayerNumber.One);
                const horizontal:number = this.manager.getUserInput(BABYLON.UserInputAxis.Horizontal, BABYLON.PlayerNumber.One);
                console.log("Echo Input: " + vertical.toString() + " x " + horizontal.toString());
            }
        }
    }
```

## Mesh Script Components

The mesh component script is to be used by **All Non Light And Camera** game objects. The component provides access to the owner mesh via its **BABYLON.AbstractMesh** property:

```javascript
    module PROJECT {
        export class NewMeshComponent extends BABYLON.MeshComponent {

            protected start() :void {
                console.log("Starting mesh component for owner: " + this.mesh.name);
            }
        }
    }
```

## Light Script Components

The light component script is to be used on **Light** game objects **Only**. The component provides runtime access to the owner light via its **BABYLON.Light** property.

```javascript
    module PROJECT {
        export class NewLightComponent extends BABYLON.LightComponent {

            protected start() :void {
                console.log("Starting light component for owner: " + this.light.name);
            }
        }
    }
```

## Camera Script Components

The camera component script is to be used on **Camera** game objects **Only**. The component provides runtime access to the owner camera via its **BABYLON.Camera** property.

```javascript
    module PROJECT {
        export class NewCameraComponent extends BABYLON.CameraComponent {

            protected start() :void {
                console.log("Starting camera component for owner: " + this.camera.name);
            }
        }
    }
```

## Babylon Global Script Files

Global scripts enable inline global function for all scenes in the project. The global application script can also be used to capture window load and scene execute when ready events for the entire project.

Example global startup script:

```javascript
BABYLON.SceneManager.OnWindowLoad(() => {
  // Global Page Loaded Handler
});

BABYLON.SceneManager.ExecuteWhenReady((scene: BABYLON.Scene, manager: BABYLON.SceneManager) => {
  // Global Scene Ready Handler
});
```
