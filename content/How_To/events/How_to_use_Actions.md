# How to use Actions

Actions are a simple way to add interactions in your scenes. An action is launched when its trigger is fired. For instance, you can specify that when the user clicks (or touches) a mesh, an action is executed.

To use actions, you have to attach an `BABYLON.ActionManager` to a mesh or to your scene:

```javascript
mesh.actionManager = new BABYLON.ActionManager(scene);
```

Once the ActionManager is created, you can start registering actions:

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        light,
        'diffuse',
        BABYLON.Color3.Black(),
        1000
    )
);
```

For instance this action will animate the `light.diffuse` property to black in 1000ms when the user picks the mesh.

You can also chain actions:

```javascript
mesh.actionManager
    .registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickTrigger,
            light,
            'diffuse',
            BABYLON.Color3.Black(),
            1000
        )
    )
    .then(
        new BABYLON.SetValueAction(
            BABYLON.ActionManager.NothingTrigger,
            mesh.material,
            'wireframe',
            false
        )
    );
```

In this case, the first click will animate the `light.diffuse` property, the second click will set `mesh.material` to false.
The third one will start again and will animate the `light.diffuse` property and so on...

Finally, you can add a condition to your actions. In this case, actions are launched when the trigger is fired if the condition is true:

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        camera,
        'alpha',
        0,
        500,
        new BABYLON.PredicateCondition(
            mesh.actionManager,
            function () {
                return light.diffuse.equals(BABYLON.Color3.Red());
            }
        )
    )
);
```

In this example, the `camera.alpha` property will be animated to 0 in 500ms when the user clicks the mesh only if the `light.diffuse` property is equal to red.

# Triggers
Currently, there are 14 different triggers available for meshes, and three for scenes.

The triggers available for meshes are:

* `BABYLON.ActionManager.NothingTrigger`: Never raised. Used for sub-actions with `action.then` function.
* `BABYLON.ActionManager.OnPickTrigger`: Raised when the user touches/clicks on a mesh.
* `BABYLON.ActionManager.OnDoublePickTrigger`: Raised when the user double touches/clicks on a mesh.
* `BABYLON.ActionManager.OnPickDownTrigger`: Raised when the user touches/clicks down on a mesh
* `BABYLON.ActionManager.OnPickUpTrigger`: Raised when the user touches/clicks up on a mesh.
* `BABYLON.ActionManager.OnPickOutTrigger`: Raised when the user touches/clicks down on a mesh and then move off-of the mesh.
* `BABYLON.ActionManager.OnLeftPickTrigger`: Raised when the user touches/clicks on a mesh with left button.
* `BABYLON.ActionManager.OnRightPickTrigger`: Raised when the user touches/clicks on a mesh with right button.
* `BABYLON.ActionManager.OnCenterPickTrigger`: Raised when the user touches/clicks on a mesh with center button.
* `BABYLON.ActionManager.OnLongPressTrigger`: Raised when the user touches/clicks up on a mesh for a long period of time in milliseconds (defined by BABYLON.Scene.LongPressDelay). 
* `BABYLON.ActionManager.OnPointerOverTrigger`: Raised when the pointer is over a mesh. Raised just once.
* `BABYLON.ActionManager.OnPointerOutTrigger`: Raised when the pointer is no more over a mesh. Raised just once.
* `BABYLON.ActionManager.OnIntersectionEnterTrigger`: Raised when the mesh is in intersection with a specific mesh. Raised just once.
* `BABYLON.ActionManager.OnIntersectionExitTrigger`: Raised when the mesh is no more in intersection with a specific mesh. Raised just once. 

Note that the two intersection triggers require you specify a specific mesh, which can be done like so:

```javascript
mesh.actionManager.registerAction(
    new BABYLON.SetValueAction(
        {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, 
            parameter: { 
                mesh: otherMesh, 
                usePreciseIntersection: true
            }
        }, 
        mesh,
        "scaling",
        new BABYLON.Vector3(1.2, 1.2, 1.2)
    )
);
```

Note the optional `usePreciseIntersection` property. If you don't want to use precise intersections, you can simply pass the mesh being targeted as the value of the parameter property:

```javascript
mesh.actionManager.registerAction(
    new BABYLON.SetValueAction(
        {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: otherMesh
        },
        mesh,
        'scaling',
        new BABYLON.Vector3(1.2, 1.2, 1.2)
    )
);
```
The triggers available for scenes are:

* `BABYLON.ActionManager.OnEveryFrameTrigger`: Raised once per frame.
* `BABYLON.ActionManager.OnKeyDownTrigger`: Raised when a key is pressed.
* `BABYLON.ActionManager.OnKeyUpTrigger`: Raised when a key is released.

Both the OnKeyUpTrigger and OnKeyDownTrigger triggers accept a string parameter value, which is compared to the event's `sourceEvent.key` value.
This allows you to create key triggers that will only trigger on specific keys, like so:

```javascript
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: 'r'
        },
        function () { console.log('r button was pressed'); }
    )
);
```

# Available Actions
Most of the actions have a `propertyPath` property. This string defines the path to the property to affect with the action. 
You can use direct values like `position` or `diffuse`. But you can also provide complex paths like `position.x`

* `BABYLON.SwitchBooleanAction(trigger, target, propertyPath, condition)`: Switchs a boolean property.
* `BABYLON.SetValueAction(trigger, target, propertyPath, value, condition)`: Sets a direct value for a property.
* `BABYLON.IncrementValueAction(trigger, target, propertyPath, value, condition)`: Adds a number to a number property.
* `BABYLON.PlayAnimationAction(trigger, target, from, to, loop, condition)`: Plays an animation on a target.
* `BABYLON.StopAnimationAction(trigger, target, condition)`: Stops any animation being played by the target.
* `BABYLON.DoNothingAction(trigger, condition)`: Do nothing :)
* `BABYLON.CombineAction(trigger, children[], condition)`: Executes multiple actions simultaneously. The children property must be an array of actions.
* `BABYLON.ExecuteCodeAction(trigger, func, condition)`: Executes code.
* `BABYLON.SetParentAction(trigger, target, parent, condition)`: Sets the parent of the target.
* `BABYLON.PlaySoundAction(trigger, sound, condition)`: Plays a given sound.
* `BABYLON.StopSoundAction(trigger, sound, condition)`: Stops a given sound
* `BABYLON.InterpolateValueAction(trigger, target, propertyPath, value, duration, condition, stopOtherAnimations)`: Creates an animation to interpolate the current value of a property to a given target. The following types are supported:
   * `number`
   * `BABYLON.Color3`
   * `BABYLON.Vector3`
   * `BABYLON.Quaternion`

# Conditions
There are three kinds of conditions:

* `BABYLON.ValueCondition(actionManager, target, propertyPath, value, operator)`: true when the given property and value conform to the operator. The following operators are supported:
   * `BABYLON.ValueCondition.IsEqual`
   * `BABYLON.ValueCondition.IsDifferent`
   * `BABYLON.ValueCondition.IsGreater`
   * `BABYLON.ValueCondition.IsLesser`
* `BABYLON.PredicateCondition(actionManager, predicate)`: true when the given predicate function returns true.
* `BABYLON.StateCondition(actionManager, target, value)`: true when the ```state``` property of the target matches the given value.

# Experimenting with Actions
Imagine you want to almost hide a mesh when the user touches it.

First, you'd add a  `BABYLON.ActionManager` to the mesh in question:

```javascript
mesh.actionManager = new BABYLON.ActionManager(scene);
```

Secondly, you'd register an action associated with the `BABYLON.ActionManager.OnPickTrigger` trigger.
This action will interpolate the ```mesh.visibility``` property to 0.2.

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        mesh,
        'visibility',
        0.2,
        1000
    )
);
```

And you're done! Easy, right?

If after fading out the mesh, you wished it to fade back in, you'd do so by chaining an action
to restore the `mesh.visibility` property to default value:

```javascript
mesh.actionManager
        .registerAction(
            new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnPickTrigger,
                mesh,
                'visibility',
                0.2,
                1000
            )
        )
        .then(
            new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnPickTrigger,
                mesh,
                'visibility',
                1.0,
                1000
            )
        );
```

In this case, the first click will hide the button, the following click will restore it, and so on...

# Sprites 
Starting with Babylon.js 2.3, sprites can have an action manager: https://www.babylonjs-playground.com/#9RUHH#5

Please note that the SpriteManager must turn picking support on by using `spriteManager.isPickable = true`
Sprites can also control picking with `sprite.isPickable = false / true` (False by default)

# Playground
If you want to play with actions, you can try them at our playground:
https://www.babylonjs-playground.com/#J19GYK#0
