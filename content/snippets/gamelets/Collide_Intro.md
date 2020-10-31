# Introduction to Developing a System For Collisions

The aim of this series of tutorials is to consider how a collision system can be built using just BabylonJS code (ie no physics engines). Some of the issues involved in developing such a system are described. The ideas in this tutorial can be used to build a collision system of complex shapes. 

In this case a complex shape is one constructed from spheres of the same size in such a way that any one sphere 
is always in contact with at least one other sphere in the shape. A complex shape is likely to have concave sections. 
An example of colliding complex shapes is given below. It has been constructed using the Solid Particle System because of the speed and flexibility when using many repeated shapes.

![Complex Shape](/img/samples/collide1.jpg)

* [Playground Example _ Complex Shapes in Collision](https://www.babylonjs-playground.com/#WLYB9)

To begin with the frame rate will be taken as constant throughout the animation and speed for any shape will be in units per frame.

# Index 

[Speed and Size Collision Issues](/samples/Issues.html)  
[Simple Particle Collisions on a Grid](/samples/Grid_Moves.html)  
[Slow Particles](/samples/Slow_Collide.html)  
[Freely Moving Particles](/samples/Free_Collide.html)  



