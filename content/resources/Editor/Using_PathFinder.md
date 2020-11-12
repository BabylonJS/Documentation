---
title: Using Path Finder
image: 
description: Babylon.js Editor tool to help creating path finders
keywords: welcome, babylon.js, editor, path finder
further-reading:
video-overview:
video-content:
---

The editor provides a tool to help creating path finders. That will require programming skills.

For example in this video, a path finder is used to animate randomly a particle system in a given mesh surface:
<iframe width="560" height="315" src="https://www.youtube.com/embed/7HucXzBYC34" frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>

## Using the Path Finder Editor
To access the tool, just click on the toolbar **Tools -> Path Finder...**.

The tool will show 2 panels:
* List of meshes surfaces where positions are available (on the left)
* Preview of the path finder output (black = wall, white = available)

To add new available surfaces, just click on the button **Add New** in the list (left). Once you add or remove surfaces, the preview will be updated.

To edit the path finder configuration, just click on the toolbar **Edit**. Now, the editor's **Inspector** will show you the available properties:
* Name: The name of the path finder configuration (important and used when programming)
* Size: Can be seen as the quality (number of positions available) of the path finder
* Ray Height: In some cases (like huge/high terrains), the ray height represents the start position on Y axis for rays being launched to check collisions on mesh surfaces. Sometimes you'll have to set a higher value
* Ray Length: Represents the length of rays being launched to check collisions. Sometimes, you'll have to set higher value
* Remove...: Remove the current path finder configuration
* Create new...: Create a new path finder configuration

## Selecting a path finder configuration
To select a path finder configuration, just click on the toolbar **Paths -> the configuration to edit**.

## Programming using path finder configurations
As a developer, you'll want to use a previously configured path finder. For example, when you add a script to a node, you can use the global instance named **tools** to access all extensions including the path finder extension.

For example, animating randomly an object:

```javascript
class Script implements IScript {
    // Public members
    public isPlaying: boolean = false; // If the object is being animated

    /**
     * Constructor
     */
    constructor ()
    { }

    /**
     * Called once starting the script
     */
    public start (): void {
        // Here we are editing a mesh
        console.log(mesh);
    }

    /**
     * Called on each frame
     */
    public update (): void {
        // Get the path finder instance. Let's have a configuration named "tutorial"
        const pathFinderConfiguration = tools.getPathFinder('tutorial');

        // Now, get start and end positions calculated by the path finder.
        // To do that, you'll have to find the nearest available point for the current node position
        const start = pathFinderConfiguration.findNearestPoint(mesh.position);
        
        const randomIndex = (Math.random() * pathFinderConfiguration.availablePoints.length) >> 0;
        const end = pathFinderConfiguration.availablePoints[randomIndex];

        // Now compute path using the path finder instance
        const path = pathFinderConfiguration.fromTo(start, end);

        // Now, create an animation. This is used as an helper to create easily a traval animation
        // Here we create an animation named "AnimationName" set as 60FPS
        const animation = pathFinderConfiguration.createAnimation('AnimationName', path, 60);

        // Animate the node!
        this.isPlaying = true;
        scene.stopAnimation(mesh);
        scene.beginAnimation(mesh, 0, path.length - 1, false, 0.4, () => {
            // On animation end, set isPlaying to false
            this.isPlaying = false;
        });
    }
}

// Function that exports the script
exportScript(Script);
```
