---
title: Root Motion
image:
description: Move a character by the travel in its animation clips, so its feet stay planted instead of sliding.
keywords: diving deeper, animation, root motion, character, locomotion, in place, animation group, walk cycle
further-reading:
  - title: Grouping Animations
    url: /features/featuresDeepDive/animation/groupAnimations
  - title: Advanced Animation Methods
    url: /features/featuresDeepDive/animation/advanced_animations
  - title: Animating Characters
    url: /features/featuresDeepDive/animation/animatedCharacter
video-overview:
video-content:
---

## What root motion is

A walk cycle is authored in one of two ways. In an **in-place** clip the character stays at the origin: the hips sway, the feet slide back under the body, and it is up to your code to move the character node at the right speed. In a clip **with travel** the root bone carries the character forward, so a looping playback walks the character away from its node and snaps it back at every loop.

Either way, the feet skate whenever the movement of the character node and the movement in the pose disagree. Root motion fixes that at the source: the travel is taken out of the clip (or, for an in-place clip, worked out from the feet), the pose plays in place, and the character node is moved by exactly the travel the pose implies, frame by frame. The feet stay planted where they touch down, at any speed ratio, forwards or backwards, blended or not.

Babylon.js does this with two classes:

- `RootMotionClip` analyzes an `AnimationGroup` once and builds an **in-place copy** of it to play. The source group is never changed.
- `RootMotionController` moves a character node by the motion of the clips playing on it.

## Quick start

```javascript
const container = await BABYLON.LoadAssetContainerAsync("https://assets.babylonjs.com/meshes/Xbot.glb", scene);
container.addAllToScene();
const walkGroup = container.animationGroups.find((group) => group.name === "walk");

const walk = new BABYLON.RootMotionClip(walkGroup); // analyzes once; walkGroup is not changed
const controller = new BABYLON.RootMotionController(walk.characterNode, [walk]);
walk.animationGroup.start(true); // play the in-place copy, not the source
```

That is all there is to it. `walk.animationGroup` is a copy of the walk with the travel left out of it, `walk.characterNode` is the node the travel is applied to (the topmost ancestor of the animated hierarchy, the `__root__` node of a glTF asset), and the controller moves that node every frame by as much as the pose advanced.

<Playground id="#ZE8Y5A#0" title="Root Motion" description="Xbot walks and runs on planted feet. Turn root motion off to compare with the raw clip." isMain={true} category="Animation"/>

## How a clip finds the travel

The clip samples the group over its range and looks for the travel in two places, in this order. `clip.source` tells you which one it used.

- **`RootMotionSource.Root`**: the root node's own position animation travels over a cycle. This is the clip's ground truth. Its travel (and its turn, when one is extracted) is removed from the root's keys in the in-place copy and applied to the character instead. The root is the position-animated node with the most animated descendants, usually the hips, unless you pass `rootNode`.
- **`RootMotionSource.FootContact`**: the root stays put, so the clip is in place and the travel is deduced from the contact nodes, usually the feet. Whatever a planted foot gives up in character space over a step is how far the character travels. Nothing is removed from the clip. The contact nodes are the leaf nodes under the root that come closest to the ground, unless you pass `contactNodes`.
- **`RootMotionSource.None`**: neither moves, as in an idle. The clip is still usable; it just produces no motion.

Pass `source` in the options to force one of the first two.

Only the travel is extracted from a root, never the whole animation. By default that is the horizontal travel along the clip's direction of travel: the up and down of the hips stays in the pose, and so does their side to side sway. Set `extractLateralMotion: true` for strafing clips, where the sideways motion is the travel.

### Turning

When a cycle leaves the character facing at least `minimumTurn` (10 degrees by default) away from where it started, the turn about the up axis is extracted too: it is removed from the root's rotation keys and the character is turned by it. A walk's hip twist, or a dance that spins round to face the front again, stays in the pose. A turn that is not in the root's travel (a turn on the spot, or a turn alongside travel deduced from the feet) turns the character about the root's starting point, so a root that sits off the character's axis does not swing at every loop. Set `extractRotation` to force this either way.

### Reading the analysis

Once constructed, a clip tells you what it found:

| Member | Meaning |
| --- | --- |
| `source` | Where the travel comes from: `Root`, `FootContact` or `None`. |
| `rootNode`, `contactNodes`, `characterNode` | The nodes the analysis settled on. |
| `travelDirection` | The direction of travel over a cycle, in character space (unit length). |
| `cycleOffset`, `cycleDistance` | The travel of one cycle, as a vector and as a distance along the direction of travel. |
| `cycleRotation` | The turn of one cycle about the up axis, in radians. Zero unless rotation is extracted. |
| `duration`, `averageSpeed` | The length of one cycle in seconds at a speed ratio of 1, and the speed it implies. |
| `getOffsetAtFrame(frame, result)`, `getRotationAtFrame(frame)` | The travel and the turn reached at a frame, relative to the first frame. |

`averageSpeed` is handy for matching a character controller to a clip, or for picking the speed ratio that makes a walk cover a given distance in a given time.

## The controller

A `RootMotionController` belongs to one character node. Give it every clip that plays on that character, in the constructor or with `addClip`, and it moves the node after the animations every frame. The motion is applied in the node's own local space, so a scaled or rotated character node works as you would expect.

```javascript
const controller = new BABYLON.RootMotionController(walk.characterNode, [walk, run]);
```

### Blending

Clips that play together are blended exactly the way the animation mixer blends their root pose, so the character moves with the pose you see whatever you do with the groups. Weighted groups contribute their share and are normalized once their weights add up to more than one, additive groups add theirs on top, an unweighted group contributes its whole motion only while no weighted group animates the root (among unweighted groups the last one to write wins), and a group blending in with `enableBlending` contributes as much as it is blended in. A cross-fade from a walk to a run gives the blended speed at every step:

```javascript
walk.animationGroup.start(true);
run.animationGroup.start(true);
walk.animationGroup.weight = 1;
run.animationGroup.weight = 0;

// Then, over a few frames, with t going from 0 to 1:
walk.animationGroup.weight = 1 - t;
run.animationGroup.weight = t;
```

### Driving something else

Set `applyToCharacter` to false to consume the motion yourself, for example to feed a physics character controller or `moveWithCollisions`. `deltaPosition` is the travel of the last animation step in world space and `deltaRotation` its turn about the up axis in radians. `onRootMotionObservable` is notified after they are updated.

```javascript
controller.applyToCharacter = false;
controller.onRootMotionObservable.add(() => {
    hero.moveWithCollisions(controller.deltaPosition);
});
```

### Jumps and resets

The motion follows the playback, so starting, stopping, pausing and changing the speed ratio need nothing from you. A jump is different: after `goToFrame`, or after teleporting the character back to the origin, call `controller.reset()` so the jump is not read as motion.

## Playback

The motion follows the pose the runtime evaluated, not a clock of its own, so everything the animation group can do moves the character exactly as far as the pose went:

- Every loop mode. The relative modes cycle, the constant mode holds the pose at the end of its first cycle and the character stops with it, and yoyo walks the character back and forth.
- Negative speed ratios walk the character backwards. Changing the speed ratio while playing needs no reset.
- Playing a range with `from` and `to`, and a root keyed over a shorter range than the group, loop by the range the runtime actually evaluates.
- A group synchronized with `syncAllAnimationsWith` follows its master, at the master's speed and through the master's loops.
- A playback that does not loop lands exactly on the clip's full travel when it ends. Calling `stop()` applies nothing more.

## Requirements and limits

- The group must not animate the position or rotation of the character node itself, since the motion applied to it would be overwritten every frame. The constructor throws with a message saying so. Parent the animated node under a new node and pass that as `characterNode`.
- The root must have an ancestor to move. A glTF asset's `__root__` node is found by default; a root node with no parent throws.
- Animations must target transform nodes, as the glTF loader's do. Bones without a linked transform node are not supported yet.
- Additive groups are not accepted as a source. To play a clip additively, create it with `cloneAnimations: true` and make its `animationGroup` additive; the source group's animations are then not changed with it.
- The clips of one controller share an up axis. Pass `upAxis` for a Z-up character.
- The in-place group belongs to the scene. `clip.dispose()` disposes it and leaves the source group untouched (a root that only turns gets its position put back). `controller.dispose()` stops applying the motion and does not dispose the clips.

## Options

`new BABYLON.RootMotionClip(animationGroup, options)` accepts:

| Option | Default | What it does |
| --- | --- | --- |
| `rootNode` | the position-animated node with the most animated descendants | The node whose own travel is tried first. A bone is resolved to its linked transform node. |
| `characterNode` | the topmost ancestor of the root | The node that receives the motion and whose local space the motion is measured in. |
| `contactNodes` | the leaf nodes closest to the ground | The nodes that touch the ground, used when the root does not travel. |
| `source` | root first, then feet | Forces `RootMotionSource.Root` or `RootMotionSource.FootContact`. |
| `extractRotation` | when a cycle turns at least `minimumTurn` | Whether the turn about the up axis is extracted and applied to the character. |
| `extractLateralMotion` | `false` | Extracts all horizontal motion instead of the travel along the direction of travel, for strafing clips. |
| `directionSnapAngle` | 0 for a root, 10 degrees for feet | Snaps a nearly axis-aligned direction of travel onto that axis. |
| `minimumTravel` | 0.1 | Travel below this share of the character's height over a cycle counts as standing still. |
| `minimumTurn` | 10 degrees | Turning below this angle over a cycle counts as twist, not as a turn. |
| `samplesPerSecond` | 60 | How densely the clip is sampled during analysis. |
| `upAxis` | +Y | The up axis in character space. |
| `name` | the source name followed by " (in place)" | The name of the in-place animation group. |
| `cloneAnimations` | `false` | Clones every animation into the in-place group instead of sharing the ones the extraction leaves untouched. |
