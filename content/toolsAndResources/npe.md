---
title: Node Particle Editor
image: 
description: Learn how to use the Node Particle Editor
keywords: particles, effects, node, graph, editor
further-reading:
video-overview:
video-content:
---

## What Is Node Particle Editor?
The Node Particle Editor will be familiar for anyone who has already used the Node Material Editor or Node Geometry Editor. This editor, like its siblings, was created to speed up the process of creating particle systems and reduce the amount and complexity of code that needs to be written to generate particle effects. Additionally, users will not need deep knowledge of the Particle System API as the tool handles all of the necessary syntax and validation for us.

The tool is available as a stand alone experience by visiting [Node Particle Editor](https://npe.babylonjs.com) and can also be opened from the inspector when selecting any Node Particle System in the scene.

![Node Particle Editor Edit Button](/img/tools/npe/npeButton1.png)

Additionally, when you select a regular particle system in the scene, you will have the option to view its representation as a Node Particle System.

![Node Particle Editor View As Button](/img/tools/npe/npeButton2.png)

## Interface

The interface for the editor is broken into 4 main sections as can be seen below. The node list is the entire list of available blocks that can be dragged onto the graph. At the top of the list is a search box to help narrow the list. The graph is the workspace for arranging the blocks to create the particle system flow. There is a panel for parameters and controls on the right side of the window which displays any parameters available to the currently selected block. If nothing on the graph is selected, this panel shows controls for the tool itself to load, save, or change default settings. In the bottom right is the preview window which displays the current particle system output in real-time. Lastly, at the bottom of the window is the console log panel which gives information about the build status of the current graph.

![Babylon.js Node Particle Editor](/img/tools/npe/npeWindow.png)

The image above shows several types of blocks available in the graph. At minimum, all particle system graphs need exactly one **System** block and at least one **Emitter** block that creates particles. The System block is the core of every particle system, defining properties like particle capacity, blend modes, and billboard settings. Note that the inputs and outputs on the blocks share colors that give hints on what can be connected. 

Shapes are just one type of several block categories such as Updates, Inputs, Logical, Math, Interpolation, Triggers, and more. Connecting these different block types creates an almost limitless variety of particle effects.

## Adding Nodes

Adding blocks to the graph is one of the most common actions taken while working with the editor. There are two main methods for adding blocks to the graph. The first method is clicking and dragging a block from the node list onto the graph and releasing the mouse button. This will drop the selected block at the mouse position. The node list can be filtered by entering a keyword in the search bar at the top of the list to help find a block faster.

The second method is to press the space bar for a shortcut to open a search window with a full block list at the mouse position on the graph. Once the window is open, we can simply start typing to enter a keyword in the search bar. Once the list is filtered, use either the mouse to click the desired block or use the arrow keys to highlight the desired block and press enter. This will drop the block at the mouse position when the shortcut was invoked. If a wire was selected when the shortcut was opened, the editor will attempt to connect the block in the middle of the connection that was selected. If the block to be placed contains compatible inputs and outputs, a connection will be made.

![Press space bar for shortcut to search bar to filter node list which appears at the mouse position](/img/tools/npe/nodeAddShortcut.png)

There is one other shortcut to quickly add blocks in a contextual manner. For most block inputs with a defined type, we can simply click on the input and drag to the left of the block which will drag out a dashed wire of the type the input expects. Once the mouse button is released, an input block of the correct type will be dropped. For example, clicking on a Vector3 input and dragging left will automatically create a Vector3 input block when released.

![Click and drag from node input to drop an automatically connected node of the appropriate type on release of the mouse button](/img/tools/npe/dragAddNode.png)

## Connecting Nodes Together

Blocks usually have one or more inputs and one or more outputs, though there are blocks that have only inputs or only outputs. What is common to all blocks is that each individual block has requirements for the data that passes through it. These requirements typically take the form of data types that the blocks expect for their calculations. To easily tell what type of data a block expects, look at the input and output icons on the block. To help decipher the icons, please refer to the legend below:

![Input type iconography](/img/tools/npe/inputTypes.png)

The most common data types are **Float**, **Vector3**, and **Color4** which are used for numeric values, positions/directions, and colors respectively. The **Particle** type is specific to the Node Particle Editor and represents the particle data stream that flows from emitters through update blocks to the system output.

**AutoDetect** is not really a data type, but a prompt to let us know that the block supports multiple data types. If a supported data type is connected to an AutoDetect type port, the block will convert all AutoDetect ports to the connected type. In this way, AutoDetect type ports will only appear on a block that does not have any connections.

Anytime a block requires a specific input to be wired, the console log will display an error saying the graph cannot be evaluated until all required inputs have been connected.

![Required connections are displayed in console log](/img/tools/npe/requiredConnection.png)

### Shortcuts for Connecting Nodes

There are several shortcuts to help speed up connecting blocks which can save a lot of mouse clicks. The first is dropping a block onto an existing wire to automatically connect compatible inputs and outputs. The block needs to already be in the graph for this to work, so drag it from the block list to the graph first. Then when dragging the block over a wire, the wire will highlight if the dragged block has inputs that are compatible with the data type represented by the wire. When releasing the mouse button, the editor will attempt to connect both inputs and outputs of the new block to maintain the original flow for the graph. There are, however, instances where a new block dropped on a wire in this way will still prevent the graph from being evaluated, mostly due to the new block having requirements that are not met.

![Dropping an unconnected node on a compatible wire will attempt to insert the node into the flow](/img/tools/npe/dragInsertNode.png)

Another shortcut to be aware of is really two different actions that are performed with a similar shortcut. The first allows a quick deletion of a connection simply by holding alt and left clicking an input port or output port. However, if alt is held and the left mouse button is clicked and held on a port, instead of deleting the wire, the wire is disconnected from the port allowing the connection to be moved from one port to another.

## Graph Organization

When working with any node graph tool, organization can make a big difference in being able to read a graph and understand it. Whether a graph is to be shared with others who also need to be able to understand the graph or if we come back to a graph at a future date when we've forgotten about the choices we made when creating the graph, there are several practices we can use to alleviate confusion.

### Naming

Every block can be assigned a custom name in the parameters panel. Naming can be done just to help us remember what the block is doing or it can be done to enable us to get a particular block from our code to set a value. No matter what a block is named, the original block type is still visible in the parameters panel so renaming a block won't cause any confusion about what the block is doing.

![Selected nodes can have their name edited in the parameters panel.](/img/tools/npe/namingNodes.png)

### Node Comments

The name of a block is a limited way of communicating what a block is doing. If a longer explanation is required, a comment can be added to a block which will display on the graph above the block. The limitation here is that the comment will maintain the same width as the block and wrap lines as necessary. This means that very long comments aren't great to use on blocks as they can be harder to read and require a clear graph behind them to be read.

![To give more context to a node, enter a comment in the parameters panel to display the comment above the node in the graph.](/img/tools/npe/nodeComments.png)

### Frames

To help group blocks together visually, frames can be drawn around them by pressing and holding the shift key while clicking and dragging a selection around the desired blocks. Clicking and dragging the header bar of the frame will move all blocks contained within the frame with the frame. It can be resized by hovering the pointer on a side or corner of the frame to fine tune the blocks that the frame encompasses.

![Frames can be drawn around nodes to help visually organize the graph and allow multiple nodes to be moved at once.](/img/tools/npe/graphFrames.png)

Frames can also be customized to help them stand out when looking at a graph. They can be given custom names and colors right in the parameters panel. Importantly, comments can also be added to frames and are displayed at the top of the frame. Comments will text wrap at the width of the frame so this is the best way to leave longer comments in the graph to describe what a section of the graph is doing.

![Frame names and colors can be set in the parameters panel. Long comments can be left on frames which will always display at the top of the frame.](/img/tools/npe/customizeFrame.png)

Note that on the header bar for a frame there is a close button to remove the frame. Right next to the close button is a collapse button which will collapse the frame and all contained blocks to a small format that tries to mirror the size of common blocks. The frame name and comment are still visible when a frame is collapsed. Any wire that crossed the border of the frame when expanded will become an input or output on the collapsed frame. This allows even more organization of the graph by minimizing sections of the graph and saving space. Any wire connected to the inputs and outputs on a collapsed frame will be routed to the original blocks inside the collapsed frame.

![Frames can be collapsed to hide all nodes within and take up less space on the graph.](/img/tools/npe/collapsedFrame.png)

The names of the inputs and outputs are taken from the name of the input or output where the wire originated. To help with clarity, however, by clicking on any input or output on a collapsed frame, the parameters panel will display an option to set a custom name. This allows collapsed frames to be more specific about where the port will lead inside the frame when collapsed. Expanding the frame will retain the original block positions and wires passing outside the frame. Note that an input or output that was renamed when collapsed will retain the custom name when expanded.

![To make a collapsed frame more user friendly, click on an input or output to change the name of the port.](/img/tools/npe/customOutputName.png)

### Custom Frames

Frames also enable reuse of parts of your graph elsewhere. If there is a part of a graph that seems like it could be a common operation through a collection of particle systems, simply create a frame around the blocks and export the frame using the `Export` button in the parameters panel. Clicking on the `Add...` button under Custom Frames in the block list enables import of the custom frame into the block list. Once imported to the block list, the custom block will be available any time the editor is launched so it only needs to be imported once. Additionally, the frame comments will appear as a tool tip when hovering the frame in the block list to give context to each frame as the custom frame list grows.

From there the custom frame can be dragged into the graph as any other block and will place in collapsed form to reduce the amount of needed space. Custom frames also appear in search results so searching in either the block list or the shortcut block list opened with the space bar will return custom blocks to make adding them even faster. Once in the graph, it acts like any other frame and can be expanded, collapsed, and arranged in any manner desired. The frames can also be directly edited in the graph or changed completely. In this way, custom frames can act like a template bringing in common collections of blocks to a graph and speeding the process of creating particle systems.

![Exporting a frame allows for import of the frame to the node list while retaining the frame comments to display on hover and is searchable](/img/tools/npe/exportFrameFlow.png)

### Wire Elbows

When working with graph editors, one of the ways it can be hard to read comes from the natural process of wires connecting different blocks turning into spaghetti. If it is not clear which path a wire is taking because it crosses or overlaps other wires or sits beneath other blocks, comprehension of the graph goes down and it takes longer to understand what the flow is actually doing. Where frames help organize blocks, elbows help organize the wires in a graph.

![A graph with many overlapping wires becomes hard to read as it is unclear which nodes are connected due to the inability to trace wires](/img/tools/npe/elbowNode1.png)


Elbow blocks can help to re-route wires in a graph allowing the user to bend and/or redirect wires into a more readable format. Adding an elbow is like any other block where it can be added from the block list or the search shortcut accessed with the space bar. However, there is a simpler way to add an elbow to a wire. Simply hover the cursor over a wire that needs an elbow and the wire will highlight. Next, hold the option key (or alt on Windows) while left-clicking the mouse on the wire. An elbow will be added to the wire at the cursor position at which point it can be moved around or be the source for more connections to other blocks as seen below.

![Elbows can redirect wires to a more readable path as well as serve as a connection point for additional nodes](/img/tools/npe/elbowNode2.png)

## Editor Options

When clicking on an empty portion of the graph, the parameters panel will display general options for the editor as well as save and load actions. Let's take a moment to go through each of the available actions.

- **Reset to default** will reset the entire graph to the default state. This is useful for clearing the entire graph to start over but use with care as this action is not reversible.
- **Zoom to fit** will set the magnification and pan for the graph so that all blocks are visible at once. This is helpful if the graph is panned away from the blocks and it is not clear which direction to pan to return to the flow.
- **Reorganize** will perform a cleanup for all blocks in a graph. It will attempt to rearrange all blocks so that none overlap one another. It will also attempt to flow blocks from left to right so that wires are not doubling back on themselves. It will also respect frames and try to rearrange blocks within the frame's area without changing the size of the frame. There are times when the reorganize won't be able to optimize due to how blocks are wired, but it will attempt to optimize the block layout.
- **Grid size** will change the spacing of the grid lines in the graph.
- **Show grid** will toggle the display of the grid in the editor.
- **Undo/Redo** will toggle the undo/redo functionality in the editor.
- **Rebuild** will rebuild the graph within the tool, which will update the particle system in the preview window. While the graph automatically rebuilds with every change, the rebuild button is useful when the graph includes blocks that produce procedurally generated output like `Random`. Pressing the rebuild button will allow testing of the graph to see different output generated by procedural blocks without needing to make a change to the graph itself.
- **Load** will load a particle system graph from a local JSON file. This will replace whatever blocks have been placed on the graph with the loaded particle system graph.
- **Save** will save the current particle system graph to a local JSON file. For production projects, saving local JSON files is preferable to using the snippet server to ensure that the JSON is always available to the project from the local server.
- **Load Frame** will load a previously exported custom frame from a local JSON file and add it to the block list for reuse.
- **Load from snippet server** will load a particle system graph from the snippet server using a snippet ID.
- **Save to snippet server** will save the current particle system graph to the snippet server and generate a snippet ID that can be parsed into an experience with only the snippet ID. This is a great option for sharing graphs or for prototyping, but isn't a good choice for production as the snippet server exists outside a project's local infrastructure and should not be relied upon for uptime when a project is live.

![Options for the graph color, grid, and zoom including save and load actions](/img/tools/npe/npeOptions.png)

## Understanding Particle Flow

Node Particle Editor works with a fundamental concept of particle lifecycle and flow. Unlike the Node Geometry Editor which generates static meshes, the Node Particle Editor creates dynamic particle systems that continuously spawn, update, and destroy particles over time.

### Particle Lifecycle

Every particle goes through three stages:

1. **Creation** - Particles are spawned by emitter blocks which determine the initial position, velocity, and distribution of new particles
2. **Update** - Each frame, particles pass through update blocks that modify their properties like position, color, size, rotation, and velocity
3. **Destruction** - Particles are removed when they reach their maximum lifetime or meet other death conditions

The flow through the graph follows this lifecycle, with emitter blocks at the start of the chain, update blocks in the middle, and the System block managing the overall particle pool.

### The System Block

The **System** block is the heart of every particle system graph. It's a required block that manages:

- **Particle Capacity** - Maximum number of particles that can exist simultaneously
- **Emitter Settings** - Rate of particle creation and pre-warm cycles
- **Blend Mode** - How particles blend with the scene (alpha, additive, multiply, etc.)
- **Billboard Mode** - How particles face the camera
- **Texture** - The sprite or texture applied to particles

All emitter and update flows must eventually connect to the System block for the particle system to function.

### Connection Flow

The typical flow in a particle system graph follows this pattern:

1. **Input Blocks** provide values (constants, random, gradients)
2. **Emitter Blocks** create particles with initial properties (position from shapes like box, sphere, cone)
3. **Update Blocks** modify particle properties each frame (color fade, gravity, rotation)
4. **System Block** receives the complete particle definition and manages the system

Multiple emitters and update chains can feed into a single System block, allowing complex particle behaviors to be composed from simple building blocks.

![Example of a Particle System with the Create and Update phases highlighted](/img/tools/npe/02.jpg)

## Iterating and Debugging

When creating a Node Particle System in a scene, it can always be edited simply by launching the Node Particle Editor with the particle system selected in the inspector. The **Edit** button to launch the Node Particle Editor can be found under the particle system properties which appear when the system is selected.

![Node Particle Editor Edit Button](/img/tools/npe/npeButton1.png)

Launching the editor from here will connect the editor to the scene allowing changes to the graph to be reflected in the scene. The Node Particle Editor will automatically update the particle system in the scene whenever there is a change to the graph, providing immediate visual feedback.

There may be a time when it is necessary to debug the interaction between the particle system graph and the code generating the scene. If, for some reason, the particle system graph fails to build, you can still open the Node Particle Editor with the call:

```javascript
nodeParticleSystemSet.editAsync();
```

This will open the editor with the referenced graph loaded into it.

### Preview Window

The preview window in the bottom-right of the editor provides real-time feedback as you build your particle system. It continuously plays the particle effect, allowing you to see how changes to blocks affect the visual output immediately. You can interact with the preview camera to view the particles from different angles.

The preview automatically updates when:
- Blocks are added, removed, or reconnected
- Block properties are changed
- The graph is rebuilt

### Console Output

The console panel at the bottom of the editor displays important information about your particle system:

- **Build Status** - Whether the graph successfully built
- **Errors** - Missing connections, invalid configurations, or type mismatches
- **Warnings** - Potential issues that don't prevent the system from running

Always check the console when the preview doesn't show expected results. Error messages will guide you to the specific blocks that need attention.

## Getting Started

Jumping into the Node Particle Editor may seem a little overwhelming at first, but the best path is just to jump in and start experimenting. There is a complete breakdown of each of the blocks and how to use them in the [Node Particle Editor Blocks](/toolsAndResources/npe/npeBlocks) reference.

You can also jump to [Node Particle Editor](https://npe.babylonjs.com) which will open with a simple particle system already created that you can tweak and experiment with.

The key to mastering the Node Particle Editor is experimentation. Try different emitter shapes, chain multiple update blocks together, and see how particles respond to your changes in real-time.
