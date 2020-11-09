---
title: Creating Custom Polyhedra
image: 
description: Learn how to create custom polyhedra in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, polyhedra shapes
further-reading:
video-overview:
video-content:
---

## Custom Polyhedra
These are a further range of polyhedra that you can create although they need more steps to achieve. This is the reason for the *custom* option. All the other options, other than *type*, can be used with custom polyhedra.


1.  Visit <Playground id="#WL3U6F" title="Custom Polyhedra" description="Simple example of custom polyhedra in Babylon.js." image=""/> and minimize the code editor by unchecking the box by Editor under the Gear icon &#9881; (Options) and note the polyhedron names under the mouse pointer.  
![Select a Polyhedron](/img/how_to/Mesh/polyhedra1.jpg);

2. From the polyhedra.js file at https://github.com/BabylonJS/Extensions/tree/master/Polyhedron find the required name
```javascript
HeptagonalPrism : {
"name":"Heptagonal Prism",
"category":["Prism"],
"vertex":[[0,0,1.090071],[0.796065,0,0.7446715],[-0.1498633,0.7818315,0.7446715],[-0.7396399,-0.2943675,0.7446715],[0.6462017,0.7818315,0.3992718],[1.049102,-0.2943675,-0.03143449],[-0.8895032,0.487464,0.3992718],[-0.8658909,-0.6614378,-0.03143449],[0.8992386,0.487464,-0.3768342],[0.5685687,-0.6614378,-0.6538232],[-1.015754,0.1203937,-0.3768342],[-0.2836832,-0.8247995,-0.6538232],[0.4187054,0.1203937,-0.9992228],[-0.4335465,-0.042968,-0.9992228]],
"face":[[0,1,4,2],[0,2,6,3],[1,5,8,4],[3,6,10,7],[5,9,12,8],[7,10,13,11],[9,11,13,12],[0,3,7,11,9,5,1],[2,4,8,12,13,10,6]]},
```

 
3. Copy/paste the wanted polyhedron object in your code like this :

```javascript
const heptagonalPrism = { "name":"Heptagonal Prism", "category":["Prism"], "vertex":[[0,0,1.090071],[0.796065,0,0.7446715],[-0.1498633,0.7818315,0.7446715],[-0.7396399,-0.2943675,0.7446715],[0.6462017,0.7818315,0.3992718],[1.049102,-0.2943675,-0.03143449],[-0.8895032,0.487464,0.3992718],[-0.8658909,-0.6614378,-0.03143449],[0.8992386,0.487464,-0.3768342],[0.5685687,-0.6614378,-0.6538232],[-1.015754,0.1203937,-0.3768342],[-0.2836832,-0.8247995,-0.6538232],[0.4187054,0.1203937,-0.9992228],[-0.4335465,-0.042968,-0.9992228]],
"face":[[0,1,4,2],[0,2,6,3],[1,5,8,4],[3,6,10,7],[5,9,12,8],[7,10,13,11],[9,11,13,12],[0,3,7,11,9,5,1],[2,4,8,12,13,10,6]]};

const heptPrism = BABYLON.MeshBuilder.CreatePolyhedron("h", {custom: heptagonalPrism}, scene); //scene is optional and defaults to the current scene

//also possible
const heptPrism1 = BABYLON.Mesh.CreatePolyhedron("h", {custom: heptagonalPrism}, scene); //scene is optional and defaults to the current scene
```
 &nbsp;
 &nbsp;   
HeptagonalPrism: <Playground id="#PBLS4Y#2" title="HeptagonalPrism" description="Simple example of a heptagonalPrism." image=""/>
Heptagonal Prism with changed sizes: <Playground id="#PBLS4Y#3" title="HeptagonalPrism With Changed Sizes" description="Simple example of a heptagonalPrism with changed sizes." image=""/>
Heptagonal Prism with face colors: <Playground id="#PBLS4Y#4" title="HeptagonalPrism With Face Colors" description="Simple example of a heptagonalPrism with face colors." image=""/>