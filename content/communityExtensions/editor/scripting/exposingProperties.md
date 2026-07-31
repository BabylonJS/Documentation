---
title: Exposing properties
image: 
description: Understanding how to use the Babylon.JS Editor provided API to expose properties in the Inspector.
keywords: editor, scripting
further-reading:
video-overview:
video-content:
---

## Introduction

Script properties can be exposed and modified in the Editor. Using the `@visibleInInspector` decorator, these
properties can be customized and grouped in the `Inspector`.

Supported property types are:
- number
- string
- boolean
- Vector2
- Vector3
- Vector4
- Color3
- Color4
- Texture
- KeyMap

**Note: the `KeyMap` type draws a button in the inspector that waits for the user to press a key on the keyboard**

Common configuration options for exposed properties are their type, name, and default value.
Example with a decorated property named `Speed`, of type `number`, and with a default value of `0.04`:

```typescript
@visibleInInspector("number", "Speed", 0.04)
private _speed: number;
```

The goal of these exposed properties is mainly to have one script attached to multiple nodes, where each node can
have its own script configuration. For example, using the `Speed` property, two nodes can have the same script
attached but will not rotate at the same speed.

## Importing decorators

Decorators are available in the `decorators.ts` file located at `src/scenes/`. Any attached script can import this
file and use the `@visibleInInspector` decorator. Scripts that are not attached to any node cannot be customized in
the editor.

```typescript
import { visibleInInspector } from "../decorators";
```

## Understanding decorator options

As well as the type, name, and default value, the decorator has an `options` parameter used to customize the property
in the Editor. All fields are optional:
- **min**: defines the minimum value that can be set in the Editor field. Available only for numbers and vectors.
- **max**: defines the maximum value that can be set in the Editor field. Available only for numbers and vectors.
- **step**: defines the step applied to the property when the user modifies it in the Editor using the mouse.

**Note: If both `min` and `max` options are provided, the number field becomes a slider.**

In this example, 3 properties will be visible in the inspector, each with distinct options.

```typescript
@visibleInInspector("number", "Speed", 0.04, { min: 0, max: 1, step: 0.01 })
private _speed: number = 0.04;

@visibleInInspector("number", "Speed 2", 0.04, { min: 0, step: 0.01 })
private _speed2: number = 0.04;

@visibleInInspector("Vector3", "Gravity", Vector3.Zero(), { min: 0 })
private _gravity2: Vector3 = Vector3.Zero();
```

Once the script is saved and attached to at least one node, the inspector will show the exposed properties
according to their types and options. If the inspector is already focused on a node that has the edited script
attached to it, the inspector will be automatically updated.

![example](/img/extensions/Editor/ExposingProperties/example.webp)

As a full example, here is a script that uses the decorated `Speed` property to apply a rotation to a mesh.

```typescript
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import { visibleInInspector } from "../decorators";

export default class MyMeshComponent extends Mesh {
    @visibleInInspector("number", "Speed", 0.04, { min: 0, max: 1, step: 0.01 })
    private _speed: number = 1;

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        this.rotation.y += 0.04 * this._speed;
    }
}
```
