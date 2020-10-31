# Adding Animations
The editor provides a tool to create and edit animations. This tool is not intended to create complex animations, modelers (3ds Max, Blender, etc.) will do it better than the editor.

Anyway, modelers are not able to access objects such as post-processes (for example animating the depth of field in the default or standard rendering pipeline). This is where the Animations Editor exists.

**Note: all animations added and edited in the modeler will not be saved in the editor project event if you modify it inside the editor**

# Using the Animations Editor
To access the tool, just click on the toolbar **Tools -> Animations Editor...**.

If the selected object has already animations, the tool will select the first one by default.

# Overview
To add a new animation, you can click on the toolbar **Add**. A window will open and show you a tree of all available properties (numbers, vectors, colors, etc.).
All properties with a red icon are not supported: for example, you cannot animate "material", but you can animate "material.alpha", "material.diffuseColor", etc.

To select an animation, you can access the list of the available animations for the atteched object using the toolbar **Animations -> the animation to editor**.

To remove the current animation being modified, just click on the toolbar **Remove Animation**.

# Adding keys
When you add a new animation, 2 keys will be created by default with a default value from frames 0 to 60.

To add new keys, just ckick on the toolbar **Add Keys**. Then, the tool will be in mode "Adding Keys", select the frame and click on the red circle to add the new key.

# Removing keys
To remove keys, just click on the toolbar **Remove Keys**. Then, click on all the keys to remove.

# Previewing Animation
To preview the current animation, you can click on the toolbar **Play**. Or use the slider (by default on top-left or the tool)

# Example animating the alpha value of a material
<iframe width="560" height="315" src="https://www.youtube.com/embed/zl_bUqo3juI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
