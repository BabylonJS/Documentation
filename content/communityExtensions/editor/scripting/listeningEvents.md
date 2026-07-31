---
title: Listening events
image: 
description: Understanding how to use the Babylon.JS Editor API to listen for events in an application.
keywords: editor, scripting
further-reading:
video-overview:
video-content:
---

## Introduction

The Editor API provides some tools, such as decorators, to help listen for events globally and on nodes. In other words, for
example with pointer events, the API can listen for events and pick the selected mesh in order to notify the decorated
method(s).

For example, here is how to listen for the `pointer tap` event on the current mesh that has this script attached:

```typescript
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PointerEventTypes, PointerInfo } from "@babylonjs/core/Events/pointerEvents";

import { onPointerEvent } from "../decorators";

export default class MyMeshComponent extends Mesh {
    private _physicsEnabled: boolean = true;

    ...

    @onPointerEvent(PointerEventTypes.POINTERTAP, true)
    protected _tapped(info: PointerInfo): void {
        if (!this._physicsEnabled) {
            return;
        }

        const force = this.getDirection(new Vector3(0, 0, 1));
        this.applyImpulse(force, this.getAbsolutePosition());
    }

    ...
}
```

## Available Decorators

### On Pointer Event

To listen for pointer events, the decorator `@onPointerEvent` can be used to decorate methods to call.
This decorator takes 2 arguments:
- the pointer event type (`PointerEventTypes` from `@babylonjs/core/Events/pointerEvents`).
- a boolean to indicate whether or not the method should be called only when, in the case of a mesh, the mesh is picked.

The second boolean parameter is set to `true` by default. That means it must be set to `false` in order to listen for
the pointer event globally.

```typescript
@onPointerEvent(PointerEventTypes.POINTERTAP, false)
protected _tapped(info: PointerInfo): void {
    // Called on the user clicks anywhere on the canvas.
}

@onPointerEvent(PointerEventTypes.POINTERTAP, true)
protected _tapped(info: PointerInfo): void {
    // Called on the user clicks on the mesh.
}
```

The method signature can define the `PointerInfo` reference, which contains all the pointer event info just as we get
using `scene.onPointerObservable.add((info) => { ... })`.

**Note: the method will be called only if the scene containing the mesh is instantiated in the game/application**

### On Keyboard Event

As with the `@onPointerEvent` decorator, the `@onKeyboardEvent` decorator can be used to decorate methods in a script.
This decorator takes 2 arguments:
- the key or keys to listen for (as numbers or strings).
- the type of keyboard event to listen for (key up or key down).

**Note: keyboard events are always listened globally**

Example of listening for the `z` key being released:

```typescript
@onKeyboardEvent("z", KeyboardEventTypes.KEYUP)
protected _keyup(info: KeyboardInfo): void {
    console.log(info.event.key);
}
```

Multiple keys can be listened to at the same time, where the decorated method will be called when any of the specified
keys is triggered:

```typescript
@onKeyboardEvent(["z", "q", "s", "d"], KeyboardEventTypes.KEYUP)
protected _keyup(info: KeyboardInfo): void {
    console.log(info.event.key);
}
```

Using key codes instead of key values is deprecated but is still supported.

```typescript
@onKeyboardEvent(32 /* or [32, 53] for multiple keys */, KeyboardEventTypes.KEYUP)
protected _keyup(info: KeyboardInfo): void {
    console.log(info.event.keyCode);
}
```
