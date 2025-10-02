---
title: Examples
image:
description: Inspector V2 extensibility examples.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
video-overview:
video-content:
---

Following are a number of concrete examples showing how to extend Inspector V2.

<Alert severity="info">
The code is shown by default for each example, but you can **drag the divider on the right towards the left to reveal a live demo of the example**.
</Alert>

## Adding a Side Pane

This example demonstrates how to add an entirely new side pane (along side Scene Explorer, Properties, etc.).

In this example, the new left side pane intercepts messages from Babylon's `Logger` class and displays them in the side pane. Look for a new tab icon that looks like a document next to the Scene Explorer tab icon in the upper left.

<CodeSandbox id="5r44gx" title="Inspector V2 - Adding a Side Pane" height="600px" />

## Adding a Toolbar Item


Add a new pane - another idea would be to use an external lib to show a treemap of nodes + vertex count?
Add a toolbar item - badge with different colors depending on draw call count
Add a section to scene explorer - maybe a list of asset containers that are scene specific
Add a section to properties - continue the scene explorer example with properties for an AssetContainer
Add a section to settings - maybe not needed
Add a pane that is itself extensible, or something else - 
Dynamic extension - just make one of the previous examples dynamic
