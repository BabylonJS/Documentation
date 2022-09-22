---
title: Animation System
image:
description: The Unity Toolkit animation system includes features like retargetable animations, full control of animation weights at runtime, event calling from within the animation playback, sophisticated state machine hierarchies and transitions, blend shapes for facial animations, and much more.
keywords: babylon.js, exporter, unity, animation
further-reading:
video-overview:
video-content:
---

The toolkit's **Animation System** includes features like retargetable animations, full control of animation weights at runtime, event calling from within the animation playback, sophisticated state machine hierarchies and transitions, blend shapes for facial animations, and much more. Please refer to the [Unity Animation](https://docs.unity3d.com/Manual/AnimationSection.html) documentation for details.

## Animation State Machines

It is common for a character or other animated Game Object to have several different animations that correspond to different actions it can perform in the game. For example, a character may breathe or sway slightly while idle, walk when commanded to and raise its arms in panic as it falls from a platform. A door may have animations for opening, closing, getting jammed, and being broken open. Mecanim uses a visual layout system similar to a flow-chart, to represent a state machine to enable you to control and sequence the animation clips that you want to use on your character or object.

Please refer to the [Unity Animation Controller](https://docs.unity3d.com/Manual/AnimatorControllers.html) documentation for details.

## Managed Runtime Support

Example **Animation State** script component:

```javascript
    module PROJECT {
        export class TestPlayerController extends BABYLON.MeshComponent {
            private animator:BABYLON.AnimationState = null;
            protected start() :void {
                this.animator = this.getComponent("BABYLON.AnimationState");
            }
            protected update() :void {
                var vertical:number = this.manager.getUserInput(BABYLON.UserInputAxis.Vertical, BABYLON.PlayerNumber.One);
                var horizontal:number = this.manager.getUserInput(BABYLON.UserInputAxis.Horizontal, BABYLON.PlayerNumber.One);
                // ..
                if (this.animator != null) {
                    this.animator.setFloat("Forward", vertical);
                    this.animator.setFloat("Strafe", horizontal);
                }
            }
        }
    }
```

## Still Under Development

The following **Animation System** features are still under development:

- 2D Blend Trees

- Animation Curves

- Animation Events

- Animation Behaviours
