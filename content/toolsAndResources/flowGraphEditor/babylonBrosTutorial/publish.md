---
title: Step 8 - Save And Publish
image:
description: Save the finished Babylon Bros flow graph to a snippet and load it from a Playground scene to ship the full demo.
keywords: babylon.js, flow graph editor, tutorial, snippet, publish, playground, parse from snippet
further-reading:
    - title: Step 7 - Win Condition
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/win
    - title: Example - Babylon Bros Platformer
      url: /toolsAndResources/flowGraphEditor/babylonBrosExample
---

## Goal

Turn the finished graph into something a scene can run by saving it to a snippet and loading it at runtime.

## Save To The Snippet Server

In the editor, save to the snippet server. You get an ID back; the final tutorial graph is `#HUA46E`. To preview it against the level, load scene `P41T6E#2` in the editor's preview panel.

![The complete Babylon Bros graph in the editor, ready to save to the snippet server](/img/tools/flowGraphEditor/tutorial/editorOverview.webp)

## Load It From A Scene

In your scene code, parse the coordinator from the snippet and start it:

```javascript
const coordinator = await BABYLON.ParseFlowGraphCoordinatorFromSnippetAsync("HUA46E", { scene });
coordinator.start();
```

Because the scene is inert, this single graph is what brings it to life - movement, jumping, coins, springs, enemies, and the win condition all come from the flow graph.

## See It Together

The full demo is the complete scene plus the graph:

<Playground id="#P41T6E#1" title="Babylon Bros - Finished" description="The finished Babylon Bros platformer: an inert scene brought to life entirely by a Flow Graph loaded from a snippet." category="Flow Graph"/>

## Where To Go Next

- Reopen any step in the editor and experiment: change jump force, coin scoring, or enemy behavior.
- Round-trip your edits through the snippet server to compare against `#HUA46E`.
- Revisit the [block families](/toolsAndResources/flowGraphEditor/supportedBlockFamilies) for capabilities this tutorial did not use.
