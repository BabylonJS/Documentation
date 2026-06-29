---
title: Step 2 - Move The Hero
image:
description: Drive the Babylon Bros hero left and right with keyboard events, a velocity variable, and a per-frame physics update in the Flow Graph Editor.
keywords: babylon.js, flow graph editor, tutorial, keyboard, movement, variables, physics velocity
further-reading:
    - title: Step 1 - Set Up The Editor
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/setup
    - title: Step 3 - Add Jumping
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/jump
    - title: Control Flow Blocks
      url: /toolsAndResources/flowGraphEditor/controlFlowBlocks
video-overview:
video-content:
---

## Goal

Make the hero run left and right with the arrow keys. The pattern is: keyboard events set a direction variable, and a per-frame tick converts that direction into physics velocity.

Open this step in the editor: [#2J4PCY](https://flowgraph.babylonjs.com/#2J4PCY) (load scene `P41T6E#1` in the preview).

## Blocks Used

- `KeyDownEvent`, `KeyUpEvent` (Events)
- `SetVariable`, `GetVariable` (Data Access)
- `SceneTickEvent` (Events)
- `GetProperty` / `SetLinearVelocity` (Data Access / Physics)
- `Multiply`, `CombineVector3` (Math / Data Conversion)

## Step By Step

### 1. Initialize State

Add `SceneReadyEvent` and a `SetVariable` named `heroVX = 0`. This seeds the horizontal direction once the scene is ready. Use the property panel to set the variable type to number.

### 2. Read The Keys

Add two `KeyDownEvent` blocks. Configure one for `ArrowRight` and one for `ArrowLeft` in the property panel. Wire each into a `SetVariable` that sets `heroVX` to `1` and `-1`. Add two `KeyUpEvent` blocks that reset `heroVX` to `0`.

Use a sticky note (`Ctrl/Cmd+M`) to label this cluster "Input".

### 3. Apply Velocity Each Frame

Add `SceneTickEvent`. Read `heroVX` with `GetVariable`, multiply it by a speed `Constant`, and build a velocity vector with `CombineVector3` (x = heroVX*speed, y = current vy, z = 0). Feed it into `SetLinearVelocity` targeting the `hero` physics body, selected from the scene picker.

### 4. Group It

Select the tick blocks and press `Ctrl/Cmd+G` to make a smart group. This keeps the canvas readable as later steps add more.

## Test In The Editor

Press Start and use the arrow keys in the preview. The hero should run. Turn on Debug Mode to watch the tick blocks light up each frame, and inspect `heroVX` in the Variables panel as you press keys.

## Save

Save to the snippet server. Your graph should match `#2J4PCY`. Continue with [Step 3 - Add Jumping](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/jump).
