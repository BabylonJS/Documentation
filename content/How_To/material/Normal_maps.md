---
title: Normal Maps
---

The goal of this article is to clearly explain what is happening with normal textures with some samples to hopefully clear up any confusion about what is happening.

To do so we are going to use this playground as an example: https://playground.babylonjs.com/#YCCU8U

What the normal map formats are and what they look like?

* OpenGL expects the first pixel in the texture to be at the bottom (lower-left pixel) and can be thought of as bottom up
* DirectX expects the first pixel in the texture to be at the top (upper-left pixel) and can be thought of as top down

To see what that looks like, we can consider this normal map comparison:

![Different normal maps convention](/img/how_to/Materials/normal_maps1.jpg)

To help identify what normal format you have by looking at the texture, you need to understand if details on the texture are embossed (stands proud of the surface) or debossed (does not stand proud of the surface). As an example, the left shapes in each texture above are embossed and the right shapes in each are debossed. Next look at the tones in the map and assume that the lighter tones in the normal texture (the light greens) are being cast from a light either directly above or below the texture. If you know your details are embossed and the lightest tones are at the top suggesting the light is positioned above your texture, you have an OpenGL format texture. If the lightest tones on an embossed detail are on the bottom, suggesting the light is below the texture, you have a DirectX format texture.

Truly, the only difference between the two formats at the file level is that the Y coordinate is inverted, positive being up in OpenGL and down in DirectX. If you assume the R, G, and B channels map to the coordinate system X, Y, and Z, you can see that we only need to change the G channel of the texture to convert between the formats. And the only operation you need to do is an invert of the tones in the G channel if you want to convert in an image editing package. Or you could convert directly in the shader by including a one minus pixel color for the G channel of the texture. And in our Node Material Editor, we have parameters on the perturb normal node that allow you to invert Y in the normal texture to effectively convert between the two formats.

Now let’s look at the requirements used by software:

* [Arnold Renderer uses OpenGL format](https://academy.substance3d.com/courses/Substance-guide-to-Rendering-in-Arnold)
* [Maya can use either format but needs to be specified in the Display preferences](https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2018/ENU/Maya-Customizing/files/GUID-BF017019-B89A-47F0-8AB5-106C058AB854-htm.html). I believe that the default is OpenGL - Core Profile (Compatibility) due to Arnold now being their bundled renderer.

![Maya export window](/img/how_to/Materials/normal_maps2.png)

When you are creating your textures, you can specify the format for the normal map before baking, but you need to align with your final use case. With that in mind, whether you are targeting an offline rendering engine like Arnold or a real-time rendering engine like Babylon.js, you need to know which format is expected by the renderer’s shaders and how your file formats may impact that choice. So let’s look at those:

* [glTF uses OpenGL as the format for its normal textures](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materialnormaltexture).
* Babylon.js uses DirectX as the format for its normal textures for Standard Materials, PBR materials, and Node Materials

This would seem to be a simple conversion from OpenGL to DirectX formats when using a glTF, but there is another issue that complicates this matter.

* glTF uses a right-handed coordinate system
* Babylon.js uses a left-handed coordinate system

This is important for this reason:

![Visual difference between conventions](/img/how_to/Materials/normal_maps3.jpg)

This is a glTF file with two planes in it exported from Maya. They were both assigned an Arnold standard surface shader with an OpenGL format normal map. When the file is loaded the plane on the right has its material replaced

When you load that glTF into Babylon.js, we take care of converting the file to match the handedness of the scene for you. However, what you see here is that the plane on the right has been assigned a Node Material with a DirectX format normal texture. It may be a little confusing why the normal looks incorrect when we just said that Babylon materials expect a DirectX format normal but this has to do with how the glTF was loaded. Babylon.js materials still expect a DirectX format normal, but when we loaded the glTF, we inverted the tangent space in Y so that it conforms with the OpenGL convention of glTF. That means that any normal texture that is applied to the mesh, no matter if it is a material from the original file or one that is created in Babylon.js needs to be authored in the OpenGL format to render correctly.

Now it may be easy to assume that if I just save my files in the .babylon format that all would be fixed and I could just save all my normal maps and DirectX format. You would be correct only if you do not change any textures in the materials assigned to your meshes and just used the assets from the .babylon file directly. If you assign a new texture to a material on a mesh from a .babylon file or you assign an entirely new material such as a node material you will get an unexpected result. The image below shows a .babylon file imported with the same OpenGL format normal from above on the left and on the right a node material that assigns a DirectX format normal to the plane.

![Normal direction based on conventions](/img/how_to/Materials/normal_maps4.jpg)

So what happened? The plane on the left looks incorrect as it should, but the one on the right looks completely wrong. This stems from the origin of Babylon.js as it was a spiritual successor to an older engine that Deltakosh wrote which was a DirectX engine. Much the same as mentioned before, DirectX formatted normal textures are read from the upper left pixel rather than the lower left pixel in OpenGL, UV space in DirectX is also read from the upper left instead of the lower left.

To illustrate this, here is a simple graph to show how the UVs are stored in a glTF file versus .babylon file:

![UV directions](/img/how_to/Materials/normal_maps5.png)

When we export a .babylon file, we don’t change anything about the texture files as that could cause some extra problems when updating or editing the textures, but we know on load that the UV space is DirectX with the textures likely being in OpenGL format. So when we read in the textures we store them in memory inverted in Y. You can see this if you inspect a texture in your scene loaded from a .babylon file. You will notice an indication as to whether it is "Stored as Inverted on Y" in the list of general properties.

![Inspector](/img/how_to/Materials/normal_maps6.jpg)

So how do we fix this. There are three ways we can work around this issue when adding new textures to a loaded .babylon file, one art fix and two code fixes. The art fix would be to author your normal textures in DirectX format and save your textures inverted in Y. You could do this on export from your texturing tool like Substance or you could manually invert them in Y in an image editor. This could be very disruptive to your art pipeline, so it may not be the right solve.

The code fixes are simpler. One is to invert your texture when you load it by using the [invertY parameter available in BABYLON.Texture](https://doc.babylonjs.com/api/classes/babylon.texture#constructor) which is the easiest solve. However, if you are loading textures through Node Material rather than in your javascript, that won’t work. This leads us to the other code solve which is to add a one minus Y operation to the UVs fed to your texture as you can see below.

![Node material](/img/how_to/Materials/normal_maps7.png)

This will correct your texture inversion issue and as you can see this will fix the rendering. Again, the planes are loaded from a .babylon file and the left one was assigned an OpenGL format normal texture in Maya and the right uses a DirectX format normal assigned with a Node Material that has the UV space inverted in Y.

![Final result](/img/how_to/Materials/normal_maps9.jpg)

It is a deep topic which is made more complex by multiple file formats with their own conventions, but there are tools available in engine to switch to whatever you need. In a way we can say that while Babylon.js was originally designed based on DirectX principles, it has since become more convention agnostic as there are plenty of tools available to make your assets work correctly so long as you know where you are coming from and where you are going.
