---
title: Physics prestep
image: 
description: How to use prestep to apply changes from scene to physics world
keywords: diving deeper, physics
further-reading:
    - title: Performance Tips
      url: /features/featuresDeepDive/physics/perfTips
video-overview:
video-content:
---

## What is it

The prestep is the process that happens just before a physics tick. It consists of updating the position and orientation of physics entities from the scene transform node state. This process can be costly and is disabled by default.
It can be enabled manually and, when enabled, two modes exist: teleport mode and action mode. Teleport mode causes the body to have limited interaction with shapes in contact, whereas action mode makes the body effectively move through the world and interact with shapes in contact.
Teleport mode is better suited for placing objects with a Gizmo, for example. Action mode is better suited for in-game use.

## How to use

There are 2 ways to enable prestep. The first is to use the `disablePreStep` boolean. When it is set to true, it enables Teleport mode.

```javascript
aggregate.body.disablePreStep = false;
```

The second allows finer control.

```javascript
aggregate.body.setPrestepType(PhysicsPrestepType.ACTION);
```

Depending on the Motion Type applied, prestep makes the body behave differently.
For Static motion, this will have no influence.

The following Playground shows 2 types of Prestep with the 3 types of Motion.
<Playground id="E9R16H#1" title="Prestep and Motion example" description="Prestep and Motion example" />
           
## Performance

As stated in Perf Tips, it can be costly to enable prestep for all physics bodies. 