---
title: Node Geometry
image: 
description: Learn how use the NodeGeometry class
keywords: geometry, procedural, non destructive, node
further-reading:
video-overview:
video-content:
---

## Introduction

The NodeGeometry feature was inspired by Blender Geometry nodes where you can use a node system to procedurally build geometry. Think about it like a postprocessing system for geometry. Ultimately it produces a geometry but with a procedural approach.

## Why?
Several reasons come to mind:
- The cost of downloading assets on the web is a strong limiting factor and procedural data can help solve that by limiting the download to the core pieces that are assembled later on by the NodeGeometry system
- The system is dynamic and can produce an infinity of variants. Far above what an offline source can produce (think about terrain generation or vegetation generation)
- It allows a new way of modelling by assembling core shapes and playing around with a node system

## Example

Here is a complete example of an advanced `NodeGeometry` which is used to generate a city with different buildings:

![Using NodeGeometry to generate a procedural city](/img/how_to/nge/01.jpg)

<Playground id="#PYY6XE#69" title="Using NodeGeometry to generate a procedural city" description="Using NodeGeometry to generate a procedural city"/>

## How to use

The `NodeGeometry` class is an utility class, meaning it is autonomous and does not require access to an engine or a scene. So instantiation is pretty simple:

```
const nodeGeometry = new BABYLON.NodeGeometry("my node geometry");
```

Once created, the system will expect you to create a flow from a source to and endpoint. In a nutshell, the NodeGeometry will process VertexData structure (See more in the [Create Custom Meshes From Scratch](/features/featuresDeepDive/mesh/creation/custom/custom)).

By default, NodeGeometry system supports the following sources:

- Box
- Capsule
- Cylinder
- Disc
- Grid
- Icosphere
- Mesh
- Plane
- Sphere
- Torus

Here is for example a complete graph that simply generates a sphere:

```
// Create node geometry
var nodegeo = new BABYLON.NodeGeometry("nodegeo");

// Create source sphere
var sphere = new BABYLON.SphereBlock("sphere");

// Create output
var output = new BABYLON.GeometryOutputBlock("geometryout");
nodegeo.outputBlock = output;
sphere.geometry.connectTo(output.geometry);
```

From there you have to imagine that the graph will flow the geometry (represented by the VertexData provided by the source) towards blocks and each block will have the opportunity to update the vertex data.

The `GeometryOutputBlock` is meant to collect the final VertexData that can then be used to generate a mesh:

```
// Build and instantiate mesh
nodegeo.build();
var mesh = nodegeo.createMesh("nodegeomesh");
```

## Updating the geometry flow

Now that we have the basics in place, we can start to introduce blocks which will update the data.

Among the simple we have the setXXX blocks which will focus on generating data for a specific layer (like positions, normals, colors, uvs, etc...):

- setPositionsBlock
- setNormalsBlock
- setTangentsBlock
- setColorsBlock
- setUVsBlock

These blocks are updating the VertexData by generating an entry per vertex inside the geometry. For that specific reason you can imagine them like a loop going through the list of vertices and pumping data from their input.

To pump data into the block you can simply use a`RandomBlock` which will generate a random value:

```
// Create node geometry
var nodegeo = new BABYLON.NodeGeometry("nodegeo");

// Create source sphere
var sphere = new BABYLON.SphereBlock("sphere");

var setPositions = new BABYLON.SetPositionsBlock("set positions");
sphere.geometry.connectTo(setPositions.geometry);

var getRnd = new BABYLON.RandomBlock("random");
var rndMin = new BABYLON.GeometryInputBlock("rndMin", BABYLON.NodeGeometryBlockConnectionPointTypes.Vector3);
rndMin.value = BABYLON.Vector3.Zero();
var rndMax = new BABYLON.GeometryInputBlock("rndMax", BABYLON.NodeGeometryBlockConnectionPointTypes.Vector3);
rndMax.value = BABYLON.Vector3.One();
rndMin.output.connectTo(getRnd.min);
rndMax.output.connectTo(getRnd.max);
getRnd.output.connectTo(setPositions.positions);

// Create output
var output = new BABYLON.GeometryOutputBlock("geometryout");
nodegeo.outputBlock = output;
setPositions.output.connectTo(output.geometry);       

// Build and instantiate mesh
nodegeo.build();
var mesh = nodegeo.createMesh("nodegeomesh");

```

The `setPositionsBlock` will call the `RandomBlock` once per vertex to generate the final mesh:


![Using NodeGeometry to generate a random based sphere](/img/how_to/nge/02.jpg)

## Contextual values

To go further you may want to READ from the geometry. For that the system will provide several contextual values that are capable of pumping data FROM the active geometry.

The active geometry is the geometry connected to the pumping block (in our example below, that will be the `SetPositionsBlock`).

So we can rewrite our graph but instead of adding random values directly we can add the normal of each vertex to the position and simply scale the normal by a random scale.

So the associated code is:

```
// Create node geometry
var nodeGeometry = new BABYLON.NodeGeometry("nodegeo");

// GeometryInputBlock
var Positions = new BABYLON.GeometryInputBlock("Positions");
Positions.contextualValue = BABYLON.NodeGeometryContextualSources.Positions;

// MathBlock
var Add = new BABYLON.MathBlock("Add");
Add.operation = BABYLON.MathBlockOperations.Add;

// MathBlock
var Multiply = new BABYLON.MathBlock("Multiply");
Multiply.operation = BABYLON.MathBlockOperations.Multiply;

// GeometryInputBlock
var Normals = new BABYLON.GeometryInputBlock("Normals");
Normals.contextualValue = BABYLON.NodeGeometryContextualSources.Normals;

// VectorConverterBlock
var Converter = new BABYLON.VectorConverterBlock("Converter");

// RandomBlock
var random = new BABYLON.RandomBlock("random");

// GeometryInputBlock
var Min = new BABYLON.GeometryInputBlock("Min", BABYLON.NodeGeometryBlockConnectionPointTypes.Float);
Min.value = 0;

// GeometryInputBlock
var Max = new BABYLON.GeometryInputBlock("Max", BABYLON.NodeGeometryBlockConnectionPointTypes.Float);
Max.value = 1;

// SetPositionsBlock
var setpositions = new BABYLON.SetPositionsBlock("set positions");

// SphereBlock
var sphere = new BABYLON.SphereBlock("sphere");

// GeometryOutputBlock
var geometryout = new BABYLON.GeometryOutputBlock("geometryout");

// Connections
sphere.geometry.connectTo(setpositions.geometry);
Positions.output.connectTo(Add.left);
Normals.output.connectTo(Multiply.left);
Min.output.connectTo(random.min);
Max.output.connectTo(random.max);
random.output.connectTo(Converter.xIn);
random.output.connectTo(Converter.yIn);
random.output.connectTo(Converter.zIn);
Converter.xyzOut.connectTo(Multiply.right);
Multiply.output.connectTo(Add.right);
Add.output.connectTo(setpositions.positions);
setpositions.output.connectTo(geometryout.geometry);

// Output nodes
nodeGeometry.outputBlock = geometryout;
nodeGeometry.build();
var mesh = nodeGeometry.createMesh("nodegeomesh");
```

That will generate that mesh:
![Using NodeGeometry to generate a random based sphere](/img/how_to/nge/03.jpg)


To better understand the graph, here is a visual representation (See Node Geometry Editor later in this page):
![NodeGeometry representation](/img/how_to/nge/04.jpg)

Please note that we used the `VectorConverter` to produce a Vector3 out of the `RandomBlock` generating a float.
We are also using a `MathBlock` twice to get an Add and a Multiply operation. You also have access to all trigonometry operations with the `GeometryTrigonometryBlock`.

To be complete with this graph, we need to add a `ComputeNormalsBlock` to make sure the normals are rebuilt using the new positions:
![NodeGeometry representation](/img/how_to/nge/06.jpg)

This will produce our weird random based sphere:
![Using NodeGeometry to generate a random based sphere](/img/how_to/nge/05.jpg)

## Node Geometry Editor

As you can see the code starts to be very long. This is why we introduced a visual tool to help you build your graph: //LINK TO NGE DOC//

## Instancing geometries

Ok, now it is time to really unleash the core power of the `NodeGeometry`!

With the `InstantiateOnVerticesBlock` class and the `InstantiateOnFacesBlock` class, you have the opportunity to instantiate a new geometry per vertex (or multiple times per face).

So let's look at this graph:
![Using InstantiateOnVerticesBlock](/img/how_to/nge/08.jpg)

The `InstantiateOnVerticesBlock` block is used to pump a box on each vertex of the sphere:
![Instancing boxes on a sphere](/img/how_to/nge/09.jpg)

You can apply rotation or scaling per instance by connecting values to the `rotation` and `scaling` inputs.

The `density` input can be used to use a percentage of the overall vertices only (like having an instance only on 15% of the vertices)

The `InstantiateOnFacesBlock` works similarly but will generate several instances per face. This block has no density input but a `count` input that will let you decide how many instances in total you want to sparkle.

## Controlling the flow

The `ConditionalBlock` is the central block if you want to control what is going on with your flow. It can let you decide which branch to take based on a condition that can be:
- Equals
- Not equals
- Greater than
- Greater or equals
- Lower than
- Lower or equals
- Xor
- Or
- And

So for instance we can decide to have a new sphere made of boxes but we want one hemisphere to be using one material and the other hemisphere using another material.
This graph will do it:
![Instancing boxes on a sphere with different material per hemisphere](/img/how_to/nge/16.jpg)

The `ConditionBlock` is used here with a Greater than setup and will then pick the value 0 or 1 based on the y value of the normal (of the sphere as the sphere is the geometry manipulated by the `InstantiateOnFacesBlock` block). If the y value of the normal is greater than 0.2 then it will pick 0 and send that value to the `SetMaterialIDBlock`. Else it will pick the value of 1.

The outcome:
![Instancing boxes on a sphere with different material per hemisphere](/img/how_to/nge/17.jpg)

## Random and noise

In order to get random values, we have already seen the `RandomBlock`. There is another one that can be used: the `NoiseBlock`.

This block will generate a noise pattern based on a Perlin noise algorithm.

Here is our example again with the `SetPositions`:
![Using noise pattern](/img/how_to/nge/10.jpg)

This will produce this mesh:
![Using noise pattern to generate a sphere](/img/how_to/nge/11.jpg)

## Material ID

If you are working with multiple sources, you can merge them easily with the `MergeBlock`:
![using MergeBlock in a graph](/img/how_to/nge/12.jpg)

That will generate that mesh:
![Using MergeBlock to merge multiple geometries](/img/how_to/nge/13.jpg)

The generated mesh will be made of one unified geometry and be rendered with one draw call.

But you can go further and actually attach a material ID per geometry with the `SetMaterialID` block:
![using MergeBlock and SetMaterialID in a graph](/img/how_to/nge/14.jpg)

This will generate this mesh:
![using MergeBlock and SetMaterialID for a mesh](/img/how_to/nge/15.jpg)

The mesh will now have a list of subMeshes (`mesh.subMeshes`) and will be rendered (when attached with a [MultiMaterial](/features/featuresDeepDive/materials/using/multiMaterials)) with one material per ID.

## Serialization

A `NodeGeometry` entity can be serialized to a json object:
```
geometry.serialize(true);
```
(in this case the boolean indicates if you want to also serialized the geometry produced by the `MeshBlock` which can be quickly heavy)

To load a `NodeGeometry` from a json object, you can call this code:
```
nodeGeometry.parseSerializedObject(json);
```

If you are using the Node Geometry Editor, you can also load a `NodeGeometry` from our snippet server:
```
const geometry = await BABYLON.NodeGeometry.ParseFromSnippetAsync("IJA02K#11");
```

## Optimizations
The `NodeGeometry` class uses the CPU to process data. Which means that you have to be cautious if you expect to generate several meshes.

For instance let's take this graph:
![Instancing meshes on a sphere](/img/how_to/nge/07.jpg)

We can see that the `InstantiateOnVerticesBlock` will call the Transform of the geometry flow for each vertex of the sphere (Please note the use of the `MergeBlock` to combine multiple geometries). In this case, as nothing in the instance part of the graph is using contextual values (like reading positions or normals for instance), we can ask the `GeometryTransformBlock` to not reevaluate its context on each call.

To do so you can call:
```
myBlock.evaluateContext = false;
```

