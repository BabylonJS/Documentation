# Getting Started - Working With Code
## A Walk Around The Village

There is a useful property of a mesh, *movePOV* which allows us to move a mesh relative to its point of view. Generally a newly created mesh will be considered as facing the negative z direction and this is the direction of its point of view. To move a mesh forward 6 units in the direction of its point of view you use

```javascript
mesh.movePOV(0, 0, 6)
```
The parameters are, in order, distance to move to the right, up and forward, generally these are the negative x axis, the positive y axis and the negative z axis in the mesh's local space.

In Babylon.js you can write code that will be executed before the rendering of the next frame using

```javascript
scene.onBeforeRenderObservable.add(() => {
    //code to execute
});
```

In this way properties of objects can be changed render frame by render frame.

Let us take the simple case of a sphere moving around the edges of a triangle. We want the sphere to appear to slide along one side, turn to slide along the next and then turn and slide along the last side and then repeat.

Take an isosceles right angled triangle as an example. Each frame the sphere will move a distance of 0.05. When the distance it has travelled is greater than 4 the sphere will make a turn, greater than 8 it will turn again and when greater than the perimeter it will reset and start again.

https://www.babylonjs-playground.com/#N9IZ8M

A little trickier and using a bit of trial and error for the turns and distance we can achieve a more complicated walk for the character around the village.
https://www.babylonjs-playground.com/#KBS9I5#55

We now have two things moving around the village a car and a character. How can we avoid them colliding?