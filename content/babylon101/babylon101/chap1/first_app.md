# Getting Started - Working with Models
## A Web Application Template

You will have seen that the template needed for any code on the playground is
```javascript
var createScene = function() {
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    // Add a lights to the scene

    //Your Code

  return scene;
};
```

By following this format in you own project you can quickly drop it into your own HTML page using the following as a template.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Babylon Template</title>

        <style>
            html, body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>

        <script src="https://cdn.babylonjs.com/babylon.js"></script>
        <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
        <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
    </head>

   <body>

	<canvas id="renderCanvas" touch-action="none"></canvas> <!-- touch-action="none" for best results from PEP -->

	<script>
        const canvas = document.getElementById("renderCanvas"); // Get the canvas element
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        // Add your code here matching the playground format

        const scene = createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                engine.resize();
        });
	</script>

   </body>

</html>
```

This line
```javascript
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```
allows you to import models into your scene.

This line
```javascript
<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
```
allows you to use a touch screen.

## Examples
The following loads models into an app.

[First App](/webpages/app1.html)

Given just a box is rather uninteresting and creating the app just using all Babylon.js code is as simple

[First Coded App](/webpages/app2.html)

let's move on to learning more about using Babylon.js code and build more interesting models. We start with giving our world a ground to build on.
