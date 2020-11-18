---
title: GUI
image: 
description: Learn all about the Babylon.js GUI systems.
keywords: welcome, babylon.js, diving deeper, GUI
further-reading:
video-overview:
video-content:
---

# Graphical User Interface

There are a number of options for adding a GUI to Babylon.js. The **Babylon.GUI** is covered in this section. It allows you to place buttons and labels within in 3D space as well as a 2D front of screen GUI. When you want a GUI that works in VR or within the 3D space it the only option. It is integrated within the playground. For your own projects it has to be loaded as well as Babylon.js

Other possible GUIs are:
1. CastorGUI a Babylon.js a community extension which overlays the scene
1. Dat.GUI, an external interface
3. HTML

<Playground id="#NGS9AU" title="Simple GUI Slider Example" description="Simple example of adding a GUI slider to your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI1.jpg"/>

# CastorGUI
An alternative 2D GUI is the extension [CastorGUI](/extensions/CastorGUI) with [documentation](/extensions/CastorGUI). It has to be loaded both for the playground and for your own projects.

It can be found on [github](https://github.com/dad72/CastorGUI) 

<Playground id="#S34THY#14" title="CastorGUI Example" description="Simple example of using the CastorGUI system in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI2.jpg"/>

# Dat.GUI
 The external [dat.GUI](https://github.com/dataarts/dat.gui) is integrated within the playground. For your own projects it has to be loaded as well as Babylon.js

 <Playground id="#NGS9AU#1" title="dat.GUI Example" description="Simple example of using the dat.GUI system in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI3.jpg"/>

# HTML
Since Babylon.js is in JavaScript it is possible to use HTML and CSS to overlay the Babylon.js scene

<Playground id="#1AHPN5" title="HTML GUI Example" description="Simple example of using HTML GUI elements in your scene." image="/img/playgroundsAndNMEs/divingDeeperGUI4.jpg"/> [Playground Example Simple HTML](https://www.babylonjs-playground.com/#1AHPN5)