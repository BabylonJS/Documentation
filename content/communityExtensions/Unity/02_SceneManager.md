---
title: Scene Manager
image:
description: The Unity Toolkit provides runtime life cycle management for game objects.
keywords: babylon.js, extension, export, unity, manager, scene manager
further-reading:
video-overview:
video-content:
---

The Babylon Toolkit Scene Manager provides runtime lifecycle management for game objects. Its script component API supports Unity-style component development for Babylon.js scenes.

## Babylon Scene Manager

The Scene Manager is part of the maintained [Babylon Toolkit runtime](https://github.com/BabylonJS/BabylonToolkit/tree/master/Runtime). Use the current [TypeScript definitions](https://github.com/BabylonJS/BabylonToolkit/blob/master/Runtime/babylon.toolkit.d.ts) and [ScriptComponent API reference](https://github.com/BabylonJS/BabylonToolkit/blob/master/Reference/api/core/ScriptComponent.md) for its public API.

Initialize the Scene Manager before using toolkit components:

```typescript
await TOOLKIT.SceneManager.InitializeRuntime(engine);
```

## Babylon Scene Components

Create components by extending `TOOLKIT.ScriptComponent`. The constructor receives the attached transform node, scene, optional exported properties, and a class alias. Override only the lifecycle methods the component needs:

```typescript
namespace PROJECT {
    export class SampleScript extends TOOLKIT.ScriptComponent {
        constructor(
            transform: BABYLON.TransformNode,
            scene: BABYLON.Scene,
            properties: any = {},
            alias: string = "PROJECT.SampleScript",
        ) {
            super(transform, scene, properties, alias);
        }

        protected awake(): void {
            // Initialize the component.
        }

        protected start(): void {
            // Initialize state that depends on other components.
        }

        protected update(): void {
            // Run frame-by-frame logic.
        }

        protected destroy(): void {
            // Release resources.
        }
    }
}
```

The current runtime also provides `ready`, `late`, `step`, `fixed`, `after`, and `reset` lifecycle methods. See the maintained [Babylon Toolkit examples](https://github.com/BabylonJS/BabylonToolkit#entity-component-system) for namespace and ES module patterns.
