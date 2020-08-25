# Introduction

The editor provides a tool to preview, edit and add textures.

This includes:
* PNG and JPEG textures
* DDS Cube textures
* Procedural textures (all from the procedural textures library of BabylonJS)
* Custom render targets
* Mirror textures

To access the tool, just click on the toolbar **View -> Textures Viewer...**.

# Adding textures from files
To add a new texture files, select in the tool's toolbar **Add -> Add From File...**. A dialog will appear to ask the texture files to add.

Once you have selected the texture files, default textures will be created in the scene. You can now select them and modify their properties.

The tool also registered the files and they'll be saved when saving the project.

**Note: you can also drag'n'drop the texture files in the Textures Viewer panel**

# Adding procedural textures
More informations about procedural textures: [https://doc.babylonjs.com/how_to/how_to_use_procedural_textures](https://doc.babylonjs.com/how_to/how_to_use_procedural_textures)

To add procedural textures, select in the tool's toolbar **Add -> Add Procedural...** and a dialog will open to ask which type of texture.
Once you have chosen the texture type, the texture will be added to the scene and will appear in the available textures in the tool.

![AddingProceduralTexture](/img/extensions/Editor/ManagingTextures/AddingProceduralTexture.png)

# Cloning a texture
To clone a texture (typically to have same texture but with distinct parameters), just richt-click the desired texture and select **"Clone"**. This will clone the current texture and add the cloned one to the scene.
The source texture and the cloned texture will share the same source file.

![CloningTexture](/img/extensions/Editor/ManagingTextures/CloningTexture.png)

# Removing a texture
To remove a texture, just right-click on the desired texture and select **"Remove"**. This will remove the texture from the scene but not the source file from the project.
Once removed, all affected materials will be updated to remove the texture reference.

**Important: Undo/Redo is not yet supported. Be careful before removing any texture.**

![RemovingTexture](/img/extensions/Editor/ManagingTextures/RemovingTexture.png)

# Using the tool to convert textures
BabylonJS provides a tool to convert environment textures (.dds) to custom .env files. More informations about the format here: [https://doc.babylonjs.com/how_to/use_hdr_environment#what-is-a-env-tech-deep-dive](https://doc.babylonjs.com/how_to/use_hdr_environment#what-is-a-env-tech-deep-dive).

To help converting, just ckick the toolbar **Convert .dds to .env**. A dialog will open to select all .dds texture files. Once selected, the tool will process the conversion.
Once done, a dialog will open for each converted texture to choose the folder where to save the result.

You can now add the new .env files by adding new textures to the scene using the above process.

![ConvertToEnv](/img/extensions/Editor/ManagingTextures/ConvertToEnv.png)

# Drag'n'drop support
The tool supports drag'n'dropping textures on meshes. That means, once you have dropped a texture on mesh, its material will be modified:
* 2D texture will replace the **Albedo Texture** for PBR materials and **Diffuse Texture** for other material types.
* Cube texture will replace the **Reflection Texture** of the material.

# Demo
Here is a live demo using the Textures Viewer tool:

<iframe width="560" height="315" src="https://www.youtube.com/embed/3dB0GlLAJko" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>