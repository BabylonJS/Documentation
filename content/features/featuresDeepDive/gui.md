---
title: GUI
image:
description: Learn all about the Babylon.js GUI systems.
keywords: diving deeper, GUI
further-reading:
video-overview:
video-content:
---

## Graphical User Interface

There are a number of options for adding a GUI to Babylon.js. The **Babylon.GUI** is covered in this section.

It allows you to place buttons and labels within in 3D space as well as a 2D front of screen GUI.
When you want a GUI that works in VR or within the 3D space it's the only option.

It is integrated within the playground. For your own projects it has to be loaded as well as Babylon.js.

<Playground id="#NGS9AU" title="Simple GUI Slider Example" description="Simple example of adding a GUI slider to your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI1.jpg"/>

Other possible GUIs are:

1. CastorGUI, a Babylon.js community extension which overlays the scene
1. Dat.GUI, an external interface
1. HTML GUI

## CastorGUI

An alternative 2D GUI is the extension [CastorGUI](/communityExtensions/castorGUI). It has to be loaded both for the playground and for your own projects.

It can be found on [Github](https://github.com/dad72/CastorGUI).

<Playground id="#S34THY#14" title="CastorGUI Example" description="Simple example of using the CastorGUI system in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI2.jpg"/>

## Dat.GUI

The external [dat.GUI](https://github.com/dataarts/dat.gui) is integrated within the playground. For your own projects it has to be loaded as well as Babylon.js.

<Playground id="#NGS9AU#1" title="dat.GUI Example" description="Simple example of using the dat.GUI system in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI3.jpg"/>

## HTML GUI

Since Babylon.js is in JavaScript it is possible to use HTML and CSS to overlay the Babylon.js scene.

<Playground id="#1AHPN5" title="HTML GUI Example" description="Simple example of using HTML GUI elements in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI4.jpg"/>

## Comparison of GUI Options

Here's a list of the pros and cons of using different types of GUIs. It’s worth noting that these options aren’t mutually exclusive - they can be used together, depending on requirements, for instance:

- Use a simple HTML GUI for initial rapid protoyping, before transitioning to Babylon 2D or 3D GUI
- Use an HTML GUI overlay for complex, dynamic, text-heavy info panels but Babylon 2D GUI for everything else

The sky’s the limit! Go forth and GUI in whatever way takes your fancy!

### HTML GUI

#### Pros

- Use familiar HTML, CSS and front-end frameworks like Bootstrap, Tailwind, React, Vue, Svelte & Angular etc
- Near unlimited flexibility & mobile responsiveness
- High performance (as rendered by native browser rather than 3D engine)
- Easier to make WCAG accessibility compliant

#### Cons

- Looser integration with 3D scene
- Can’t have GUI elements directly within 3D scene (e.g. applied to meshes)
- Can’t apply 3D post processing effects to overlaid HTML GUI elements
- Can’t be used for fullscreen/native VR

### Babylon 2D GUI

#### Pros

- There’s now an awesome [GUI Editor](/toolsAndResources/guiEditor) to make interface creation easier!
- Tight integration with 3D scene
- Ability to optionally apply scene post processing effects to GUI as well
- Ability to apply/link GUI elements and meshes
- Some unique, useful capabilities like nine-patch stretching and sprite-sheet animation that aren’t available with a raw HTML GUI

#### Cons

- Less comprehensive/flexible than HTML GUI (but still more than enough for most requirements)
- Depending on advanced dynamic texture resolution, GUI may look a little blurry
- Possibly some performance considerations
- Can’t be used for fullscreen/native VR

### Babylon 3D GUI

#### Pros

- Supports fullscreen/native VR
- Tight integration with 3D scene
- Ability to optionally apply scene post processing effects to GUI as well

#### Cons

- Less comprehensive/flexible than both Babylon 2D GUI and HTML GUI
