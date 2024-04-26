---
title: Vertical Wave with Vertex Shader
image: 
description: A row of many boxes that move vertically in a wave motion
keywords: shader, vertex, vertex shader
further-reading:
video-overview:
video-content:
---

## Vertical Wave with Vertex Shader

As with any code it is important to have a firm idea of what you want to achieve, what is possible to code and 
a design. 

## Requirements
The requirements are a row of many boxes that move vertically in a wave motion. The motion will be achieved by 
changing the apparent positions of all vertices within a Vertex Shader. To be clear the positions of the boxes within 
the scene model will not be altered. What will be changed through the Vertex Shader is their projection onto the screen.

## First Stage Design
The boxes will be generated using the Solid Particle System as this deals with a multitude of repeated boxes efficiently. 
The vertical height of a box at any time will depend on the time and its position along the x axis using the sin function.

## First Challenge
Generally coding this project in Javascript, for example, would give access to the position of a box and so
```Javascript
box.position.y = Math.sin(box.position.x + time)
```
could be used.

However the data passed to a Vertex Shader Code is the attributes of the vertices of a mesh or is through using uniforms. Also the 
Vertex Shader Code applies to a single vertex with no access to any other vertices. 
Since the x coordinate of vertices on the left hand side of the box will differ by the size of the box to those on the right hand side. 
So sin(x<sub>Left</sub> + time) with differ from sin(x<sub>Right</sub> + time) distorting the box. 

What is needed is a method of obtaining the same number h, from the numbers x<sub>Left</sub> and x<sub>Right</sub>. 

## Second Stage Design

The boxes are cubes arranged equally spaced with the following parameters, *size* of box, *gap* between boxes and *spacing* = *size* + *gap*

![spaced boxes](/img/how_to/Shaders/wave1.jpg)

The number of boxes n will be odd, numbered from the left starting with 0. 

The box i will be at position (i - floor(n/2)) \* *spacing* + *size*/2

For example when n = 5, floor(n/2) = 2 and the left hand edges of the boxes 0 to 4 will have positions

-2 \* *spacing*, -1 \* *spacing*, 0, 1 \* *spacing*, 2 \* *spacing* respectively. Adding size to these gives their hand edges.

![spaced boxes positions](/img/how_to/Shaders/wave2.jpg)

Dividing these left and right hand edge positions by *spacing* gives a pair of numbers for each box of

-2, -2 + (*size*/*spacing*), &nbsp;&nbsp;&nbsp;-1, -1 + (*size*/*spacing*), &nbsp;&nbsp;&nbsp;0, (*size*/*spacing*), &nbsp;&nbsp;&nbsp;1, 1 + (*size*/*spacing*), &nbsp;&nbsp;&nbsp;2, 2 + (*size*/*spacing*).

Since *spacing* = *size* + *gap*  *spacing* &gt; *size* and so (*size*/*spacing*) &lt; 1 and it follows that applying the 
function floor to each of these numbers gives 

-2, -2, &nbsp;&nbsp;&nbsp;-1, -1, &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;0, 0, &nbsp;&nbsp;&nbsp;1, 1, &nbsp;&nbsp;&nbsp;2,2.

Hence obtaining a number h that is the same from the numbers x<sub>Left</sub> and x<sub>Right</sub>.  
For a box the x coordinate of any vertex will either be on a left hand or a right hand edge and so for each box *x/spacing* 
will give a unique number. 

## Third Stage Design

Within the Vertex Shader Main function 

```
vec3 p = position;
float bn = floor(position.x / box_spacing);
p.y = p.y + sin(time + bn/4.0);
gl_Position = worldViewProjection * vec4(p, 1.0);
```

where time and box_spacing are uniforms.

## SPS Code

```
//Create SPS of Boxes
var boxes = 101; //odd number
var box_size = 0.25; // must be float
var box_gap = box_size/2;
var box_spacing = box_size + box_gap;
var box = BABYLON.MeshBuilder.CreateBox("box", {size:box_size}, scene);

var boxes_SPS = new BABYLON.SolidParticleSystem("boxesSPS", scene, {updatable: false});
    
//function to position boxes
var set_boxes = function(particle, i, s) {   
    var mid_point = Math.floor(boxes/2);
    particle.position.x = (i - mid_point) * box_spacing + box_size/2;
}

boxes_SPS.addShape(box, boxes, {positionFunction:set_boxes});  
var boxes = boxes_SPS.buildMesh(); // mesh of leaves
box.dispose();
```

## Shader Material Code

### Vertex Shader

```
// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float box_spacing;
uniform float time;

// Normal
varying vec2 vUV;

void main(void) {
    vec3 p = position;
    float bn = floor(position.x / box_spacing);
    p.y = p.y + sin(time + bn/4.0);
    gl_Position = worldViewProjection * vec4(p, 1.0);

    vUV = uv;
}
```
### Fragment Shader

```
varying vec2 vUV;

uniform sampler2D textureSampler;

void main(void) {
  gl_FragColor = texture2D(textureSampler, vUV);
}
```

### Set Material

```javascript
var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
		vertexElement: "vertexShaderCode",
		fragmentElement: "fragmentShaderCode",
	},
	{
		attributes: ["position", "normal", "uv"],
		uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
	});


var mainTexture = new BABYLON.Texture("amiga.jpg", scene);

shaderMaterial.setTexture("textureSampler", mainTexture);
```

### Animation Loop

```javascript
var time = 0;
scene.registerBeforeRender(function() {
    boxes.material.setFloat("time", time);
    time +=0.1;
});
```

## Shader Builder Code

### Shader Code

```javascript
BABYLONX.ShaderBuilder.InitializeEngine();
		
var shaderMaterial =   new BABYLONX.ShaderBuilder()             
	.Solid({ b: 1 })
	.SetUniform('box_spacing', 'float')
    .Map({path:'amiga.jpg'  }) 
	.VertexShader(
        ' float bn = pos.x/box_spacing;\
          result = vec4( pos.x, pos.y + sin(time + bn/4.0), pos.z  ,1.);')
	.BuildMaterial(scene);
```

### Set Material

```javascript
boxes.material = shaderMaterial;
boxes.material.setFloat("box_spacing", box_spacing)
```

### Animation Loop

```javascript
var time = 0;
scene.registerBeforeRender(function () {

	time += 0.1;

    new BABYLONX.ShaderMaterialHelper().SetUniforms(
        scene.meshes,
        camera.position,
        camera.target,
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        time);
	            
});
```

## Vertical Wave

[External Example - Shader Material](http://babylonjsguide.github.io/examples/bouncecode.html)

PG: <Playground id="#1OH09K#3" title="Vertical Wave" description="Built from Shader Material."/>

[External Example - Shader Builder](http://babylonjsguide.github.io/examples/bouncecodeSB.html)

PG: <Playground id="#1NXPC3#4" title="Vertical Wave" description="Built from Shader Builder."/>
