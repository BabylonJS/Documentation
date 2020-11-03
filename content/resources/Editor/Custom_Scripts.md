# Writing custom scripts

The editor provides a tool to write and attach custom scripts to objects in the scene

This includes:
* The scene itself
* Meshes
* Cameras
* Lights
* Particle systems

To access the tool, just click on the toolbar **Tools -> Code Editor...**.

All the scripts you will write are standalone and can be attached to objects (by creating links).
That means you'll first have to add a new script. Then, attach the new script to your object(s).

To add a new script, just click **Add New Script...** in the toolbar and give it a name. If you selected an object before, the script will be automatically attached.
Once you added the new script, the assets panel will be updated and you able to drag'n'drop the new script on another objects.

To add a new reference to a script to the selected object, just click on **Add New** in the grid and select the script to attach.

Once you select another object in the scene, the tool will refresh and draw the available scripts for the new selected object.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6U87lDX8i3A" frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>

# Explaining the code

```javascript
import { Scene, Color4 } from 'babylonjs';

class Script implements IScript {
    // Public members
    public blackColor = new Color4(0, 0, 0, 1);
    public customParam: string = '';

    /**
     * Constructor
     * @param mesh the mesh reference the script is applied on. Can be of type "Scene", "Light", etc.
     * @param scene the scene reference containing the current script.
     */
    constructor (public mesh: Mesh, public scene: Scene) {

    }

    /**
     * Called once starting the script
     */
    public start (): void {
        // You can access the scene everywhere.
        // That means the scene is globally accessible
        this.scene.clearColor = this.blackColor;

        // You can access the attached object everywhere
        // The attached object can also be "scene", "pointlight", etc.
        console.log(this.mesh);

        // Finally, you can console.log a custom parameter set from the editor
        console.log(this.customParam);
    }

    /**
     * Called on each frame
     */
    public update (): void {
        // Your code... For example:
        this.mesh.rotation.y += 0.01;
    }
}

// Function that exports the script
exportScript(
    Script, // Constructor of the script. No parameters allowed

    // Custom parameters accessible from the editor in order to customize the script.
    // These values will be available in the Inspector panel in the folder 'Script'
    { customParam: 'Hello' }
);
```

# Debugging the code
Once you are happy and want to test your code, just run the scene by clicking in the toolbar **Play and Debug**. The editor will open a new window.

To see errors and debug your code (break points, logs, etc.), just type F12 in the new opened window. To set breakpoints, all the custom scripts are available at **behaviors/**. For instance, sourcemaps are not supported but will come in future versions.

# Importing custom classes in your scripts

To help you factorizing your code, you can create different kinds of scripts:
* Scripts that you'll attach to nodes
* Scripts used to store functionalities

Given this script named `"Maki"` attached to `Sphere Standard`:
![EditorCodeEditor](/img/extensions/Editor/CodeEditor/maki.png)

We would like to import a class we'll write to create new instances and call methods. To add a new script you'll import, just click the button "Add" in the assets panel and give it a name (here `"Dog"`):
![EditorCodeEditor](/img/extensions/Editor/CodeEditor/dog.png)

By default, the new class implements a constructor and a function `"log"`.

Let's rename the class to `Dog`:

![EditorCodeEditor](/img/extensions/Editor/CodeEditor/class_dog.png)

Back to our script `"Maki"`, we are now able to import the class `Dog` from the script named `"Dog"`:

![EditorCodeEditor](/img/extensions/Editor/CodeEditor/maki_final.png)

Then, running your project, the `.log` function is called:

![EditorCodeEditor](/img/extensions/Editor/CodeEditor/maki_result.png)

# Accessing the project files
The Editor is designed to create, edit and add the maximum of scene objects using the Editor's tools. The code editor is done to only interact with the scene objects and add logic.
Anyway, it is also possible to create scene objects in scripts such as textures etc. and that means you have to access the files.

To access the files of the project in your scripts, you have to use the editor's tools class to get the right URLs of the wanted files.
Each script exposes a **`tools`** object that contains some useful methods. In our case, the tools provide a method to get a the real URL of a file according to its name.

Example creating a cube texture:

```javascript
import { Scene, CubeTexture } from 'babylonjs';

class Script implements IScript {
    /**
     * Constructor
     * @param mesh the mesh reference the script is applied on. Can be of type "Scene", "Light", etc.
     * @param scene the scene reference containing the current script.
     */
    constructor (public mesh: Mesh, public scene: Scene) {

    }

    /**
     * Called once starting the script
     */
    public start (): void {
        const cubeTexture = new CubeTexture('Space', this.scene, null, false, [
            tools.getFileUrl('tex1.jpg'),
            tools.getFileUrl('tex2.jpg'),
            tools.getFileUrl('tex3.jpg'),
            tools.getFileUrl('tex4.jpg'),
            tools.getFileUrl('tex5.jpg'),
            tools.getFileUrl('tex6.jpg'),
        ]);

        this.mesh.material.reflectionTexture = cubeTexture;
    }
}

...
```