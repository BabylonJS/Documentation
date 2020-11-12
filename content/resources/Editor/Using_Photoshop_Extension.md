---
title: using the Photoshop Extension
image: 
description: Babylon.js Editor extension to connect to the current Photoshop instance opened in our computer and send to the editor the file that is being edited in Photoshop.
keywords: welcome, babylon.js, editor, photoshop
further-reading:
video-overview:
video-content:
---

## Introduction

The Babylon.JS Editor v3.2.0 comes with a new feature: the Photoshop Extension. The goal of this extension is to connect to the current Photoshop instance opened in our computer and send to the editor the file that is being edited in Photoshop. This feature is mainly used to live-texture meshes and see the result in real-time (almost real-time) without reloading the scene.

The Editor's plugin is called a "Generator Plug-in" and works only with Photoshop CC: http://blogs.adobe.com/photoshop/2013/09/introducing-adobe-generator-for-photoshop-cc.html. In other words, the editor will connect to Photoshop and listen events.

A simple demo video is available here:
<iframe width="560" height="315" src="https://www.youtube.com/embed/-gsR6FJPA8Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

## Enabling Extensions

First, we have to enable Generators Plug-ins in Photoshop. To enable, just go in preferences -> plug-ins to open the plug-ins options.
![OpeningPreferences](/img/extensions/Editor/PhotoshopExtension/photoshop_setup.png)

The first options are based on Photoshop Generators. We'll have to enable:
* Generator
* Remote connections (required as the plug-in is not installed in the Photoshop directory but is embeded by the editor)
* A password (default is "password")
![Generators](/img/extensions/Editor/PhotoshopExtension/generators.png)

Once done, click "Ok" and Generator Plug-ins are enabled!

## Connecting to Photoshop

The last step is to connect to Photoshop. In the editor, in the main toolbar, a Photoshop icon is available and can be clicked.

![EditorConnect](/img/extensions/Editor/PhotoshopExtension/editor_connect.png)

This will ask you a password: this is the password you chose for remote connections in the plug-ins preferences. Type your password and then the editor connects to Photoshop:

![EditorPassword](/img/extensions/Editor/PhotoshopExtension/editor_password.png)

## Viewing Textures

Once connected, to view textures, just open the Textures Viewer and assign to our meshes we want to live-texture.

![EditorPassword](/img/extensions/Editor/PhotoshopExtension/editor_textures_viewer.png)

That's all!
Now, once a photoshop file changes (painting, new text, etc.) then the texture will be sent to the Editor and will be updated in the Babylon.JS Scene in real-time.