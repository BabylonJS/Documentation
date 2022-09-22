---
title: Behaviors
image:
description: Dive into the rich world of behaviors in Babylon.js.
keywords: diving deeper, behaviors
further-reading:
video-overview:
video-content:
---

## Behaviors

Babylon.js v3.1 introduced a new component based tools: the behaviors.
A behavior is a simple class that can be attached to a target where it will provide a specific set of features. Features will be triggered by defined events.

## General

A behavior is defined by the following interface:

- `name`: Return the name of the behavior
- `init()`: This function will be called when a behavior needs to be initialized. This is before the attachment to a target.
- `attach(target)`: This function will be called when a behavior is attached to a target. This is where the behavior will hook into useful events. Babylon.js will make sure that the scene is not currently loading when this function will be called.
- `detach()`: This function will be called when a behavior is detached from a target. The behavior must clear any associated resources and unhook all events

If behaviors rely on animation, the following **static** properties will be available:

- `EasingFunction`: Define the easing function used animations
- `EasingMode`: Define the easing mode used by animations

You can add behaviors to any object implementing the IBehaviorAware interface (lights, cameras or meshes for instance). Every IBehaviorAware provides the following entry points:

- `addBehavior(behavior)`: Use this function to attach a behavior to a given target. If the scene is currently loading, this code will be delayed until scene completion.
- `removeBehavior(behavior)`: Use this function to detach a behavior from a target
- `getBehaviorByName(name)`: Return a behavior with the given name or null if not found
- `behaviors`: This read-only property returns the list of behaviors associated with the target

Most of the time, behaviors are designed to deal with a specific kind of targets.

There are both camera and mesh behaviors.
