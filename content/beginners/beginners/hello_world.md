# Requirements
As you start out and follow the Beginner's Guide and you will be able to achieve many of your own scenes just by applying what you learn. In order to make the best use of Babylon.js and to produce your own amazing applications a working knowledge of JavaScript is essential to fit all the parts together in wonderful new ways. As you experience grows you will want to also learn to work with Node.js and NPM.

For now, all you need is access to the Babylon Playground where you can learn and experiment. Access to the playground is always available and is as simple as following the playground examples as you follow the guide.

# Introduction
Instead of producing the words **Hello World** as the starting point to learning Babylon.js we will take you through producing a simple 3D world scene. A scene is the basic container for everything you need to create your own world no matter how simple or complex. To view anything in your scene it needs a camera,  a light and something to see.

## Getting Started Video
[![You Tube](https://i.ytimg.com/an_webp/Cib3Y64GVWE/mqdefault_6s.webp?du=3000&sqp=CJjrhvgF&rs=AOn4CLDomzxguyi0loSWMuDRD8pKsqFIhQ)](https://www.youtube.com/watch?v=XFT5omp_F3g)


## Hello World - Base
A simple box building standing on the ground, viewed with an [arc rotate camera](/babylon101/cameras#arc-rotate-camera) and lit by a [hemispheric light](/babylon101/lights#the-hemispheric-light). Since both the box and ground, as most meshes, are created using (0, 0, 0) as the origin for all vertices and positioned at (0, 0, 0) the box is moved upwards to lie on the ground.

[Hello World - Box and Ground](https://www.babylonjs-playground.com/#MA8AVG)

<span style ="border: solid 1px black"> Meshes [&#128712;](/How_To/Set_Shapes)</span>

## Hello World - Material
Now add a little [color](/babylon101/materials#color) and [texture](/babylon101/materials#texture) using the [standard material](/babylon101/materials#reactions-to-light)

[Hello World - Material](https://www.babylonjs-playground.com/#MA8AVG#1)

<span style ="border: solid 1px black"> Opacity [&#128712;](/how_to/more_materials#opacity) | PBR [&#128712;](/How_To/Physically_Based_Rendering)<span>

## Hello World - Transformations
To begin to fill the world we add extra building boxes in different [positions, rotations and scaling](/babylon101/position).

[Hello World - Add and Transform Boxes](https://www.babylonjs-playground.com/#MA8AVG#2)

<span style ="border: solid 1px black">Parents [&#128712;](/How_To/Parenting) | Pivots [&#128712;](https://doc.babylonjs.com/How_To/Pivots) | Frame of Reference [&#128712;](/resources/frame_of_reference)</span>


