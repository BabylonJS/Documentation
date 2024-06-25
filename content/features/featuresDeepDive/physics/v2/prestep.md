---
title: Physics prestep
image: 
description: How to use prestep to apply changes from scene to physics world
keywords: diving deeper, phyiscs
further-reading:
    - title: Performance Tips
      url: /features/featuresDeepDive/physics/perfTips
video-overview:
video-content:
---

## What is it

The prestep is the process happening just before physics tick. It consists in updating physics entities position and orientation from scene transform node state. This process can be costly and is by default disabled.
It can be manually enabled and when enabled, 2 methods exists: a teleport mode and an action mode. The teleport mode makes the body to have limited interaction with shapes in contact. Whereas the action mode make the body to effective move in the world and interact with shapes in contact.
Teleport mode will be more suited when placing objects with a Gizmo for example. And Action mode when in game.

## How to use

There are 2 ways to enable prestep. First one is using `disablePreStep` boolean. When set to true, it will enable Teleport mode.

```javascript
aggregate.body.disablePreStep = false;
```

The second one allows finer control.

```javascript
aggregate.body.setPrestepType(PhysicsPrestepType.ACTION);
```

Depending on the Motion Type applied, the prestep will make the body to behave differently.
For Static motion, this will have no influence.

The following Playground shows 2 types of Prestep with the 3 types of Motion.
<Playground id="E9R16H#1" title="Prestep and Motion example" description="Prestep and Motion example" />
           
## Performance

As stated in Perf Tips, it can be costly to enable prestep for all physics body. 