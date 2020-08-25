# Creating Prefabs

In order to optimize and go faster in design, the editor allows you to create prefabs.
For instance, only meshes are supported by prefabs (no lights, no particle systems, etc.).

Before a tool such as a **Prefab Builder** is coming, you are able to create prefabs from an entire mesh hierarchy.
In the scene graph, you can select a mesh and right click it, then you have a menu called **Create Prefab**.
This menu is used as a shortcut to create a prefab asset starting from the selected source mesh with all its hierarchy.

Given this hierarchy:
1. Sphere
    1. Cube
    2. Plane

If you select the **Sphere** and click **Create Prefab**, the prefab asset will contain the sphere, the cube and the plane.
Else, if you select only the cube, the prefab asset will contain only the cube.
Etc. etc.

Once you have created a prefab, this prefab will appear in the assets panel (don't forget to select the Prefabs tab).
From now, you can drag'n'drop your prefab assets in the scene in order to add new prefab nodes in your scene.

In the scene graph, the hierarchy of a prefab will not be drawn as you cannot remove or clone a child of a prefab for instance.
Anyway, you can of course attach scripts, graphs etc. to your prefabs, including the children of a prefab.

# What about performances?
For instance, only meshes are supported by prefabs (no lights, no particle systems, etc.).
In fact, the meshes used for the prefabs are not cloned because it would need the engine to draw multiple times the same mesh and then increase draw calls.
To overcome the draw calls problem, the editor will just create **Mesh Instances** from source meshes you have selected.

From the given documentation (//doc.babylonjs.com/how_to/how_to_use_instances), instances can be explain like: **Instances are an excellent way to use hardware accelerated rendering to draw a huge number of identical meshes (let's imagine a forest or an army)**.

In conclusion, that means each mesh of a prefab will be rendered only one time but at several places on each render.

# Demo video
<iframe width="560" height="315" src="https://www.youtube.com/embed/cIT0NK0amBA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
