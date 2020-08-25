# First Steps

Babylon.JS is a great way to code a 3D environment on the web using the HTML5 canvas element.

## The Playground

This is the quickest and easiest way to make your own scene. Creating a 3D scene is easy, simply add a camera, lights and 3D shapes (meshes) and you are away.

The [Playground](https://babylonjs-playground.com) is a web site which has everything you need to create
your own scene or edit an existing one. [More on the Playground](/features/Playground).

A template for creating a scene within the playground is:

```javascript
var createScene = function() {
  // Create the scene space
  var scene = new BABYLON.Scene(engine);

  // Add a camera to the scene and attach it to the canvas
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 2,
    2,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // Add lights to the scene
  var light1 = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  var light2 = new BABYLON.PointLight(
    "light2",
    new BABYLON.Vector3(0, 1, -1),
    scene
  );

  // This is where you create and manipulate meshes
  var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2 },
    scene
  );

  return scene;
};
```

Everything else you need is taken care of within the Playground.

- [Playground example of above code](https://www.babylonjs-playground.com/#WG9OY#1)

## Your Own HTML

When writing your own HTML you just need to embed the createScene function into an HTML page structure with a &lt; script &gt; tag along with a few other items. You will need to load the BabylonJS JavaScript code. Also for use on tablets and mobiles BabylonJS uses pointer events rather than mouse events and so the PEP event system needs to be loaded as well.

In addition a canvas element will have to be added to the body as this is where the 3D scene will be rendered and a reference variable _canvas_ added to it in the code. You also need to generate the BabylonJS engine before the function for creating the scene.

Finally, add code to call the scene. This enables the engine to continually render the scene in a loop and to resize it if the browser is ever resized.

### HTML template

```javascript
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

        <script src="https://preview.babylonjs.com/babylon.js"></script>
        <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
        <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
    </head>

   <body>

	<canvas id="renderCanvas" touch-action="none"></canvas> <!-- touch-action="none" for best results from PEP -->

	<script>
        var canvas = document.getElementById("renderCanvas"); // Get the canvas element
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        /******* Add the create scene function ******/
        var createScene = function () {

            // Create the scene space
            var scene = new BABYLON.Scene(engine);

            // Add a camera to the scene and attach it to the canvas
            var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
            camera.attachControl(canvas, true);

            // Add lights to the scene
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

            // Add and manipulate meshes in the scene
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

            return scene;
        };
        /******* End of the create scene function ******/

        var scene = createScene(); //Call the createScene function

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

## Notes

1. The examples above uses the newer MeshBuilder method for creating shapes where variables for the shape are set within the options object parameter and has some advantages over the older form of BABYLON.Mesh.Create.... which uses a parameter list for the shape variables. The majority of Playgrounds use the older method as many were created before MeshBuilder existed.

2. The use of PEP for pointer events is more recent advice, older advice was to use a system called hand.js. Both work, although hand.js is no longer maintained. You may still find references to hand.js in the documentation.

# Next Step

Now you are ready to go further and learn how to create more shapes like spheres, cylinders, boxes, etc. by visiting [Set Shapes](/babylon101/Discover_Basic_Elements)

# Further Reading

[How To Get Babylon.js](/babylon101/how_to_get)

# Further Reading External

[BabylonJS Forum](https://forum.babylonjs.com)  
[PEP and hand.js](http://www.html5gamedevs.com/topic/22474-how-does-babylonjs-get-pointer-events-working/#comment-127993)

# Useful Links External

[BabylonJS Main Website](http://www.babylonjs.com/)  
[BabylonJS Playground](https://babylonjs-playground.com)  
[PEP Github](https://github.com/jquery/PEP)  
[hand.js Github](https://github.com/Deltakosh/handjs)
