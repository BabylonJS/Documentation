# Editing Prefabs

Once you created a prefab source and drag'n'dropped some prefabs in your scene, you are able to edit:
* A prefab object in the scene
* The source prefab object

# Opening the prefab editor
To edit prefabs, you can open the tool via **Tools -> Prefab Editor**.
This tool has 2 parts:
* Prefab hierarchy (on the left)
* Prefab live preview (on the right)

**Note:** Undo/redo is not yet supported and will be available in future version.

# Editing a prefab object in the scene
Once you have opened the prefab editor and selected a prefab in the scene graph, the tool will be updated and show you the selected prefab hierarchy and the live preview.
In the prefab hierarchy, you can delete the unwanted nodes (right click -> Remove).

Once you removed a node, **ONLY the selected prefab** will have its node removed from the scene. If you want to globally remove a node from all prefabs, you have to edit the source prefab object.

# Editing the source prefab object
In some cases, you would like to remove a node from the source prefab and apply the hierarchy modification on all already instantiated prefabs in the scene. To do that, just select the prefab asset in the assets panel.
Once selected, the prefab editor will be updated.

From now, you are editing the source prefab object. Once you remove a node from the prefab hierarchy, **ALL the instantiated prefab** in the scene will have their related node being removed from the scene.

# Demo
* 1 - Add some prefabs in scene
* 2 - Modify a prefab object in the scene
* 3 - Modify the source prefab object

<iframe width="560" height="315" src="https://www.youtube.com/embed/tVMI2cUC2lU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Future
This tool is the first version of the prefab editor and some features are incoming:
* Re-arrange hierarchy on the fly
* Add new nodes on the fly
* Instantiate a prefab via the code
