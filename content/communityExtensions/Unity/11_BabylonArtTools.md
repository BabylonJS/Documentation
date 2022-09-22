---
title: Art Tools
image:
description: The Unity Toolkit art tools allow you to optimize your game assets for maximum performance using the WebGL platform.
keywords: babylon.js, exporter, unity
further-reading:
video-overview:
video-content:
---

Good performance is critical to the success of many games. The graphical parts of your game can primarily impact on two systems of the computer: the GPU and the CPU.

**Common Bottlenecks:**

- The **GPU** has too many vertices to process. The number of vertices that is acceptable to ensure good performance depends on the GPU and the complexity of vertex shaders. Generally speaking, aim for no more than 100,000 vertices on mobile. A PC manages well even with several million vertices, but it is still good practice to keep this number as low as possible through optimization.

- The **CPU** has too many vertices to process. This could be in skinned meshes, cloth simulation, particles, or other game objects and meshes. As above, it is generally good practice to keep this number as low as possible without compromising game quality. See the section on CPU optimization below for guidance on how to do this.
  If rendering is not a problem on the GPU or the CPU, there may be an issue elsewhere - for example, in your script or physics. Use the Unity Profiler to locate the problem.

The art tools provided by the toolkit allow you to optimize your game assets for maximum performance using the **WebGL** platform.

# Maya Arts Tools

**Maya Scripts** plattform folder locations:

- **Windows** - C:\Users\USERNAME\Documents\maya\*VERSION\*\scripts

- **Macintosh** - ~/Library/Preferences/Autodesk/maya/_VERSION_/scripts

Check out the [Maya Arts Tools Tutorial](http://www.babylontoolkit.com/videos/MayaArtTools.mp4) to get started optimizing your geometry for web based game development.

# Babylon Reskin Tool

Reskin and combine selected meshes with new max influencers. Download and install the [Babylon Reskin Tool](https://github.com/BabylonJS/Exporters/blob/master/Maya/Tools/babylonReskinTool.mel) file in your **Maya Scripts** folder.

Open the Script Editor and go to the Mel tab, copy and paste command below:

    babylonReskinTool();

Highlight it and click on "Save Script to Shelf...", specify a name ('Reskin') and click "OK".

# Babylon Namespace Tool

Removes unwanted namespace text from selected object. Download and install the [Babylon Namespace Tool](https://github.com/BabylonJS/Exporters/blob/master/Maya/Tools/babylonReskinTool.mel) file in your **Maya Scripts** folder.

Open the Script Editor and go to the Mel tab, copy and paste command below:

    babylonNameTool();

Highlight it and click on "Save Script to Shelf...", specify a name ('Names') and click "OK".

# Unity Art Tools

# Geometry Tools

The geometry tools help improve overall scene performance by optimizing game art for **WebGL** rendering. The toolkit supports combining meshes, seperating meshes, generating blocking volumes for collision and baking a texture atlas for **Static Mesh Filter** game objects.

![Geometry Tools](/img/exporters/unity/combinemeshes.jpg)

# Height Mapping

The height mapping tool enables **16-Bit RAW Greyscale** image manipulations. This is very useful to convert to and from **RAW** and **PNG** image formats and to scale height maps to the desired mesh detail resolution.

![Height Mapping](/img/exporters/unity/heightmapping.jpg)

# Cubemap Baking

The cubemap baking tool can pre bake environment **Skybox** and **Radiance** texture images. The toolkit supports **Low Dynamic Range**, **High Dynamic Range**, and **Direct Draw Surface** image file formats. An internal [Cubemap Filtering Tool](https://github.com/dariomanesku/cmft) plugin is used to process cubemap textures. It reaches very fast processing speeds by utilizing both multi-core CPU and OpenCL GPU at the same time.

![Cubemap Baking](/img/exporters/unity/cubemapbaking.jpg)

# Texture Atlas Skin

The texture atlas skin tool allows you to bake a texture atlas for **Skinned Mesh Renderer** game objects. It will parse all the sub meshes (materials) and combine all the textures into a group of texture atlas images. The toolkit will encode new uv sets and bake new geometry assets using the combined texture atlas material assets.

![Texture Atlas Skin](/img/exporters/unity/textureatlasskin.jpg)
